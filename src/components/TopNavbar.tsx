"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gavel, MessageCircle, User, Sparkles, Package, Plus, ShoppingBag } from "lucide-react";
import { Suspense, memo, useEffect, useState, useCallback, useMemo } from "react";

// ============ মেমোইজড ন্যাভ আইটেম ============
const NavItem = memo(({ href, icon: Icon, label, isActive, badge }: { 
  href: string; 
  icon: any; 
  label: string; 
  isActive: boolean;
  badge?: number;
}) => (
  <Link
    href={href}
    className={`
      relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300
      ${isActive 
        ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105" 
        : "text-gray-600 hover:text-[#f85606] hover:bg-white/60 hover:scale-105"
      }
    `}
  >
    <div className="relative">
      <Icon 
        size={18} 
        strokeWidth={isActive ? 2.5 : 2}
        className={`transition-all duration-300 ${isActive ? "text-white drop-shadow-md" : "group-hover:drop-shadow-md"}`} 
      />
      {/* ✅ badge শুধু unreadCount > 0 হলে দেখাবে */}
      {badge && badge > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-md animate-pulse border border-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </div>
    <span className="hidden md:inline font-semibold tracking-wide">
      {label}
    </span>
    
    {/* Active indicator dot */}
    {isActive && (
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-md" />
    )}
  </Link>
));
NavItem.displayName = 'NavItem';

// ============ স্কেলেটন ============
const Skeleton = () => (
  <div className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-lg z-50">
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-24 h-6 bg-gray-200 rounded-lg animate-pulse hidden lg:block" />
        </div>
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={`sk-${i}`} className="w-20 h-10 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

// ============ মেইন কন্টেন্ট ============
function TopNavbarContent() {
  const pathname = usePathname();
  
  // ✅ সব useState সবার আগে
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  // ✅ useCallback
  const isActive = useCallback((path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path) || false;
  }, [pathname]);

  // ✅ useMemo - badge: unreadCount > 0 ? unreadCount : undefined
  const navItems = useMemo(() => [
    { href: "/", label: "হোম", icon: Home },
    { href: "/auction", label: "নিলাম", icon: Gavel },
    { href: "/chat", label: "চ্যাট", icon: MessageCircle, badge: unreadCount > 0 ? unreadCount : undefined },
    { href: "/my-posts", label: "পোস্ট", icon: Package },
    { href: "/my-account", label: "অ্যাকাউন্ট", icon: User },
  ], [unreadCount]);

  // ✅ useEffect
  useEffect(() => {
    setIsClient(true);
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserName(profile.full_name || profile.username || '');
            setUserAvatar(profile.avatar_url || '');
          }
          
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

    const interval = setInterval(() => {
      if (isLoggedIn) loadUserData();
    }, 30000);

    return () => clearInterval(interval);
  }, [mounted, isLoggedIn]);

  // ✅ conditional return (সব হুকের পরে)
  if (!isClient || !mounted) return <Skeleton />;
  if (pathname?.startsWith('/chat/')) return null;

  return (
    <nav 
      className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100/50 shadow-sm" 
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5">
        <div className="flex justify-between items-center gap-4">
          
          {/* ============ লোগো ============ */}
          <Link href="/" className="group relative shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-[#f85606] to-orange-500 rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <ShoppingBag size={18} className="text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-[#f85606] via-orange-500 to-[#ff6b35] bg-clip-text text-transparent">
                    আমার দুনিয়া
                  </span>
                </h1>
                <p className="text-[8px] font-semibold tracking-widest text-gray-400 uppercase">
                  স্বপ্নের ঠিকানা
                </p>
              </div>
            </div>
          </Link>

          {/* ============ নেভিগেশন লিংক ============ */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-gray-100/60 backdrop-blur-sm">
            {navItems.map((item) => (
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

          {/* ============ রাইট সাইড ============ */}
          <div className="flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                {/* ✅ পোস্ট দিন বাটন - /post-ad এ যাবে */}
                <Link href="/post-ad">
                  <button className="relative group bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-md hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden">
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                    <Plus size={18} strokeWidth={2.5} className="relative z-10" />
                    <span className="hidden md:inline relative z-10 tracking-wide">পোস্ট দিন</span>
                  </button>
                </Link>
                
                {/* ইউজার প্রোফাইল */}
                <Link href="/my-account" className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 py-1.5 transition-all duration-300">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#f85606] to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden lg:block text-xs font-semibold text-gray-700 max-w-[80px] truncate">
                    {userName || 'ইউজার'}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-md hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 tracking-wide">
                    লগইন
                  </button>
                </Link>
                
                <Link href="/register" className="hidden md:block">
                  <button className="border-2 border-[#f85606] text-[#f85606] px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-orange-50 hover:shadow-md transition-all duration-300 hover:scale-105 tracking-wide">
                    রেজিস্টার
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

// ============ এক্সপোর্ট ============
export default function TopNavbar() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TopNavbarContent />
    </Suspense>
  );
}