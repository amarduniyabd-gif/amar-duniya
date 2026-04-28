"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Package, Gavel, 
  CreditCard, FileText, Flag, Settings, FolderTree,
  LogOut, ChevronRight, Shield, Home, Menu, X,
  Sparkles, MessageCircle, Heart, Gift,
  Database, Loader2
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
// ✅ এখানে পরিবর্তন করা হয়েছে: getSupabaseClient এর বদলে শুধু supabase
import { supabase } from "@/lib/supabase/client";

const menuItems = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/users", label: "ইউজার ম্যানেজমেন্ট", icon: <Users size={18} /> },
  { href: "/admin/posts", label: "পোস্ট ম্যানেজমেন্ট", icon: <Package size={18} /> },
  { href: "/admin/auctions", label: "নিলাম ম্যানেজমেন্ট", icon: <Gavel size={18} /> },
  { href: "/admin/payments", label: "পেমেন্ট ম্যানেজমেন্ট", icon: <CreditCard size={18} /> },
  { href: "/admin/documents", label: "ডকুমেন্ট সার্ভিস", icon: <FileText size={18} /> },
  { href: "/admin/categories", label: "ক্যাটাগরি ম্যানেজমেন্ট", icon: <FolderTree size={18} /> },
  { href: "/admin/sliders", label: "স্লাইডার ম্যানেজমেন্ট", icon: <Sparkles size={18} /> },
  { href: "/admin/matrimony", label: "পাত্র-পাত্রী ম্যানেজমেন্ট", icon: <Heart size={18} /> },
  { href: "/admin/chat", label: "চ্যাট মনিটরিং", icon: <MessageCircle size={18} /> },
  { href: "/admin/reports", label: "রিপোর্ট ম্যানেজমেন্ট", icon: <Flag size={18} /> },
  { href: "/admin/offer-ads", label: "অফার জোন", icon: <Gift size={18} /> },
  { href: "/admin/migrate", label: "ডাটা মাইগ্রেশন", icon: <Database size={18} /> },
  { href: "/admin/settings", label: "সেটিংস", icon: <Settings size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============ Supabase লগআউট ============
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    
    try {
      // ✅ সরাসরি supabase ব্যবহার করা হয়েছে
      await supabase.auth.signOut();
      
      // কুকি ক্লিয়ার করা (লগইন লুপ বন্ধ করতে জরুরি)
      document.cookie = "adminLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      
      // লোকাল স্টোরেজ ক্লিয়ার
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("isLoggedIn");
      
      // অ্যাডমিন লগইন পেজে রিডাইরেক্ট
      window.location.href = "/admin/login";
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      window.location.href = "/admin/login";
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className={`h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ${
      collapsed ? "w-20" : "w-72"
    }`}>
      {/* হেডার */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <Shield size={18} className="text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                আমার দুনিয়া
              </h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-800 rounded-lg transition active:scale-95"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>
      </div>

      {/* নেভিগেশন */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive 
                  ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-lg shadow-orange-500/20" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              {!collapsed && <span className="flex-1 text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ফুটার */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 disabled:opacity-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {isLoggingOut ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LogOut size={18} />
          )}
          {!collapsed && <span className="flex-1 text-sm font-medium text-left">
            {isLoggingOut ? "লগ আউট হচ্ছে..." : "লগ আউট"}
          </span>}
        </button>
      </div>
    </div>
  );
}