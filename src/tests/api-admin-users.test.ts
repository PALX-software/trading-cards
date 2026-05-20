import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mock next/headers ──────────────────────────────────────────────────────
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}))

// ── Supabase chain helpers ─────────────────────────────────────────────────
function buildSelectChain(data: unknown, error: unknown) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
  }
}

function buildUpdateChain(data: unknown, error: unknown) {
  return {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
  }
}

// ── Two distinct mock clients ──────────────────────────────────────────────
const mockUserClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

const mockServiceClient = {
  from: vi.fn(),
}

// ── Mock @supabase/ssr — differentiate by key (anon vs service role) ───────
// The admin route creates:
//   userClient  = createServerClient(url, NEXT_PUBLIC_SUPABASE_ANON_KEY, ...)
//   serviceClient = createServerClient(url, SUPABASE_SERVICE_ROLE_KEY, ...)
// In test env both env vars are undefined, so both keys are undefined.
// Instead we differentiate by call order within a single request handling.
// We use a per-test call counter that is reset each beforeEach.
let _clientCallIndex = 0

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((_url: unknown, _key: unknown) => {
    _clientCallIndex++
    // createUserClient is called first, createServiceClient second
    return _clientCallIndex % 2 === 1 ? mockUserClient : mockServiceClient
  }),
}))

// ── Import the route after mocks are in place ──────────────────────────────
import { PATCH } from '@/app/api/admin/users/[id]/route'

// ── Request helper ─────────────────────────────────────────────────────────
function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/admin/users/target-uid', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ── params helper ─────────────────────────────────────────────────────────
function makeParams(id = 'target-uid') {
  return { params: Promise.resolve({ id }) }
}

// ── Default happy-path mock data ───────────────────────────────────────────
const defaultUpdateData = {
  id: 'target-uid',
  username: 'jdoe',
  balance: 200,
  membership_paid: false,
  is_admin: false,
}

beforeEach(() => {
  vi.clearAllMocks()
  _clientCallIndex = 0

  // Default: authenticated admin caller
  mockUserClient.auth.getUser.mockResolvedValue({
    data: { user: { id: 'caller-uid' } },
    error: null,
  })

  mockUserClient.from.mockReturnValue(buildSelectChain(null, null))

  // Reset queue first to clear any leftover mockReturnValueOnce values from prior tests
  mockServiceClient.from.mockReset()

  // First from() call on serviceClient → admin check (select is_admin)
  // Second from() call on serviceClient → update profile
  mockServiceClient.from
    .mockReturnValueOnce(buildSelectChain({ is_admin: true }, null))
    .mockReturnValueOnce(buildUpdateChain(defaultUpdateData, null))
})

describe('PATCH /api/admin/users/[id]', () => {
  it('returns 401 when no auth session', async () => {
    mockUserClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('No session'),
    })

    const res = await PATCH(makeRequest({ balance: 100 }), makeParams())
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 403 when caller is not admin', async () => {
    mockServiceClient.from.mockReset()
    mockServiceClient.from
      .mockReturnValueOnce(buildSelectChain({ is_admin: false }, null))
      .mockReturnValueOnce(buildUpdateChain(defaultUpdateData, null))

    const res = await PATCH(makeRequest({ balance: 100 }), makeParams())
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toBe('Forbidden')
  })

  it('returns 403 when profile lookup returns null (no profile)', async () => {
    mockServiceClient.from.mockReset()
    mockServiceClient.from
      .mockReturnValueOnce(buildSelectChain(null, null))
      .mockReturnValueOnce(buildUpdateChain(defaultUpdateData, null))

    const res = await PATCH(makeRequest({ balance: 100 }), makeParams())
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toBe('Forbidden')
  })

  it('returns 400 when only invalid/unknown fields are provided (e.g., password)', async () => {
    const res = await PATCH(makeRequest({ password: 'secret123' }), makeParams())
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/No valid fields/i)
  })

  it('returns 400 when body is empty', async () => {
    const res = await PATCH(makeRequest({}), makeParams())
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/No valid fields/i)
  })

  it('returns 400 when balance is not a number', async () => {
    const res = await PATCH(makeRequest({ balance: 'not-a-number' }), makeParams())
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/balance must be a number/i)
  })

  it('returns 400 when membership_paid is not a boolean', async () => {
    const res = await PATCH(makeRequest({ membership_paid: 'yes' }), makeParams())
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/membership_paid must be a boolean/i)
  })

  it('returns 400 when is_admin is not a boolean', async () => {
    const res = await PATCH(makeRequest({ is_admin: 1 }), makeParams())
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/is_admin must be a boolean/i)
  })

  it('returns 200 with profile data for valid balance update', async () => {
    const res = await PATCH(makeRequest({ balance: 200 }), makeParams())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(json.profile).toBeDefined()
  })

  it('returns 200 for valid membership_paid boolean update', async () => {
    mockServiceClient.from.mockReset()
    mockServiceClient.from
      .mockReturnValueOnce(buildSelectChain({ is_admin: true }, null))
      .mockReturnValueOnce(buildUpdateChain({ id: 'target-uid', membership_paid: true }, null))

    const res = await PATCH(makeRequest({ membership_paid: true }), makeParams())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  it('returns 200 for valid is_admin boolean update', async () => {
    mockServiceClient.from.mockReset()
    mockServiceClient.from
      .mockReturnValueOnce(buildSelectChain({ is_admin: true }, null))
      .mockReturnValueOnce(buildUpdateChain({ id: 'target-uid', is_admin: true }, null))

    const res = await PATCH(makeRequest({ is_admin: true }), makeParams())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })

  it('returns 500 when DB update fails', async () => {
    mockServiceClient.from.mockReset()
    mockServiceClient.from
      .mockReturnValueOnce(buildSelectChain({ is_admin: true }, null))
      .mockReturnValueOnce(buildUpdateChain(null, { message: 'DB update failed' }))

    const res = await PATCH(makeRequest({ balance: 100 }), makeParams())
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('DB update failed')
  })

  it('calls the update with the correct target user id', async () => {
    _clientCallIndex = 0 // reset so next PATCH also gets correct client assignment
    mockServiceClient.from.mockReset()
    mockServiceClient.from
      .mockReturnValueOnce(buildSelectChain({ is_admin: true }, null))

    const updateChain = buildUpdateChain(defaultUpdateData, null)
    mockServiceClient.from.mockReturnValueOnce(updateChain)

    await PATCH(makeRequest({ balance: 500 }), makeParams('specific-user-id'))

    expect(updateChain.eq).toHaveBeenCalledWith('id', 'specific-user-id')
  })
})
