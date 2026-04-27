import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// ১. এনভায়রনমেন্ট ভেরিয়েবল চেক
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ২. হার্ডকোডেড ব্যাকআপ (যদি এনভায়রনমেন্ট ভেরিয়েবল না থাকে)
const FALLBACK_URL = 'https://nryqoyqdwxqdydifatzb.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yeXFveXFkd3hxZHlkaWZhdHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTQyNzEsImV4cCI6MjA5Mjc3MDI3MX0.TLl1cJDhipmG4NczcG6kZUVEB7KAtbi6Rwis6lXH5GA';

// ৩. ক্লায়েন্ট হোল্ডার
let supabaseInstance: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (supabaseInstance) return supabaseInstance;

  // ইউআরএল ভ্যালিডেশন চেক
  const finalUrl = supabaseUrl && supabaseUrl.startsWith('http') ? supabaseUrl : FALLBACK_URL;
  const finalKey = supabaseAnonKey || FALLBACK_KEY;

  try {
    supabaseInstance = createClient<Database>(finalUrl, finalKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error("Supabase creation failed, using fallback...");
    supabaseInstance = createClient<Database>(FALLBACK_URL, FALLBACK_KEY);
  }

  return supabaseInstance;
};

// ৪. সরাসরি ব্যবহারের জন্য এক্সপোর্ট
export const supabase = getSupabaseClient();