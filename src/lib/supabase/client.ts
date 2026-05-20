import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Fallbacks prevent @supabase/ssr from throwing during Next.js SSR pre-rendering
  // at build time when NEXT_PUBLIC_* vars haven't been baked in yet.
  // Real values must still be set as Cloudflare Environment Variables so Next.js
  // embeds them into the bundle; without them the client will fail all API calls.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
  return createBrowserClient(url, key)
}
