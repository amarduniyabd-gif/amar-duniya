"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Package, Gavel, Settings, LogOut, Heart, 
  MessageCircle, Bell, Shield, MapPin, Phone, Mail,
  ChevronRight, Edit2, Camera, X, CheckCircle,
  Crown, Clock, CreditCard, FileText, Star, Eye,
  TrendingUp, Award, Zap, Trash2, AlertCircle,
  MoreVertical, Plus, Copy, Users, Filter, RefreshCw,
  Calendar, ExternalLink
} from "lucide-react";

// ============ টাইপ ডেফিনিশন ============
type FeaturedPost = {
  postId: number;
  postTitle: string;
  endDate: string;
  status: 'active' | 'expired';
  views: number;
};

type PaymentHistory = {
  id: string;
  type: 'featured' | 'document' | 'bid';
  amount: number;
  postTitle?: string;
  date: string;
};

type DocumentRequest = {
  id: string;
  postTitle: string;
  status: 'pending' | 'released';
  fee: number;
  createdAt: string;
};

type MyAuction = {
  id: number;
  title: string;
  currentPrice: number;
  startPrice: number;
  image: string;
  endTime: string;
  totalBids: number;
  status: 'active' | 'ended' | 'won' | 'cancelled';
  views: number;
  isWinner?: boolean;
  winningBid?: number;
};

// ============ মেমোইজড কম্পোনেন্ট ============
const StatCard = memo(({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-3 text-white shadow-lg transform-gpu`}>
    <p className="text-xs opacity-90">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
));
StatCard.displayName = 'StatCard';

// ============ ইমেজ কম্প্রেশন (সুপার ফাস্ট) ============
const compressToWebP = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 150;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
        ctx?.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL('image/webp', 0.7));
      };
    };
  });
};

export default function MyAccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("👨");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'featured' | 'payments' | 'documents' | 'auctions'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [showExtendModal, setShowExtendModal] = useState<number | null>(null);
  const [extendDays, setExtendDays] = useState(7);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: "রহিম উদ্দিন",
    email: "rahim@gmail.com",
    phone: "017XXXXXXXX",
    location: "কুষ্টিয়া, বাংলাদেশ",
    bio: "প্রফেশনাল বিক্রেতা | ৫ বছর অভিজ্ঞতা | ৫০০+ সফল লেনদেন",
  });

  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([
    { postId: 1, postTitle: 'iPhone 15 Pro Max', endDate: '2026-04-23T00:00:00Z', status: 'active', views: 1240 },
    { postId: 2, postTitle: 'MacBook Pro M2', endDate: '2026-04-20T00:00:00Z', status: 'active', views: 890 },
  ]);

  const [payments, setPayments] = useState<PaymentHistory[]>([
    { id: '1', type: 'featured', amount: 100, postTitle: 'iPhone 15 Pro Max', date: '২০২৬-০৪-১৬' },
    { id: '2', type: 'featured', amount: 100, postTitle: 'MacBook Pro M2', date: '২০২৬-০৪-১৩' },
    { id: '3', type: 'bid', amount: 2, date: '২০২৬-০৪-১৫' },
  ]);

  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([
    { id: '1', postTitle: 'iPhone 15 Pro Max', status: 'released', fee: 1500, createdAt: '২০২৬-০৪-১৪' },
    { id: '2', postTitle: 'Samsung Galaxy S23', status: 'pending', fee: 1900, createdAt: '২০২৬-০৪-১৫' },
  ]);

  const [myAuctions, setMyAuctions] = useState<MyAuction[]>([
    {
      id: 1, title: "iPhone 15 Pro Max - 128GB", currentPrice: 85000, startPrice: 70000,
      image: "📱", endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      totalBids: 15, status: 'active', views: 340,
    },
    {
      id: 2, title: "MacBook Pro M2 - 256GB", currentPrice: 145000, startPrice: 120000,
      image: "💻", endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      totalBids: 28, status: 'ended', views: 560, isWinner: true, winningBid: 145000,
    },
    {
      id: 3, title: "Samsung Galaxy S23 Ultra", currentPrice: 75000, startPrice: 65000,
      image: "📱", endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalBids: 8, status: 'active', views: 210,
    },
  ]);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
    if (loggedIn !== "true") router.push("/login");
  }, [router]);

  // ============ অপটিমাইজড হ্যান্ডলার (useCallback) ============
  const getDaysLeft = useCallback((endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, []);

  const getTimeLeft = useCallback((endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return { text: "সমাপ্ত", isEnded: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    if (days > 0) return { text: `${days} দিন ${hours} ঘন্টা`, isEnded: false };
    return { text: `${hours} ঘন্টা`, isEnded: false };
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      const webpImage = await compressToWebP(e.target.files[0]);
      setProfileImage(webpImage);
      setIsUploading(false);
    }
  }, []);

  const handleProfileUpdate = useCallback(() => {
    setShowEditModal(false);
    alert("✅ প্রোফাইল আপডেট করা হয়েছে!");
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  }, [router]);

  const handleDeleteAuction = useCallback((id: number) => {
    setMyAuctions(prev => prev.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
    alert("✅ নিলাম ডিলিট করা হয়েছে!");
  }, []);

  const handleEditAuction = useCallback((id: number) => {
    // 🔥 এডিট পেজ না থাকলে অ্যালার্ট দেখাবে
    alert(`📝 নিলাম এডিট ফিচার শীঘ্রই আসছে!\nনিলাম আইডি: ${id}`);
    // router.push(`/auction/edit/${id}`); // পেজ তৈরি হলে আনকমেন্ট করবেন
  }, []);

  const handleExtendFeatured = useCallback((postId: number, days: number) => {
    setFeaturedPosts(prev => prev.map(p => 
      p.postId === postId 
        ? { ...p, endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() } 
        : p
    ));
    setShowExtendModal(null);
    alert(`✅ ফিচার্ড ${days} দিন বাড়ানো হয়েছে!`);
  }, []);

  const handleViewAuction = useCallback((id: number) => {
    router.push(`/auction/${id}`);
  }, [router]);

  const handleViewBids = useCallback((id: number) => {
    router.push(`/auction/${id}?tab=bids`);
  }, [router]);

  const handlePayNow = useCallback((auction: MyAuction) => {
    router.push(`/auction/${auction.id}/payment?amount=${auction.winningBid || auction.currentPrice}`);
  }, [router]);

  const handleChatWithSeller = useCallback(() => {
    router.push('/chat');
  }, [router]);

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const activeFeaturedCount = featuredPosts.filter(p => p.status === 'active').length;

  const menuItems = [
    { icon: <Package size={20} />, label: "আমার পোস্ট", href: "/my-posts", badge: "12", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: <Gavel size={20} />, label: "আমার নিলাম", href: "/my-auctions", badge: String(myAuctions.length), bgColor: "bg-green-50", iconColor: "text-green-600" },
    { icon: <Heart size={20} />, label: "সংরক্ষিত পণ্য", href: "/saved", badge: "8", bgColor: "bg-red-50", iconColor: "text-red-600" },
    { icon: <MessageCircle size={20} />, label: "মেসেজ", href: "/chat", badge: "5", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { icon: <Bell size={20} />, label: "নোটিফিকেশন", href: "/notifications", badge: "2", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
    { icon: <Settings size={20} />, label: "সেটিংস", href: "/settings", bgColor: "bg-gray-50", iconColor: "text-gray-600" },
    { icon: <Shield size={20} />, label: "প্রাইভেসি ও নিরাপত্তা", href: "/privacy", bgColor: "bg-indigo-50", iconColor: "text-indigo-600" },
  ];

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      
      {/* প্রোফাইল হেডার - GPU Accelerated */}
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] overflow-hidden transform-gpu">
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 py-8 text-center">
          
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl border-4 border-white shadow-2xl overflow-hidden">
              {profileImage.startsWith('data:') ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" loading="eager" />
              ) : (
                <span>{profileImage}</span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200 active:scale-95"
            >
              <Camera size={16} className="text-[#f85606]" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <h2 className="text-2xl font-bold mt-4 text-white">{profile.name}</h2>
          <p className="text-sm text-white/80">{profile.email}</p>
          <div className="flex justify-center gap-6 mt-3">
            <div className="text-center"><p className="text-xl font-bold text-white">12</p><p className="text-xs text-white/70">পোস্ট</p></div>
            <div className="w-px bg-white/30" />
            <div className="text-center"><p className="text-xl font-bold text-white">{myAuctions.length}</p><p className="text-xs text-white/70">নিলাম</p></div>
            <div className="w-px bg-white/30" />
            <div className="text-center"><p className="text-xl font-bold text-white">4.8</p><p className="text-xs text-white/70">রেটিং</p></div>
            <div className="w-px bg-white/30" />
            <div className="text-center"><p className="text-xl font-bold text-white">500+</p><p className="text-xs text-white/70">লেনদেন</p></div>
          </div>
          
          <button 
            onClick={() => setShowEditModal(true)}
            className="mt-4 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 mx-auto hover:bg-white/30 transition duration-200 border border-white/30 active:scale-95"
          >
            <Edit2 size={16} /> প্রোফাইল এডিট করুন
          </button>
        </div>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard title="মোট খরচ" value={`${totalSpent} ৳`} color="from-[#f85606] to-orange-500" />
          <div className="bg-white rounded-xl p-3 shadow-md">
            <p className="text-xs text-gray-500">সক্রিয় ফিচার্ড</p>
            <p className="text-xl font-bold text-[#f85606]">{activeFeaturedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <p className="text-xs text-gray-500">মোট পোস্ট</p>
            <p className="text-xl font-bold text-[#f85606]">12</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <p className="text-xs text-gray-500">মোট ভিউ</p>
            <p className="text-xl font-bold text-[#f85606]">4,230</p>
          </div>
        </div>
      </div>

      {/* ট্যাব মেনু */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-md border border-[#f85606]/20 overflow-x-auto">
          {[
            { id: 'overview', label: 'ওভারভিউ' },
            { id: 'auctions', label: 'নিলাম' },
            { id: 'featured', label: 'ফিচার্ড' },
            { id: 'payments', label: 'পেমেন্ট' },
            { id: 'documents', label: 'ডকুমেন্ট' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap px-3 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#f85606]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ট্যাব কন্টেন্ট */}
      <div className="max-w-3xl mx-auto p-4 space-y-3">
        
        {/* ওভারভিউ ট্যাব */}
        {activeTab === 'overview' && (
          <>
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border border-[#f85606]/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <div className={item.iconColor}>{item.icon}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">{item.label}</span>
                      {item.badge && <p className="text-xs text-gray-400">{item.badge} টি আইটেম</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && <span className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>}
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
            
            {/* 🔥 চ্যাট কুইক অ্যাকশন */}
            <button
              onClick={handleChatWithSeller}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={20} />
                <span className="font-semibold">চ্যাট করুন</span>
              </div>
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* নিলাম ট্যাব */}
        {activeTab === 'auctions' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Gavel size={20} className="text-[#f85606]" />
                <span className="bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                  আমার নিলাম ({myAuctions.length})
                </span>
              </h2>
              <Link href="/auction/create">
                <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition active:scale-95">
                  <Plus size={16} /> নতুন নিলাম
                </button>
              </Link>
            </div>

            {myAuctions.length === 0 ? (
              <div className="text-center py-8">
                <Gavel size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400">কোনো নিলাম নেই</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myAuctions.map((auction) => {
                  const timeInfo = getTimeLeft(auction.endTime);
                  return (
                    <div key={auction.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-white relative">
                      <div className="absolute top-3 right-3 z-10">
                        {auction.status === 'active' && (
                          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> সক্রিয়
                          </span>
                        )}
                        {auction.status === 'ended' && auction.isWinner && (
                          <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <Award size={10} /> আপনি জিতেছেন!
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-4xl shadow-sm">
                          {auction.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 line-clamp-1 pr-20">{auction.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div><span className="text-[10px] text-gray-400">বর্তমান দাম</span><p className="font-bold text-[#f85606]">৳{auction.currentPrice.toLocaleString()}</p></div>
                            <div className="w-px h-6 bg-gray-200" />
                            <div><span className="text-[10px] text-gray-400">বিড</span><p className="font-semibold text-gray-700">{auction.totalBids} টি</p></div>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Clock size={12} className={timeInfo.isEnded ? "text-red-500" : "text-green-500"} />
                            <span className={`text-xs font-medium ${timeInfo.isEnded ? "text-red-500" : "text-green-600"}`}>{timeInfo.text}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => handleViewAuction(auction.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95">
                          <Eye size={12} /> দেখুন
                        </button>
                        <button onClick={() => handleViewBids(auction.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95">
                          <Users size={12} /> বিড ({auction.totalBids})
                        </button>
                        {auction.status === 'active' && (
                          <button onClick={() => handleEditAuction(auction.id)} className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95">
                            <Edit2 size={12} /> এডিট
                          </button>
                        )}
                        {auction.status === 'ended' && auction.isWinner && (
                          <button onClick={() => handlePayNow(auction)} className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition active:scale-95">
                            <CreditCard size={12} /> পেমেন্ট
                          </button>
                        )}
                        <div className="relative">
                          <button onClick={() => setShowActionMenu(showActionMenu === auction.id ? null : auction.id)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition">
                            <MoreVertical size={14} />
                          </button>
                          {showActionMenu === auction.id && (
                            <div className="absolute right-0 bottom-full mb-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-30 min-w-[140px]">
                              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/auction/${auction.id}`); alert("লিংক কপি হয়েছে!"); setShowActionMenu(null); }} className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2">
                                <Copy size={12} /> লিংক কপি
                              </button>
                              <button onClick={() => { setShowActionMenu(null); setShowDeleteConfirm(auction.id); }} className="w-full px-4 py-2 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-2">
                                <Trash2 size={12} /> ডিলিট
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ফিচার্ড ট্যাব */}
        {activeTab === 'featured' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Crown size={20} className="text-[#f85606]" /> 
              <span className="bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">ফিচার্ড পোস্ট</span>
            </h2>
            {featuredPosts.length === 0 ? (
              <p className="text-center text-gray-400 py-4">কোনো ফিচার্ড পোস্ট নেই</p>
            ) : (
              <div className="space-y-3">
                {featuredPosts.map((post) => (
                  <div key={post.postId} className="border border-[#f85606]/20 rounded-xl p-3 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{post.postTitle}</p>
                        <p className="text-xs text-gray-400"><Eye size={12} className="inline" /> {post.views} ভিউ</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">সক্রিয়</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-xs text-gray-500"><Clock size={12} className="inline" /> {getDaysLeft(post.endDate)} দিন বাকি</p>
                      <div className="flex gap-2">
                        <button onClick={() => setShowExtendModal(post.postId)} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                          <RefreshCw size={10} /> সময় বাড়ান
                        </button>
                        <button onClick={() => router.push(`/post/${post.postId}`)} className="text-xs text-[#f85606] font-semibold hover:underline">
                          বিস্তারিত
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* পেমেন্ট ট্যাব */}
        {activeTab === 'payments' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-[#f85606]" />
              <span className="bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">পেমেন্ট হিস্ট্রি</span>
            </h2>
            {payments.length === 0 ? (
              <p className="text-center text-gray-400 py-4">কোনো পেমেন্ট নেই</p>
            ) : (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center border-b border-gray-100 py-2 hover:bg-orange-50/50 p-2 rounded-lg transition">
                    <div>
                      <p className="font-semibold text-sm">
                        {payment.type === 'featured' && '⭐ ফিচার্ড লিস্টিং'}
                        {payment.type === 'document' && '📄 ডকুমেন্ট সার্ভিস'}
                        {payment.type === 'bid' && '🔨 বিড ফি'}
                      </p>
                      {payment.postTitle && <p className="text-xs text-gray-400">{payment.postTitle}</p>}
                      <p className="text-xs text-gray-400">{payment.date}</p>
                    </div>
                    <p className="font-bold text-[#f85606]">{payment.amount} ৳</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ডকুমেন্ট ট্যাব */}
        {activeTab === 'documents' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#f85606]" />
              <span className="bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">ডকুমেন্ট রিকোয়েস্ট</span>
            </h2>
            {documentRequests.length === 0 ? (
              <p className="text-center text-gray-400 py-4">কোনো ডকুমেন্ট রিকোয়েস্ট নেই</p>
            ) : (
              <div className="space-y-3">
                {documentRequests.map((doc) => (
                  <div key={doc.id} className="border border-[#f85606]/20 rounded-xl p-3 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div><p className="font-semibold text-gray-800">{doc.postTitle}</p><p className="text-xs text-gray-400">{doc.createdAt}</p></div>
                      <span className={`text-xs px-2 py-1 rounded-full ${doc.status === 'released' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {doc.status === 'released' ? 'রিলিজড' : 'পেন্ডিং'}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-600">ফি: <span className="font-bold text-[#f85606]">{doc.fee} ৳</span></p>
                      {doc.status === 'released' ? (
                        <button onClick={() => router.push(`/documents/download?id=${doc.id}`)} className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold active:scale-95 transition">
                          ডাউনলোড
                        </button>
                      ) : (
                        <button onClick={() => router.push(`/documents/payment?id=${doc.id}&amount=${doc.fee}`)} className="text-sm bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-1.5 rounded-lg font-semibold active:scale-95 transition">
                          পেমেন্ট করুন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* লগআউট বাটন */}
        <button onClick={handleLogout} className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 text-red-600 shadow-md hover:shadow-xl transition-all duration-200 group border border-red-100 active:scale-[0.99]">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <LogOut size={20} className="text-red-500" />
          </div>
          <span className="font-semibold">লগ আউট</span>
          <ChevronRight size={18} className="ml-auto text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* এডিট প্রোফাইল মডাল */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">প্রোফাইল এডিট করুন</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল</label><input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">ফোন নম্বর</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">অঞ্চল</label><input type="text" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">বায়ো</label><textarea rows={3} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" /></div>
              <button onClick={handleProfileUpdate} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md active:scale-95 transition">
                <CheckCircle size={18} /> সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ডিলিট কনফার্মেশন মডাল */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32} className="text-red-500" /></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">নিলাম ডিলিট করবেন?</h3>
              <p className="text-sm text-gray-500 mb-6">এই নিলামটি স্থায়ীভাবে ডিলিট হয়ে যাবে।</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={() => handleDeleteAuction(showDeleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold">ডিলিট করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ফিচার্ড এক্সটেন্ড মডাল */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Calendar size={18} className="text-[#f85606]" /> ফিচার্ড সময় বাড়ান</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">কত দিন বাড়াবেন?</label><select value={extendDays} onChange={(e) => setExtendDays(Number(e.target.value))} className="w-full p-3 border rounded-xl"><option value={7}>৭ দিন (১০০ ৳)</option><option value={15}>১৫ দিন (১৮০ ৳)</option><option value={30}>৩০ দিন (৩০০ ৳)</option></select></div>
              <div className="flex gap-3">
                <button onClick={() => setShowExtendModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={() => handleExtendFeatured(showExtendModal, extendDays)} className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold">সংরক্ষণ</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* আপলোডিং ইন্ডিকেটর */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">ছবি আপলোড হচ্ছে...</p>
          </div>
        </div>
      )}
    </div>
  );
}