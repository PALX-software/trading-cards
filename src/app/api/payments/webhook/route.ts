import { createClient } from '@/lib/supabase/server'
import { getMPClient } from '@/lib/mercadopago'
import { Payment } from 'mercadopago'
import type { MPExternalRef } from '@/lib/mercadopago'

// MP expects a 200 response even when we encounter errors, so we always return 200
// and log errors internally.

export async function POST(request: Request) {
  let body: { type?: string; data?: { id?: string | number } }

  try {
    body = await request.json()
  } catch (err) {
    console.error('[webhook] Failed to parse body:', err)
    return new Response('OK', { status: 200 })
  }

  // MP sends type='payment' notifications
  if (body.type !== 'payment' || !body.data?.id) {
    // Acknowledge non-payment notifications silently
    return new Response('OK', { status: 200 })
  }

  const paymentId = String(body.data.id)

  let paymentData: Awaited<ReturnType<Payment['get']>>
  try {
    const mpPayment = new Payment(getMPClient())
    paymentData = await mpPayment.get({ id: paymentId })
  } catch (err) {
    console.error('[webhook] Failed to fetch MP payment:', err)
    return new Response('OK', { status: 200 })
  }

  if (paymentData.status !== 'approved') {
    // Not approved yet — nothing to do
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

  // Mark our payment record as completed
  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('id', dbPaymentId)

  if (paymentUpdateError) {
    console.error('[webhook] Failed to update payment record:', paymentUpdateError)
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
        if (!referenceId) {
          console.error('[webhook] auction_creation missing referenceId')
          break
        }
        const { error } = await supabase
          .from('auctions')
          .update({ creation_fee_paid: true, status: 'active' })
          .eq('id', referenceId)
          .eq('seller_id', userId)
        if (error) console.error('[webhook] auction_creation update error:', error)
        break
      }

      case 'auction_entry': {
        if (!referenceId) {
          console.error('[webhook] auction_entry missing referenceId')
          break
        }
        const { error } = await supabase
          .from('auction_participants')
          .update({ entry_fee_paid: true })
          .eq('auction_id', referenceId)
          .eq('user_id', userId)
        if (error) console.error('[webhook] auction_entry update error:', error)
        break
      }

      case 'trade_search': {
        if (!referenceId) {
          console.error('[webhook] trade_search missing referenceId')
          break
        }
        const { error } = await supabase
          .from('trades')
          .update({ search_fee_paid: true, status: 'pending' })
          .eq('id', referenceId)
          .eq('proposer_id', userId)
        if (error) console.error('[webhook] trade_search update error:', error)
        break
      }

      case 'trade_accept': {
        if (!referenceId) {
          console.error('[webhook] trade_accept missing referenceId')
          break
        }
        // Mark the invitation as accepted
        const { error: invError } = await supabase
          .from('trade_invitations')
          .update({ acceptance_fee_paid: true, status: 'accepted' })
          .eq('id', referenceId)
          .eq('invited_user_id', userId)
        if (invError) {
          console.error('[webhook] trade_accept invitation update error:', invError)
          break
        }
        // Fetch the trade_id from the invitation to update the parent trade
        const { data: invitation, error: fetchError } = await supabase
          .from('trade_invitations')
          .select('trade_id')
          .eq('id', referenceId)
          .single()
        if (fetchError || !invitation) {
          console.error('[webhook] trade_accept failed to fetch invitation:', fetchError)
          break
        }
        const { error: tradeError } = await supabase
          .from('trades')
          .update({ status: 'accepted' })
          .eq('id', invitation.trade_id)
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
