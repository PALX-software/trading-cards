import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// ─── Build a service-role client (bypasses RLS) ───────────────
async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() { /* service role — no cookie writes needed */ },
      },
    }
  )
}

// ─── Build a user-session client to verify the caller ────────
async function createUserClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
}

// ─── PATCH /api/admin/users/[id] ────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Verify the calling user is authenticated
  const userClient = await createUserClient()
  const { data: { user }, error: authError } = await userClient.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Check that the calling user has is_admin = true
  const serviceClient = await createServiceClient()
  const { data: callerProfile, error: profileError } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !callerProfile?.is_admin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Parse body
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 4. Only allow specific fields to be updated
  const ALLOWED_FIELDS = ['balance', 'membership_paid', 'is_admin'] as const
  type AllowedField = typeof ALLOWED_FIELDS[number]

  const update: Partial<Record<AllowedField, unknown>> = {}
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      update[field] = body[field]
    }
  }

  if (Object.keys(update).length === 0) {
    return Response.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  // Validate types
  if ('balance' in update && typeof update.balance !== 'number') {
    return Response.json({ error: 'balance must be a number' }, { status: 400 })
  }
  if ('membership_paid' in update && typeof update.membership_paid !== 'boolean') {
    return Response.json({ error: 'membership_paid must be a boolean' }, { status: 400 })
  }
  if ('is_admin' in update && typeof update.is_admin !== 'boolean') {
    return Response.json({ error: 'is_admin must be a boolean' }, { status: 400 })
  }

  // 5. Perform the update using the service role client (bypasses RLS)
  const { data, error: updateError } = await serviceClient
    .from('profiles')
    .update(update)
    .eq('id', id)
    .select('id, username, balance, membership_paid, is_admin')
    .single()

  if (updateError) {
    console.error('[admin/users/patch] update error:', updateError)
    return Response.json({ error: updateError.message }, { status: 500 })
  }

  return Response.json({ ok: true, profile: data })
}
