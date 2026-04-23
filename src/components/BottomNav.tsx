"use client";
import Link from "next/link";
import { Home, Gavel, MessageCircle, User, Package } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense, memo, useMemo, useEffect, useState } from "react";

// মেমোইজড ন্যাভ আইটেম
const NavItem = memo(({ href, icon: Icon, label, isActive, badge }: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean;
  badge?: number;
}) => (
  <Link href={href} className="flex flex-col items-center relative group">
    <div className="relative">
      <Icon size={22} className={`transition-colors duration-200 ${isActive ? "text-[#f85606]" : "text-gray-500 group-hover:text-gray-700"}`} />
      {badge && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </div>
    <span className={`text-[10px] mt-1 font-bold transition-colors duration-200 ${isActive ? "text-[#f85606]" : "text-gray-500 group-hover:text-gray-700"}`}>
      {label}
    </span>
  </Link>
));
NavItem.displayName = 'NavItem';

function BottomNavContent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ mounted চেক
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Supabase কল শুধু ক্লায়েন্ট সাইডে
  useEffect(() => {
    if (!mounted) return;

    const loadUnread = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = getSupabaseClient();
        
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

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const navItems = useMemo(() => [
    { href: "/", icon: Home, label: "হোম" },
    { href: "/auction", icon: Gavel, label: "নিলাম" },
    { href: "/chat", icon: MessageCircle, label: "চ্যাট", badge: unreadCount },
    { href: "/my-posts", icon: Package, label: "পোস্ট" },
    { href: "/my-account", icon: User, label: "অ্যাকাউন্ট" },
  ], [unreadCount]);

  if (pathname?.startsWith('/chat/')) return null;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 py-2 z-50 bg-white/95 backdrop-blur-md border-gray-100">
      <div className="flex justify-around items-center max-w-md mx-auto">
        
        {navItems.slice(0, 2).map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
            badge={item.badge}
          />
        ))}

        <Link href="/post-ad" className="relative -mt-5 transition-transform active:scale-95">
          <div className="bg-gradient-to-r from-[#f85606] to-orange-500 w-[60px] h-[50px] rounded-2xl shadow-xl border-[3px] border-white flex items-center justify-center hover:shadow-2xl transition-shadow">
            <span className="text-white text-[12px] font-black uppercase tracking-tight">
              পোস্ট
            </span>
          </div>
        </Link>

        {navItems.slice(2).map((item) => (
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
    <Suspense fallback={
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-100">
        <div className="flex justify-around items-center max-w-md mx-auto h-full">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-12 h-8 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <BottomNavContent />
    </Suspense>
  );
}