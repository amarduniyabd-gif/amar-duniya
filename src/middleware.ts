// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // সেশন চেক করুন
  const { data: { session } } = await supabase.auth.getSession()

  // পাবলিক রাউটগুলি
  const publicRoutes = ['/', '/login', '/register', '/about', '/contact']
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)
  
  // API রাউটগুলির জন্য (পোস্ট সাবমিট API)
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')
  
  // পোস্ট এড করার পেজ
  const isAddPostPage = req.nextUrl.pathname === '/add-post'
  
  // ✅ API রাউটের জন্য রিডাইরেক্ট করবেন না
  if (isApiRoute) {
    return response
  }
  
  // ✅ পোস্ট এড পেজের জন্য সঠিক চেক
  if (isAddPostPage && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // অন্যান্য প্রোটেক্টেড রাউট
  if (!isPublicRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}