import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ক্যাশ কনফিগ
const CACHE_MAX_AGE = 60; // ১ মিনিট
const STALE_WHILE_REVALIDATE = 300; // ৫ মিনিট

// GET /api/posts - সব পোস্ট লিস্ট
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    // পেজিনেশন
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    // ফিল্টার
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const status = searchParams.get('status') || 'approved';
    const featured = searchParams.get('featured') === 'true';
    const urgent = searchParams.get('urgent') === 'true';
    const sellerId = searchParams.get('sellerId');
    const search = searchParams.get('search');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const sort = searchParams.get('sort') || 'created_at_desc';
    
    // বেস কুয়েরি
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        description,
        price,
        original_price,
        condition,
        brand,
        location,
        status,
        is_featured,
        is_urgent,
        views,
        likes,
        created_at,
        seller_id,
        seller:profiles!seller_id(id, name, avatar, is_verified),
        category:categories!category_id(id, name, name_bn, icon, slug),
        images:post_images(thumbnail_url, full_url, order_index)
      `, { count: 'exact' });
    
    // ফিল্টার প্রয়োগ
    if (status) query = query.eq('status', status);
    if (featured) query = query.eq('is_featured', true);
    if (urgent) query = query.eq('is_urgent', true);
    if (category) query = query.eq('category_id', category);
    if (subCategory) query = query.eq('sub_category_id', subCategory);
    if (sellerId) query = query.eq('seller_id', sellerId);
    if (condition) query = query.eq('condition', condition);
    if (location) query = query.ilike('location', `%${location}%`);
    if (minPrice) query = query.gte('price', parseInt(minPrice));
    if (maxPrice) query = query.lte('price', parseInt(maxPrice));
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // সর্টিং
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'views_desc':
        query = query.order('views', { ascending: false });
        break;
      case 'likes_desc':
        query = query.order('likes', { ascending: false });
        break;
      case 'featured_first':
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
    
    // পেজিনেশন
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Posts fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'পোস্ট লোড করতে সমস্যা হয়েছে' },
        { status: 500 }
      );
    }
    
    // ডাটা ফরম্যাট
    const posts = (data || []).map(post => ({
      ...post,
      time_ago: getTimeAgo(post.created_at),
    }));
    
    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: (page * limit) < (count || 0),
      },
    }, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    });
    
  } catch (error) {
    console.error('Posts GET error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// POST /api/posts - নতুন পোস্ট তৈরি
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'পোস্ট তৈরি করতে লগইন করুন' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const {
      title,
      description,
      price,
      original_price,
      condition = 'new',
      brand,
      warranty,
      delivery = 'pickup',
      location = 'ঢাকা',
      category_id,
      sub_category_id,
      is_featured = false,
      is_urgent = false,
      images = [],
    } = body;
    
    // ভ্যালিডেশন
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'পণ্যের নাম আবশ্যক' },
        { status: 400 }
      );
    }
    
    if (!price || price <= 0) {
      return NextResponse.json(
        { success: false, error: 'সঠিক দাম দিন' },
        { status: 400 }
      );
    }
    
    if (!category_id) {
      return NextResponse.json(
        { success: false, error: 'ক্যাটাগরি সিলেক্ট করুন' },
        { status: 400 }
      );
    }
    
    // কন্টেন্ট ফিল্টার
    const blockedKeywords = ['অশ্লীল', 'মাদক', 'জুয়া', 'হ্যাকিং'];
    const fullText = (title + ' ' + (description || '')).toLowerCase();
    for (const keyword of blockedKeywords) {
      if (fullText.includes(keyword)) {
        return NextResponse.json(
          { success: false, error: 'পোস্টে অনুমোদিত নয় এমন শব্দ আছে' },
          { status: 400 }
        );
      }
    }
    
    // পোস্ট তৈরি
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        price,
        original_price: original_price || null,
        condition,
        brand: brand?.trim() || null,
        warranty: warranty || null,
        delivery,
        location: location.trim(),
        seller_id: user.id,
        category_id,
        sub_category_id: sub_category_id || null,
        is_featured,
        is_urgent,
        status: 'pending',
        views: 0,
        likes: 0,
      })
      .select()
      .single();
    
    if (postError) {
      console.error('Post create error:', postError);
      return NextResponse.json(
        { success: false, error: postError.message },
        { status: 500 }
      );
    }
    
    // ছবি যোগ
    if (images.length > 0) {
      const imageInserts = images.slice(0, 5).map((img: any, index: number) => ({
        post_id: post.id,
        thumbnail_url: img.thumbnail,
        full_url: img.full,
        width: img.width || 400,
        height: img.height || 400,
        order_index: index,
      }));
      
      await supabase.from('post_images').insert(imageInserts);
    }
    
    // নোটিফিকেশন
    try {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'পোস্ট তৈরি হয়েছে',
        message: `আপনার "${title}" পোস্ট রিভিউ এর জন্য জমা হয়েছে।`,
        type: 'post',
        data: { post_id: post.id },
      });
    } catch {}
    
    return NextResponse.json({
      success: true,
      post,
      message: 'পোস্ট সফলভাবে তৈরি হয়েছে',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Posts POST error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// ============ হেল্পার ============
function getTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} দিন আগে`;
  if (hours > 0) return `${hours} ঘন্টা আগে`;
  if (minutes > 0) return `${minutes} মিনিট আগে`;
  return 'এইমাত্র';
}