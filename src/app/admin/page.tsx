"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, TrendingUp, TrendingDown, Eye, Users, Package, Gavel, DollarSign, 
  Activity, Clock, Bell, ArrowUpRight, RefreshCw, Zap, CreditCard, UserCheck,
  Search, Filter, Download, MoreVertical, CheckCircle, XCircle, AlertCircle,
  BarChart3, PieChart, Calendar, Settings, LogOut, Shield, Home, FileText,
  UserPlus, MessageCircle, Trash2, Edit, EyeOff, ChevronDown, Smartphone
} from "lucide-react";

// নোটিফিকেশন টাইপ
type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'user' | 'post' | 'payment' | 'auction' | 'system' | 'report';
  postId?: number;
  postTitle?: string;
  sellerName?: string;
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
  const [isMobile, setIsMobile] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // ============ মোবাইল ডিটেকশন ============
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // নোটিফিকেশন ডাটা
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "🆕 নতুন ইউজার রেজিস্ট্রেশন", message: "আলমগীর হোসেন নতুন অ্যাকাউন্ট তৈরি করেছেন", time: "এখনই", read: false, type: "user" },
    { id: 2, title: "📝 পোস্ট পেন্ডিং", message: "নতুন পোস্ট অ্যাপ্রুভালের জন্য অপেক্ষমান", time: "২ মিনিট আগে", read: false, type: "post", postId: 101, postTitle: "iPhone 15 Pro Max", sellerName: "রহিম উদ্দিন" },
    { id: 3, title: "💰 পেমেন্ট সফল", message: "করিম মিয়া ৳১০০ পেমেন্ট সম্পন্ন করেছেন", time: "৫ মিনিট আগে", read: false, type: "payment" },
    { id: 4, title: "🔨 নিলাম শেষ", message: "iPhone 15 Pro Max নিলাম শেষ হয়েছে", time: "১০ মিনিট আগে", read: true, type: "auction" },
    { id: 5, title: "⚠️ রিপোর্ট জমা", message: "একটি পোস্ট রিপোর্ট করা হয়েছে", time: "১৫ মিনিট আগে", read: false, type: "report" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ============ নতুন পোস্ট নোটিফিকেশন (সিমুলেটেড) ============
  const addPostNotification = useCallback((postTitle: string, sellerName: string, postId: number) => {
    const newNotification: Notification = {
      id: Date.now(),
      title: "📝 নতুন পোস্ট জমা পড়েছে",
      message: `${sellerName} "${postTitle}" পোস্ট করেছেন`,
      time: "এখনই",
      read: false,
      type: "post",
      postId,
      postTitle,
      sellerName,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // ============ ডেমো: প্রতি ৪৫ সেকেন্ডে নতুন নোটিফিকেশন ============
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPost = ["Samsung S24", "Nike Shoes", "Sony Headphone", "Leather Bag"][Math.floor(Math.random() * 4)];
      const randomSeller = ["রহিম", "করিম", "নাজমা", "শাহিনুর"][Math.floor(Math.random() * 4)];
      addPostNotification(randomPost, randomSeller, Date.now());
    }, 45000);
    return () => clearInterval(interval);
  }, [addPostNotification]);

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
    { id: 1, action: "নতুন ইউজার রেজিস্ট্রেশন", user: "আলমগীর হোসেন", time: "এখনই", type: "user", icon: "👤" },
    { id: 2, action: "নতুন পোস্ট জমা", user: "নাজমা বেগম", time: "২ মিনিট আগে", type: "post", icon: "📝" },
    { id: 3, action: "পেমেন্ট সফল", user: "করিম মিয়া", amount: 100, time: "৫ মিনিট আগে", type: "payment", icon: "💰" },
    { id: 4, action: "নতুন নিলাম শুরু", user: "রহিম উদ্দিন", time: "১০ মিনিট আগে", type: "auction", icon: "🔨" },
  ]);

  const monthlyData = [65000, 45000, 78000, 55000, 89000, 70000, 92000, 80000, 75000, 88000, 95000, 85000];
  const months = ["জানু", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ", "অক্টো", "নভে", "ডিসে"];

  // ক্লিক আউটসাইড হ্যান্ডলার
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else { setIsLoggedIn(true); setLoading(false); }
  }, [router]);

  const handleLogout = () => { 
    localStorage.removeItem("adminLoggedIn"); 
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("adminEmail");
    router.push("/admin/login"); 
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => { setLastUpdated(new Date()); setLoading(false); }, 800);
  };

  const handleApprovePost = (id: number) => {
    setRecentPosts(posts => posts.map(post => post.id === id ? { ...post, status: 'approved' } : post));
    addActivity("পোস্ট অ্যাপ্রুভ করা হয়েছে", "অ্যাডমিন", "post", "✅");
    setNotifications(prev => prev.filter(n => n.postId !== id));
  };

  const handleRejectPost = (id: number) => {
    setRecentPosts(posts => posts.map(post => post.id === id ? { ...post, status: 'rejected' } : post));
    addActivity("পোস্ট রিজেক্ট করা হয়েছে", "অ্যাডমিন", "post", "❌");
    setNotifications(prev => prev.filter(n => n.postId !== id));
  };

  const handleToggleUserStatus = (id: number) => {
    setRecentUsers(users => users.map(user => user.id === id ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } : user));
  };

  const addActivity = (action: string, user: string, type: string, icon: string) => {
    const newActivity = { id: Date.now(), action, user, time: "এখনই", type, icon };
    setRecentActivities(prev => [newActivity, ...prev.slice(0, 9)]);
  };

  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markNotificationRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleApproveFromNotification = (notif: Notification) => {
    if (notif.postId) {
      handleApprovePost(notif.postId);
      markNotificationRead(notif.id);
    }
  };

  const handleDownloadReport = () => {
    const now = new Date();
    const reportData = [["আমার দুনিয়া - রিপোর্ট"], ["তারিখ: " + now.toLocaleDateString('bn-BD')], [], ["মোট ইউজার", stats.users.total.toString()], ["মোট পোস্ট", stats.posts.total.toString()]];
    let csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${now.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowReportOptions(false);
    alert("✅ রিপোর্ট ডাউনলোড হয়েছে!");
  };

  if (!mounted || !isLoggedIn) return null;

  const pendingPostsCount = recentPosts.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল বাটন */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block"><AdminSidebar /></div>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-72">
        {/* টপ বার - মোবাইল রেসপন্সিভ */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm px-3 md:px-6 py-3 md:py-4 sticky top-0 z-30 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">ড্যাশবোর্ড</h1>
            
            <div className="flex items-center gap-1 md:gap-3">
              <button onClick={handleRefresh} className="p-2 hover:bg-gray-100 rounded-xl"><RefreshCw size={18} className="text-gray-500" /></button>
              
              {/* 🔔 নোটিফিকেশন - মোবাইল রেসপন্সিভ */}
              <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-xl">
                  <Bell size={18} className="text-gray-500" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[9px] md:text-[10px] rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span>}
                </button>
                
                {showNotifications && (
                  <div className={`absolute ${isMobile ? 'right-0 left-0 mx-auto' : 'right-0'} mt-2 w-[280px] md:w-80 bg-white rounded-2xl shadow-xl border overflow-hidden z-50 max-h-96 overflow-y-auto`}>
                    <div className="p-3 border-b flex justify-between sticky top-0 bg-white"><h3 className="font-semibold">নোটিফিকেশন</h3><button onClick={markAllNotificationsRead} className="text-xs text-[#f85606]">সব পড়া</button></div>
                    <div className="divide-y">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 hover:bg-gray-50 ${!n.read ? 'bg-orange-50/50' : ''}`}>
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                          {n.type === 'post' && n.postId && (
                            <button onClick={() => handleApproveFromNotification(n)} className="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                              <CheckCircle size={10} /> অ্যাপ্রুভ করুন
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* প্রোফাইল */}
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-xl">
                  <div className="hidden sm:block text-right"><p className="text-sm font-medium">অ্যাডমিন</p><p className="text-xs text-gray-400">admin@amarduniya.com</p></div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center text-white font-bold">A</div>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                    <Link href="/admin/settings"><button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3"><Settings size={16} /> সেটিংস</button></Link>
                    <Link href="/"><button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3"><Home size={16} /> হোম পেজ</button></Link>
                    <div className="border-t"><button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"><LogOut size={16} /> লগ আউট</button></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-6">
          {/* স্ট্যাটাস কার্ড - মোবাইল ২ কলাম */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 mb-4 md:mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs">মোট ইউজার</p><p className="text-xl font-bold">{stats.users.total}</p></div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs">মোট পোস্ট</p><p className="text-xl font-bold">{stats.posts.total}</p></div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 text-white"><p className="text-xs">মোট নিলাম</p><p className="text-xl font-bold">{stats.auctions.total}</p></div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs">লেনদেন</p><p className="text-xl font-bold">৳{stats.revenue.total.toLocaleString()}</p></div>
          </div>

          {/* পেন্ডিং পোস্ট অ্যালার্ট - মোবাইলে প্রোমিনেন্ট */}
          {pendingPostsCount > 0 && (
            <div className="md:hidden mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><AlertCircle size={18} className="text-yellow-600" /><span className="text-sm font-medium">{pendingPostsCount} টি পোস্ট পেন্ডিং</span></div>
              <button onClick={() => setActiveTab('posts')} className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs">রিভিউ</button>
            </div>
          )}

          {/* পেন্ডিং পোস্ট সেকশন */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-4">
            <div className="p-3 md:p-4 border-b flex justify-between">
              <h2 className="font-bold text-gray-800">পেন্ডিং পোস্ট ({pendingPostsCount})</h2>
              <Link href="/admin/posts"><button className="text-xs text-[#f85606]">সব দেখুন →</button></Link>
            </div>
            {recentPosts.filter(p => p.status === 'pending').slice(0, 3).map(post => (
              <div key={post.id} className="p-3 md:p-4 hover:bg-gray-50 border-b last:border-b-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <div className="flex-1">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-gray-400">{post.seller} • ৳{post.price.toLocaleString()} • {post.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprovePost(post.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-1"><CheckCircle size={12} /> অ্যাপ্রুভ</button>
                    <button onClick={() => handleRejectPost(post.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-1"><XCircle size={12} /> রিজেক্ট</button>
                  </div>
                </div>
              </div>
            ))}
            {pendingPostsCount === 0 && <p className="text-center text-gray-400 py-6 text-sm">কোনো পেন্ডিং পোস্ট নেই</p>}
          </div>

          {/* চার্ট - ডেস্কটপে দেখাবে */}
          <div className="hidden md:block bg-white rounded-2xl p-5 shadow-sm border mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2"><TrendingUp size={18} className="text-[#f85606]" /> মাসিক আয়</h2>
              <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="text-sm border rounded-lg px-3 py-1.5"><option value="2026">২০২৬</option></select>
            </div>
            <div className="space-y-3">
              {monthlyData.slice(0, 6).map((value, i) => {
                const maxValue = Math.max(...monthlyData);
                const widthPercent = (value / maxValue) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-10">{months[i]}</span>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#f85606] to-orange-400 rounded-lg flex items-center justify-end px-2" style={{ width: `${widthPercent}%` }}>
                        <span className="text-xs text-white font-medium">৳{value.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* রিপোর্ট ডাউনলোড */}
          <div className="relative">
            <button onClick={() => setShowReportOptions(!showReportOptions)} className="w-full md:w-auto bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Download size={16} /> রিপোর্ট ডাউনলোড
            </button>
            {showReportOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                <button onClick={handleDownloadReport} className="w-full px-4 py-3 text-left text-sm hover:bg-orange-50 flex items-center gap-2"><FileText size={16} className="text-[#f85606]" /> CSV রিপোর্ট</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}