// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let clientInstance: any = null

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') return null
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}

// ✅ এই লাইনটা যোগ করুন - যাতে সব জায়গায় { supabase } ইম্পোর্ট কাজ করে
export const supabase = getSupabaseClient()

// যারা supabase() ফাংশন ব্যবহার করে তাদের জন্যও রাখলাম
export const supabaseClient = () => getSupabaseClient()