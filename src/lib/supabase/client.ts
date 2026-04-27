import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// সরাসরি ভ্যালুগুলো দিয়ে দেওয়া হলো যাতে বিল্ড এরর না আসে
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nryqoyqdwxqdydifatzb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yeXFveXFkd3hxZHlkaWZhdHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTQyNzEsImV4cCI6MjA5Mjc3MDI3MX0.TLl1cJDhipmG4NczcG6kZUVEB7KAtbi6Rwis6lXH5GA';

let supabaseClient: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> => {
  // যদি কোনো কারণে ইউআরএল ইনভ্যালিড থাকে, তার জন্য একটা সেফটি চেক
  const finalUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://nryqoyqdwxqdydifatzb.supabase.co';

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(finalUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

export const resetSupabaseClient = () => {
  supabaseClient = null;
};

export const isSupabaseReady = (): boolean => {
  return !!supabaseUrl && !!supabaseUrl.startsWith('http');
};

// সরাসরি এক্সপোর্ট
export const supabase = getSupabaseClient();