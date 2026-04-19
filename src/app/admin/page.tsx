"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, TrendingUp, TrendingDown, Eye, Users, Package, Gavel, DollarSign, 
  Activity, Clock, Bell, ArrowUpRight, RefreshCw, Zap, CreditCard, UserCheck,
  Search, Download, CheckCircle, XCircle, AlertCircle,
  BarChart3, Settings, LogOut, Shield, Home, FileText,
  MessageCircle, ChevronDown, Smartphone, Image, MapPin, Tag
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
  postImage?: string;
  postPrice?: number;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'users' | 'auctions'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ============ মোবাইল ডিটেকশন ============
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============ নোটিফিকেশন সাউন্ড ============
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    // লোকাল স্টোরেজ থেকে সাউন্ড সেটিং লোড
    const soundSetting = localStorage.getItem('notificationSound');
    if (soundSetting !== null) {
      setNotificationSoundEnabled(soundSetting === 'true');
    }
  }, []);

  const playNotificationSound = () => {
    if (notificationSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Sound play failed:', e));
    }
  };

  const toggleNotificationSound = () => {
    const newSetting = !notificationSoundEnabled;
    setNotificationSoundEnabled(newSetting);
    localStorage.setItem('notificationSound', String(newSetting));
  };

  // নোটিফিকেশন ডাটা
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, title: "🆕 নতুন ইউজার রেজিস্ট্রেশন", message: "আলমগীর হোসেন নতুন অ্যাকাউন্ট তৈরি করেছেন", 
      time: "এখনই", read: false, type: "user" 
    },
    { 
      id: 2, title: "📝 পোস্ট পেন্ডিং", message: "নতুন পোস্ট অ্যাপ্রুভালের জন্য অপেক্ষমান", 
      time: "২ মিনিট আগে", read: false, type: "post", postId: 101, 
      postTitle: "iPhone 15 Pro Max", sellerName: "রহিম উদ্দিন", 
      postImage: "📱", postPrice: 75000 
    },
    { 
      id: 3, title: "💰 পেমেন্ট সফল", message: "করিম মিয়া ৳১০০ পেমেন্ট সম্পন্ন করেছেন", 
      time: "৫ মিনিট আগে", read: false, type: "payment" 
    },
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
      postImage: ["📱", "💻", "👕", "🏠"][Math.floor(Math.random() * 4)],
      postPrice: Math.floor(Math.random() * 50000) + 5000,
    };
    setNotifications(prev => [newNotification, ...prev]);
    playNotificationSound(); // 🔔 সাউন্ড প্লে
  }, [notificationSoundEnabled]);

  // ============ ডেমো: প্রতি ৪৫ সেকেন্ডে নতুন নোটিফিকেশন ============
  useEffect(() => {
    const interval = setInterval(() => {
      const randomPost = ["Samsung S24 Ultra", "Nike Air Max", "Sony Headphone", "Leather Bag", "MacBook Pro"][Math.floor(Math.random() * 5)];
      const randomSeller = ["রহিম", "করিম", "নাজমা", "শাহিনুর", "ফাতেমা"][Math.floor(Math.random() * 5)];
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
    { id: 1, title: "iPhone 15 Pro Max", seller: "রহিম উদ্দিন", price: 75000, status: "pending", date: "২০২৬-০৪-১৬", views: 1240, category: "মোবাইল", location: "ঢাকা", image: "📱", description: "ব্র্যান্ড নতুন iPhone 15 Pro Max, 128GB, ফুল বক্স সহ" },
    { id: 2, title: "MacBook Pro M2", seller: "করিম মিয়া", price: 180000, status: "approved", date: "২০২৬-০৪-১৫", views: 890, category: "কম্পিউটার", location: "চট্টগ্রাম", image: "💻", description: "MacBook Pro M2, 256GB SSD, 8GB RAM" },
    { id: 3, title: "Samsung Galaxy S23", seller: "শাহিনুর রহমান", price: 95000, status: "rejected", date: "২০২৬-০৪-১৪", views: 2100, category: "মোবাইল", location: "খুলনা", image: "📱", description: "Samsung Galaxy S23 Ultra, 256GB" },
    { id: 4, title: "Nike Air Max", seller: "আব্দুল করিম", price: 12000, status: "pending", date: "২০২৬-০৪-১৩", views: 340, category: "ফ্যাশন", location: "রাজশাহী", image: "👟", description: "Nike Air Max, সাইজ ৯, একদম নতুন" },
    { id: 5, title: "Sony PlayStation 5", seller: "আলমগীর হোসেন", price: 55000, status: "approved", date: "২০২৬-০৪-১২", views: 1560, category: "ইলেকট্রনিক্স", location: "সিলেট", image: "🎮", description: "PS5 Disc Edition, ২টি কন্ট্রোলার সহ" },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "নতুন ইউজার রেজিস্ট্রেশন", user: "আলমগীর হোসেন", time: "এখনই", type: "user", icon: "👤" },
    { id: 2, action: "নতুন পোস্ট জমা", user: "নাজমা বেগম", time: "২ মিনিট আগে", type: "post", icon: "📝" },
    { id: 3, action: "পেমেন্ট সফল", user: "করিম মিয়া", amount: 100, time: "৫ মিনিট আগে", type: "payment", icon: "💰" },
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
    const post = recentPosts.find(p => p.id === id);
    setRecentPosts(posts => posts.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    addActivity("পোস্ট অ্যাপ্রুভ করা হয়েছে", post?.seller || "অ্যাডমিন", "post", "✅");
    setNotifications(prev => prev.filter(n => n.postId !== id));
  };

  const handleRejectPost = (id: number) => {
    const post = recentPosts.find(p => p.id === id);
    setRecentPosts(posts => posts.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    addActivity("পোস্ট রিজেক্ট করা হয়েছে", post?.seller || "অ্যাডমিন", "post", "❌");
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

  const handleViewPostDetails = (post: any) => {
    setSelectedPost(post);
    setShowPostDetailModal(true);
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
              {/* মোবাইল ট্যাব */}
              <div className="flex md:hidden items-center gap-1">
                <button onClick={() => setActiveTab('overview')} className={`px-2 py-1 rounded-lg text-xs font-medium ${activeTab === 'overview' ? 'bg-[#f85606] text-white' : 'bg-gray-100'}`}>ওভারভিউ</button>
                <button onClick={() => setActiveTab('posts')} className={`px-2 py-1 rounded-lg text-xs font-medium ${activeTab === 'posts' ? 'bg-[#f85606] text-white' : 'bg-gray-100'}`}>পোস্ট {pendingPostsCount > 0 && `(${pendingPostsCount})`}</button>
              </div>

              <button onClick={handleRefresh} className="p-2 hover:bg-gray-100 rounded-xl"><RefreshCw size={18} className="text-gray-500" /></button>
              
              {/* 🔔 নোটিফিকেশন - মোবাইল রেসপন্সিভ */}
              <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-xl">
                  <Bell size={18} className="text-gray-500" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[9px] md:text-[10px] rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span>}
                </button>
                
                {showNotifications && (
                  <div className={`absolute ${isMobile ? 'right-0 left-0 mx-auto' : 'right-0'} mt-2 w-[300px] md:w-80 bg-white rounded-2xl shadow-xl border overflow-hidden z-50 max-h-96 overflow-y-auto`}>
                    <div className="p-3 border-b flex justify-between items-center sticky top-0 bg-white">
                      <h3 className="font-semibold">নোটিফিকেশন</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={toggleNotificationSound} className={`text-xs ${notificationSoundEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                          {notificationSoundEnabled ? '🔊' : '🔇'}
                        </button>
                        <button onClick={markAllNotificationsRead} className="text-xs text-[#f85606]">সব পড়া</button>
                      </div>
                    </div>
                    <div className="divide-y">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 hover:bg-gray-50 ${!n.read ? 'bg-orange-50/50' : ''}`}>
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.message}</p>
                          {n.type === 'post' && n.postPrice && (
                            <p className="text-xs font-semibold text-[#f85606] mt-1">{n.postImage} ৳{n.postPrice?.toLocaleString()}</p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                          {n.type === 'post' && n.postId && (
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleApproveFromNotification(n)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                                <CheckCircle size={10} /> অ্যাপ্রুভ
                              </button>
                              <button onClick={() => handleRejectPost(n.postId!)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                                <XCircle size={10} /> রিজেক্ট
                              </button>
                            </div>
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

          {/* মোবাইল পোস্ট ভিউ */}
          {activeTab === 'posts' && isMobile && (
            <div className="space-y-3 mb-4">
              {recentPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl p-3 shadow-sm border">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-3xl">{post.image}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{post.title}</h3>
                      <p className="text-xs text-gray-400">{post.seller}</p>
                      <p className="text-sm font-bold text-[#f85606]">৳{post.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      post.status === "approved" ? "bg-green-100 text-green-700" : 
                      post.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }`}>
                      {post.status === "approved" ? "অনুমোদিত" : post.status === "pending" ? "পেন্ডিং" : "বাতিল"}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleViewPostDetails(post)} className="text-blue-500 text-xs flex items-center gap-1"><Eye size={12} /> বিস্তারিত</button>
                      {post.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprovePost(post.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs">অ্যাপ্রুভ</button>
                          <button onClick={() => handleRejectPost(post.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs">রিজেক্ট</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* পেন্ডিং পোস্ট সেকশন (ডেস্কটপ ও ওভারভিউ ট্যাব) */}
          {(activeTab === 'overview' || !isMobile) && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-4">
              <div className="p-3 md:p-4 border-b flex justify-between">
                <h2 className="font-bold text-gray-800">পেন্ডিং পোস্ট ({pendingPostsCount})</h2>
                <Link href="/admin/posts"><button className="text-xs text-[#f85606]">সব দেখুন →</button></Link>
              </div>
              {recentPosts.filter(p => p.status === 'pending').slice(0, 3).map(post => (
                <div key={post.id} className="p-3 md:p-4 hover:bg-gray-50 border-b last:border-b-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center text-xl">{post.image}</div>
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.seller} • ৳{post.price.toLocaleString()} • {post.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleViewPostDetails(post)} className="text-blue-500 text-xs flex items-center gap-1"><Eye size={12} /> বিস্তারিত</button>
                      <button onClick={() => handleApprovePost(post.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-1"><CheckCircle size={12} /> অ্যাপ্রুভ</button>
                      <button onClick={() => handleRejectPost(post.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-1"><XCircle size={12} /> রিজেক্ট</button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingPostsCount === 0 && <p className="text-center text-gray-400 py-6 text-sm">কোনো পেন্ডিং পোস্ট নেই</p>}
            </div>
          )}

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

      {/* পোস্ট ডিটেইল মডাল */}
      {showPostDetailModal && selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostDetailModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">পোস্ট বিস্তারিত</h3>
              <button onClick={() => setShowPostDetailModal(false)}><X size={20} /></button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-5xl">{selectedPost.image}</div>
                <div>
                  <h2 className="text-xl font-bold">{selectedPost.title}</h2>
                  <p className="text-2xl font-bold text-[#f85606]">৳{selectedPost.price?.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">বিক্রেতা:</span> {selectedPost.seller}</p>
                <p><span className="font-medium">ক্যাটাগরি:</span> {selectedPost.category}</p>
                <p><span className="font-medium">অবস্থান:</span> {selectedPost.location}</p>
                <p><span className="font-medium">তারিখ:</span> {selectedPost.date}</p>
                <p><span className="font-medium">ভিউ:</span> {selectedPost.views}</p>
                <p><span className="font-medium">বিবরণ:</span> {selectedPost.description}</p>
              </div>
              {selectedPost.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { handleApprovePost(selectedPost.id); setShowPostDetailModal(false); }} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold">অ্যাপ্রুভ করুন</button>
                  <button onClick={() => { handleRejectPost(selectedPost.id); setShowPostDetailModal(false); }} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold">রিজেক্ট করুন</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}