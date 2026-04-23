"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gavel, MessageCircle, User, Sparkles, Package } from "lucide-react";
import { Suspense, memo, useMemo, useEffect, useState } from "react";

// মেমোইজড ন্যাভ আইটেম
const NavItem = memo(({ href, icon: Icon, label, isActive }: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={`
      relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
      ${isActive 
        ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-lg shadow-orange-500/30" 
        : "text-gray-600 hover:text-[#f85606] hover:bg-white/50"
      }
    `}
  >
    <Icon size={18} className={isActive ? "text-white" : ""} />
    <span>{label}</span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
    )}
  </Link>
));
NavItem.displayName = 'NavItem';

function TopNavbarContent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadUserData = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const supabase = getSupabaseClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
        
        if (user) {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('is_read', false);
          
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Navbar user error:', error);
      }
    };

    loadUserData();
  }, [mounted]);

  // ✅ Hydration ফিক্স - mounted না হলে null
  if (!mounted) {
    return (
      <div className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // চ্যাট পেজে টপবার দেখাবে না
  if (pathname?.startsWith('/chat/')) return null;

  const navItems = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/auction", label: "নিলাম", icon: Gavel },
    { href: "/chat", label: "চ্যাট", icon: MessageCircle, badge: unreadCount },
    { href: "/my-posts", label: "পোস্ট", icon: Package },
    { href: "/my-account", label: "অ্যাকাউন্ট", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path) || false;
  };

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-lg" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* লোগো */}
          <Link href="/" className="group relative">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-gradient-to-br from-[#f85606] to-orange-500 rounded-xl p-2 shadow-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[#f85606] via-orange-500 to-[#ff6b35] bg-clip-text text-transparent">
                    আমার দুনিয়া
                  </span>
                </h1>
                <p className="text-[9px] font-semibold tracking-wider -mt-0.5 text-gray-400">
                  স্বপ্নের ঠিকানা
                </p>
              </div>
            </div>
          </Link>

          {/* নেভিগেশন লিংক */}
          <div className="flex gap-1 p-1 rounded-2xl backdrop-blur-sm bg-gray-100/50">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                <NavItem
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={isActive(item.href)}
                />
                {item.badge && item.badge > 0 && item.href === '/chat' && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* রাইট সাইড */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/post-ad">
                <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                  + পোস্ট দিন
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                  লগইন
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default function TopNavbar() {
  return (
    <Suspense fallback={null}>
      <TopNavbarContent />
    </Suspense>
  );
}