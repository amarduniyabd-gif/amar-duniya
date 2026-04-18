"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, TrendingUp, TrendingDown, Eye, Users, Package, Gavel, DollarSign, 
  Activity, Clock, Bell, ArrowUpRight, RefreshCw, Zap, CreditCard, UserCheck } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [stats, setStats] = useState({
    users: { total: 1234, new: 45, growth: 12 },
    posts: { total: 5678, new: 89, growth: 8 },
    auctions: { total: 89, new: 12, growth: -3 },
    revenue: { total: 1234567, new: 23456, growth: 23 },
  });

  const recentUsers = [
    { id: 1, name: "রহিম উদ্দিন", email: "rahim@gmail.com", status: "active", date: "২০২৬-০৪-১৬", avatar: "R" },
    { id: 2, name: "করিম মিয়া", email: "karim@gmail.com", status: "active", date: "২০২৬-০৪-১৫", avatar: "K" },
    { id: 3, name: "শাহিনুর রহমান", email: "shahinur@gmail.com", status: "blocked", date: "২০২৬-০৪-১৪", avatar: "S" },
    { id: 4, name: "আব্দুল করিম", email: "abdul@gmail.com", status: "active", date: "২০২৬-০৪-১৩", avatar: "A" },
  ];

  const recentPosts = [
    { id: 1, title: "iPhone 15 Pro Max", seller: "রহিম উদ্দিন", price: 75000, status: "pending", date: "২০২৬-০৪-১৬", views: 1240 },
    { id: 2, title: "MacBook Pro M2", seller: "করিম মিয়া", price: 180000, status: "approved", date: "২০২৬-০৪-১৫", views: 890 },
    { id: 3, title: "Samsung Galaxy S23", seller: "শাহিনুর রহমান", price: 95000, status: "rejected", date: "২০২৬-০৪-১৪", views: 2100 },
    { id: 4, title: "Nike Air Max", seller: "আব্দুল করিম", price: 12000, status: "pending", date: "২০২৬-০৪-১৩", views: 340 },
  ];

  const recentActivities = [
    { id: 1, action: "নতুন ইউজার রেজিস্ট্রেশন", user: "আলমগীর হোসেন", time: "২ মিনিট আগে", type: "user" },
    { id: 2, action: "নতুন পোস্ট জমা", user: "নাজমা বেগম", time: "৫ মিনিট আগে", type: "post" },
    { id: 3, action: "পেমেন্ট সফল", user: "করিম মিয়া", amount: 100, time: "১০ মিনিট আগে", type: "payment" },
    { id: 4, action: "নতুন নিলাম শুরু", user: "রহিম উদ্দিন", time: "১৫ মিনিট আগে", type: "auction" },
    { id: 5, action: "ইউজার ব্লক করা হয়েছে", user: "শাহিনুর রহমান", time: "৩০ মিনিট আগে", type: "alert" },
  ];

  const monthlyData = [65000, 45000, 78000, 55000, 89000, 70000, 92000, 80000, 75000, 88000, 95000, 85000];
  const months = ["জানু", "ফেব", "মার্চ", "এপ্রি", "মে", "জুন", "জুল", "আগ", "সেপ", "অক্টো", "নভে", "ডিসে"];

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      router.push("/admin/login");
    } else {
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল বাটন */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-2 rounded-lg shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ডেস্কটপ সাইডবার */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 hidden md:block">
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* মোবাইল সাইডবার */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* মেন কন্টেন্ট */}
      <div className="md:ml-64">
        {/* টপ বার */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 sticky top-0 z-30 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">ড্যাশবোর্ড</h1>
              <p className="text-xs text-gray-400 mt-1">সবশেষ আপডেট: {lastUpdated.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleRefresh} className="p-2 hover:bg-gray-100 rounded-xl transition"><RefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} /></button>
              <div className="relative"><Bell size={20} className="text-gray-500 cursor-pointer" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">3</span></div>
              <div className="flex items-center gap-3"><div className="text-right hidden sm:block"><p className="text-sm font-medium text-gray-800">অ্যাডমিন</p><p className="text-xs text-gray-400">admin@amarduniya.com</p></div><div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center text-white font-bold shadow-md">A</div></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div><p className="text-sm opacity-90">মোট ইউজার</p><p className="text-3xl font-bold mt-1">{stats.users.total}</p><div className="flex items-center gap-1 mt-2"><TrendingUp size={14} className="text-green-300" /><span className="text-xs">{stats.users.growth}%</span><span className="text-xs opacity-75 ml-1">থেকে গত মাসে</span></div></div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Users size={24} /></div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20"><p className="text-xs opacity-75">নতুন: +{stats.users.new} এই মাসে</p></div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start"><div><p className="text-sm opacity-90">মোট পোস্ট</p><p className="text-3xl font-bold mt-1">{stats.posts.total}</p><div className="flex items-center gap-1 mt-2"><TrendingUp size={14} className="text-green-300" /><span className="text-xs">{stats.posts.growth}%</span><span className="text-xs opacity-75 ml-1">থেকে গত মাসে</span></div></div><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Package size={24} /></div></div>
              <div className="mt-3 pt-3 border-t border-white/20"><p className="text-xs opacity-75">নতুন: +{stats.posts.new} এই মাসে</p></div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start"><div><p className="text-sm opacity-90">মোট নিলাম</p><p className="text-3xl font-bold mt-1">{stats.auctions.total}</p><div className="flex items-center gap-1 mt-2"><TrendingDown size={14} className="text-red-300" /><span className="text-xs">{Math.abs(stats.auctions.growth)}%</span><span className="text-xs opacity-75 ml-1">থেকে গত মাসে</span></div></div><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Gavel size={24} /></div></div>
              <div className="mt-3 pt-3 border-t border-white/20"><p className="text-xs opacity-75">সক্রিয়: {stats.auctions.new} টি</p></div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start"><div><p className="text-sm opacity-90">মোট লেনদেন</p><p className="text-3xl font-bold mt-1">৳{stats.revenue.total.toLocaleString()}</p><div className="flex items-center gap-1 mt-2"><TrendingUp size={14} className="text-green-300" /><span className="text-xs">{stats.revenue.growth}%</span><span className="text-xs opacity-75 ml-1">থেকে গত মাসে</span></div></div><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><DollarSign size={24} /></div></div>
              <div className="mt-3 pt-3 border-t border-white/20"><p className="text-xs opacity-75">এই মাসে: ৳{stats.revenue.new.toLocaleString()}</p></div>
            </div>
          </div>

          {/* চার্ট ও কুইক অ্যাকশন */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-gray-800 flex items-center gap-2"><TrendingUp size={18} className="text-[#f85606]" /> মাসিক আয়</h2><select className="text-sm border rounded-lg px-2 py-1"><option>২০২৬</option><option>২০২৫</option></select></div>
              <div className="h-72 flex items-end justify-center gap-2">
                {monthlyData.map((value, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gradient-to-t from-[#f85606]/20 to-[#f85606]/40 rounded-t-lg hover:from-[#f85606]/40 hover:to-[#f85606]/60 transition-all duration-300 cursor-pointer group relative" style={{ height: `${value / 100}px` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">৳{value.toLocaleString()}</div>
                    </div>
                    <span className="text-[10px] text-gray-500 rotate-45 origin-left">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-[#f85606]" /> কুইক অ্যাকশন</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Users size={16} className="text-blue-600" /></div><span className="text-sm font-medium">নতুন ইউজার যোগ করুন</span></div><ArrowUpRight size={16} className="text-gray-400" /></div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><Package size={16} className="text-green-600" /></div><span className="text-sm font-medium">পেন্ডিং পোস্ট ({recentPosts.filter(p => p.status === 'pending').length})</span></div><ArrowUpRight size={16} className="text-gray-400" /></div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><Gavel size={16} className="text-orange-600" /></div><span className="text-sm font-medium">সক্রিয় নিলাম</span></div><ArrowUpRight size={16} className="text-gray-400" /></div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><CreditCard size={16} className="text-purple-600" /></div><span className="text-sm font-medium">পেন্ডিং পেমেন্ট</span></div><ArrowUpRight size={16} className="text-gray-400" /></div>
                <button className="w-full mt-2 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition">+ রিপোর্ট তৈরি করুন</button>
              </div>
            </div>
          </div>

          {/* রিসেন্ট ইউজার, পোস্ট ও অ্যাক্টিভিটি */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center"><h2 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} className="text-[#f85606]" /> রিসেন্ট ইউজার</h2><button className="text-xs text-[#f85606] hover:underline">সব দেখুন →</button></div>
              <div className="divide-y divide-gray-100">
                {recentUsers.map((user) => (<div key={user.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-medium text-gray-600">{user.avatar}</div><div><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-gray-400">{user.email}</p></div></div><div className="text-right"><span className={`text-xs px-2 py-0.5 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.status === "active" ? "সক্রিয়" : "ব্লক"}</span><p className="text-[10px] text-gray-400 mt-1">{user.date}</p></div></div>))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center"><h2 className="font-bold text-gray-800 flex items-center gap-2"><Package size={18} className="text-[#f85606]" /> রিসেন্ট পোস্ট</h2><button className="text-xs text-[#f85606] hover:underline">সব দেখুন →</button></div>
              <div className="divide-y divide-gray-100">
                {recentPosts.map((post) => (<div key={post.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition"><div><p className="font-medium text-sm">{post.title}</p><p className="text-xs text-gray-400">{post.seller} • ৳{post.price.toLocaleString()} • 👁️ {post.views}</p></div><div className="text-right"><span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "approved" ? "bg-green-100 text-green-700" : post.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{post.status === "approved" ? "অনুমোদিত" : post.status === "pending" ? "পেন্ডিং" : "বাতিল"}</span><p className="text-[10px] text-gray-400 mt-1">{post.date}</p></div></div>))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center"><h2 className="font-bold text-gray-800 flex items-center gap-2"><Activity size={18} className="text-[#f85606]" /> সাম্প্রতিক কার্যকলাপ</h2><button className="text-xs text-gray-400 hover:text-[#f85606]">সব দেখুন →</button></div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {recentActivities.map((activity) => (<div key={activity.id} className="p-3 flex items-start gap-3 hover:bg-gray-50 transition"><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'user' ? 'bg-blue-100' : activity.type === 'post' ? 'bg-green-100' : activity.type === 'payment' ? 'bg-purple-100' : 'bg-orange-100'}`}>{activity.type === 'user' ? <UserCheck size={14} className="text-blue-600" /> : activity.type === 'post' ? <Package size={14} className="text-green-600" /> : activity.type === 'payment' ? <DollarSign size={14} className="text-purple-600" /> : <Bell size={14} className="text-orange-600" />}</div><div className="flex-1"><p className="text-sm font-medium">{activity.action}</p><p className="text-xs text-gray-500">{activity.user}{activity.amount ? ` - ৳${activity.amount}` : ''}</p><p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {activity.time}</p></div></div>))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}