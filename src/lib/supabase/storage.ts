import { getSupabaseClient } from './client';

// ============ কনস্ট্যান্ট ============
const BUCKETS = {
  POST_IMAGES: 'post-images',
  MATRIMONY_PHOTOS: 'matrimony-photos',
  OFFER_BANNERS: 'offer-banners',
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  SLIDERS: 'sliders',
} as const;

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
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${type}/${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from(BUCKETS.POST_IMAGES)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Post image upload error:', error.message);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from(BUCKETS.POST_IMAGES)
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

export const deletePostImage = async (url: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  const path = extractPathFromUrl(url);
  if (!path) return false;
  
  const { error } = await supabase.storage
    .from(BUCKETS.POST_IMAGES)
    .remove([path]);
  
  return !error;
};

export const uploadMultiplePostImages = async (
  files: File[],
  userId: string,
  type: 'thumbnail' | 'full'
): Promise<string[]> => {
  const results = await Promise.all(
    files.map(file => uploadPostImage(file, userId, type))
  );
  return results.filter((url): url is string => url !== null);
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
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${type}/${userId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from(BUCKETS.MATRIMONY_PHOTOS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Matrimony photo upload error:', error.message);
    return null;
  }
  
  // প্রাইভেট বাকেটের জন্য সাইনড URL
  const { data: urlData } = await supabase.storage
    .from(BUCKETS.MATRIMONY_PHOTOS)
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // ৭ দিন
  
  return urlData?.signedUrl || null;
};

export const deleteMatrimonyPhoto = async (url: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  const path = extractPathFromUrl(url);
  if (!path) return false;
  
  const { error } = await supabase.storage
    .from(BUCKETS.MATRIMONY_PHOTOS)
    .remove([path]);
  
  return !error;
};

// =====================================================
// Offer Banners
// =====================================================
export const uploadOfferBanner = async (file: File): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `banner-${Date.now()}.${fileExt}`;
  const filePath = `banners/${fileName}`;
  
  const { error } = await supabase.storage
    .from(BUCKETS.OFFER_BANNERS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Offer banner upload error:', error.message);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from(BUCKETS.OFFER_BANNERS)
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

export const deleteOfferBanner = async (url: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  const path = extractPathFromUrl(url);
  if (!path) return false;
  
  const { error } = await supabase.storage
    .from(BUCKETS.OFFER_BANNERS)
    .remove([path]);
  
  return !error;
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
  
  // পুরনো অ্যাভাটার ডিলিট
  const { data: oldFiles } = await supabase.storage
    .from(BUCKETS.AVATARS)
    .list(`users/${userId}`);
  
  if (oldFiles && oldFiles.length > 0) {
    const pathsToDelete = oldFiles.map((f: any) => `users/${userId}/${f.name}`);
    await supabase.storage.from(BUCKETS.AVATARS).remove(pathsToDelete);
  }
  
  const { error } = await supabase.storage
    .from(BUCKETS.AVATARS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });
  
  if (error) {
    console.error('Avatar upload error:', error.message);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from(BUCKETS.AVATARS)
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

export const deleteAvatar = async (userId: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  const { data: files } = await supabase.storage
    .from(BUCKETS.AVATARS)
    .list(`users/${userId}`);
  
  if (!files || files.length === 0) return true;
  
  const paths = files.map((f: any) => `users/${userId}/${f.name}`);
  const { error } = await supabase.storage.from(BUCKETS.AVATARS).remove(paths);
  
  return !error;
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
    .from(BUCKETS.DOCUMENTS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Document upload error:', error.message);
    return null;
  }
  
  const { data: urlData } = await supabase.storage
    .from(BUCKETS.DOCUMENTS)
    .createSignedUrl(filePath, 60 * 60 * 24 * 30); // ৩০ দিন
  
  return urlData?.signedUrl || null;
};

export const deleteDocument = async (path: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.storage
    .from(BUCKETS.DOCUMENTS)
    .remove([path]);
  
  return !error;
};

export const getDocumentSignedUrl = async (path: string): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const { data } = await supabase.storage
    .from(BUCKETS.DOCUMENTS)
    .createSignedUrl(path, 60 * 5); // ৫ মিনিট
  
  return data?.signedUrl || null;
};

// =====================================================
// Sliders
// =====================================================
export const uploadSliderImage = async (file: File): Promise<string | null> => {
  const supabase = getSupabaseClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `slider-${Date.now()}.${fileExt}`;
  const filePath = `images/${fileName}`;
  
  const { error } = await supabase.storage
    .from(BUCKETS.SLIDERS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Slider upload error:', error.message);
    return null;
  }
  
  const { data: urlData } = supabase.storage
    .from(BUCKETS.SLIDERS)
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

export const deleteSliderImage = async (url: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  const path = extractPathFromUrl(url);
  if (!path) return false;
  
  const { error } = await supabase.storage
    .from(BUCKETS.SLIDERS)
    .remove([path]);
  
  return !error;
};

// =====================================================
// ইউটিলিটি
// =====================================================
const extractPathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => 
      Object.values(BUCKETS).includes(part as any)
    );
    
    if (bucketIndex === -1) return null;
    
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
};

export const getPublicUrl = (bucket: keyof typeof BUCKETS, path: string): string => {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(path);
  return data.publicUrl;
};

export const listFiles = async (
  bucket: keyof typeof BUCKETS,
  folderPath?: string
): Promise<any[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(BUCKETS[bucket])
    .list(folderPath || '');
  
  if (error) {
    console.error('List files error:', error.message);
    return [];
  }
  
  return data || [];
};