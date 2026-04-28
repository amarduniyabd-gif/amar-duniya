// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

let clientInstance: any = null

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return null as any
  }
  
  if (!clientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase environment variables missing!')
      return null as any
    }
    
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  return clientInstance
}

// ❌ এই লাইন সরিয়ে দিন (এটাই সমস্যা করছিল)
// export const supabase = getSupabaseClient()