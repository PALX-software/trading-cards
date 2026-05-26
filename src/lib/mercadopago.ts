export interface MPExternalRef {
  type: string
  userId: string
  paymentId: string
  referenceId?: string
}

export async function createMPPreference(params: {
  title: string
  amount: number
  externalRef: MPExternalRef
  baseUrl: string
}): Promise<{ initPoint: string; sandboxInitPoint: string; preferenceId: string }> {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN is not set')

  const body = {
    items: [{
      id: params.externalRef.type,
      title: params.title,
      quantity: 1,
      unit_price: params.amount,
      currency_id: 'MXN',
    }],
    back_urls: {
      success: `${params.baseUrl}/payments/success`,
      failure: `${params.baseUrl}/payments/failure`,
      pending: `${params.baseUrl}/payments/success`,
    },
    auto_return: 'approved',
    external_reference: JSON.stringify(params.externalRef),
    notification_url: `${params.baseUrl}/api/payments/webhook`,
  }

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MP API ${res.status}: ${text}`)
  }

  const data = await res.json() as {
    id: string
    init_point: string
    sandbox_init_point: string
  }

  return {
    initPoint: data.init_point,
    sandboxInitPoint: data.sandbox_init_point,
    preferenceId: data.id,
  }
}
