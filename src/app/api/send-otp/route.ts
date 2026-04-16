import { NextRequest, NextResponse } from 'next/server';

const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 11) {
      return NextResponse.json({ success: false, message: 'সঠিক ফোন নম্বর দিন' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { otp, expires });
    console.log(`OTP for ${phone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: 'OTP পাঠানো হয়েছে',
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'OTP পাঠাতে সমস্যা হয়েছে' }, { status: 500 });
  }
}