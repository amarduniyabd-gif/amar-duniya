"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, X, Sparkles,
  Clock, Eye, Gift, Tag,
  Store, Megaphone, BadgeCheck
} from "lucide-react";

type OfferBanner = {
  id: number;
  shopName: string;
  offerTitle: string;
  description: string;
  bannerColor: string;
  shopLogo: string;
  contactName: string;
  contactPhone: string;
  contactLocation: string;
  offerDetails: string;
  validUntil: string;
  discountCode?: string;
  priority: 'high' | 'medium' | 'low';
  views: number;
  status: 'active' | 'inactive';
};

// স্ট্যাটিক ডাটা - ল্যাগ কমাতে
const defaultBanners: OfferBanner[] = [
  {
    id: 1, shopName: "আলিফ ইলেকট্রনিক্স", offerTitle: "৫০% ছাড়", 
    description: "সব ইলেকট্রনিক্সে", bannerColor: "from-blue-600 to-cyan-500",
    shopLogo: "📱", contactName: "আলিফ", contactPhone: "017XXXXXXXX",
    contactLocation: "কুষ্টিয়া শহর", offerDetails: "iPhone, Samsung, TV, AC সব পণ্যে।",
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    discountCode: "ALIF50", priority: 'high', views: 450, status: 'active',
  },
  {
    id: 2, shopName: "কুষ্টিয়া ফ্যাশন", offerTitle: "৩০% ছাড়", 
    description: "সব পোশাকে", bannerColor: "from-pink-600 to-rose-500",
    shopLogo: "👗", contactName: "রহিমা", contactPhone: "018XXXXXXXX",
    contactLocation: "কুষ্টিয়া বাজার", offerDetails: "শাড়ি, থ্রি-পিস, শার্ট, প্যান্ট সহ।",
    validUntil: new Date(Date.now() + 5 * 86400000).toISOString(),
    priority: 'high', views: 320, status: 'active',
  },
  {
    id: 3, shopName: "দেশি বাজার", offerTitle: "২০% ছাড়", 
    description: "নিত্যপ্রয়োজনীয়", bannerColor: "from-green-600 to-emerald-500",
    shopLogo: "🛒", contactName: "করিম", contactPhone: "019XXXXXXXX",
    contactLocation: "কুষ্টিয়া সদর", offerDetails: "চাল, ডাল, তেল, চিনি সহ।",
    validUntil: new Date(Date.now() + 10 * 86400000).toISOString(),
    priority: 'medium', views: 280, status: 'active',
  },
  {
    id: 4, shopName: "মোবাইল হাট", offerTitle: "ফ্রি accessories", 
    description: "স্মার্টফোন কিনলে", bannerColor: "from-purple-600 to-violet-500",
    shopLogo: "📲", contactName: "সোহেল", contactPhone: "016XXXXXXXX",
    contactLocation: "মোবাইল মার্কেট", offerDetails: "ফ্রি charger, earphone ও cover!",
    validUntil: new Date(Date.now() + 3 * 86400000).toISOString(),
    discountCode: "MOBILE10", priority: 'high', views: 510, status: 'active',
  },
  {
    id: 5, shopName: "হোম স্টোর", offerTitle: "৪০% ছাড়", 
    description: "ফার্নিচারে", bannerColor: "from-amber-600 to-orange-500",
    shopLogo: "🏠", contactName: "রাশেদ", contactPhone: "015XXXXXXXX",
    contactLocation: "স্টেশন রোড", offerDetails: "সব ফার্নিচার ও গৃহসজ্জায় ছাড়!",
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
    priority: 'medium', views: 190, status: 'active',
  },
  {
    id: 6, shopName: "গিফট শপ", offerTitle: "Buy 1 Get 1", 
    description: "সব গিফটে", bannerColor: "from-red-600 to-pink-500",
    shopLogo: "🎁", contactName: "নাদিয়া", contactPhone: "017XXXXXXXX",
    contactLocation: "কলেজ রোড", offerDetails: "সব ধরনের গিফট আইটেমে Buy 1 Get 1 Free!",
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    priority: 'high', views: 620, status: 'active',
  },
];

export default function OfferZonePage() {
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [banners, setBanners] = useState<OfferBanner[]>(defaultBanners);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedBanners = localStorage.getItem("offerBanners");
    if (savedBanners) {
      try {
        const parsed = JSON.parse(savedBanners);
        const active = parsed.filter((b: OfferBanner) => b.status === 'active');
        if (active.length > 0) setBanners(active);
      } catch {}
    }
    setLoading(false);
  }, []);

  const handleBannerClick = (banner: OfferBanner) => {
    setSelectedBanner(banner);
    const updated = banners.map(b => b.id === banner.id ? { ...b, views: b.views + 1 } : b);
    setBanners(updated);
    localStorage.setItem("offerBanners", JSON.stringify(updated));
  };

  const getDaysLeft = (validUntil: string) => {
    const diff = Math.ceil((new Date(validUntil).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#f85606] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* হেডার - সিম্পল */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Megaphone size={20} />
            <div>
              <h1 className="text-lg font-black">অফার জোন</h1>
              <p className="text-[10px] opacity-90">কুষ্টিয়ার দোকানগুলোর সেরা অফার</p>
            </div>
          </div>
        </div>
      </div>

      {/* ৩ কলাম গ্রিড - অপটিমাইজড */}
      <div className="max-w-6xl mx-auto px-2 py-3">
        {/* স্ট্যাটাস */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-xs font-semibold text-gray-600 flex items-center gap-1">
            <Store size={12} className="text-[#f85606]" /> চলমান অফার
          </h2>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {banners.length} টি
          </span>
        </div>

        {/* ৩ কলাম গ্রিড - মোবাইল: ২ কলাম, md: ৩ কলাম, lg: ৪ কলাম */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {banners.map(banner => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              className={`relative bg-gradient-to-br ${banner.bannerColor} rounded-xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer overflow-hidden`}
            >
              {/* কন্টেন্ট */}
              <div className="p-2.5 text-white">
                {/* লোগো + নাম */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-lg">{banner.shopLogo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black truncate">{banner.shopName}</p>
                    <p className="text-[8px] opacity-80 truncate flex items-center gap-0.5">
                      <MapPin size={8} /> {banner.contactLocation}
                    </p>
                  </div>
                </div>
                
                {/* অফার */}
                <div className="bg-black/20 rounded-lg p-1.5 text-center">
                  <p className="text-sm font-black">{banner.offerTitle}</p>
                  <p className="text-[10px] font-medium">{banner.description}</p>
                </div>
                
                {/* ফুটার */}
                <div className="flex items-center justify-between mt-1.5 text-[8px] opacity-80">
                  <span className="flex items-center gap-0.5"><Eye size={8} /> {banner.views}</span>
                  <span className="flex items-center gap-0.5"><Clock size={8} /> {getDaysLeft(banner.validUntil)}d</span>
                  {banner.discountCode && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono">{banner.discountCode}</span>
                  )}
                </div>
              </div>
              
              {/* হট ব্যাজ */}
              {banner.priority === 'high' && (
                <div className="absolute -top-1 -right-1">
                  <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full border border-white">🔥</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* খালি */}
        {banners.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">🏪</div>
            <p className="text-gray-500 text-sm">কোন অফার নেই</p>
          </div>
        )}
      </div>

      {/* মডাল - সিম্পল */}
      {selectedBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" onClick={() => setSelectedBanner(null)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${selectedBanner.bannerColor} text-white p-4`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedBanner.shopLogo}</span>
                <div>
                  <h2 className="text-xl font-black">{selectedBanner.shopName}</h2>
                  <p className="text-xs opacity-90 flex items-center gap-1"><MapPin size={12} /> {selectedBanner.contactLocation}</p>
                </div>
              </div>
              <div className="mt-3 bg-black/20 rounded-lg p-3 text-center">
                <p className="text-lg font-black">{selectedBanner.offerTitle}</p>
                <p className="text-base font-bold">{selectedBanner.description}</p>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">{selectedBanner.offerDetails}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="font-semibold text-sm mb-2">📞 যোগাযোগ</p>
                <p className="text-xs flex items-center gap-2"><Phone size={12} className="text-[#f85606]" /> {selectedBanner.contactPhone}</p>
                <p className="text-xs mt-1 flex items-center gap-2"><Clock size={12} className="text-[#f85606]" /> {getDaysLeft(selectedBanner.validUntil)} দিন বাকি</p>
              </div>
              
              <div className="flex gap-2">
                <a href={`tel:${selectedBanner.contactPhone}`} className="flex-1 bg-[#f85606] text-white py-2.5 rounded-lg text-sm font-semibold text-center">📞 কল</a>
                <a href={`https://wa.me/${selectedBanner.contactPhone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-1 bg-green-500 text-white py-2.5 rounded-lg text-sm font-semibold text-center">💬 WhatsApp</a>
              </div>
              <button onClick={() => setSelectedBanner(null)} className="w-full mt-2 bg-gray-200 py-2.5 rounded-lg text-sm">বন্ধ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}