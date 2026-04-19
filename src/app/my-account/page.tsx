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
  Calendar, ExternalLink, EyeOff, Lock, Gem, Bookmark
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
  type: 'featured' | 'document' | 'bid' | 'matrimony';
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

// 🔥 পাত্র-পাত্রী প্রোফাইল টাইপ
type MyMatrimonyProfile = {
  id: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  district: string;
  profession: string;
  status: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  isPremium: boolean;
  views: number;
  interests: number;
  createdAt: string;
  expiresAt?: string;
};

// 🔥 পাত্র-পাত্রী পেমেন্ট হিস্ট্রি
type MatrimonyPayment = {
  id: string;
  profileId: number;
  profileName: string;
  amount: number;
  date: string;
  type: 'profile_unlock' | 'premium' | 'featured';
};

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
  const [activeTab, setActiveTab] = useState<'overview' | 'auctions' | 'matrimony' | 'featured' | 'payments' | 'documents'>('overview');
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
    { id: '2', type: 'matrimony', amount: 500, postTitle: 'পাত্রী প্রোফাইল আনলক', date: '২০২৬-০৪-১৫' },
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
  ]);

  // 🔥 পাত্র-পাত্রী প্রোফাইল স্টেট
  const [myMatrimonyProfiles, setMyMatrimonyProfiles] = useState<MyMatrimonyProfile[]>([
    {
      id: 1, name: "রহিমা খাতুন", age: 24, gender: "female", district: "নারায়ণগঞ্জ",
      profession: "সফটওয়্যার ইঞ্জিনিয়ার", status: "approved", isVerified: true, isPremium: true,
      views: 1240, interests: 56, createdAt: "২০২৬-০৪-১৫",
    },
    {
      id: 2, name: "আব্দুল করিম", age: 28, gender: "male", district: "গাজীপুর",
      profession: "ব্যবসায়ী", status: "pending", isVerified: false, isPremium: false,
      views: 120, interests: 8, createdAt: "২০২৬-০৪-১৮",
    },
  ]);

  // 🔥 পাত্র-পাত্রী পেমেন্ট হিস্ট্রি
  const [matrimonyPayments, setMatrimonyPayments] = useState<MatrimonyPayment[]>([
    { id: '1', profileId: 1, profileName: 'রহিমা খাতুন', amount: 500, date: '২০২৬-০৪-১৫', type: 'profile_unlock' },
    { id: '2', profileId: 2, profileName: 'নিজের প্রোফাইল', amount: 1000, date: '২০২৬-০৪-১৮', type: 'premium' },
  ]);

  // 🔥 সেভ করা প্রোফাইল
  const [savedProfiles, setSavedProfiles] = useState<MyMatrimonyProfile[]>([
    { id: 3, name: "ফাতেমা বেগম", age: 22, gender: "female", district: "কুমিল্লা", profession: "চিকিৎসা শিক্ষার্থী", status: "approved", isVerified: true, isPremium: false, views: 2100, interests: 89, createdAt: "২০২৬-০৪-১৩" },
  ]);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
    if (loggedIn !== "true") router.push("/login");
  }, [router]);

  // ============ অপটিমাইজড হ্যান্ডলার ============
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
    alert(`📝 নিলাম এডিট ফিচার শীঘ্রই আসছে!\nনিলাম আইডি: ${id}`);
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

  // 🔥 পাত্র-পাত্রী হ্যান্ডলার
  const handleEditMatrimonyProfile = useCallback((id: number) => {
    router.push(`/category/matrimony/edit/${id}`);
  }, [router]);

  const handleViewMatrimonyProfile = useCallback((id: number) => {
    router.push(`/category/matrimony?id=${id}`);
  }, [router]);

  const handleDeleteMatrimonyProfile = useCallback((id: number) => {
    setMyMatrimonyProfiles(prev => prev.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
    alert("✅ প্রোফাইল ডিলিট করা হয়েছে!");
  }, []);

  const handleBoostProfile = useCallback((id: number) => {
    alert(`🚀 প্রোফাইল বুস্ট করতে ২০০ টাকা পেমেন্ট করতে হবে!\nপ্রোফাইল আইডি: ${id}`);
  }, []);

  const handleRenewPremium = useCallback((id: number) => {
    alert(`👑 প্রিমিয়াম নবায়ন করতে ১০০০ টাকা পেমেন্ট করতে হবে!\nপ্রোফাইল আইডি: ${id}`);
  }, []);

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const activeFeaturedCount = featuredPosts.filter(p => p.status === 'active').length;

  const menuItems = [
  { icon: <Package size={20} />, label: "আমার পোস্ট", href: "/my-posts", badge: "12", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
  { icon: <Gavel size={20} />, label: "আমার নিলাম", href: "/my-auctions", badge: String(myAuctions.length), bgColor: "bg-green-50", iconColor: "text-green-600" },
  { icon: <Heart size={20} />, label: "পাত্র-পাত্রী", href: "/category/matrimony", badge: String(myMatrimonyProfiles.length), bgColor: "bg-pink-50", iconColor: "text-pink-600" },
  { icon: <Heart size={20} />, label: "সংরক্ষিত পণ্য", href: "/saved", badge: "8", bgColor: "bg-red-50", iconColor: "text-red-600" },
  { icon: <MessageCircle size={20} />, label: "মেসেজ", href: "/chat", badge: "5", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
  { icon: <Bell size={20} />, label: "নোটিফিকেশন", href: "/notifications", badge: "2", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
  { icon: <Settings size={20} />, label: "সেটিংস", href: "/settings", bgColor: "bg-gray-50", iconColor: "text-gray-600" }, // ✅ এটা ঠিক আছে
  { icon: <Shield size={20} />, label: "প্রাইভেসি ও নিরাপত্তা", href: "/privacy", bgColor: "bg-indigo-50", iconColor: "text-indigo-600" },
];
  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      
      {/* প্রোফাইল হেডার */}
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
            <div className="text-center"><p className="text-xl font-bold text-white">{myMatrimonyProfiles.length}</p><p className="text-xs text-white/70">পাত্র-পাত্রী</p></div>
            <div className="w-px bg-white/30" />
            <div className="text-center"><p className="text-xl font-bold text-white">4.8</p><p className="text-xs text-white/70">রেটিং</p></div>
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
          <div className="bg-gradient-to-r from-[#f85606] to-orange-500 rounded-xl p-3 text-white shadow-lg">
            <p className="text-xs opacity-90">মোট খরচ</p>
            <p className="text-xl font-bold">{totalSpent} ৳</p>
          </div>
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
            { id: 'matrimony', label: 'পাত্র-পাত্রী' },
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
          </>
        )}

        {/* 🔥 পাত্র-পাত্রী ট্যাব */}
        {activeTab === 'matrimony' && (
          <div className="space-y-4">
            {/* আমার প্রোফাইল */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Heart size={20} className="text-[#f85606]" />
                  <span className="bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                    আমার প্রোফাইল ({myMatrimonyProfiles.length})
                  </span>
                </h2>
                <Link href="/category/matrimony/create">
                  <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <Plus size={16} /> নতুন প্রোফাইল
                  </button>
                </Link>
              </div>

              {myMatrimonyProfiles.length === 0 ? (
                <p className="text-center text-gray-400 py-4">কোনো প্রোফাইল নেই</p>
              ) : (
                <div className="space-y-3">
                  {myMatrimonyProfiles.map((prof) => (
                    <div key={prof.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-2xl">
                            {prof.gender === 'male' ? '👨' : '👩'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                              {prof.name}
                              {prof.isVerified && <CheckCircle size={12} className="text-green-500" />}
                              {prof.isPremium && <Crown size={12} className="text-amber-500" />}
                            </h3>
                            <p className="text-xs text-gray-400">{prof.age} বছর • {prof.profession}</p>
                            <p className="text-xs text-gray-400">{prof.district}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            prof.status === 'approved' ? 'bg-green-100 text-green-700' :
                            prof.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {prof.status === 'approved' ? 'অনুমোদিত' : prof.status === 'pending' ? 'পেন্ডিং' : 'বাতিল'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>👁️ {prof.views} ভিউ</span>
                        <span>❤️ {prof.interests} আগ্রহ</span>
                        <span>📅 {prof.createdAt}</span>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => handleViewMatrimonyProfile(prof.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                          <Eye size={12} /> দেখুন
                        </button>
                        <button onClick={() => handleEditMatrimonyProfile(prof.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                          <Edit2 size={12} /> এডিট
                        </button>
                        {!prof.isPremium && (
                          <button onClick={() => handleRenewPremium(prof.id)} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                            <Crown size={12} /> প্রিমিয়াম
                          </button>
                        )}
                        <button onClick={() => handleBoostProfile(prof.id)} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                          <Zap size={12} /> বুস্ট
                        </button>
                        <button onClick={() => { setShowDeleteConfirm(prof.id); }} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* সেভ করা প্রোফাইল */}
            {savedProfiles.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bookmark size={20} className="text-[#f85606]" />
                  সেভ করা প্রোফাইল
                </h2>
                <div className="space-y-2">
                  {savedProfiles.map((prof) => (
                    <div key={prof.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-xl">
                          {prof.gender === 'male' ? '👨' : '👩'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{prof.name}</p>
                          <p className="text-xs text-gray-400">{prof.age} বছর • {prof.district}</p>
                        </div>
                      </div>
                      <button onClick={() => handleViewMatrimonyProfile(prof.id)} className="text-[#f85606] text-xs font-semibold">
                        দেখুন →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* পাত্র-পাত্রী পেমেন্ট হিস্ট্রি */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-[#f85606]" />
                পেমেন্ট হিস্ট্রি
              </h2>
              {matrimonyPayments.length === 0 ? (
                <p className="text-center text-gray-400 py-2">কোনো পেমেন্ট নেই</p>
              ) : (
                <div className="space-y-2">
                  {matrimonyPayments.map((pay) => (
                    <div key={pay.id} className="flex justify-between items-center border-b border-gray-100 py-2">
                      <div>
                        <p className="font-medium text-sm">{pay.profileName}</p>
                        <p className="text-xs text-gray-400">
                          {pay.type === 'profile_unlock' ? '🔓 প্রোফাইল আনলক' : 
                           pay.type === 'premium' ? '👑 প্রিমিয়াম' : '⭐ ফিচার্ড'} • {pay.date}
                        </p>
                      </div>
                      <p className="font-bold text-[#f85606]">{pay.amount} ৳</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* নিলাম ট্যাব */}
        {activeTab === 'auctions' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Gavel size={20} className="text-[#f85606]" />
                <span>আমার নিলাম ({myAuctions.length})</span>
              </h2>
              <Link href="/auction/create">
                <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                  <Plus size={16} /> নতুন নিলাম
                </button>
              </Link>
            </div>

            {myAuctions.length === 0 ? (
              <p className="text-center text-gray-400 py-4">কোনো নিলাম নেই</p>
            ) : (
              <div className="space-y-3">
                {myAuctions.map((auction) => {
                  const timeInfo = getTimeLeft(auction.endTime);
                  return (
                    <div key={auction.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-white">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-3xl">
                          {auction.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{auction.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-bold text-[#f85606]">৳{auction.currentPrice.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">{auction.totalBids} বিড</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className={timeInfo.isEnded ? "text-red-500" : "text-green-500"} />
                            <span className={`text-xs ${timeInfo.isEnded ? "text-red-500" : "text-green-600"}`}>{timeInfo.text}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleViewAuction(auction.id)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs">দেখুন</button>
                        <button onClick={() => handleViewBids(auction.id)} className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-xs">বিড</button>
                        {auction.status === 'active' && (
                          <button onClick={() => handleEditAuction(auction.id)} className="flex-1 bg-orange-50 text-orange-700 py-2 rounded-lg text-xs">এডিট</button>
                        )}
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
              <Crown size={20} className="text-[#f85606]" /> ফিচার্ড পোস্ট
            </h2>
            {featuredPosts.map((post) => (
              <div key={post.postId} className="border rounded-xl p-3 mb-2">
                <div className="flex justify-between">
                  <span className="font-medium">{post.postTitle}</span>
                  <span className="text-xs text-gray-400">{post.views} ভিউ</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{getDaysLeft(post.endDate)} দিন বাকি</span>
                  <button onClick={() => setShowExtendModal(post.postId)} className="text-xs text-blue-600">সময় বাড়ান</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* পেমেন্ট ট্যাব */}
        {activeTab === 'payments' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-[#f85606]" /> পেমেন্ট হিস্ট্রি
            </h2>
            {payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium text-sm">
                    {payment.type === 'featured' && '⭐ ফিচার্ড'}
                    {payment.type === 'matrimony' && '💑 পাত্র-পাত্রী'}
                    {payment.type === 'bid' && '🔨 বিড'}
                  </p>
                  {payment.postTitle && <p className="text-xs text-gray-400">{payment.postTitle}</p>}
                  <p className="text-xs text-gray-400">{payment.date}</p>
                </div>
                <p className="font-bold text-[#f85606]">{payment.amount} ৳</p>
              </div>
            ))}
          </div>
        )}

        {/* ডকুমেন্ট ট্যাব */}
        {activeTab === 'documents' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#f85606]" /> ডকুমেন্ট
            </h2>
            {documentRequests.map((doc) => (
              <div key={doc.id} className="border rounded-xl p-3 mb-2">
                <div className="flex justify-between">
                  <span className="font-medium">{doc.postTitle}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${doc.status === 'released' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {doc.status === 'released' ? 'রিলিজড' : 'পেন্ডিং'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">ফি: {doc.fee} ৳</span>
                  {doc.status === 'released' ? (
                    <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg">ডাউনলোড</button>
                  ) : (
                    <button className="text-sm bg-[#f85606] text-white px-3 py-1 rounded-lg">পেমেন্ট</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* লগআউট বাটন */}
        <button onClick={handleLogout} className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 text-red-600 shadow-md hover:shadow-xl transition-all duration-200 group border border-red-100">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={20} className="text-red-500" />
          </div>
          <span className="font-semibold">লগ আউট</span>
        </button>
      </div>

      {/* এডিট প্রোফাইল মডাল */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">প্রোফাইল এডিট</h3>
            <div className="space-y-3">
              <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="নাম" />
              <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="ইমেইল" />
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="ফোন" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleProfileUpdate} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl">সংরক্ষণ</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* ফিচার্ড এক্সটেন্ড মডাল */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4">ফিচার্ড সময় বাড়ান</h3>
            <select value={extendDays} onChange={(e) => setExtendDays(Number(e.target.value))} className="w-full p-3 border rounded-xl mb-4">
              <option value={7}>৭ দিন (১০০ ৳)</option>
              <option value={15}>১৫ দিন (১৮০ ৳)</option>
              <option value={30}>৩০ দিন (৩০০ ৳)</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => handleExtendFeatured(showExtendModal, extendDays)} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl">সংরক্ষণ</button>
              <button onClick={() => setShowExtendModal(null)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* আপলোডিং ইন্ডিকেটর */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">ছবি আপলোড হচ্ছে...</p>
          </div>
        </div>
      )}
    </div>
  );
}