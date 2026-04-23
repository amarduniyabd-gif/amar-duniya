import 'server-only';
import { createServerSupabaseClient, createAdminClient } from './server';

// ============ ইউজার ফাংশন ============

export const getServerUser = async () => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getServerSession = async () => {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getServerUser();
  return !!user;
};

// ============ অ্যাডমিন ফাংশন ============

export const isAdmin = async (): Promise<boolean> => {
  const user = await getServerUser();
  if (!user) return false;
  
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  return profile?.is_admin || false;
};

export const requireAdmin = async () => {
  const user = await getServerUser();
  if (!user) {
    throw new Error('Unauthorized: Please login');
  }
  
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  if (!profile?.is_admin) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
};

// ============ ইউজার ম্যানেজমেন্ট ============

export const getAllUsers = async () => {
  const supabase = await createAdminClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getUserById = async (userId: string) => {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const supabase = await createAdminClient();
  
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

export const deleteUser = async (userId: string) => {
  const supabase = await createAdminClient();
  
  // প্রথমে প্রোফাইল ডিলিট
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  
  if (profileError) return { error: profileError };
  
  // তারপর auth ইউজার ডিলিট
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  
  return { error: authError };
};

// ============ স্ট্যাটিস্টিক্স ============

export const getUserStats = async () => {
  const supabase = await createAdminClient();
  
  // টোটাল ইউজার
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  // ভেরিফাইড ইউজার
  const { count: verifiedUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true);
  
  // অ্যাডমিন
  const { count: adminUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_admin', true);
  
  // আজকের নতুন ইউজার
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  return {
    totalUsers: totalUsers || 0,
    verifiedUsers: verifiedUsers || 0,
    adminUsers: adminUsers || 0,
    todayUsers: todayUsers || 0,
  };
};

// ============ রোল চেক (ফিক্সড) ============

export const hasRole = async (role: 'admin' | 'verified'): Promise<boolean> => {
  const user = await getServerUser();
  if (!user) return false;
  
  const supabase = await createServerSupabaseClient();
  
  if (role === 'admin') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    return profile?.is_admin || false;
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_verified')
      .eq('id', user.id)
      .single();
    
    return profile?.is_verified || false;
  }
};

// ============ ব্লক/আনব্লক ============

export const blockUser = async (userId: string) => {
  const supabase = await createAdminClient();
  
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: '876600h', // ১০০ বছর (পারমানেন্ট)
  });
  
  return { error };
};

export const unblockUser = async (userId: string) => {
  const supabase = await createAdminClient();
  
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: '0h',
  });
  
  return { error };
};