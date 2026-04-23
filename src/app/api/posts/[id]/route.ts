import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/posts/[id] - পোস্ট ডিটেইলস
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        description,
        price,
        original_price,
        condition,
        brand,
        warranty,
        delivery,
        location,
        status,
        is_featured,
        is_urgent,
        views,
        likes,
        created_at,
        updated_at,
        seller_id,
        seller:profiles!seller_id(id, name, avatar, phone, is_verified, location, created_at),
        category:categories!category_id(id, name, name_bn, icon, slug),
        sub_category:categories!sub_category_id(id, name, name_bn, icon, slug),
        images:post_images(thumbnail_url, full_url, width, height, order_index)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Post fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'পোস্ট পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'পোস্ট পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    // ভিউ কাউন্ট বাড়ান (অ্যাসিঙ্ক্রোনাস - ব্লক করবে না)
    supabase
      .from('posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('View update error:', error);
      });
    
    // সেলার স্ট্যাটস - seller_id ব্যবহার ✅
    const { count: sellerPostsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', post.seller_id); // ✅ seller_id
    
    // রেটিং ক্যালকুলেট (সিম্পল)
    const sellerRating = 4.5;
    
    const formattedPost = {
      ...post,
      seller: {
        ...post.seller,
        total_ads: sellerPostsCount || 0,
        rating: sellerRating,
      },
      time_ago: getTimeAgo(post.created_at),
      is_active: post.status === 'approved',
    };
    
    return NextResponse.json({
      success: true,
      post: formattedPost,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
    
  } catch (error) {
    console.error('Post GET error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - পোস্ট আপডেট
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'লগইন করা নেই' },
        { status: 401 }
      );
    }
    
    // পোস্টের মালিক চেক
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('seller_id, status')
      .eq('id', id)
      .single();
    
    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: 'পোস্ট পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    // অ্যাডমিন চেক
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_admin || false;
    
    if (existingPost.seller_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'অনুমতি নেই' },
        { status: 403 }
      );
    }
    
    // বিক্রি হয়ে গেলে আপডেট ব্লক
    if (existingPost.status === 'sold' && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'বিক্রি হওয়া পোস্ট আপডেট করা যাবে না' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // যে ফিল্ডগুলো আপডেট করা যাবে
    const allowedUpdates = [
      'title', 'description', 'price', 'original_price', 'condition',
      'brand', 'warranty', 'delivery', 'location', 'category_id', 'sub_category_id'
    ];
    
    const updates: any = {};
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });
    
    // অ্যাডমিন হলে extra ফিল্ড
    if (isAdmin) {
      if (body.status) updates.status = body.status;
      if (body.is_featured !== undefined) updates.is_featured = body.is_featured;
      if (body.is_urgent !== undefined) updates.is_urgent = body.is_urgent;
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'আপডেট করার মতো কোনো ফিল্ড নেই' },
        { status: 400 }
      );
    }
    
    updates.updated_at = new Date().toISOString();
    
    const { data: post, error: updateError } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Post update error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post,
      message: 'পোস্ট আপডেট হয়েছে',
    });
    
  } catch (error) {
    console.error('Post PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - পোস্ট ডিলিট
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'লগইন করা নেই' },
        { status: 401 }
      );
    }
    
    // পোস্টের মালিক চেক
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('seller_id, status')
      .eq('id', id)
      .single();
    
    if (fetchError || !existingPost) {
      return NextResponse.json(
        { success: false, error: 'পোস্ট পাওয়া যায়নি' },
        { status: 404 }
      );
    }
    
    // অ্যাডমিন চেক
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_admin || false;
    
    if (existingPost.seller_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'অনুমতি নেই' },
        { status: 403 }
      );
    }
    
    // ছবি ডিলিট (স্টোরেজ থেকে)
    const { data: images } = await supabase
      .from('post_images')
      .select('thumbnail_url, full_url')
      .eq('post_id', id);
    
    if (images && images.length > 0) {
      const paths: string[] = [];
      images.forEach((img: any) => {
        if (img.thumbnail_url) paths.push(extractPathFromUrl(img.thumbnail_url));
        if (img.full_url) paths.push(extractPathFromUrl(img.full_url));
      });
      
      if (paths.length > 0) {
        await supabase.storage.from('post-images').remove(paths);
      }
    }
    
    // পোস্ট ডিলিট (ক্যাসকেডিং)
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Post delete error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'পোস্ট সফলভাবে ডিলিট হয়েছে',
    });
    
  } catch (error) {
    console.error('Post DELETE error:', error);
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

function extractPathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'post-images');
    if (bucketIndex === -1) return '';
    return pathParts.slice(bucketIndex + 1).join('/');
  } catch {
    return '';
  }
}