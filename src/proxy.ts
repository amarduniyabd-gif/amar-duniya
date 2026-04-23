import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  await supabase.auth.getUser();

  // Protected routes
  const { pathname } = request.nextUrl;
  
  // ইউজার প্রটেক্টেড রুট
  const protectedRoutes = [
    '/my-account',
    '/my-posts',
    '/my-auctions',
    '/settings',
    '/post-ad',
    '/chat',
    '/saved',
    '/notifications',
    '/documents',
    '/auction/create',
    '/category/matrimony/create',
  ];
  
  // অ্যাডমিন রুট
  const adminRoutes = [
    '/admin',
    '/admin/users',
    '/admin/posts',
    '/admin/auctions',
    '/admin/payments',
    '/admin/documents',
    '/admin/categories',
    '/admin/sliders',
    '/admin/matrimony',
    '/admin/chat',
    '/admin/reports',
    '/admin/offer-ads',
    '/admin/migrate',
    '/admin/settings',
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Not logged in, redirect to login
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (isAdminRoute) {
      // Check if user is admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error || !profile?.is_admin) {
        // Not admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};