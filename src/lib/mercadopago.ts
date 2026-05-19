import { MercadoPagoConfig, Preference } from 'mercadopago'

export function getMPClient(): MercadoPagoConfig {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
}

export interface MPExternalRef {
  type: string       // PaymentType
  userId: string
  paymentId: string  // our DB payment UUID
  referenceId?: string  // auction_id or trade_id
}

export async function createMPPreference(params: {
  title: string
  amount: number
  externalRef: MPExternalRef
  baseUrl: string
}): Promise<{ initPoint: string; sandboxInitPoint: string; preferenceId: string }> {
  const client = getMPClient()
  const preference = new Preference(client)
  const result = await preference.create({
    body: {
      items: [{ id: params.externalRef.type, title: params.title, quantity: 1, unit_price: params.amount, currency_id: 'MXN' }],
      back_urls: {
        success: `${params.baseUrl}/payments/success`,
        failure: `${params.baseUrl}/payments/failure`,
        pending: `${params.baseUrl}/payments/success`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify(params.externalRef),
      notification_url: `${params.baseUrl}/api/payments/webhook`,
    },
  })
  return {
    initPoint: result.init_point!,
    sandboxInitPoint: result.sandbox_init_point!,
    preferenceId: result.id!,
  }
}
