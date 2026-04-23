import { getSupabaseClient } from './client';

// ============ Auth ফাংশন ============

export const signUp = async (email: string, password: string, name: string, phone?: string) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signInWithOAuth = async (provider: 'google' | 'facebook') => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { data, error };
};

export const signOut = async () => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return { data, error };
};

export const updatePassword = async (password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.updateUser({ password });
  return { data, error };
};

export const getCurrentUser = async () => {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const refreshSession = async () => {
  const supabase = getSupabaseClient();
  const { data: { session }, error } = await supabase.auth.refreshSession();
  return { session, error };
};

// ============ প্রোফাইল ফাংশন ============

export const getProfile = async (userId: string) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'No user logged in' };
  
  return getProfile(user.id);
};

export const createProfile = async (userId: string, profile: {
  name?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  bio?: string;
}) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...profile,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: {
  name?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  bio?: string;
}) => {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const updateCurrentProfile = async (updates: {
  name?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  bio?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'No user logged in' };
  
  return updateProfile(user.id, updates);
};

export const uploadAvatar = async (file: File): Promise<string | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `users/${user.id}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });
  
  if (error) return null;
  
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  // প্রোফাইল আপডেট
  await updateProfile(user.id, { avatar: urlData.publicUrl });
  
  return urlData.publicUrl;
};

// ============ অ্যাডমিন চেক ============

export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  return data?.is_admin || false;
};

export const isVerified = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('profiles')
    .select('is_verified')
    .eq('id', user.id)
    .single();
  
  return data?.is_verified || false;
};

// ============ ইমেইল ভেরিফিকেশন ============

export const sendEmailVerification = async () => {
  const supabase = getSupabaseClient();
  const user = await getCurrentUser();
  
  if (!user?.email) return { error: 'No email found' };
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email,
  });
  
  return { error };
};

// ============ ইউটিলিটি ============

export const isLoggedIn = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  const supabase = getSupabaseClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
    callback(session?.user || null);
  });
  
  return subscription;
};