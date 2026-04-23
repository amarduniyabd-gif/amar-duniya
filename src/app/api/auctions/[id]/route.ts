import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/auctions/[id] - নিলাম ডিটেইলস
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    // নিলাম ডাটা লোড
    const { data: auction, error } = await supabase
      .from('auctions')
      .select(`
        *,
        seller:profiles!seller_id(id, name, avatar, phone, is_verified, location),
        category:categories(id, name, name_bn, icon, slug),
        images:auction_images(thumbnail_url, full_url, order_index),
        bids(
          id, 
          amount, 
          created_at, 
          is_auto_bid,
          bidder:profiles!bidder_id(id, name, avatar)
        )
      `)
      .eq('id', id)
      .order('created_at', { foreignTable: 'bids', ascending: false })
      .single();
    
    if (error) {
      console.error('Auction fetch error:', error);
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    // ভিউ কাউন্ট আপডেট (অ্যাসিঙ্ক্রোনাস - ব্লক করবে না)
    supabase
      .from('auctions')
      .update({ views: (auction.views || 0) + 1 })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('View update error:', error);
      });
    
    // রেস্পন্স ডাটা ফরম্যাট
    const formattedAuction = {
      ...auction,
      bids_count: auction.bids?.length || 0,
      highest_bid: auction.bids?.[0]?.amount || auction.start_price,
      time_left: getTimeLeft(auction.end_time),
      is_active: auction.status === 'active' && 
                 new Date(auction.start_time) <= new Date() && 
                 new Date(auction.end_time) > new Date(),
    };
    
    return NextResponse.json(
      { auction: formattedAuction },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=10, stale-while-revalidate=59',
        },
      }
    );
  } catch (error) {
    console.error('Auction GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/auctions/[id] - নিলাম আপডেট (শুধু বিক্রেতা)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // নিলামের মালিক চেক
    const { data: auction, error: fetchError } = await supabase
      .from('auctions')
      .select('seller_id, status')
      .eq('id', id)
      .single();
    
    if (fetchError || !auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    if (auction.seller_id !== user.id) {
      // অ্যাডমিন চেক
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (!profile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    // শুধুমাত্র pending বা active অবস্থায় আপডেট করা যাবে
    if (auction.status === 'ended' || auction.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot update ended or cancelled auction' }, { status: 400 });
    }
    
    const body = await request.json();
    
    // যে ফিল্ডগুলো আপডেট করা যাবে
    const allowedUpdates = [
      'title', 'description', 'min_bid_increment', 'category_id'
    ];
    
    const updates: any = {};
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    updates.updated_at = new Date().toISOString();
    
    const { data: updatedAuction, error: updateError } = await supabase
      .from('auctions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json({ auction: updatedAuction });
  } catch (error) {
    console.error('Auction PUT error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/auctions/[id] - নিলাম ডিলিট (শুধু বিক্রেতা/অ্যাডমিন)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // নিলামের মালিক চেক
    const { data: auction, error: fetchError } = await supabase
      .from('auctions')
      .select('seller_id, status')
      .eq('id', id)
      .single();
    
    if (fetchError || !auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    // অ্যাডমিন চেক
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    const isAdmin = profile?.is_admin || false;
    
    if (auction.seller_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // যদি বিড থাকে এবং অ্যাডমিন না হয়, তাহলে ডিলিট করা যাবে না
    if (!isAdmin) {
      const { count } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('auction_id', id);
      
      if (count && count > 0) {
        return NextResponse.json({ 
          error: 'Cannot delete auction with bids. Please cancel instead.' 
        }, { status: 400 });
      }
    }
    
    // নিলাম ডিলিট (ক্যাসকেডিং)
    const { error: deleteError } = await supabase
      .from('auctions')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Auction deleted successfully' 
    });
  } catch (error) {
    console.error('Auction DELETE error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/auctions/[id] - নিলাম ক্যান্সেল (শুধু বিক্রেতা)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { action } = body;
    
    // নিলামের মালিক চেক
    const { data: auction, error: fetchError } = await supabase
      .from('auctions')
      .select('seller_id, status')
      .eq('id', id)
      .single();
    
    if (fetchError || !auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    if (auction.seller_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    if (action === 'cancel') {
      if (auction.status !== 'active' && auction.status !== 'pending') {
        return NextResponse.json({ error: 'Cannot cancel this auction' }, { status: 400 });
      }
      
      const { error: updateError } = await supabase
        .from('auctions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: 'Auction cancelled' });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auction PATCH error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============ হেল্পার ফাংশন ============
function getTimeLeft(endTime: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  is_ended: boolean;
  text: string;
} {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;
  
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      is_ended: true,
      text: 'সমাপ্ত',
    };
  }
  
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  let text = '';
  if (days > 0) text = `${days} দিন ${hours} ঘন্টা`;
  else if (hours > 0) text = `${hours} ঘন্টা ${minutes} মিনিট`;
  else text = `${minutes} মিনিট ${seconds} সেকেন্ড`;
  
  return {
    days,
    hours,
    minutes,
    seconds,
    is_ended: false,
    text,
  };
}