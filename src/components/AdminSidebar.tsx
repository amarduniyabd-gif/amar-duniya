"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Package, Gavel, 
  CreditCard, FileText, Flag, Settings, FolderTree,
  LogOut, ChevronRight
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/users", label: "ইউজার ম্যানেজমেন্ট", icon: <Users size={18} /> },
  { href: "/admin/posts", label: "পোস্ট ম্যানেজমেন্ট", icon: <Package size={18} /> },
  { href: "/admin/auctions", label: "নিলাম ম্যানেজমেন্ট", icon: <Gavel size={18} /> },
  { href: "/admin/payments", label: "পেমেন্ট ম্যানেজমেন্ট", icon: <CreditCard size={18} /> },
  { href: "/admin/documents", label: "ডকুমেন্ট সার্ভিস", icon: <FileText size={18} /> },
  { href: "/admin/categories", label: "ক্যাটাগরি ম্যানেজমেন্ট", icon: <FolderTree size={18} /> },
  { href: "/admin/reports", label: "রিপোর্ট ম্যানেজমেন্ট", icon: <Flag size={18} /> },
  { href: "/admin/settings", label: "সেটিংস", icon: <Settings size={18} /> },
];

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <div className="h-full bg-gray-900 text-white p-5 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
          আমার দুনিয়া
        </h1>
        <p className="text-xs text-gray-500 mt-1">অ্যাডমিন প্যানেল</p>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition group ${
              pathname === item.href 
                ? "bg-gray-800 text-white" 
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="flex-1 text-sm">{item.label}</span>
            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition ${pathname === item.href ? "opacity-100" : ""}`} />
          </Link>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition mt-4"
        >
          <LogOut size={18} />
          <span className="flex-1 text-sm">লগ আউট</span>
        </button>
      </nav>
    </div>
  );
}