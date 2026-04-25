"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const checkAuth = async () => {
      const adminLoggedIn = localStorage.getItem("adminLoggedIn");
      const adminEmail = localStorage.getItem("adminEmail");
      
      // ✅ লগইন পেজ - সবাই দেখতে পারবে
      if (pathname === "/admin/login") {
        if (adminLoggedIn === "true" && adminEmail) {
          // ইতিমধ্যে লগইন থাকলে ড্যাশবোর্ডে পাঠান
          router.push("/admin");
          return;
        }
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }
      
      // ✅ অন্যান্য অ্যাডমিন পেজ - লগইন চেক
      if (adminLoggedIn !== "true" || !adminEmail) {
        // লগইন নেই → লগইন পেজে পাঠান
        router.push("/admin/login");
        return;
      }
      
      // ✅ Supabase চেক (অপশনাল - লোকাল ফলব্যাক সহ)
      try {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
          
          if (!profile?.is_admin) {
            // অ্যাডমিন না → হোম পেজে পাঠান
            localStorage.removeItem("adminLoggedIn");
            localStorage.removeItem("adminEmail");
            router.push("/");
            return;
          }
        }
      } catch (error) {
        // Supabase চেক ফেইল → লোকাল স্টোরেজ দিয়েই ঢুকতে দেবে
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Hydration Error এড়াতে
  if (!isMounted) return null;

  // লগইন পেজ
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // লোডিং
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent" />
      </div>
    );
  }

  // আনঅথরাইজড
  if (!isAuthorized) return null;

  // ✅ অ্যাডমিন প্যানেল
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="h-full flex-shrink-0">
        <AdminSidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}