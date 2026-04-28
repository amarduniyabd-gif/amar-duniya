// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server Component এর জন্য চেক
const isBrowser = typeof window !== 'undefined'

export const createClient = () => {
  if (!isBrowser) {
    // Server side - return dummy client (won't be used)
    return {} as any
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export const supabase = () => {
  if (!isBrowser) {
    return null as any
  }
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}