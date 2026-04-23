import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/auctions/[id]/bids - নতুন বিড করা
export async function POST(
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
    const { amount } = body;
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }
    
    // নিলাম চেক
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (auctionError || !auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    if (auction.status !== 'active') {
      return NextResponse.json({ error: 'Auction is not active' }, { status: 400 });
    }
    
    if (new Date(auction.end_time) < new Date()) {
      return NextResponse.json({ error: 'Auction has ended' }, { status: 400 });
    }
    
    if (new Date(auction.start_time) > new Date()) {
      return NextResponse.json({ error: 'Auction has not started yet' }, { status: 400 });
    }
    
    const minBid = (auction.current_price || auction.start_price) + (auction.min_bid_increment || 100);
    if (amount < minBid) {
      return NextResponse.json({ error: `Minimum bid is ${minBid}` }, { status: 400 });
    }
    
    // নিজের নিলামে বিড করা যাবে না
    if (auction.seller_id === user.id) {
      return NextResponse.json({ error: 'Cannot bid on your own auction' }, { status: 403 });
    }
    
    // সর্বোচ্চ বিড চেক (অপশনাল)
    const { data: highestBid } = await supabase
      .from('bids')
      .select('bidder_id')
      .eq('auction_id', id)
      .order('amount', { ascending: false })
      .limit(1)
      .single();
    
    if (highestBid?.bidder_id === user.id) {
      return NextResponse.json({ error: 'You are already the highest bidder' }, { status: 400 });
    }
    
    // বিড তৈরি
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert({
        auction_id: id,
        bidder_id: user.id,
        amount,
      })
      .select()
      .single();
    
    if (bidError) {
      return NextResponse.json({ error: bidError.message }, { status: 500 });
    }
    
    // কারেন্ট প্রাইস আপডেট
    await supabase
      .from('auctions')
      .update({ current_price: amount })
      .eq('id', id);
    
    // নোটিফিকেশন পাঠান
    await supabase.from('notifications').insert({
      user_id: auction.seller_id,
      title: 'নতুন বিড',
      message: `আপনার "${auction.title}" নিলামে ${amount.toLocaleString()} টাকা বিড করা হয়েছে।`,
      type: 'bid',
      data: { auction_id: id, bid_id: bid.id, amount },
    });
    
    return NextResponse.json({ bid }, { status: 201 });
  } catch (error) {
    console.error('Bid POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/auctions/[id]/bids - সব বিড লিস্ট
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;
    
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        id,
        amount,
        created_at,
        is_auto_bid,
        bidder:profiles!bidder_id(id, name, avatar)
      `)
      .eq('auction_id', id)
      .order('amount', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      bids,
      count: bids?.length || 0,
    });
  } catch (error) {
    console.error('Bid GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}