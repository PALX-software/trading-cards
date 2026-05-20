import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock next/headers before any module that uses it ───────────────────────
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}))

// ── Shared mock state ───────────────────────────────────────────────────────
let mockUser: { id: string } | null = { id: 'user-123' }
let mockInsertData: { id: string } | null = { id: 'payment-abc' }
let mockInsertError: unknown = null

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

// ── Mock @supabase/ssr ──────────────────────────────────────────────────────
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabase),
}))

// ── Mock MercadoPago ────────────────────────────────────────────────────────
const mockCreatePreference = vi.fn().mockResolvedValue({
  init_point: 'https://mp.com/init',
  sandbox_init_point: 'https://sandbox.mp.com/init',
  id: 'pref-123',
})

vi.mock('mercadopago', () => ({
  MercadoPagoConfig: vi.fn(),
  Preference: vi.fn().mockImplementation(function () {
    return { create: mockCreatePreference }
  }),
}))

// ── Import route after mocks are in place ──────────────────────────────────
import { POST } from '@/app/api/payments/create/route'

// ── Helper: build a minimal Request ────────────────────────────────────────
function makeRequest(body: unknown, method = 'POST'): Request {
  return new Request('http://localhost/api/payments/create', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ── Chain builder for Supabase query interface ──────────────────────────────
function buildChain(data: unknown, error: unknown) {
  const chain = {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
  }
  return chain
}

beforeEach(() => {
  vi.clearAllMocks()

  // Default: authenticated user
  mockUser = { id: 'user-123' }
  mockInsertData = { id: 'payment-abc' }
  mockInsertError = null

  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: mockUser },
    error: null,
  })

  mockSupabase.from.mockImplementation(() =>
    buildChain(mockInsertData, mockInsertError)
  )

  mockCreatePreference.mockResolvedValue({
    init_point: 'https://mp.com/init',
    sandbox_init_point: 'https://sandbox.mp.com/init',
    id: 'pref-123',
  })
})

describe('POST /api/payments/create', () => {
  it('returns 401 when no auth session', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('No session'),
    })

    const req = makeRequest({ type: 'membership' })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 400 when type is missing from body', async () => {
    const req = makeRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/Invalid payment type/i)
  })

  it('returns 400 when type is invalid', async () => {
    const req = makeRequest({ type: 'not_a_real_type' })
    const res = await POST(req)

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/Invalid payment type/i)
  })

  it('returns 200 with init_point for valid membership payment', async () => {
    const req = makeRequest({ type: 'membership' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty('init_point')
    expect(typeof json.init_point).toBe('string')
    expect(json.init_point.length).toBeGreaterThan(0)
  })

  it('returns 200 with init_point for trade_search payment', async () => {
    const req = makeRequest({ type: 'trade_search' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty('init_point')
  })

  it('inserts a pending payment record in Supabase', async () => {
    const req = makeRequest({ type: 'membership' })
    await POST(req)

    expect(mockSupabase.from).toHaveBeenCalledWith('payments')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        type: 'membership',
        status: 'pending',
        payment_method: 'mercadopago',
      })
    )
  })

  it('passes referenceId through to the payment record', async () => {
    const req = makeRequest({ type: 'trade_search', referenceId: 'trade-xyz' })
    await POST(req)

    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        reference_id: 'trade-xyz',
      })
    )
  })

  it('returns 500 when DB insert fails', async () => {
    mockSupabase.from.mockImplementation(() =>
      buildChain(null, new Error('DB error'))
    )

    const req = makeRequest({ type: 'membership' })
    const res = await POST(req)

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toMatch(/Failed to create payment record/i)
  })

  it('returns 500 when MercadoPago preference creation fails', async () => {
    mockCreatePreference.mockRejectedValue(new Error('MP error'))

    const req = makeRequest({ type: 'membership' })
    const res = await POST(req)

    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toMatch(/Failed to create MercadoPago preference/i)
  })
})
