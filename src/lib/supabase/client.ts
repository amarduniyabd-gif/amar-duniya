import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kclhglzlbiuidbyzlhcq.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZoxhX9xkcTnzwFqWMKpjcw_p0Ltg5Vm'
    );
  }
  return supabaseClient;
};

export const resetSupabaseClient = () => {
  supabaseClient = null;
};

export const isSupabaseReady = (): boolean => {
  return true;
};