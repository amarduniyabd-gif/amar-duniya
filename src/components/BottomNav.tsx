"use client";
import Link from "next/link";
import { Home, Gavel, MessageCircle, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        
        {/* Home */}
        <Link href="/" className="flex flex-col items-center">
          <Home size={22} className={isActive("/") ? "text-[#f85606]" : "text-gray-500"} />
          <span className={`text-[10px] mt-1 font-bold ${isActive("/") ? "text-[#f85606]" : "text-gray-500"}`}>Home</span>
        </Link>

        {/* Auction */}
        <Link href="/auction" className="flex flex-col items-center">
          <Gavel size={22} className={isActive("/auction") ? "text-[#f85606]" : "text-gray-500"} />
          <span className={`text-[10px] mt-1 font-bold ${isActive("/auction") ? "text-[#f85606]" : "text-gray-500"}`}>Auction</span>
        </Link>

        {/* Post Button (No Plus Icon, Only Text) */}
        <Link href="/post-ad" className="relative -mt-4 transition-transform active:scale-95">
          <div className="bg-[#f85606] w-[58px] h-[48px] rounded-[16px] shadow-lg border-[3px] border-white flex items-center justify-center">
             <span className="text-white text-[11px] font-black uppercase tracking-tight">Post</span>
          </div>
        </Link>

        {/* Chat */}
        <Link href="/chat" className="flex flex-col items-center relative">
          <MessageCircle size={22} className={isActive("/chat") ? "text-[#f85606]" : "text-gray-500"} />
          <span className={`text-[10px] mt-1 font-bold ${isActive("/chat") ? "text-[#f85606]" : "text-gray-500"}`}>Chat</span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-white border-2"></span>
        </Link>

        {/* My Account */}
        <Link href="/my-account" className="flex flex-col items-center">
          <User size={22} className={isActive("/my-account") ? "text-[#f85606]" : "text-gray-500"} />
          <span className={`text-[10px] mt-1 font-bold ${isActive("/my-account") ? "text-[#f85606]" : "text-gray-500"}`}>Account</span>
        </Link>

      </div>
    </footer>
  );
}