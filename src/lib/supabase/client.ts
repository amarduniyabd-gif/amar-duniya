import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      'https://nryqoyqdwxqdydifatzb.supabase.co',
      'sb_publishable_si3zDsvJIr_WVRV52vKqKQ_UC5b4c4C'
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