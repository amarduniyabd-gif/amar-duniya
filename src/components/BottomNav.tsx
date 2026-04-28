"use client";
import Link from "next/link";
import { Home, Gavel, MessageCircle, User, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense, memo, useEffect, useState, useMemo, useCallback } from "react";

// ============ মেমোইজড ন্যাভ আইটেম ============
const NavItem = memo(({ href, icon: Icon, label, isActive, badge }: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean;
  badge?: number;
}) => (
  <Link href={href} className="flex flex-col items-center relative group">
    <div className="relative">
      <Icon 
        size={22} 
        className={`transition-colors duration-200 ${
          isActive ? "text-[#f85606]" : "text-gray-500 group-hover:text-gray-700"
        }`} 
      />
      {badge && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className={`text-[10px] mt-1 font-bold transition-colors duration-200 ${
      isActive ? "text-[#f85606]" : "text-gray-500 group-hover:text-gray-700"
    }`}>
      {label}
    </span>
  </Link>
));
NavItem.displayName = 'NavItem';

// ============ স্কেলেটন ============
const Skeleton = () => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50">
    <div className="flex justify-around items-center max-w-md mx-auto h-full">
      {[...Array(5)].map((_, i) => (
        <div key={`sk-${i}`} className="w-12 h-8 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  </div>
);

// ============ মেইন কন্টেন্ট ============
function BottomNavContent() {
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const isActive = useCallback((path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path) || false;
  }, [pathname]);

  const leftItems = useMemo(() => [
    { href: "/", icon: Home, label: "হোম" },
    { href: "/auction", icon: Gavel, label: "নিলাম" },
  ], []);

  const rightItems = useMemo(() => [
    { href: "/chat", icon: MessageCircle, label: "চ্যাট", badge: unreadCount > 0 ? unreadCount : undefined },
    { href: "/my-account", icon: User, label: "অ্যাকাউন্ট" },
  ], [unreadCount]);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadUnread = async () => {
      try {
        // ✅ ফিক্সড: getSupabaseClient ব্যবহার
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = getSupabaseClient();
        
        if (!supabase) return;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('is_read', false);
          
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Bottom nav error:', error);
      }
    };

    loadUnread();
  }, [mounted]);

  if (!isClient || !mounted) return <Skeleton />;
  
  // চ্যাট পেজের ভিতরে নেভিগেশন দেখাবে না
  if (pathname?.startsWith('/chat/')) return null;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 py-2 z-50 bg-white/95 backdrop-blur-md border-gray-100">
      <div className="flex justify-around items-center max-w-md mx-auto">
        
        {leftItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
          />
        ))}

        {/* পোস্ট দিন বাটন - মিডল */}
        <Link href="/post-ad" className="relative -mt-5 transition-transform active:scale-95">
          <div className="bg-gradient-to-r from-[#f85606] to-orange-500 w-[60px] h-[50px] rounded-2xl shadow-xl border-[3px] border-white flex flex-col items-center justify-center gap-0.5 hover:shadow-2xl transition-shadow">
            <ShoppingBag size={20} className="text-white" />
            <span className="text-white text-[9px] font-black uppercase tracking-tight">
              পোস্ট
            </span>
          </div>
        </Link>

        {rightItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
            badge={item.badge}
          />
        ))}

      </div>
    </footer>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={<Skeleton />}>
      <BottomNavContent />
    </Suspense>
  );
}