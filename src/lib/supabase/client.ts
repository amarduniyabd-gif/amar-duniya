import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nryqoyqdwxqdydifatzb.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_si3zDsvJIr_WVRV52vKqKQ_UC5b4c4C'
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