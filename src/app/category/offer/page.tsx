"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, X, Sparkles,
  Clock, Eye, TrendingUp, Gift, Tag,
  Store, AlertCircle, Megaphone, BadgeCheck
} from "lucide-react";
import Lottie from "lottie-react";

type OfferBanner = {
  id: number;
  shopName: string;
  offerTitle: string;
  description: string;
  bannerColor: string;
  shopLogo: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactLocation: string;
  offerDetails: string;
  validUntil: string;
  discountCode?: string;
  priority: 'high' | 'medium' | 'low';
  views: number;
  status: 'active' | 'inactive';
};

// Lottie অ্যানিমেশন
const offerAnimationUrl = "https://assets10.lottiefiles.com/packages/lf20_5ngs2ksb.json";

export default function OfferZonePage() {
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  // Lottie লোড
  useEffect(() => {
    fetch(offerAnimationUrl)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.log('Animation load failed:', err));
  }, []);

  // ব্যানার লোড
  useEffect(() => {
    const savedBanners = localStorage.getItem("offerBanners");
    if (savedBanners) {
      const activeBanners = JSON.parse(savedBanners).filter((b: OfferBanner) => b.status === 'active');
      setBanners(activeBanners);
    } else {
      // ডিফল্ট দোকানের ব্যানার
      const defaultBanners: OfferBanner[] = [
        {
          id: 1, shopName: "আলিফ ইলেকট্রনিক্স", offerTitle: "বছরের সেরা ছাড়", 
          description: "সব পণ্যে ৫০% পর্যন্ত", bannerColor: "from-blue-600 to-cyan-500",
          shopLogo: "📱", contactName: "আলিফ", contactPhone: "017XXXXXXXX",
          contactEmail: "alif@shop.com", contactLocation: "কুষ্টিয়া শহর",
          offerDetails: "ইলেকট্রনিক্স পণ্যে বিশেষ ছাড়! iPhone, Samsung, TV, AC সব পণ্যে।",
          validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
          discountCode: "ALIF50", priority: 'high', views: 450, status: 'active',
        },
        {
          id: 2, shopName: "কুষ্টিয়া ফ্যাশন হাউস", offerTitle: "ঈদ স্পেশাল অফার", 
          description: "সব পোশাকে ৩০% ছাড়", bannerColor: "from-pink-600 to-rose-500",
          shopLogo: "👗", contactName: "রহিমা", contactPhone: "018XXXXXXXX",
          contactEmail: "fashion@shop.com", contactLocation: "কুষ্টিয়া বাজার",
          offerDetails: "শাড়ি, থ্রি-পিস, শার্ট, প্যান্ট সহ সব পোশাকে ছাড়!",
          validUntil: new Date(Date.now() + 5 * 86400000).toISOString(),
          priority: 'high', views: 320, status: 'active',
        },
        {
          id: 3, shopName: "দেশি বাজার", offerTitle: "নিত্যপ্রয়োজনীয় সাশ্রয়", 
          description: "৫-২০% পর্যন্ত ছাড়", bannerColor: "from-green-600 to-emerald-500",
          shopLogo: "🛒", contactName: "করিম", contactPhone: "019XXXXXXXX",
          contactEmail: "bazar@shop.com", contactLocation: "কুষ্টিয়া সদর",
          offerDetails: "চাল, ডাল, তেল, চিনি সহ সব নিত্যপ্রয়োজনীয় পণ্যে ছাড়!",
          validUntil: new Date(Date.now() + 10 * 86400000).toISOString(),
          priority: 'medium', views: 280, status: 'active',
        },
        {
          id: 4, shopName: "মোবাইল হাট", offerTitle: "স্মার্টফোন ফেস্ট", 
          description: "ফ্রি accessories", bannerColor: "from-purple-600 to-violet-500",
          shopLogo: "📲", contactName: "সোহেল", contactPhone: "016XXXXXXXX",
          contactEmail: "mobile@shop.com", contactLocation: "কুষ্টিয়া মোবাইল মার্কেট",
          offerDetails: "যেকোনো স্মার্টফোন কিনলে ফ্রি charger, earphone ও cover!",
          validUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
          discountCode: "MOBILE10", priority: 'high', views: 510, status: 'active',
        },
        {
          id: 5, shopName: "হোম স্টোর", offerTitle: "গৃহসজ্জায় ছাড়", 
          description: "২০-৪০% মূল্যছাড়", bannerColor: "from-amber-600 to-orange-500",
          shopLogo: "🏠", contactName: "রাশেদ", contactPhone: "015XXXXXXXX",
          contactEmail: "home@shop.com", contactLocation: "কুষ্টিয়া স্টেশন রোড",
          offerDetails: "ফার্নিচার, পর্দা, বেডশীট সহ সব গৃহসজ্জা পণ্যে ছাড়!",
          validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
          priority: 'medium', views: 190, status: 'active',
        },
        {
          id: 6, shopName: "গিফট শপ", offerTitle: "উপহার সামগ্রী", 
          description: "কিনুন ১ পাবেন ১ ফ্রি", bannerColor: "from-red-600 to-pink-500",
          shopLogo: "🎁", contactName: "নাদিয়া", contactPhone: "017XXXXXXXX",
          contactEmail: "gift@shop.com", contactLocation: "কুষ্টিয়া কলেজ রোড",
          offerDetails: "সব ধরনের গিফট আইটেমে Buy 1 Get 1 Free!",
          validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
          priority: 'high', views: 620, status: 'active',
        },
      ];
      setBanners(defaultBanners);
      localStorage.setItem("offerBanners", JSON.stringify(defaultBanners));
    }
    setLoading(false);
  }, []);

  const handleBannerClick = (banner: OfferBanner) => {
    setSelectedBanner(banner);
    const updatedBanners = banners.map(b => 
      b.id === banner.id ? { ...b, views: b.views + 1 } : b
    );
    setBanners(updatedBanners);
    localStorage.setItem("offerBanners", JSON.stringify(updatedBanners));
  };

  const getDaysLeft = (validUntil: string) => {
    const end = new Date(validUntil).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="text-center">
          {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />}
          <p className="text-gray-500 mt-2">দোকানের অফার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার - সাইনবোর্ড স্টাইল */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone size={24} className="animate-pulse" />
              <div>
                <h1 className="text-xl font-black tracking-wide">অফার জোন</h1>
                <p className="text-xs opacity-90">কুষ্টিয়ার দোকানগুলোর সেরা অফার</p>
              </div>
            </div>
            {animationData && (
              <Lottie animationData={animationData} loop={true} style={{ width: 50, height: 50 }} />
            )}
          </div>
        </div>
      </div>

      {/* ব্যানার গ্রিড - সাইনবোর্ড স্টাইল */}
      <div className="max-w-6xl mx-auto px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {banners.map(banner => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              className={`relative bg-gradient-to-r ${banner.bannerColor} rounded-2xl shadow-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
            >
              {/* সাইনবোর্ড ইফেক্ট - বর্ডার */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-2xl pointer-events-none"></div>
              
              {/* LED লাইট ইফেক্ট */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 animate-pulse"></div>
              
              <div className="relative p-5 text-white">
                {/* দোকানের নাম - বড় করে */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
                    {banner.shopLogo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <Store size={16} className="opacity-80" />
                      <h2 className="text-lg font-black tracking-wide">{banner.shopName}</h2>
                      {banner.priority === 'high' && <BadgeCheck size={16} className="text-yellow-300" />}
                    </div>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <MapPin size={12} /> {banner.contactLocation}
                    </p>
                  </div>
                </div>
                
                {/* অফার টাইটেল - সাইনবোর্ডের মূল লেখা */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-2xl font-black tracking-wider drop-shadow-lg">{banner.offerTitle}</p>
                  <p className="text-lg font-bold mt-1">{banner.description}</p>
                </div>
                
                {/* ফুটার */}
                <div className="flex items-center justify-between mt-3 text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><Eye size={12} /> {banner.views}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {getDaysLeft(banner.validUntil)} দিন বাকি</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Tag size={12} />
                    <span className="font-mono font-bold">{banner.discountCode || "অফার"}</span>
                  </div>
                </div>
              </div>
              
              {/* হট ডিল ব্যাজ */}
              {banner.priority === 'high' && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce border-2 border-white">
                    🔥 হট ডিল
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* বিস্তারিত মডাল - দোকানের ফুল ইনফো */}
      {selectedBanner && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
          onClick={() => setSelectedBanner(null)}
        >
          <div 
            className="bg-white rounded-t-3xl md:rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* দোকানের ব্যানার */}
            <div className={`bg-gradient-to-r ${selectedBanner.bannerColor} text-white p-5 rounded-t-3xl md:rounded-t-2xl`}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl border-2 border-white/30">
                  {selectedBanner.shopLogo}
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedBanner.shopName}</h2>
                  <p className="opacity-90 text-sm flex items-center gap-1"><MapPin size={14} /> {selectedBanner.contactLocation}</p>
                </div>
              </div>
              <div className="mt-4 bg-black/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-xl font-black">{selectedBanner.offerTitle}</p>
                <p className="text-lg font-bold">{selectedBanner.description}</p>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-gray-600 mb-4">{selectedBanner.offerDetails}</p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-3">📞 যোগাযোগ</h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-[#f85606]" />
                    {selectedBanner.contactName} - {selectedBanner.contactPhone}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-[#f85606]" />
                    {selectedBanner.contactEmail}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-[#f85606]" />
                    মেয়াদ: {getDaysLeft(selectedBanner.validUntil)} দিন বাকি
                  </p>
                  {selectedBanner.discountCode && (
                    <p className="flex items-center gap-2 text-sm">
                      <Tag size={14} className="text-[#f85606]" />
                      কোড: <span className="font-mono font-bold">{selectedBanner.discountCode}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <a href={`tel:${selectedBanner.contactPhone}`} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Phone size={18} /> কল করুন
                </a>
                <a href={`https://wa.me/${selectedBanner.contactPhone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.55 4.115 1.515 5.85L0 24l6.33-1.655A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                  হোয়াটসঅ্যাপ
                </a>
              </div>
              
              <button onClick={() => setSelectedBanner(null)} className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}