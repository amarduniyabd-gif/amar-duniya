import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // বর্তমান ইউজার চেক
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // লগআউট লগ (অপশনাল)
      try {
        const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                          request.headers.get('x-real-ip') || 
                          'unknown';
        
        await supabase.from('logout_logs').insert({
          user_id: user.id,
          ip_address: ipAddress,
          user_agent: request.headers.get('user-agent'),
          logged_out_at: new Date().toISOString(),
        });
      } catch {
        // লগ ফেইল করলেও লগআউট ঠিক থাকবে
      }
      
      // last_seen আপডেট
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', user.id);
    }
    
    // সাইন আউট
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      return NextResponse.json(
        { success: false, error: 'লগআউট করতে সমস্যা হয়েছে' },
        { status: 500 }
      );
    }
    
    // ক্লিয়ার কুকি রেস্পন্স
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'সফলভাবে লগআউট হয়েছে',
        redirect_to: '/login',
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
    
    // সব কুকি ক্লিয়ার
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('sb-provider-token');
    response.cookies.delete('sb-token');
    
    return response;
    
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'সার্ভার সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

// GET মেথডও সাপোর্ট (রিডাইরেক্টের জন্য)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    
    // লগইন পেজে রিডাইরেক্ট
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('message', 'logged_out');
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=logout_failed', request.url));
  }
}