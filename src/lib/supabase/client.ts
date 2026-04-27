import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // আপনার তৈরি করা টাইপ ফাইলটি ইমপোর্ট করুন

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ক্লায়েন্টকে <Database> টাইপ দিয়ে ডিফাইন করা
let supabaseClient: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing! Check your .env.local file.");
    }
    // এখানেও <Database> বসিয়ে দিন
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
};

export const resetSupabaseClient = () => {
  supabaseClient = null;
};

export const isSupabaseReady = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// সরাসরি এক্সপোর্ট যা এখন টাইপ-সেফ
export const supabase = getSupabaseClient();