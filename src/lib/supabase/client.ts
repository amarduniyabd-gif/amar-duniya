// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// ফলব্যাক ভ্যালু যোগ করা হয়েছে (যাতে Vercel এ ভেরিয়েবল না থাকলেও build fails না)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nryqoyqdwxqdydifatzb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yeXFveXFkd3hxZHlkaWZhdHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTQyNzEsImV4cCI6MjA5Mjc3MDI3MX0.TLl1cJDhipmG4NczcG6kZUVEB7KAtbi6Rwis6lXH5GA'

let clientInstance: any = null

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') return null
  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}

// সব জায়গায় { supabase } ইম্পোর্ট কাজ করবে
export const supabase = getSupabaseClient()

// যারা supabase() ফাংশন ব্যবহার করে তাদের জন্যও
export const supabaseClient = () => getSupabaseClient()