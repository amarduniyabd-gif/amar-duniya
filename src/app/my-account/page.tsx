"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, Package, Gavel, Settings, LogOut, Heart, 
  MessageCircle, Bell, Shield, MapPin, Phone, Mail,
  ChevronRight, Edit2, Camera, X, CheckCircle
} from "lucide-react";

export default function MyAccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("👨");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: "রহিম উদ্দিন",
    email: "rahim@gmail.com",
    phone: "017XXXXXXXX",
    location: "ঢাকা, বাংলাদেশ",
    bio: "প্রফেশনাল বিক্রেতা | ৫ বছর অভিজ্ঞতা",
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
    if (loggedIn !== "true") {
      router.push("/login");
    }
  }, []);

  // WebP ইমেজ কম্প্রেশন ফাংশন
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
    alert("প্রোফাইল আপডেট করা হয়েছে!");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const menuItems = [
    { icon: <Package size={20} />, label: "আমার পোস্ট", href: "/my-posts", badge: "12", color: "bg-blue-50 text-blue-600" },
    { icon: <Gavel size={20} />, label: "আমার নিলাম", href: "/my-auctions", badge: "3", color: "bg-green-50 text-green-600" },
    { icon: <Heart size={20} />, label: "সংরক্ষিত পণ্য", href: "/saved", badge: "8", color: "bg-red-50 text-red-600" },
    { icon: <MessageCircle size={20} />, label: "মেসেজ", href: "/chat", badge: "5", color: "bg-purple-50 text-purple-600" },
    { icon: <Bell size={20} />, label: "নোটিফিকেশন", href: "/notifications", badge: "2", color: "bg-yellow-50 text-yellow-600" },
    { icon: <Settings size={20} />, label: "সেটিংস", href: "/settings", color: "bg-gray-50 text-gray-600" },
    { icon: <Shield size={20} />, label: "প্রাইভেসি ও নিরাপত্তা", href: "/privacy", color: "bg-indigo-50 text-indigo-600" },
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      
      {/* প্রোফাইল হেডার - বিলিয়ন ডলার লুক */}
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-3xl mx-auto px-4 py-8 text-center">
          
          {/* প্রোফাইল ইমেজ */}
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition"></div>
            <div className="relative w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl border-4 border-white shadow-2xl overflow-hidden">
              {profileImage.startsWith('data:') ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{profileImage}</span>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition"
            >
              <Camera size={16} className="text-[#f85606]" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {/* ইউজার তথ্য */}
          <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
          <p className="text-sm opacity-90">{profile.email}</p>
          <div className="flex justify-center gap-4 mt-3">
            <div className="text-center"><p className="text-xl font-bold">12</p><p className="text-xs opacity-80">পোস্ট</p></div>
            <div className="w-px bg-white/30"></div>
            <div className="text-center"><p className="text-xl font-bold">3</p><p className="text-xs opacity-80">নিলাম</p></div>
            <div className="w-px bg-white/30"></div>
            <div className="text-center"><p className="text-xl font-bold">4.8</p><p className="text-xs opacity-80">রেটিং</p></div>
          </div>
          
          {/* এডিট প্রোফাইল বাটন */}
          <button 
            onClick={() => setShowEditModal(true)}
            className="mt-4 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 mx-auto hover:bg-white/30 transition"
          >
            <Edit2 size={16} /> প্রোফাইল এডিট করুন
          </button>
        </div>
      </div>

      {/* মেনু আইটেম */}
      <div className="max-w-3xl mx-auto p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <div className="group bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{item.label}</span>
                  {item.badge && <p className="text-xs text-gray-400">{item.badge} টি আইটেম</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && <span className="bg-[#f85606] text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>}
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#f85606] group-hover:translate-x-1 transition" />
              </div>
            </div>
          </Link>
        ))}

        {/* লগআউট বাটন */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 text-red-600 shadow-sm hover:shadow-xl transition-all duration-300 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className="font-semibold">লগ আউট</span>
          <ChevronRight size={18} className="ml-auto text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* এডিট প্রোফাইল মডাল */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">প্রোফাইল এডিট করুন</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ফোন নম্বর</label>
                <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">অঞ্চল</label>
                <input type="text" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বায়ো</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" />
              </div>
              <button onClick={handleProfileUpdate} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                <CheckCircle size={18} /> সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* আপলোডিং ইন্ডিকেটর */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">ছবি আপলোড হচ্ছে...</p>
          </div>
        </div>
      )}

    </div>
  );
}