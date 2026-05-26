import { createClient } from '@/lib/supabase/server'
import type { MPExternalRef } from '@/lib/mercadopago'

async function validateMPSignature(
  signatureHeader: string | null,
  requestId: string | null,
  dataId: string,
): Promise<boolean> {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[webhook] MP_WEBHOOK_SECRET not set — skipping signature validation in dev')
      return true
    }
    console.error('[webhook] MP_WEBHOOK_SECRET not configured in production')
    return false
  }
  if (!signatureHeader || !requestId) return false

  const parts: Record<string, string> = {}
  for (const part of signatureHeader.split(',')) {
    const eq = part.trim().indexOf('=')
    if (eq > 0) parts[part.trim().slice(0, eq)] = part.trim().slice(eq + 1)
  }
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(manifest))
  const computed = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return computed === v1
}

export async function POST(request: Request) {
  let body: { type?: string; data?: { id?: string | number } }

  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return new Response('OK', { status: 200 })
  }

  try {
    body = JSON.parse(rawBody)
  } catch (err) {
    console.error('[webhook] Failed to parse body:', err)
    return new Response('OK', { status: 200 })
  }

  if (body.type !== 'payment' || !body.data?.id) {
    return new Response('OK', { status: 200 })
  }

  const paymentId = String(body.data.id)

  // Validate MP webhook signature (C2)
  const isValid = await validateMPSignature(
    request.headers.get('x-signature'),
    request.headers.get('x-request-id'),
    paymentId,
  )
  if (!isValid) {
    console.error('[webhook] Invalid signature — ignoring request')
    return new Response('OK', { status: 200 })
  }

  let paymentData: { status: string; external_reference?: string | null }
  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    })
    if (!res.ok) {
      console.error('[webhook] MP payment fetch failed:', res.status, await res.text())
      return new Response('OK', { status: 200 })
    }
    paymentData = await res.json()
  } catch (err) {
    console.error('[webhook] Failed to fetch MP payment:', err)
    return new Response('OK', { status: 200 })
  }

  if (paymentData.status !== 'approved') {
    return new Response('OK', { status: 200 })
  }

  let externalRef: MPExternalRef
  try {
    externalRef = JSON.parse(paymentData.external_reference ?? '{}') as MPExternalRef
  } catch (err) {
    console.error('[webhook] Failed to parse external_reference:', err)
    return new Response('OK', { status: 200 })
  }

  const { type, userId, paymentId: dbPaymentId, referenceId } = externalRef

  if (!type || !userId || !dbPaymentId) {
    console.error('[webhook] Missing fields in external_reference:', externalRef)
    return new Response('OK', { status: 200 })
  }

  const supabase = await createClient()

  // Verify external_reference matches the DB record (H5: prevent tampered/replayed refs)
  const { data: dbPayment } = await supabase
    .from('payments')
    .select('user_id, type, status')
    .eq('id', dbPaymentId)
    .single()

  if (!dbPayment || dbPayment.user_id !== userId || dbPayment.type !== type) {
    console.error('[webhook] external_reference mismatch with DB record')
    return new Response('OK', { status: 200 })
  }

  // Idempotency: only process if still pending (C3)
  const { data: updated } = await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', dbPaymentId)
    .eq('status', 'pending')
    .select('id')

  if (!updated?.length) {
    // Already processed — ack to stop MP retries
    return new Response('OK', { status: 200 })
  }

  // Run business logic based on payment type
  try {
    switch (type) {
      case 'membership': {
        const { error } = await supabase
          .from('profiles')
          .update({ membership_paid: true, membership_paid_at: new Date().toISOString() })
          .eq('id', userId)
        if (error) console.error('[webhook] membership update error:', error)
        break
      }

      case 'auction_creation': {
        if (!referenceId) { console.error('[webhook] auction_creation missing referenceId'); break }
        const { error } = await supabase
          .from('auctions')
          .update({ creation_fee_paid: true, status: 'active' })
          .eq('id', referenceId)
          .eq('seller_id', userId)
        if (error) console.error('[webhook] auction_creation update error:', error)
        break
      }

      case 'auction_entry': {
        if (!referenceId) { console.error('[webhook] auction_entry missing referenceId'); break }
        const { error } = await supabase
          .from('auction_participants')
          .update({ entry_fee_paid: true })
          .eq('auction_id', referenceId)
          .eq('user_id', userId)
        if (error) console.error('[webhook] auction_entry update error:', error)
        break
      }

      case 'trade_search': {
        if (!referenceId) { console.error('[webhook] trade_search missing referenceId'); break }
        const { data: tradeRows, error } = await supabase
          .from('trades')
          .update({ search_fee_paid: true, status: 'pending' })
          .eq('id', referenceId)
          .eq('proposer_id', userId)
          .select('offered_sticker, wanted_sticker')
        if (error || !tradeRows?.length) {
          console.error('[webhook] trade_search update error:', error)
          break
        }
        // Match: find users who own the wanted sticker
        const { wanted_sticker } = tradeRows[0] as { offered_sticker: string; wanted_sticker: string }
        const { data: matches } = await supabase
          .from('user_stickers')
          .select('user_id')
          .eq('sticker_number', wanted_sticker)
          .neq('user_id', userId)
          .limit(10)

        if (matches?.length) {
          const invitations = (matches as { user_id: string }[]).map(m => ({
            trade_id: referenceId,
            proposer_id: userId,
            invited_user_id: m.user_id,
            status: 'pending',
            acceptance_fee_paid: false,
          }))
          const { error: invError } = await supabase.from('trade_invitations').insert(invitations)
          if (invError) console.error('[webhook] trade_invitations insert error:', invError)
        }
        break
      }

      case 'trade_accept': {
        if (!referenceId) { console.error('[webhook] trade_accept missing referenceId'); break }
        const { error: invError } = await supabase
          .from('trade_invitations')
          .update({ acceptance_fee_paid: true, status: 'accepted' })
          .eq('id', referenceId)
          .eq('invited_user_id', userId)
        if (invError) { console.error('[webhook] trade_accept invitation update error:', invError); break }
        const { data: invitation, error: fetchError } = await supabase
          .from('trade_invitations')
          .select('trade_id')
          .eq('id', referenceId)
          .single()
        if (fetchError || !invitation) { console.error('[webhook] trade_accept failed to fetch invitation:', fetchError); break }
        const { error: tradeError } = await supabase
          .from('trades')
          .update({ status: 'accepted' })
          .eq('id', (invitation as { trade_id: string }).trade_id)
        if (tradeError) console.error('[webhook] trade_accept trade update error:', tradeError)
        break
      }

      default:
        console.error('[webhook] Unknown payment type:', type)
    }
  } catch (err) {
    console.error('[webhook] Business logic error:', err)
  }

  return new Response('OK', { status: 200 })
}
