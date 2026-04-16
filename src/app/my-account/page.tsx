"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Package, Gavel, Settings, LogOut, Heart, 
  MessageCircle, Bell, Shield, MapPin, Phone, Mail,
  ChevronRight, Edit2, Camera, X, CheckCircle,
  Crown, Clock, CreditCard, FileText, Star, Eye,
  TrendingUp, Award, Zap
} from "lucide-react";

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

export default function MyAccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("👨");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'featured' | 'payments' | 'documents'>('overview');
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

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
    if (loggedIn !== "true") {
      router.push("/login");
    }
  }, []);

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

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
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, size, size);
          const webpData = canvas.toDataURL('image/webp', 0.7);
          resolve(webpData);
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const webpImage = await compressToWebP(e.target.files[0]);
      setProfileImage(webpImage);
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = () => {
    setShowEditModal(false);
    alert("✅ প্রোফাইল আপডেট করা হয়েছে!");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const activeFeaturedCount = featuredPosts.filter(p => p.status === 'active').length;

  const menuItems = [
    { icon: <Package size={20} />, label: "আমার পোস্ট", href: "/my-posts", badge: "12", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: <Gavel size={20} />, label: "আমার নিলাম", href: "/my-auctions", badge: "3", bgColor: "bg-green-50", iconColor: "text-green-600" },
    { icon: <Heart size={20} />, label: "সংরক্ষিত পণ্য", href: "/saved", badge: "8", bgColor: "bg-red-50", iconColor: "text-red-600" },
    { icon: <MessageCircle size={20} />, label: "মেসেজ", href: "/chat", badge: "5", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { icon: <Bell size={20} />, label: "নোটিফিকেশন", href: "/notifications", badge: "2", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
    { icon: <Settings size={20} />, label: "সেটিংস", href: "/settings", bgColor: "bg-gray-50", iconColor: "text-gray-600" },
    { icon: <Shield size={20} />, label: "প্রাইভেসি ও নিরাপত্তা", href: "/privacy", bgColor: "bg-indigo-50", iconColor: "text-indigo-600" },
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      
      {/* প্রোফাইল হেডার */}
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl mx-auto px-4 py-8 text-center">
          
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl border-4 border-white shadow-2xl overflow-hidden">
              {profileImage.startsWith('data:') ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{profileImage}</span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition duration-300"
            >
              <Camera size={16} className="text-[#f85606]" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <h2 className="text-2xl font-bold mt-4 text-white">{profile.name}</h2>
          <p className="text-sm text-white/80">{profile.email}</p>
          <div className="flex justify-center gap-6 mt-3">
            <div className="text-center"><p className="text-xl font-bold text-white">12</p><p className="text-xs text-white/70">পোস্ট</p></div>
            <div className="w-px bg-white/30"></div>
            <div className="text-center"><p className="text-xl font-bold text-white">3</p><p className="text-xs text-white/70">নিলাম</p></div>
            <div className="w-px bg-white/30"></div>
            <div className="text-center"><p className="text-xl font-bold text-white">4.8</p><p className="text-xs text-white/70">রেটিং</p></div>
            <div className="w-px bg-white/30"></div>
            <div className="text-center"><p className="text-xl font-bold text-white">500+</p><p className="text-xs text-white/70">লেনদেন</p></div>
          </div>
          
          <button 
            onClick={() => setShowEditModal(true)}
            className="mt-4 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 mx-auto hover:bg-white/30 transition duration-300 border border-white/30"
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
          <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition">
            <p className="text-xs text-gray-500">সক্রিয় ফিচার্ড</p>
            <p className="text-xl font-bold text-[#f85606]">{activeFeaturedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition">
            <p className="text-xs text-gray-500">মোট পোস্ট</p>
            <p className="text-xl font-bold text-[#f85606]">12</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition">
            <p className="text-xs text-gray-500">মোট ভিউ</p>
            <p className="text-xl font-bold text-[#f85606]">4,230</p>
          </div>
        </div>
      </div>

      {/* ট্যাব মেনু */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-md border border-[#f85606]/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-[#f85606]'
            }`}
          >
            ওভারভিউ
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'featured' 
                ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-[#f85606]'
            }`}
          >
            ফিচার্ড
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'payments' 
                ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-[#f85606]'
            }`}
          >
            পেমেন্ট
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'documents' 
                ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-[#f85606]'
            }`}
          >
            ডকুমেন্ট
          </button>
        </div>
      </div>

      {/* ট্যাব কন্টেন্ট */}
      <div className="max-w-3xl mx-auto p-4 space-y-3">
        
        {/* ওভারভিউ ট্যাব */}
        {activeTab === 'overview' && (
          <>
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border border-[#f85606]/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition duration-300`}>
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
                      <button 
                        onClick={() => router.push(`/post/${post.postId}`)}
                        className="text-xs text-[#f85606] font-semibold hover:underline"
                      >
                        বিস্তারিত
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:from-[#f85606]/10 hover:to-orange-500/10 transition">
              নতুন পোস্ট ফিচার্ড করুন
            </button>
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

        {/* ডকুমেন্ট ট্যাব - বাটন কাজ করবে */}
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
                      <div>
                        <p className="font-semibold text-gray-800">{doc.postTitle}</p>
                        <p className="text-xs text-gray-400">{doc.createdAt}</p>
                      </div>
                      {doc.status === 'released' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">রিলিজড</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">পেন্ডিং</span>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-600">ফি: <span className="font-bold text-[#f85606]">{doc.fee} ৳</span></p>
                      {doc.status === 'released' ? (
                        <button 
                          onClick={() => router.push(`/documents/download?id=${doc.id}&title=${encodeURIComponent(doc.postTitle)}`)}
                          className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:scale-105 transition"
                        >
                          ডাউনলোড
                        </button>
                      ) : (
                        <button 
                          onClick={() => router.push(`/documents/payment?id=${doc.id}&amount=${doc.fee}&title=${encodeURIComponent(doc.postTitle)}`)}
                          className="text-sm bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-1.5 rounded-lg font-semibold hover:scale-105 transition"
                        >
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
        <button
          onClick={handleLogout}
          className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 text-red-600 shadow-md hover:shadow-xl transition-all duration-300 group border border-red-100"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition">
            <LogOut size={20} className="text-red-500" />
          </div>
          <span className="font-semibold">লগ আউট</span>
          <ChevronRight size={18} className="ml-auto text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* এডিট প্রোফাইল মডাল */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">প্রোফাইল এডিট করুন</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ফোন নম্বর</label>
                <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">অঞ্চল</label>
                <input type="text" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বায়ো</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" />
              </div>
              <button onClick={handleProfileUpdate} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition">
                <CheckCircle size={18} /> সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* আপলোডিং ইন্ডিকেটর */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">ছবি আপলোড হচ্ছে...</p>
          </div>
        </div>
      )}

    </div>
  );
} 