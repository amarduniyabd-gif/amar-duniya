"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gavel, MessageCircle, User, Sparkles, Plus } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "হোম", icon: Home },
    { href: "/auction", label: "নিলাম", icon: Gavel },
    { href: "/chat", label: "চ্যাট", icon: MessageCircle },
    { href: "/my-account", label: "অ্যাকাউন্ট", icon: User },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* লোগো - আধুনিক প্রিমিয়াম স্টাইল */}
          <Link href="/" className="group relative">
            <div className="flex items-center gap-2">
              {/* অ্যানিমেটেড আইকন */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#f85606] to-orange-500 rounded-xl p-2 shadow-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>
              
              {/* টেক্সট লোগো */}
              <div className="leading-tight">
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[#f85606] via-orange-500 to-[#ff6b35] bg-clip-text text-transparent">
                    আমার দুনিয়া
                  </span>
                </h1>
                <p className="text-[9px] font-semibold text-gray-400 tracking-wider -mt-0.5">
                  WHERE DREAMS COME TRUE
                </p>
              </div>
            </div>
            
            {/* হোভার ইফেক্ট আন্ডারলাইন */}
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full group-hover:w-full transition-all duration-500"></div>
          </Link>

          {/* নেভিগেশন লিংক */}
          <div className="flex gap-1 bg-gray-100/50 p-1 rounded-2xl backdrop-blur-sm">
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
                
                {/* অ্যাক্টিভ ইন্ডিকেটর ডট */}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* ডান পাশের এক্সট্রা এলিমেন্ট */}
          <div className="flex items-center gap-3">
            {/* ইউজার আইকন - মাই অ্যাকাউন্টে লিংক */}
            <Link href="/my-account" className="relative group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 flex items-center justify-center group-hover:from-[#f85606] group-hover:to-orange-500 transition-all duration-300 cursor-pointer">
                <User size={18} className="text-[#f85606] group-hover:text-white transition" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </Link>
            
            {/* পোস্ট বাটন - পোস্ট অ্যাড পেজে লিংক */}
            <Link
              href="/post-ad"
              className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Plus size={18} />
              পোস্ট দিন
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}