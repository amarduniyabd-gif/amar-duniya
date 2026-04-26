import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // শুধু admin পেজ প্রোটেক্ট (login পেজ ছাড়া)
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const adminCookie = req.cookies.get("adminLoggedIn");
    
    // কুকি না থাকলে বা false হলে → login পেজে পাঠাও
    if (!adminCookie || adminCookie.value !== "true") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", path); // লগইন করার পর এখানে ফেরত আসবে
      return NextResponse.redirect(loginUrl);
    }
  }

  // লগইন করা থাকলে admin/login পেজে গেলে সরাসরি admin এ পাঠাও
  if (path === "/admin/login") {
    const adminCookie = req.cookies.get("adminLoggedIn");
    if (adminCookie?.value === "true") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};