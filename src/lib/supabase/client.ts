import { createBrowserClient } from '@supabase/ssr';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient should only be called on client side');
  }
  
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  return supabaseClient;
};

// রিসেট ক্লায়েন্ট (লগআউটের পর ব্যবহার)
export const resetSupabaseClient = () => {
  supabaseClient = null;
};

// ক্লায়েন্ট রেডি কিনা চেক
export const isSupabaseReady = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// ডিরেক্ট এক্সপোর্ট (সুবিধার জন্য)
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null;