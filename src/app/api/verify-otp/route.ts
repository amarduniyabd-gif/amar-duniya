import { NextRequest, NextResponse } from 'next/server';

const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ success: false, message: 'ফোন নম্বর ও OTP দিন' }, { status: 400 });
    }

    const stored = otpStore.get(phone);

    if (!stored) {
      return NextResponse.json({ success: false, message: 'OTP পাওয়া যায়নি' }, { status: 400 });
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(phone);
      return NextResponse.json({ success: false, message: 'OTP মেয়াদ উত্তীর্ণ' }, { status: 400 });
    }

    if (stored.otp !== otp) {
      return NextResponse.json({ success: false, message: 'OTP সঠিক নয়' }, { status: 400 });
    }

    otpStore.delete(phone);

    return NextResponse.json({
      success: true,
      message: 'OTP ভেরিফাই সফল!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'OTP ভেরিফাই করতে সমস্যা হয়েছে' }, { status: 500 });
  }
}