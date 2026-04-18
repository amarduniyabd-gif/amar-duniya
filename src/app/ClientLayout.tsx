"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🔥 এই পেজগুলোতে TopNavbar ও BottomNav দেখাবে না
  const hideNavbars = pathname?.startsWith('/admin') || 
                      pathname?.startsWith('/login') ||
                      pathname?.startsWith('/register') ||
                      pathname?.startsWith('/chat');

  // চ্যাট পেজে BottomNav দেখাবে না
  const isChatPage = pathname?.startsWith('/chat');
  
  if (hideNavbars) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNavbar />
      <main className="pb-20 md:pb-0 md:pt-16">
        {children}
      </main>
      {!isChatPage && <BottomNav />}
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}