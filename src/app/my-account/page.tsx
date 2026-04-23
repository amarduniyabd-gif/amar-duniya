"use client";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Package, Gavel, Settings, LogOut, Heart, 
  MessageCircle, Bell, Shield, ChevronRight, Edit2, Camera,
  Crown, Clock, CreditCard, Eye, Trash2, Plus,
  Bookmark, CheckCircle, Loader2
} from "lucide-react";

// ============ টাইপ ডেফিনিশন ============
type FeaturedPost = {
  postId: string;
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

type MyAuction = {
  id: string;
  title: string;
  current_price: number;
  start_price: number;
  image: string;
  end_time: string;
  total_bids: number;
  status: string;
  views: number;
};

type MyMatrimonyProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  district: string;
  profession: string;
  status: string;
  is_verified: boolean;
  is_premium: boolean;
  views: number;
  interests: number;
  created_at: string;
};

// ============ মেমোইজড সাব-কম্পোনেন্ট ============
const StatCard = memo(({ label, value, isOrange }: { label: string; value: string | number; isOrange?: boolean }) => (
  <div className={`rounded-xl p-3 shadow-md ${isOrange ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white' : 'bg-white'}`}>
    <p className="text-xs opacity-90">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
));
StatCard.displayName = 'StatCard';

const MenuItem = memo(({ item }: { item: any }) => (
  <Link href={item.href}>
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
));
MenuItem.displayName = 'MenuItem';

// ইমেজ কম্প্রেশন
const compressToWebP = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        requestAnimationFrame(() => {
          const canvas = document.createElement('canvas');
          const size = 150;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
          if (ctx) {
            ctx.drawImage(img, 0, 0, size, size);
            resolve(canvas.toDataURL('image/webp', 0.7));
          } else {
            resolve('');
          }
        });
      };
    };
  });
};

// টাইম এগো
const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} দিন আগে`;
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours} ঘন্টা আগে`;
  return 'এইমাত্র';
};

export default function MyAccountPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("👨");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'auctions' | 'matrimony' | 'payments'>('overview');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [stats, setStats] = useState({
    totalPosts: 0,
    totalAuctions: 0,
    totalMatrimony: 0,
    totalSpent: 0,
    totalViews: 0,
  });

  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [myAuctions, setMyAuctions] = useState<MyAuction[]>([]);
  const [myMatrimonyProfiles, setMyMatrimonyProfiles] = useState<MyMatrimonyProfile[]>([]);

  // ✅ Supabase ক্লায়েন্ট লোড
  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const client = getSupabaseClient();
        setSupabase(client);
      } catch (error) {
        console.error('Failed to load Supabase:', error);
      }
    };
    
    loadSupabase();
    setMounted(true);
  }, []);

  // ✅ ডাটা লোড
  useEffect(() => {
    if (!supabase) return;

    const loadUserData = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login?redirect=/my-account");
          return;
        }
        setCurrentUserId(user.id);

        // প্রোফাইল লোড
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile({
            name: profileData.name || 'ইউজার',
            email: user.email || '',
            phone: profileData.phone || '',
            location: profileData.location || 'বাংলাদেশ',
            bio: profileData.bio || '',
            avatar: profileData.avatar || '',
          });
          if (profileData.avatar) setProfileImage(profileData.avatar);
        } else {
          setProfile(prev => ({ ...prev, email: user.email || '' }));
        }

        // পোস্ট কাউন্ট
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', user.id);
        
        // নিলাম কাউন্ট
        const { count: auctionsCount } = await supabase
          .from('auctions')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', user.id);
        
        // পাত্র-পাত্রী কাউন্ট
        const { count: matrimonyCount } = await supabase
          .from('matrimony_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        // পেমেন্ট টোটাল
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('amount')
          .eq('user_id', user.id);
        
        // ভিউ টোটাল
        const { data: viewsData } = await supabase
          .from('posts')
          .select('views')
          .eq('seller_id', user.id);
        
        setStats({
          totalPosts: postsCount || 0,
          totalAuctions: auctionsCount || 0,
          totalMatrimony: matrimonyCount || 0,
          totalSpent: paymentsData?.reduce((s: number, p: any) => s + p.amount, 0) || 0,
          totalViews: viewsData?.reduce((s: number, p: any) => s + (p.views || 0), 0) || 0,
        });

        // নিলাম লোড
        const { data: auctions } = await supabase
          .from('auctions')
          .select(`
            id, title, current_price, start_price, end_time, status, views,
            images:auction_images(thumbnail_url),
            bids(count)
          `)
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (auctions) {
          setMyAuctions(auctions.map((a: any) => ({
            ...a,
            image: a.images?.[0]?.thumbnail_url || '🔨',
            total_bids: a.bids?.[0]?.count || 0,
          })));
        }

        // পাত্র-পাত্রী লোড
        const { data: matrimony } = await supabase
          .from('matrimony_profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (matrimony) setMyMatrimonyProfiles(matrimony);

        // পেমেন্ট হিস্ট্রি
        const { data: paymentHistory } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (paymentHistory) {
          setPayments(paymentHistory.map((p: any) => ({
            id: p.id,
            type: p.type,
            amount: p.amount,
            date: new Date(p.created_at).toLocaleDateString('bn-BD'),
          })));
        }

      } catch (error) {
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [supabase, router]);

  // ============ হ্যান্ডলার ============
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUserId || !supabase) return;
    
    setIsUploading(true);
    try {
      const webpImage = await compressToWebP(file);
      setProfileImage(webpImage);
      
      const fileName = `avatar-${Date.now()}.webp`;
      const blob = dataURItoBlob(webpImage);
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`users/${currentUserId}/${fileName}`, blob);
      
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`users/${currentUserId}/${fileName}`);
        
        if (urlData) {
          await supabase.from('profiles')
            .update({ avatar: urlData.publicUrl })
            .eq('id', currentUserId);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [currentUserId, supabase]);

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  const handleProfileUpdate = useCallback(async () => {
    if (!currentUserId || !supabase) return;
    
    try {
      await supabase.from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUserId);
      
      setShowEditModal(false);
      alert("✅ প্রোফাইল আপডেট করা হয়েছে!");
    } catch (error) {
      alert("প্রোফাইল আপডেট করতে সমস্যা হয়েছে!");
    }
  }, [profile, currentUserId, supabase]);

  const handleLogout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.clear();
    router.push("/login");
  }, [supabase, router]);

  const getTimeLeft = useCallback((endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return { text: "সমাপ্ত", isEnded: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return { text: `${days} দিন ${hours} ঘন্টা`, isEnded: false };
    return { text: `${hours} ঘন্টা`, isEnded: false };
  }, []);

  const handleViewAuction = useCallback((id: string) => router.push(`/auction/${id}`), [router]);
  const handleViewMatrimonyProfile = useCallback((id: string) => router.push(`/category/matrimony?id=${id}`), [router]);
  const handleEditMatrimonyProfile = useCallback((id: string) => router.push(`/category/matrimony/edit/${id}`), [router]);
  const handleDeleteMatrimonyProfile = useCallback(async (id: string) => {
    if (!supabase) return;
    if (!confirm('প্রোফাইল ডিলিট করবেন?')) return;
    await supabase.from('matrimony_profiles').delete().eq('id', id);
    setMyMatrimonyProfiles(prev => prev.filter(p => p.id !== id));
    alert("✅ প্রোফাইল ডিলিট করা হয়েছে!");
  }, [supabase]);

  const menuItems = [
    { icon: <Package size={20} />, label: "আমার পোস্ট", href: "/my-posts", badge: String(stats.totalPosts), bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: <Gavel size={20} />, label: "আমার নিলাম", href: "/my-auctions", badge: String(stats.totalAuctions), bgColor: "bg-green-50", iconColor: "text-green-600" },
    { icon: <Heart size={20} />, label: "পাত্র-পাত্রী", href: "/category/matrimony", badge: String(stats.totalMatrimony), bgColor: "bg-pink-50", iconColor: "text-pink-600" },
    { icon: <Heart size={20} />, label: "সংরক্ষিত পণ্য", href: "/saved", badge: "0", bgColor: "bg-red-50", iconColor: "text-red-600" },
    { icon: <MessageCircle size={20} />, label: "মেসেজ", href: "/chat", badge: "0", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
    { icon: <Bell size={20} />, label: "নোটিফিকেশন", href: "/notifications", badge: "0", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
    { icon: <Settings size={20} />, label: "সেটিংস", href: "/settings", bgColor: "bg-gray-50", iconColor: "text-gray-600" },
    { icon: <Shield size={20} />, label: "প্রাইভেসি ও নিরাপত্তা", href: "/privacy", bgColor: "bg-indigo-50", iconColor: "text-indigo-600" },
  ];

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

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
              {profileImage.startsWith('data:') || profileImage.startsWith('http') ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" loading="eager" />
              ) : (
                <span>{profileImage}</span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200 active:scale-95"
              disabled={isUploading}
            >
              <Camera size={16} className="text-[#f85606]" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <h2 className="text-2xl font-bold mt-4 text-white">{profile.name || 'ইউজার'}</h2>
          <p className="text-sm text-white/80">{profile.email}</p>
          <div className="flex justify-center gap-6 mt-3">
            <div className="text-center"><p className="text-xl font-bold text-white">{stats.totalPosts}</p><p className="text-xs text-white/70">পোস্ট</p></div>
            <div className="w-px bg-white/30" />
            <div className="text-center"><p className="text-xl font-bold text-white">{stats.totalAuctions}</p><p className="text-xs text-white/70">নিলাম</p></div>
            <div className="w-px bg-white/30" />
            <div className="text-center"><p className="text-xl font-bold text-white">{stats.totalMatrimony}</p><p className="text-xs text-white/70">পাত্র-পাত্রী</p></div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="মোট খরচ" value={`${stats.totalSpent} ৳`} isOrange />
          <StatCard label="মোট পোস্ট" value={stats.totalPosts} />
          <StatCard label="মোট ভিউ" value={stats.totalViews} />
        </div>
      </div>

      {/* ট্যাব মেনু */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-md border border-[#f85606]/20 overflow-x-auto">
          {['overview', 'auctions', 'matrimony', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap px-3 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#f85606]'
              }`}
            >
              {tab === 'overview' && 'ওভারভিউ'}
              {tab === 'auctions' && 'নিলাম'}
              {tab === 'matrimony' && 'পাত্র-পাত্রী'}
              {tab === 'payments' && 'পেমেন্ট'}
            </button>
          ))}
        </div>
      </div>

      {/* ট্যাব কন্টেন্ট */}
      <div className="max-w-3xl mx-auto p-4 space-y-3">
        
        {activeTab === 'overview' && (
          <>
            {menuItems.map((item, idx) => (
              <MenuItem key={idx} item={item} />
            ))}
          </>
        )}

        {activeTab === 'matrimony' && (
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Heart size={20} className="text-[#f85606]" />
                  <span>আমার প্রোফাইল ({myMatrimonyProfiles.length})</span>
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
                              {prof.is_verified && <CheckCircle size={12} className="text-green-500" />}
                              {prof.is_premium && <Crown size={12} className="text-amber-500" />}
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
                        <span>📅 {timeAgo(prof.created_at)}</span>
                      </div>

                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => handleViewMatrimonyProfile(prof.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                          <Eye size={12} /> দেখুন
                        </button>
                        <button onClick={() => handleEditMatrimonyProfile(prof.id)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                          <Edit2 size={12} /> এডিট
                        </button>
                        <button onClick={() => handleDeleteMatrimonyProfile(prof.id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
                  const timeInfo = getTimeLeft(auction.end_time);
                  return (
                    <div key={auction.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-white">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-3xl">
                          {auction.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{auction.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-bold text-[#f85606]">৳{auction.current_price?.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">{auction.total_bids} বিড</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className={timeInfo.isEnded ? "text-red-500" : "text-green-500"} />
                            <span className={`text-xs ${timeInfo.isEnded ? "text-red-500" : "text-green-600"}`}>{timeInfo.text}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleViewAuction(auction.id)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs">দেখুন</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-[#f85606]/10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-[#f85606]" /> পেমেন্ট হিস্ট্রি
            </h2>
            {payments.length === 0 ? (
              <p className="text-center text-gray-400 py-4">কোনো পেমেন্ট নেই</p>
            ) : (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-medium text-sm">
                        {payment.type === 'featured' && '⭐ ফিচার্ড'}
                        {payment.type === 'matrimony' && '💑 পাত্র-পাত্রী'}
                        {payment.type === 'bid' && '🔨 বিড'}
                        {payment.type === 'document' && '📄 ডকুমেন্ট'}
                      </p>
                      <p className="text-xs text-gray-400">{payment.date}</p>
                    </div>
                    <p className="font-bold text-[#f85606]">{payment.amount} ৳</p>
                  </div>
                ))}
              </div>
            )}
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
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="ফোন" />
              <input type="text" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="ঠিকানা" />
              <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="বায়ো" rows={3} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleProfileUpdate} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl">সংরক্ষণ</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* আপলোডিং ইন্ডিকেটর */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <Loader2 className="animate-spin text-[#f85606] mx-auto mb-4" size={40} />
            <p className="text-gray-600">ছবি আপলোড হচ্ছে...</p>
          </div>
        </div>
      )}
    </div>
  );
}