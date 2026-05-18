import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Use placeholder URLs for development if not configured
const url = SUPABASE_URL && SUPABASE_URL !== 'your-supabase-project-url'
  ? SUPABASE_URL
  : 'https://placeholder.supabase.co'

const key = SUPABASE_KEY && SUPABASE_KEY !== 'your-supabase-anon-key'
  ? SUPABASE_KEY
  : 'placeholder-anon-key'

export function createClient() {
  return createBrowserClient(url, key)
}
