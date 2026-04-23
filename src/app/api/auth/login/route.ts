import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();
    const { email, password } = body;
    
    // ভ্যালিডেশন
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'ইমেইল এবং পাসওয়ার্ড আবশ্যক' },
        { status: 400 }
      );
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'সঠিক ইমেইল ফরম্যাট দিন' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' },
        { status: 400 }
      );
    }
    
    // লগইন
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
      
      // এরর মেসেজ বাংলায়
      let errorMessage = 'লগইন করতে সমস্যা হয়েছে';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'ইমেইল বা পাসওয়ার্ড ভুল';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'ইমেইল ভেরিফাই করা হয়নি। অনুগ্রহ করে ইমেইল চেক করুন';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'অনেকবার চেষ্টা করেছেন। কিছুক্ষণ পর আবার চেষ্টা করুন';
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }
    
    if (!data.user) {
      return NextResponse.json(
        { success: false, error: 'লগইন ব্যর্থ হয়েছে' },
        { status: 401 }
      );
    }
    
    // প্রোফাইল চেক (অ্যাডমিন স্ট্যাটাস)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, name, avatar')
      .eq('id', data.user.id)
      .single();
    
    // IP অ্যাড্রেস (Next.js 16 কম্প্যাটিবল)
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // লগইন লগ (অপশনাল)
    try {
      await supabase.from('login_logs').insert({
        user_id: data.user.id,
        ip_address: ipAddress,
        user_agent: request.headers.get('user-agent'),
        logged_in_at: new Date().toISOString(),
      });
    } catch {
      // লগ ফেইল করলেও লগইন ঠিক থাকবে
    }
    
    // শেষ লগইন আপডেট
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
    
    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || 'ইউজার',
        avatar: profile?.avatar || null,
        is_admin: profile?.is_admin || false,
      },
      session: {
        expires_at: data.session?.expires_at,
      },
      redirect_to: profile?.is_admin ? '/admin' : '/',
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন' },
      { status: 500 }
    );
  }
}