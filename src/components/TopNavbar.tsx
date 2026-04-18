"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gavel, MessageCircle, User, Sparkles } from "lucide-react";
import { Suspense } from "react";

function TopNavbarContent() {
  const pathname = usePathname();

  // চ্যাট পেজে টপবার দেখাবে না
  if (pathname?.startsWith('/chat')) return null;

  const navItems = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/auction", label: "নিলাম", icon: Gavel },
    { href: "/chat", label: "চ্যাট", icon: MessageCircle },
    { href: "/my-account", label: "অ্যাকাউন্ট", icon: User },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* লোগো */}
          <Link href="/" className="group relative">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500"></div>
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
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                  ${isActive(item.href) 
                    ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-lg shadow-orange-500/30" 
                    : "text-gray-600 hover:text-[#f85606] hover:bg-white/50"
                  }
                `}
              >
                <item.icon size={18} className={isActive(item.href) ? "text-white" : ""} />
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* পোস্ট বাটন */}
          <Link href="/post-ad">
            <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              + পোস্ট দিন
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default function TopNavbar() {
  return (
    <Suspense fallback={<div className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-lg"></div>}>
      <TopNavbarContent />
    </Suspense>
  );
}