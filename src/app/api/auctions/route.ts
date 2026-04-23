import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// ক্যাশ কনফিগ
const CACHE_MAX_AGE = 30; // ৩০ সেকেন্ড
const STALE_WHILE_REVALIDATE = 300; // ৫ মিনিট

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status') || 'active';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const category = searchParams.get('category');
    const sellerId = searchParams.get('sellerId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'created_at_desc';
    
    // বেস কুয়েরি
    let query = supabase
      .from('auctions')
      .select(`
        id,
        title,
        description,
        start_price,
        current_price,
        min_bid_increment,
        start_time,
        end_time,
        status,
        views,
        created_at,
        seller:profiles!seller_id(id, name, avatar, is_verified),
        category:categories(id, name, name_bn, icon, slug),
        images:auction_images(thumbnail_url, full_url, order_index),
        bids_count:bids(count)
      `, { count: 'exact' });
    
    // ফিল্টার
    if (status === 'active') {
      const now = new Date().toISOString();
      query = query
        .eq('status', 'active')
        .lte('start_time', now)
        .gte('end_time', now);
    } else {
      query = query.eq('status', status);
    }
    
    if (category) {
      query = query.eq('category_id', category);
    }
    
    if (sellerId) {
      query = query.eq('seller_id', sellerId);
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    // সর্টিং
    switch (sort) {
      case 'price_asc':
        query = query.order('current_price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('current_price', { ascending: false });
        break;
      case 'bids_desc':
        query = query.order('bids_count', { ascending: false });
        break;
      case 'ending_soon':
        query = query.order('end_time', { ascending: true });
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
      console.error('Auctions fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch auctions' }, { status: 500 });
    }
    
    // ডাটা ফরম্যাট
    const auctions = (data || []).map(auction => ({
      ...auction,
      is_active: auction.status === 'active' && 
                 new Date(auction.start_time) <= new Date() && 
                 new Date(auction.end_time) > new Date(),
      time_left: getTimeLeftText(auction.end_time),
      bids: auction.bids_count?.[0]?.count || 0,
    }));
    
    return NextResponse.json({
      success: true,
      auctions,
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
    console.error('Auctions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const {
      title,
      description,
      start_price,
      min_bid_increment = 100,
      start_time,
      end_time,
      category_id,
      images = [],
    } = body;
    
    // ভ্যালিডেশন
    if (!title?.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    
    if (!start_price || start_price <= 0) {
      return NextResponse.json({ success: false, error: 'Valid start price is required' }, { status: 400 });
    }
    
    if (!start_time || !end_time) {
      return NextResponse.json({ success: false, error: 'Start and end time are required' }, { status: 400 });
    }
    
    const start = new Date(start_time);
    const end = new Date(end_time);
    const now = new Date();
    
    if (start < now) {
      return NextResponse.json({ success: false, error: 'Start time must be in the future' }, { status: 400 });
    }
    
    if (end <= start) {
      return NextResponse.json({ success: false, error: 'End time must be after start time' }, { status: 400 });
    }
    
    if (min_bid_increment < 10) {
      return NextResponse.json({ success: false, error: 'Minimum bid increment must be at least 10' }, { status: 400 });
    }
    
    // নিলাম তৈরি
    const { data: auction, error } = await supabase
      .from('auctions')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        start_price,
        current_price: start_price,
        min_bid_increment,
        start_time,
        end_time,
        seller_id: user.id,
        category_id: category_id || null,
        status: start <= now ? 'active' : 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Auction create error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    // ছবি যোগ
    if (images.length > 0) {
      const imageInserts = images.slice(0, 5).map((img: any, index: number) => ({
        auction_id: auction.id,
        thumbnail_url: img.thumbnail,
        full_url: img.full,
        order_index: index,
      }));
      
      await supabase.from('auction_images').insert(imageInserts);
    }
    
    // নোটিফিকেশন (অপশনাল)
    try {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'নিলাম তৈরি হয়েছে',
        message: `আপনার "${title}" নিলাম সফলভাবে তৈরি হয়েছে।`,
        type: 'auction',
        data: { auction_id: auction.id },
      });
    } catch {}
    
    return NextResponse.json({
      success: true,
      auction,
      message: 'Auction created successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Auctions POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============ হেল্পার ============
function getTimeLeftText(endTime: string): string {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;
  
  if (diff <= 0) return 'সমাপ্ত';
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  if (days > 0) return `${days} দিন ${hours} ঘন্টা`;
  if (hours > 0) return `${hours} ঘন্টা ${minutes} মিনিট`;
  return `${minutes} মিনিট`;
}