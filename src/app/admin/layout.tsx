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

  useEffect(() => {
    setIsMounted(true);
    const isAdmin = localStorage.getItem("adminLoggedIn");
    
    // লগইন পেজে চেক করবে না
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }
    
    if (isAdmin !== "true") {
      router.push("/admin/login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // Hydration Error এড়াতে মাউন্ট হওয়ার আগে কিছু দেখাবে না
  if (!isMounted) {
    return null;
  }

  // লগইন পেজের জন্য আলাদা লেআউট
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent"></div>
      </div>
    );
  }

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