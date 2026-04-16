import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { type, amount, postId, userId } = await req.json();

    if (type === 'featured') {
      const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return NextResponse.json({
        success: true,
        paymentId,
        amount: 100,
        message: 'ফিচার্ড লিস্টিং পেমেন্ট সফল!',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    if (type === 'document') {
      const fee = amount * 0.02;
      const paymentId = `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return NextResponse.json({
        success: true,
        paymentId,
        amount: fee,
        message: 'ডকুমেন্ট সার্ভিস পেমেন্ট সফল!',
      });
    }

    if (type === 'bid') {
      const paymentId = `BID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return NextResponse.json({
        success: true,
        paymentId,
        amount: 2,
        message: 'বিড ফি পেমেন্ট সফল!',
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid payment type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 500 });
  }
}