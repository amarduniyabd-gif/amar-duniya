"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, X, Sparkles,
  Clock, Eye, TrendingUp, Gift, Tag,
  Store, AlertCircle, Megaphone, BadgeCheck,
  ChevronRight
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
  const [isMobile, setIsMobile] = useState(false);

  // মোবাইল ডিটেকশন
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          id: 2, shopName: "কুষ্টিয়া ফ্যাশন", offerTitle: "ঈদ স্পেশাল", 
          description: "সব পোশাকে ৩০% ছাড়", bannerColor: "from-pink-600 to-rose-500",
          shopLogo: "👗", contactName: "রহিমা", contactPhone: "018XXXXXXXX",
          contactEmail: "fashion@shop.com", contactLocation: "কুষ্টিয়া বাজার",
          offerDetails: "শাড়ি, থ্রি-পিস, শার্ট, প্যান্ট সহ সব পোশাকে ছাড়!",
          validUntil: new Date(Date.now() + 5 * 86400000).toISOString(),
          priority: 'high', views: 320, status: 'active',
        },
        {
          id: 3, shopName: "দেশি বাজার", offerTitle: "নিত্যপ্রয়োজনীয়", 
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
          contactEmail: "mobile@shop.com", contactLocation: "মোবাইল মার্কেট",
          offerDetails: "যেকোনো স্মার্টফোন কিনলে ফ্রি charger, earphone ও cover!",
          validUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
          discountCode: "MOBILE10", priority: 'high', views: 510, status: 'active',
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 80, height: 80 }} />}
          <p className="text-gray-500 text-sm mt-2">দোকানের অফার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Megaphone size={isMobile ? 18 : 24} className="animate-pulse" />
              <div>
                <h1 className="text-base md:text-xl font-black tracking-wide">অফার জোন</h1>
                <p className="text-[10px] md:text-xs opacity-90">কুষ্টিয়ার দোকানগুলোর সেরা অফার</p>
              </div>
            </div>
            {animationData && (
              <Lottie animationData={animationData} loop={true} style={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }} />
            )}
          </div>
        </div>
      </div>

      {/* ব্যানার লিস্ট - রেসপন্সিভ গ্রিড */}
      <div className="max-w-6xl mx-auto px-2 md:px-3 py-3 md:py-4">
        {/* স্ট্যাটাস বার */}
        <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
          <h2 className="text-xs md:text-sm font-semibold text-gray-600 flex items-center gap-1">
            <Store size={isMobile ? 12 : 14} className="text-[#f85606]" />
            চলমান অফার
          </h2>
          <span className="text-[10px] md:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {banners.length} টি দোকান
          </span>
        </div>

        {/* ব্যানার গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          {banners.map(banner => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              className={`relative bg-gradient-to-r ${banner.bannerColor} rounded-xl md:rounded-2xl shadow-md hover:shadow-lg cursor-pointer transform active:scale-[0.99] md:hover:scale-[1.01] transition-all duration-200 overflow-hidden`}
            >
              {/* সাইনবোর্ড বর্ডার */}
              <div className="absolute inset-0 border-2 md:border-4 border-white/20 rounded-xl md:rounded-2xl pointer-events-none"></div>
              
              {/* LED লাইট ইফেক্ট */}
              <div className="absolute top-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 animate-pulse"></div>
              
              <div className="relative p-3 md:p-4 text-white">
                {/* দোকানের নাম */}
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-inner border border-white/30 flex-shrink-0">
                    {banner.shopLogo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5 md:gap-1 flex-wrap">
                      <Store size={isMobile ? 12 : 14} className="opacity-80 flex-shrink-0" />
                      <h2 className="text-sm md:text-base font-black tracking-wide truncate">{banner.shopName}</h2>
                      {banner.priority === 'high' && <BadgeCheck size={isMobile ? 12 : 14} className="text-yellow-300 flex-shrink-0" />}
                    </div>
                    <p className="text-[10px] md:text-xs opacity-90 flex items-center gap-0.5 truncate">
                      <MapPin size={isMobile ? 10 : 12} className="flex-shrink-0" /> 
                      <span className="truncate">{banner.contactLocation}</span>
                    </p>
                  </div>
                </div>
                
                {/* অফার টাইটেল */}
                <div className="bg-black/20 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 text-center border border-white/20">
                  <p className="text-base md:text-xl font-black tracking-wide drop-shadow-lg leading-tight">
                    {banner.offerTitle}
                  </p>
                  <p className="text-sm md:text-base font-bold mt-0.5 md:mt-1">
                    {banner.description}
                  </p>
                </div>
                
                {/* ফুটার */}
                <div className="flex items-center justify-between mt-2 md:mt-3 text-[9px] md:text-xs opacity-80">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="flex items-center gap-0.5"><Eye size={isMobile ? 10 : 12} /> {banner.views}</span>
                    <span className="flex items-center gap-0.5"><Clock size={isMobile ? 10 : 12} /> {getDaysLeft(banner.validUntil)} দিন</span>
                  </div>
                  {banner.discountCode && (
                    <div className="flex items-center gap-0.5 bg-white/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                      <Tag size={isMobile ? 10 : 12} />
                      <span className="font-mono font-bold text-[9px] md:text-xs">{banner.discountCode}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* হট ডিল ব্যাজ */}
              {banner.priority === 'high' && (
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-10">
                  <div className="bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg animate-bounce border border-white">
                    🔥 হট
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* খালি অবস্থা */}
        {banners.length === 0 && (
          <div className="text-center py-10 md:py-16">
            <div className="text-4xl md:text-6xl mb-2 md:mb-4">🏪</div>
            <p className="text-gray-500 text-sm md:text-base">এই মুহূর্তে কোন অফার নেই</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">পরে আবার চেক করুন</p>
          </div>
        )}
      </div>

      {/* বিস্তারিত মডাল */}
      {selectedBanner && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setSelectedBanner(null)}
        >
          <div 
            className={`bg-white ${isMobile ? 'rounded-t-3xl w-full' : 'rounded-2xl max-w-lg w-full'} max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200`}
            onClick={e => e.stopPropagation()}
          >
            {/* দোকানের ব্যানার */}
            <div className={`bg-gradient-to-r ${selectedBanner.bannerColor} text-white p-4 md:p-5 ${isMobile ? 'rounded-t-3xl' : 'rounded-t-2xl'}`}>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl md:text-5xl border-2 border-white/30 flex-shrink-0">
                  {selectedBanner.shopLogo}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-2xl font-black truncate">{selectedBanner.shopName}</h2>
                  <p className="opacity-90 text-xs md:text-sm flex items-center gap-1 mt-0.5">
                    <MapPin size={isMobile ? 12 : 14} className="flex-shrink-0" /> 
                    <span className="truncate">{selectedBanner.contactLocation}</span>
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-4 bg-black/20 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center">
                <p className="text-lg md:text-xl font-black">{selectedBanner.offerTitle}</p>
                <p className="text-base md:text-lg font-bold">{selectedBanner.description}</p>
              </div>
            </div>
            
            <div className="p-4 md:p-5">
              <p className="text-sm md:text-base text-gray-600 mb-4">{selectedBanner.offerDetails}</p>
              
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4">
                <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-2 md:mb-3">📞 যোগাযোগ</h4>
                <div className="space-y-1.5 md:space-y-2">
                  <p className="flex items-center gap-2 text-xs md:text-sm">
                    <Phone size={isMobile ? 14 : 16} className="text-[#f85606] flex-shrink-0" />
                    <span className="truncate">{selectedBanner.contactName} - {selectedBanner.contactPhone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs md:text-sm">
                    <Mail size={isMobile ? 14 : 16} className="text-[#f85606] flex-shrink-0" />
                    <span className="truncate">{selectedBanner.contactEmail}</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs md:text-sm">
                    <Clock size={isMobile ? 14 : 16} className="text-[#f85606] flex-shrink-0" />
                    মেয়াদ: {getDaysLeft(selectedBanner.validUntil)} দিন বাকি
                  </p>
                  {selectedBanner.discountCode && (
                    <p className="flex items-center gap-2 text-xs md:text-sm">
                      <Tag size={isMobile ? 14 : 16} className="text-[#f85606] flex-shrink-0" />
                      কোড: <span className="font-mono font-bold">{selectedBanner.discountCode}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <a href={`tel:${selectedBanner.contactPhone}`} className="flex-1 bg-[#f85606] text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                  <Phone size={isMobile ? 16 : 18} /> কল করুন
                </a>
                <a href={`https://wa.me/${selectedBanner.contactPhone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-1 bg-green-500 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.55 4.115 1.515 5.85L0 24l6.33-1.655A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                  হোয়াটসঅ্যাপ
                </a>
              </div>
              
              <button onClick={() => setSelectedBanner(null)} className="w-full mt-3 bg-gray-200 text-gray-700 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base">
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}