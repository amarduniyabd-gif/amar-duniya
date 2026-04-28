// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// একটি singleton instance
let clientInstance: any = null

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return null as any
  }
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}

// সরাসরি instance export করুন (ফাংশন না)
export const supabase = getSupabaseClient()