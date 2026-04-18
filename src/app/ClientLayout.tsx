"use client";
import { usePathname } from "next/navigation";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 🔥 এই পেজগুলোতে TopNavbar ও BottomNav দেখাবে না
  const hideNavbars = pathname?.startsWith('/admin') || 
                      pathname?.startsWith('/login') ||
                      pathname?.startsWith('/register') ||
                      pathname?.startsWith('/chat');

  // চ্যাট পেজে BottomNav দেখাবে না (আপনার আগের লজিক)
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