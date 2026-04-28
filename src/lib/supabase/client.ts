import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nryqoyqdwxqdydifatzb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yeXFveXFkd3hxZHlkaWZhdHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTQyNzEsImV4cCI6MjA5Mjc3MDI3MX0.TLl1cJDhipmG4NczcG6kZUVEB7KAtbi6Rwis6lXH5GA';

// ভ্যারিয়েবল আগে ডিক্লেয়ার করলাম যাতে লাল দাগ না আসে
let supabaseInstance: any = null;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};