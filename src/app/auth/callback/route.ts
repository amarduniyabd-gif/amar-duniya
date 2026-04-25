import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('redirect') || '/';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Exchange error:', error.message);
    }
  }

  // ✅ রেস্পন্স
  const response = NextResponse.redirect(new URL(next, request.url));
  
  // ✅ ক্যাশ বন্ধ
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  
  return response;
}