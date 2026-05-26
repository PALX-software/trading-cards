import { createClient } from '@/lib/supabase/server'
import { createMPPreference, type MPExternalRef } from '@/lib/mercadopago'
import { PRICING, type PaymentType } from '@/lib/types'

const VALID_TYPES: PaymentType[] = [
  'membership',
  'auction_creation',
  'auction_entry',
  'trade_search',
  'trade_accept',
]

const PAYMENT_LABELS: Record<PaymentType, string> = {
  membership: 'Membresía FIFA WC Cards',
  auction_creation: 'Crear Subasta',
  auction_entry: 'Unirse a Subasta',
  trade_search: 'Buscar Intercambio',
  trade_accept: 'Aceptar Intercambio',
}

const PAYMENT_AMOUNTS: Record<PaymentType, number> = {
  membership: PRICING.MEMBERSHIP_FEE,
  auction_creation: PRICING.AUCTION_CREATION_FEE,
  auction_entry: PRICING.AUCTION_ENTRY_FEE,
  trade_search: PRICING.TRADE_SEARCH_FEE,
  trade_accept: PRICING.TRADE_ACCEPT_FEE,
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { type: string; referenceId?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { type, referenceId } = body

  if (!type || !VALID_TYPES.includes(type as PaymentType)) {
    return Response.json(
      { error: `Invalid payment type. Must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  const paymentType = type as PaymentType
  const amount = PAYMENT_AMOUNTS[paymentType]

  // Insert a pending payment record in Supabase
  const { data: paymentRecord, error: insertError } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      type: paymentType,
      amount,
      reference_id: referenceId ?? null,
      status: 'pending',
      payment_method: 'mercadopago',
    })
    .select('id')
    .single()

  if (insertError || !paymentRecord) {
    console.error('[payments/create] DB insert error:', insertError)
    return Response.json({ error: 'Failed to create payment record' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  const externalRef: MPExternalRef = {
    type: paymentType,
    userId: user.id,
    paymentId: paymentRecord.id,
    ...(referenceId ? { referenceId } : {}),
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    console.error('[payments/create] MP_ACCESS_TOKEN is not set')
    return Response.json({ error: 'MP_ACCESS_TOKEN not configured' }, { status: 500 })
  }

  let preference: { initPoint: string; sandboxInitPoint: string; preferenceId: string }
  try {
    preference = await createMPPreference({
      title: PAYMENT_LABELS[paymentType],
      amount,
      externalRef,
      baseUrl,
    })
  } catch (err: any) {
    const detail = err?.message ?? err?.cause?.message ?? JSON.stringify(err)
    console.error('[payments/create] MP preference error:', detail)
    return Response.json({ error: `MercadoPago error: ${detail}` }, { status: 500 })
  }

  const initPoint =
    process.env.NODE_ENV === 'production'
      ? preference.initPoint
      : preference.sandboxInitPoint

  return Response.json({ init_point: initPoint })
}
