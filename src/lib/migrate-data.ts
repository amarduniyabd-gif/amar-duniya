import { getSupabaseClient } from './supabase/client';
import { defaultCategories } from '@/data/categories';

// =====================================================
// ক্যাটাগরি মাইগ্রেশন
// =====================================================
export const migrateCategories = async () => {
  const supabase = getSupabaseClient();
  
  console.log('📂 Migrating categories...');
  
  // ডিফল্ট ক্যাটাগরি থেকে ডাটা নেওয়া
  const categoriesToMigrate = defaultCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    name_bn: cat.name,
    icon: cat.icon,
    slug: cat.slug,
    parent_id: cat.parentId,
    order_index: cat.order_index || 0,
    is_active: cat.status !== 'inactive',
    has_payment: cat.hasPayment || false,
  }));

  let successCount = 0;
  let errorCount = 0;

  for (const cat of categoriesToMigrate) {
    const { error } = await supabase
      .from('categories')
      .upsert(cat, { onConflict: 'slug' });
    
    if (error) {
      console.error(`❌ Failed: ${cat.name}`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }
  
  console.log(`✅ Categories migrated: ${successCount} success, ${errorCount} failed`);
  return { success: errorCount === 0, successCount, errorCount };
};

// =====================================================
// পোস্ট মাইগ্রেশন
// =====================================================
export const migratePosts = async (userId: string) => {
  const supabase = getSupabaseClient();
  
  const localPosts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
  
  if (localPosts.length === 0) {
    console.log('📭 No posts to migrate');
    return { success: true, count: 0 };
  }
  
  console.log(`📦 Migrating ${localPosts.length} posts...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const post of localPosts) {
    try {
      // পোস্ট ইনসার্ট
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert({
          title: post.title || 'Untitled',
          description: post.description || '',
          price: post.price || 0,
          original_price: post.originalPrice || null,
          condition: post.condition || 'new',
          brand: post.brand || null,
          warranty: post.warranty || null,
          delivery: post.delivery || 'pickup',
          location: post.location || 'ঢাকা',
          seller_id: userId,
          status: 'approved',
          is_featured: post.featured || post.isFeatured || false,
          is_urgent: post.urgent || post.is_urgent || false,
          views: post.views || 0,
          likes: post.likes || 0,
          created_at: post.createdAt || new Date().toISOString(),
        })
        .select()
        .single();
      
      if (postError) {
        console.error(`❌ Failed: ${post.title}`, postError.message);
        errorCount++;
        continue;
      }
      
      // ছবি মাইগ্রেট
      if (post.images && post.images.length > 0) {
        const imageInserts = post.images.map((img: any, index: number) => ({
          post_id: newPost.id,
          thumbnail_url: img.thumbnail || img.full || img,
          full_url: img.full || img.thumbnail || img,
          width: img.width || 400,
          height: img.height || 400,
          order_index: index,
        }));
        
        await supabase.from('post_images').insert(imageInserts);
      }
      
      successCount++;
      console.log(`✅ Migrated: ${post.title}`);
    } catch (error: any) {
      console.error(`❌ Error: ${post.title}`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Posts migrated: ${successCount} success, ${errorCount} failed`);
  return { success: errorCount === 0, successCount, errorCount };
};

// =====================================================
// অফার ব্যানার মাইগ্রেশন
// =====================================================
export const migrateOfferBanners = async (userId: string) => {
  const supabase = getSupabaseClient();
  
  const localBanners = JSON.parse(localStorage.getItem('offerBanners') || '[]');
  
  if (localBanners.length === 0) {
    console.log('📭 No offer banners to migrate');
    return { success: true, count: 0 };
  }
  
  console.log(`🎁 Migrating ${localBanners.length} offer banners...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const banner of localBanners) {
    try {
      const { error } = await supabase
        .from('offer_banners')
        .insert({
          shop_name: banner.shopName || banner.title || 'দোকান',
          offer_title: banner.offerTitle || banner.title || 'অফার',
          description: banner.description || '',
          banner_color: banner.bannerColor || 'from-blue-600 to-cyan-500',
          shop_logo: banner.shopLogo || '🏪',
          shop_image: banner.shopImage || null,
          contact_name: banner.contactName || '',
          contact_phone: banner.contactPhone || '',
          contact_email: banner.contactEmail || null,
          contact_location: banner.contactLocation || 'কুষ্টিয়া',
          offer_details: banner.offerDetails || '',
          valid_until: banner.validUntil || new Date(Date.now() + 30 * 86400000).toISOString(),
          discount_code: banner.discountCode || null,
          priority: banner.priority || 'medium',
          views: banner.views || 0,
          status: banner.status || 'active',
          created_by: userId,
          created_at: banner.createdAt || new Date().toISOString(),
        });
      
      if (error) {
        console.error(`❌ Failed: ${banner.offerTitle || banner.title}`, error.message);
        errorCount++;
      } else {
        successCount++;
        console.log(`✅ Migrated: ${banner.offerTitle || banner.title}`);
      }
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Offer banners migrated: ${successCount} success, ${errorCount} failed`);
  return { success: errorCount === 0, successCount, errorCount };
};

// =====================================================
// পাত্র-পাত্রী প্রোফাইল মাইগ্রেশন
// =====================================================
export const migrateMatrimonyProfiles = async (userId: string) => {
  const supabase = getSupabaseClient();
  
  const localProfiles = JSON.parse(localStorage.getItem('matrimonyProfiles') || '[]');
  
  if (localProfiles.length === 0) {
    console.log('📭 No matrimony profiles to migrate');
    return { success: true, count: 0 };
  }
  
  console.log(`💑 Migrating ${localProfiles.length} matrimony profiles...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const profile of localProfiles) {
    try {
      const { data: newProfile, error } = await supabase
        .from('matrimony_profiles')
        .insert({
          user_id: userId,
          name: profile.name || '',
          age: profile.age || null,
          gender: profile.gender || null,
          religion: profile.religion || null,
          village: profile.village || '',
          district: profile.district || '',
          profession: profile.profession || '',
          education: profile.education || null,
          expected_income: profile.expectedIncome || null,
          height: profile.height || null,
          weight: profile.weight || null,
          blood_group: profile.bloodGroup || null,
          complexion: profile.complexion || null,
          marital_status: profile.maritalStatus || 'unmarried',
          has_children: profile.hasChildren || false,
          children_count: profile.childrenCount || null,
          remarry_willing: profile.remarryWilling || 'yes',
          phone: profile.phone || null,
          email: profile.email || null,
          about: profile.about || null,
          family_status: profile.familyStatus || null,
          hobbies: profile.hobbies || [],
          status: profile.status || 'approved',
          is_verified: profile.isVerified || false,
          is_premium: profile.isPremium || false,
          views: profile.views || 0,
          interests: profile.interests || 0,
          created_at: profile.createdAt || new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Failed: ${profile.name}`, error.message);
        errorCount++;
        continue;
      }
      
      // ছবি মাইগ্রেট
      if (profile.images && profile.images.length > 0) {
        const imageInserts = profile.images.map((img: any, index: number) => ({
          profile_id: newProfile.id,
          thumbnail_url: img.thumbnail || img.full || img,
          full_url: img.full || img.thumbnail || img,
          is_blurred: true,
          order_index: index,
        }));
        
        await supabase.from('matrimony_images').insert(imageInserts);
      }
      
      successCount++;
      console.log(`✅ Migrated: ${profile.name}`);
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Matrimony profiles migrated: ${successCount} success, ${errorCount} failed`);
  return { success: errorCount === 0, successCount, errorCount };
};

// =====================================================
// ইউজার প্রোফাইল মাইগ্রেশন
// =====================================================
export const migrateUserProfile = async (userId: string) => {
  const supabase = getSupabaseClient();
  
  const localProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  if (Object.keys(localProfile).length === 0) {
    console.log('📭 No user profile to migrate');
    return { success: true };
  }
  
  console.log('👤 Migrating user profile...');
  
  const { error } = await supabase
    .from('profiles')
    .update({
      name: localProfile.name || localProfile.fullName || 'User',
      phone: localProfile.phone || null,
      location: localProfile.location || localProfile.district || null,
      bio: localProfile.bio || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  if (error) {
    console.error('❌ Failed to migrate user profile:', error.message);
    return { success: false, error: error.message };
  } else {
    console.log('✅ User profile migrated');
    return { success: true };
  }
};

// =====================================================
// সেভড আইটেম মাইগ্রেশন
// =====================================================
export const migrateSavedItems = async (userId: string) => {
  const supabase = getSupabaseClient();
  
  const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
  const savedMatrimony = JSON.parse(localStorage.getItem('savedMatrimonyProfiles') || '[]');
  
  let count = 0;
  
  // সেভড পোস্ট
  for (const postId of savedPosts) {
    const { error } = await supabase
      .from('saved_posts')
      .upsert({ user_id: userId, post_id: postId }, { onConflict: 'user_id,post_id' });
    
    if (!error) count++;
  }
  
  // সেভড পাত্র-পাত্রী
  for (const profileId of savedMatrimony) {
    const { error } = await supabase
      .from('saved_matrimony')
      .upsert({ user_id: userId, profile_id: profileId }, { onConflict: 'user_id,profile_id' });
    
    if (!error) count++;
  }
  
  console.log(`✅ Saved items migrated: ${count}`);
  return { success: true, count };
};

// =====================================================
/// =====================================================
// সব কিছু মাইগ্রেট করার ফাংশন
// =====================================================
export const migrateAllData = async (userId: string) => {
  console.log('🚀 Starting data migration...');
  console.log('================================');
  
  const results: {
    categories: { success: boolean; successCount?: number; errorCount?: number };
    profile: { success: boolean };
    posts: { success: boolean; count?: number };
    offers: { success: boolean; count?: number };
    matrimony: { success: boolean; count?: number };
    saved: { success: boolean; count?: number };
  } = {
    categories: { success: true },
    profile: { success: true },
    posts: { success: true, count: 0 },
    offers: { success: true, count: 0 },
    matrimony: { success: true, count: 0 },
    saved: { success: true, count: 0 },
  };
  
  try {
    // ১. ক্যাটাগরি
    const catResult = await migrateCategories();
    results.categories = catResult;
    
    // ২. ইউজার প্রোফাইল
    results.profile = await migrateUserProfile(userId);
    
    // ৩. পোস্ট
    const postResult = await migratePosts(userId);
    results.posts = { success: postResult.success, count: postResult.count };
    
    // ৪. অফার ব্যানার
    const offerResult = await migrateOfferBanners(userId);
    results.offers = { success: offerResult.success, count: offerResult.count };
    
    // 5. পাত্র-পাত্রী
    const matResult = await migrateMatrimonyProfiles(userId);
    results.matrimony = { success: matResult.success, count: matResult.count };
    
    // ৬. সেভড আইটেম
    const savedResult = await migrateSavedItems(userId);
    results.saved = { success: savedResult.success, count: savedResult.count };
    
    console.log('================================');
    console.log('📊 Migration Summary:');
    console.log(`   Categories: ${results.categories.success ? '✅' : '❌'}`);
    console.log(`   Profile: ${results.profile.success ? '✅' : '❌'}`);
    console.log(`   Posts: ${results.posts.count || 0} migrated`);
    console.log(`   Offers: ${results.offers.count || 0} migrated`);
    console.log(`   Matrimony: ${results.matrimony.count || 0} migrated`);
    console.log(`   Saved: ${results.saved.count || 0} migrated`);
    console.log('================================');
    
    const overallSuccess = 
      results.categories.success &&
      results.profile.success &&
      results.posts.success &&
      results.offers.success &&
      results.matrimony.success &&
      results.saved.success;
    
    if (overallSuccess) {
      console.log('✅ All data migrated successfully!');
    } else {
      console.log('⚠️ Migration completed with some errors');
    }
    
    return { success: overallSuccess, results };
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    return { success: false, error: error.message };
  }
};

// =====================================================
// লোকাল স্টোরেজ ক্লিয়ার
// =====================================================
export const clearLocalStorage = () => {
  const keys = [
    'amarDuniyaPosts',
    'offerBanners',
    'matrimonyProfiles',
    'userProfile',
    'userSettings',
    'userNotifications',
    'userPrivacy',
    'savedPosts',
    'savedMatrimonyProfiles',
    'paidMatrimonyProfiles',
    'payments',
    'chatConversations',
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  console.log('🧹 Local storage cleared');
};