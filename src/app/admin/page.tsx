"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, TrendingUp, TrendingDown, Eye, Users, Package, Gavel, DollarSign, 
  Activity, Clock, Bell, ArrowUpRight, RefreshCw, Zap, CreditCard, UserCheck,
  Search, Filter, Download, MoreVertical, CheckCircle, XCircle, AlertCircle,
  BarChart3, PieChart, Calendar, Settings, LogOut, Shield, Home, FileText,
  UserPlus, MessageCircle, Trash2, Edit, EyeOff, ChevronDown
} from "lucide-react";

// নোটিফিকেশন টাইপ
type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'user' | 'post' | 'payment' | 'auction' | 'system';
};

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'auctions'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // নোটিফিকেশন ডাটা
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "নতুন ইউজার রেজিস্ট্রেশন", message: "আলমগীর হোসেন নতুন অ্যাকাউন্ট তৈরি করেছেন", time: "২ মিনিট আগে", read: false, type: "user" },
    { id: 2, title: "পোস্ট পেন্ডিং", message: "নতুন পোস্ট অ্যাপ্রুভালের জন্য অপেক্ষমান", time: "৫ মিনিট আগে", read: false, type: "post" },
    { id: 3, title: "পেমেন্ট সফল", message: "করিম মিয়া ৳১০০ পেমেন্ট সম্পন্ন করেছেন", time: "১০ মিনিট আগে", read: false, type: "payment" },
    { id: 4, title: "নিলাম শেষ", message: "iPhone 15 Pro Max নিলাম শেষ হয়েছে", time: "৩০ মিনিট আগে", read: true, type: "auction" },
    { id: 5, title: "সিস্টেম আপডেট", message: "সার্ভার মেইনটেনেন্স সম্পন্ন হয়েছে", time: "১ ঘন্টা আগে", read: true, type: "system" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const [stats, setStats] = useState({
    users: { total: 1234, new: 45, growth: 12 },
    posts: { total: 5678, new: 89, growth: 8 },
    auctions: { total: 89, new: 12, growth: -3 },
    revenue: { total: 1234567, new: 23456, growth: 23 },
  });

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: "রহিম উদ্দিন", email: "rahim@gmail.com", phone: "01712345678", status: "active", date: "২০২৬-০৪-১৬", avatar: "R", verified: true },
    { id: 2, name: "করিম মিয়া", email: "karim@gmail.com", phone: "01812345678", status: "active", date: "২০২৬-০৪-১৫", avatar: "K", verified: true },
    { id: 3, name: "শাহিনুর রহমান", email: "shahinur@gmail.com", phone: "01912345678", status: "blocked", date: "২০২৬-০৪-১৪", avatar: "S", verified: false },
    { id: 4, name: "আব্দুল করিম", email: "abdul@gmail.com", phone: "01612345678", status: "active", date: "২০২৬-০৪-১৩", avatar: "A", verified: true },
    { id: 5, name: "নাজমা বেগম", email: "nazma@gmail.com", phone: "01512345678", status: "pending", date: "২০২৬-০৪-১২", avatar: "N", verified: false },
  ]);

  const [recentPosts, setRecentPosts] = useState([
    { id: 1, title: "iPhone 15 Pro Max", seller: "রহিম উদ্দিন", price: 75000, status: "pending", date: "২০২৬-০৪-১৬", views: 1240, category: "মোবাইল", location: "ঢাকা" },
    { id: 2, title: "MacBook Pro M2", seller: "করিম মিয়া", price: 180000, status: "approved", date: "২০২৬-০৪-১৫", views: 890, category: "কম্পিউটার", location: "চট্টগ্রাম" },
    { id: 3, title: "Samsung Galaxy S23", seller: "শাহিনুর রহমান", price: 95000, status: "rejected", date: "২০২৬-০৪-১৪", views: 2100, category: "মোবাইল", location: "খুলনা" },
    { id: 4, title: "Nike Air Max", seller: "আব্দুল করিম", price: 12000, status: "pending", date: "২০২৬-০৪-১৩", views: 340, category: "ফ্যাশন", location: "রাজশাহী" },
    { id: 5, title: "Sony PlayStation 5", seller: "আলমগীর হোসেন", price: 55000, status: "approved", date: "২০২৬-০৪-১২", views: 1560, category: "ইলেকট্রনিক্স", location: "সিলেট" },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "নতুন ইউজার রেজিস্ট্রেশন", user: "আলমগীর হোসেন", time: "২ মিনিট আগে", type: "user", icon: "👤" },
    { id: 2, action: "নতুন পোস্ট জমা", user: "নাজমা বেগম", time: "৫ মিনিট আগে", type: "post", icon: "📝" },
    { id: 3, action: "পেমেন্ট সফল", user: "করিম মিয়া", amount: 100, time: "১০ মিনিট আগে", type: "payment", icon: "💰" },
    { id: 4, action: "নতুন নিলাম শুরু", user: "রহিম উদ্দিন", time: "১৫ মিনিট আগে", type: "auction", icon: "🔨" },
    { id: 5, action: "ইউজার ব্লক করা হয়েছে", user: "শাহিনুর রহমান", time: "৩০ মিনিট আগে", type: "alert", icon: "⚠️" },
    { id: 6, action: "পোস্ট অ্যাপ্রুভ করা হয়েছে", user: "অ্যাডমিন", time: "১ ঘন্টা আগে", type: "post", icon: "✅" },
  ]);

  const monthlyData = [65000, 45000, 78000, 55000, 89000, 70000, 92000, 80000, 75000, 88000, 95000, 85000];
  const months = ["জানু", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ", "অক্টো", "নভে", "ডিসে"];

  // ক্লিক আউটসাইড হ্যান্ডলার
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      router.push("/admin/login");
    } else {
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => { 
    localStorage.removeItem("adminLoggedIn"); 
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminEmail");
    router.push("/admin/login"); 
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const handleApprovePost = (id: number) => {
    setRecentPosts(posts => 
      posts.map(post => post.id === id ? { ...post, status: 'approved' } : post)
    );
    addActivity("পোস্ট অ্যাপ্রুভ করা হয়েছে", "অ্যাডমিন", "post", "✅");
  };

  const handleRejectPost = (id: number) => {
    setRecentPosts(posts => 
      posts.map(post => post.id === id ? { ...post, status: 'rejected' } : post)
    );
    addActivity("পোস্ট রিজেক্ট করা হয়েছে", "অ্যাডমিন", "post", "❌");
  };

  const handleToggleUserStatus = (id: number) => {
    setRecentUsers(users => 
      users.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } 
          : user
      )
    );
  };

  const handleVerifyUser = (id: number) => {
    setRecentUsers(users => 
      users.map(user => user.id === id ? { ...user, verified: true } : user)
    );
  };

  const addActivity = (action: string, user: string, type: string, icon: string) => {
    const newActivity = {
      id: recentActivities.length + 1,
      action,
      user,
      time: "এখনই",
      type,
      icon,
    };
    setRecentActivities([newActivity, ...recentActivities]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // 🔥 রিপোর্ট ডাউনলোড ফাংশন
  const handleDownloadReport = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('bn-BD');
    const timeStr = now.toLocaleTimeString('bn-BD');
    
    const reportData = [
      ["আমার দুনিয়া - অ্যাডমিন রিপোর্ট", "", "", "", ""],
      ["তারিখ: " + dateStr, "সময়: " + timeStr, "", "", ""],
      ["", "", "", "", ""],
      ["সারসংক্ষেপ", "", "", "", ""],
      ["মোট ইউজার", stats.users.total.toString(), "নতুন", stats.users.new.toString(), stats.users.growth + "%"],
      ["মোট পোস্ট", stats.posts.total.toString(), "নতুন", stats.posts.new.toString(), stats.posts.growth + "%"],
      ["মোট নিলাম", stats.auctions.total.toString(), "সক্রিয়", stats.auctions.new.toString(), ""],
      ["মোট লেনদেন", "৳" + stats.revenue.total.toLocaleString(), "এই মাসে", "৳" + stats.revenue.new.toLocaleString(), stats.revenue.growth + "%"],
      ["", "", "", "", ""],
      ["রিসেন্ট ইউজার", "", "", "", ""],
      ["নাম", "ইমেইল", "ফোন", "স্ট্যাটাস", "তারিখ"],
      ...recentUsers.map(user => [user.name, user.email, user.phone || "-", user.status, user.date]),
      ["", "", "", "", ""],
      ["রিসেন্ট পোস্ট", "", "", "", ""],
      ["টাইটেল", "বিক্রেতা", "মূল্য", "স্ট্যাটাস", "ভিউ"],
      ...recentPosts.map(post => [post.title, post.seller, "৳" + post.price, post.status, post.views.toString()]),
    ];

    let csvContent = "";
    reportData.forEach(row => {
      const formattedRow = row.map(cell => {
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',');
      csvContent += formattedRow + "\n";
    });

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amar-duniya-report-${now.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowReportOptions(false);
    alert("✅ রিপোর্ট ডাউনলোড শুরু হয়েছে!");
  };

  const handleDownloadFullReport = () => {
    const now = new Date();
    const summaryData = `
═══════════════════════════════════════════════════
            আমার দুনিয়া - অ্যাডমিন রিপোর্ট
═══════════════════════════════════════════════════
তারিখ: ${now.toLocaleDateString('bn-BD')} | সময়: ${now.toLocaleTimeString('bn-BD')}
═══════════════════════════════════════════════════

📊 সারসংক্ষেপ
───────────────────────────────────────────────────
• মোট ইউজার: ${stats.users.total} (নতুন: +${stats.users.new}, বৃদ্ধি: ${stats.users.growth}%)
• মোট পোস্ট: ${stats.posts.total} (নতুন: +${stats.posts.new}, বৃদ্ধি: ${stats.posts.growth}%)
• মোট নিলাম: ${stats.auctions.total} (সক্রিয়: ${stats.auctions.new})
• মোট লেনদেন: ৳${stats.revenue.total.toLocaleString()}

═══════════════════════════════════════════════════
👥 রিসেন্ট ইউজার
═══════════════════════════════════════════════════
${recentUsers.map((u, i) => 
  `${i+1}. ${u.name} (${u.email}) - ${u.status} - ${u.verified ? '✅ ভেরিফাইড' : '⚠️ আনভেরিফাইড'}`
).join('\n')}

═══════════════════════════════════════════════════
📦 রিসেন্ট পোস্ট
═══════════════════════════════════════════════════
${recentPosts.map((p, i) => 
  `${i+1}. ${p.title} - ৳${p.price} - ${p.status} - ${p.views} ভিউ`
).join('\n')}

═══════════════════════════════════════════════════
                        রিপোর্ট সমাপ্ত
═══════════════════════════════════════════════════
`;

    const blob = new Blob(['\uFEFF' + summaryData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amar-duniya-full-report-${now.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowReportOptions(false);
    alert("✅ বিস্তারিত রিপোর্ট ডাউনলোড সম্পন্ন হয়েছে!");
  };

  if (!mounted || !isLoggedIn) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল বাটন */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ডেস্কটপ সাইডবার */}
      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block">
        <AdminSidebar />
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* মোবাইল সাইডবার */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 md:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <AdminSidebar />
      </div>

      {/* মেন কন্টেন্ট */}
      <div className="md:ml-72">
        {/* টপ বার */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm px-6 py-4 sticky top-0 z-30 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                ড্যাশবোর্ড
              </h1>
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'overview' 
                      ? 'bg-[#f85606] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ওভারভিউ
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'users' 
                      ? 'bg-[#f85606] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ইউজার
                </button>
                <button 
                  onClick={() => setActiveTab('posts')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'posts' 
                      ? 'bg-[#f85606] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  পোস্ট
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="খুঁজুন..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                />
              </div>
              
              <button 
                onClick={handleRefresh} 
                className="p-2 hover:bg-gray-100 rounded-xl transition"
                title="রিফ্রেশ"
              >
                <RefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {/* 🔔 নোটিফিকেশন ড্রপডাউন */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-xl transition"
                >
                  <Bell size={20} className="text-gray-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">নোটিফিকেশন</h3>
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-xs text-[#f85606] hover:underline"
                      >
                        সব পড়া হয়েছে
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-gray-400 py-6">কোনো নোটিফিকেশন নেই</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                              !notif.read ? 'bg-orange-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                notif.type === 'user' ? 'bg-blue-100' :
                                notif.type === 'post' ? 'bg-green-100' :
                                notif.type === 'payment' ? 'bg-purple-100' :
                                notif.type === 'auction' ? 'bg-orange-100' : 'bg-gray-100'
                              }`}>
                                {notif.type === 'user' && <Users size={14} className="text-blue-600" />}
                                {notif.type === 'post' && <Package size={14} className="text-green-600" />}
                                {notif.type === 'payment' && <DollarSign size={14} className="text-purple-600" />}
                                {notif.type === 'auction' && <Gavel size={14} className="text-orange-600" />}
                                {notif.type === 'system' && <Settings size={14} className="text-gray-600" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                <p className="text-xs text-gray-500">{notif.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-[#f85606] rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <Link href="/admin/notifications">
                        <button className="w-full text-center text-xs text-[#f85606] py-2 hover:underline">
                          সব নোটিফিকেশন দেখুন
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 👤 অ্যাডমিন প্রোফাইল ড্রপডাউন */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 hover:bg-gray-100 p-1.5 rounded-xl transition"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">অ্যাডমিন</p>
                    <p className="text-xs text-gray-400">admin@amarduniya.com</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                    A
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">অ্যাডমিন</p>
                      <p className="text-xs text-gray-400">admin@amarduniya.com</p>
                    </div>
                    <div className="py-1">
                      <Link href="/admin/settings">
                        <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition">
                          <Settings size={16} className="text-gray-500" />
                          সেটিংস
                        </button>
                      </Link>
                      <Link href="/">
                        <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition">
                          <Home size={16} className="text-gray-500" />
                          হোম পেজ
                        </button>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 transition"
                      >
                        <LogOut size={16} />
                        লগ আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">মোট ইউজার</p>
                  <p className="text-3xl font-bold mt-1">{stats.users.total}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-green-300" />
                    <span className="text-xs">{stats.users.growth}%</span>
                    <span className="text-xs opacity-75 ml-1">গত মাস থেকে</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs opacity-75">নতুন: +{stats.users.new} এই মাসে</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">মোট পোস্ট</p>
                  <p className="text-3xl font-bold mt-1">{stats.posts.total}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-green-300" />
                    <span className="text-xs">{stats.posts.growth}%</span>
                    <span className="text-xs opacity-75 ml-1">গত মাস থেকে</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Package size={24} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs opacity-75">নতুন: +{stats.posts.new} এই মাসে</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">মোট নিলাম</p>
                  <p className="text-3xl font-bold mt-1">{stats.auctions.total}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stats.auctions.growth > 0 ? (
                      <TrendingUp size={14} className="text-green-300" />
                    ) : (
                      <TrendingDown size={14} className="text-red-300" />
                    )}
                    <span className="text-xs">{Math.abs(stats.auctions.growth)}%</span>
                    <span className="text-xs opacity-75 ml-1">গত মাস থেকে</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Gavel size={24} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs opacity-75">সক্রিয়: {stats.auctions.new} টি</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">মোট লেনদেন</p>
                  <p className="text-3xl font-bold mt-1">৳{stats.revenue.total.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp size={14} className="text-green-300" />
                    <span className="text-xs">{stats.revenue.growth}%</span>
                    <span className="text-xs opacity-75 ml-1">গত মাস থেকে</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs opacity-75">এই মাসে: ৳{stats.revenue.new.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* চার্ট ও কুইক অ্যাকশন */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#f85606]" /> 
                  মাসিক আয়
                </h2>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5"
                >
                  <option value="2026">২০২৬</option>
                  <option value="2025">২০২৫</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {monthlyData.slice(0, 6).map((value, i) => {
                  const maxValue = Math.max(...monthlyData);
                  const widthPercent = (value / maxValue) * 100;
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-10">{months[i]}</span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#f85606] to-orange-400 rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                          style={{ width: `${widthPercent}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            ৳{value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-3 mt-2">
                {monthlyData.slice(6, 12).map((value, i) => {
                  const maxValue = Math.max(...monthlyData);
                  const widthPercent = (value / maxValue) * 100;
                  const monthIndex = i + 6;
                  
                  return (
                    <div key={monthIndex} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-10">{months[monthIndex]}</span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#f85606] to-orange-400 rounded-lg transition-all duration-500 flex items-center justify-end px-2"
                          style={{ width: `${widthPercent}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            ৳{value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-sm font-semibold text-gray-700">মোট আয়</span>
                <span className="text-lg font-bold text-[#f85606]">
                  ৳{monthlyData.reduce((a, b) => a + b, 0).toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* কুইক অ্যাকশন */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-[#f85606]" /> 
                কুইক অ্যাকশন
              </h2>
              <div className="space-y-3">
                <Link href="/admin/users">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">নতুন ইউজার যোগ করুন</span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                  </div>
                </Link>
                
                <div 
                  onClick={() => setActiveTab('posts')}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <Package size={16} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      পেন্ডিং পোস্ট ({recentPosts.filter(p => p.status === 'pending').length})
                    </span>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                </div>
                
                <Link href="/admin/auctions">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                        <Gavel size={16} className="text-orange-600" />
                      </div>
                      <span className="text-sm font-medium">সক্রিয় নিলাম</span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                  </div>
                </Link>
                
                <Link href="/admin/payments">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                        <CreditCard size={16} className="text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">পেন্ডিং পেমেন্ট</span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                  </div>
                </Link>
                
                {/* 🔥 রিপোর্ট ডাউনলোড ড্রপডাউন */}
                <div className="relative">
                  <button 
                    onClick={() => setShowReportOptions(!showReportOptions)}
                    className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"
                  >
                    <Download size={16} /> রিপোর্ট ডাউনলোড করুন
                  </button>
                  
                  {showReportOptions && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                      <button 
                        onClick={handleDownloadReport}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 flex items-center gap-2 transition"
                      >
                        <FileText size={16} className="text-[#f85606]" /> CSV রিপোর্ট
                      </button>
                      <button 
                        onClick={handleDownloadFullReport}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 flex items-center gap-2 transition border-t border-gray-100"
                      >
                        <FileText size={16} className="text-blue-500" /> বিস্তারিত রিপোর্ট (TXT)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* রিসেন্ট ইউজার ও পোস্ট */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* রিসেন্ট ইউজার */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Users size={18} className="text-[#f85606]" /> 
                  রিসেন্ট ইউজার
                </h2>
                <Link href="/admin/users">
                  <button className="text-xs text-[#f85606] hover:underline">সব দেখুন →</button>
                </Link>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {recentUsers.map((user) => (
                  <div key={user.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-medium text-gray-600">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{user.name}</p>
                          {user.verified && (
                            <CheckCircle size={12} className="text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-700" : 
                          user.status === "blocked" ? "bg-red-100 text-red-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {user.status === "active" ? "সক্রিয়" : 
                           user.status === "blocked" ? "ব্লক" : "পেন্ডিং"}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">{user.date}</p>
                      </div>
                      <button 
                        onClick={() => handleToggleUserStatus(user.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                        title={user.status === 'active' ? 'ব্লক করুন' : 'সক্রিয় করুন'}
                      >
                        {user.status === 'active' ? 
                          <XCircle size={16} className="text-red-500" /> : 
                          <CheckCircle size={16} className="text-green-500" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* রিসেন্ট পোস্ট */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-[#f85606]" /> 
                  রিসেন্ট পোস্ট
                </h2>
                <Link href="/admin/posts">
                  <button className="text-xs text-[#f85606] hover:underline">সব দেখুন →</button>
                </Link>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-3 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{post.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-gray-400">{post.seller}</p>
                          <p className="text-xs text-gray-400">•</p>
                          <p className="text-xs font-semibold text-[#f85606]">৳{post.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">•</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Eye size={10} /> {post.views}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          post.status === "approved" ? "bg-green-100 text-green-700" : 
                          post.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-red-100 text-red-700"
                        }`}>
                          {post.status === "approved" ? "অনুমোদিত" : 
                           post.status === "pending" ? "পেন্ডিং" : "বাতিল"}
                        </span>
                      </div>
                    </div>
                    
                    {post.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => handleApprovePost(post.id)}
                          className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={12} /> অ্যাপ্রুভ
                        </button>
                        <button 
                          onClick={() => handleRejectPost(post.id)}
                          className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition flex items-center justify-center gap-1"
                        >
                          <XCircle size={12} /> রিজেক্ট
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* সাম্প্রতিক কার্যকলাপ */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Activity size={18} className="text-[#f85606]" /> 
                সাম্প্রতিক কার্যকলাপ
              </h2>
              <p className="text-xs text-gray-400">
                শেষ আপডেট: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-3 flex items-start gap-3 hover:bg-gray-50 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user}
                      {activity.amount ? ` - ৳${activity.amount}` : ''}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} /> {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}