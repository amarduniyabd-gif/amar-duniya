import { NextRequest, NextResponse } from 'next/server';

type Bid = {
  id: string;
  auctionId: number;
  userId: string;
  amount: number;
  createdAt: string;
};

let bids: Bid[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const auctionId = searchParams.get('auctionId');

  if (!auctionId) {
    return NextResponse.json({ success: false, message: 'auctionId প্রয়োজন' }, { status: 400 });
  }

  const auctionBids = bids.filter(bid => bid.auctionId === parseInt(auctionId));
  const highestBid = auctionBids.length > 0 ? Math.max(...auctionBids.map(b => b.amount)) : 0;

  return NextResponse.json({
    success: true,
    data: auctionBids,
    highestBid,
    totalBids: auctionBids.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { auctionId, userId, amount } = await req.json();

    const newBid: Bid = {
      id: `BID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      auctionId,
      userId,
      amount,
      createdAt: new Date().toISOString(),
    };

    bids.push(newBid);

    return NextResponse.json({
      success: true,
      message: 'বিড সফল হয়েছে!',
      data: newBid,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'বিড দিতে সমস্যা হয়েছে' }, { status: 500 });
  }
}