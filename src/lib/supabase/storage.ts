import { getSupabaseClient } from './client';

// =====================================================
// Post Images
// =====================================================
export const uploadPostImage = async (
  file: File,
  userId: string,
  type: 'thumbnail' | 'full'
): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${type}/${userId}/${fileName}`;
  
  const { error, data } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

export const deletePostImage = async (url: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  // Extract path from URL
  const path = url.split('/').slice(-3).join('/');
  
  const { error } = await supabase.storage
    .from('post-images')
    .remove([path]);
  
  return !error;
};

// =====================================================
// Matrimony Photos
// =====================================================
export const uploadMatrimonyPhoto = async (
  file: File,
  userId: string,
  type: 'thumbnail' | 'full'
): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${type}/${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('matrimony-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  // For private bucket, create signed URL
  const { data: urlData } = await supabase.storage
    .from('matrimony-photos')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
  
  return urlData?.signedUrl || null;
};

// =====================================================
// Offer Banners
// =====================================================
export const uploadOfferBanner = async (
  file: File
): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `banner-${Date.now()}.${fileExt}`;
  const filePath = `banners/${fileName}`;
  
  const { error } = await supabase.storage
    .from('offer-banners')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from('offer-banners')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

// =====================================================
// Avatars
// =====================================================
export const uploadAvatar = async (
  file: File,
  userId: string
): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `users/${userId}/${fileName}`;
  
  // Delete old avatar first
  const { data: oldFiles } = await supabase.storage
    .from('avatars')
    .list(`users/${userId}`);
  
  if (oldFiles && oldFiles.length > 0) {
    await supabase.storage
      .from('avatars')
      .remove(oldFiles.map(f => `users/${userId}/${f.name}`));
  }
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

// =====================================================
// Documents
// =====================================================
export const uploadDocument = async (
  file: File,
  userId: string,
  postId: string
): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `doc-${Date.now()}.${fileExt}`;
  const filePath = `contracts/${userId}/${postId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  const { data: urlData } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 60 * 60 * 24 * 30); // 30 days
  
  return urlData?.signedUrl || null;
};