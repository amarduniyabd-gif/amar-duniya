"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, X, Sparkles,
  Clock, Eye, Gift, Tag, Store, Megaphone,
  ShoppingBag, Package
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

type Product = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  shopName: string;
  discount?: number;
};

// Lottie অ্যানিমেশন
const offerAnimationUrl = "https://assets10.lottiefiles.com/packages/lf20_5ngs2ksb.json";

// দোকানের ব্যানার ডাটা
const defaultBanners: OfferBanner[] = [
  { id: 1, shopName: "আলিফ ইলেকট্রনিক্স", offerTitle: "৫০% পর্যন্ত ছাড়", description: "সব ইলেকট্রনিক্সে", bannerColor: "from-blue-600 to-cyan-500", shopLogo: "📱", contactName: "আলিফ", contactPhone: "017XXXXXXXX", contactEmail: "alif@shop.com", contactLocation: "কুষ্টিয়া শহর", offerDetails: "iPhone, Samsung, TV, AC সব পণ্যে বিশেষ ছাড়!", validUntil: new Date(Date.now() + 7*86400000).toISOString(), discountCode: "ALIF50", priority: 'high', views: 450, status: 'active' },
  { id: 2, shopName: "কুষ্টিয়া ফ্যাশন", offerTitle: "৩০% পর্যন্ত ছাড়", description: "সব পোশাকে", bannerColor: "from-pink-600 to-rose-500", shopLogo: "👗", contactName: "রহিমা", contactPhone: "018XXXXXXXX", contactEmail: "fashion@shop.com", contactLocation: "কুষ্টিয়া বাজার", offerDetails: "শাড়ি, থ্রি-পিস, শার্ট, প্যান্ট সহ সব পোশাকে ছাড়!", validUntil: new Date(Date.now() + 5*86400000).toISOString(), priority: 'high', views: 320, status: 'active' },
  { id: 3, shopName: "দেশি বাজার", offerTitle: "২০% পর্যন্ত ছাড়", description: "নিত্যপ্রয়োজনীয়", bannerColor: "from-green-600 to-emerald-500", shopLogo: "🛒", contactName: "করিম", contactPhone: "019XXXXXXXX", contactEmail: "bazar@shop.com", contactLocation: "কুষ্টিয়া সদর", offerDetails: "চাল, ডাল, তেল, চিনি সহ সব নিত্যপ্রয়োজনীয় পণ্যে ছাড়!", validUntil: new Date(Date.now() + 10*86400000).toISOString(), priority: 'medium', views: 280, status: 'active' },
  { id: 4, shopName: "মোবাইল হাট", offerTitle: "ফ্রি accessories", description: "স্মার্টফোন কিনলে", bannerColor: "from-purple-600 to-violet-500", shopLogo: "📲", contactName: "সোহেল", contactPhone: "016XXXXXXXX", contactEmail: "mobile@shop.com", contactLocation: "মোবাইল মার্কেট", offerDetails: "যেকোনো স্মার্টফোন কিনলে ফ্রি charger, earphone ও cover!", validUntil: new Date(Date.now() + 3*86400000).toISOString(), discountCode: "MOBILE10", priority: 'high', views: 510, status: 'active' },
  { id: 5, shopName: "হোম স্টোর", offerTitle: "৪০% পর্যন্ত ছাড়", description: "ফার্নিচারে", bannerColor: "from-amber-600 to-orange-500", shopLogo: "🏠", contactName: "রাশেদ", contactPhone: "015XXXXXXXX", contactEmail: "home@shop.com", contactLocation: "স্টেশন রোড", offerDetails: "সব ফার্নিচার ও গৃহসজ্জায় ছাড়!", validUntil: new Date(Date.now() + 15*86400000).toISOString(), priority: 'medium', views: 190, status: 'active' },
  { id: 6, shopName: "গিফট শপ", offerTitle: "Buy 1 Get 1", description: "সব গিফটে", bannerColor: "from-red-600 to-pink-500", shopLogo: "🎁", contactName: "নাদিয়া", contactPhone: "017XXXXXXXX", contactEmail: "gift@shop.com", contactLocation: "কলেজ রোড", offerDetails: "সব ধরনের গিফট আইটেমে Buy 1 Get 1 Free!", validUntil: new Date(Date.now() + 7*86400000).toISOString(), priority: 'high', views: 620, status: 'active' },
  { id: 7, shopName: "বুক সেন্টার", offerTitle: "৩০% ছাড়", description: "সব বইয়ে", bannerColor: "from-indigo-600 to-blue-500", shopLogo: "📚", contactName: "রফিক", contactPhone: "017XXXXXXXX", contactEmail: "book@shop.com", contactLocation: "কলেজ রোড", offerDetails: "পাঠ্যবই, গল্প, উপন্যাস সব বইয়ে ছাড়!", validUntil: new Date(Date.now() + 12*86400000).toISOString(), priority: 'medium', views: 150, status: 'active' },
  { id: 8, shopName: "জুয়েলার্স", offerTitle: "মেকিং চার্জ ফ্রি", description: "সব গহনায়", bannerColor: "from-yellow-600 to-amber-500", shopLogo: "💍", contactName: "জুয়েল", contactPhone: "018XXXXXXXX", contactEmail: "jewel@shop.com", contactLocation: "বাজার মোড়", offerDetails: "সোনা, রূপার গহনায় মেকিং চার্জ সম্পূর্ণ ফ্রি!", validUntil: new Date(Date.now() + 10*86400000).toISOString(), discountCode: "JEWEL20", priority: 'high', views: 380, status: 'active' },
  { id: 9, shopName: "কসমেটিকস", offerTitle: "Buy 2 Get 1", description: "সব কসমেটিকসে", bannerColor: "from-pink-500 to-rose-400", shopLogo: "💄", contactName: "শারমিন", contactPhone: "019XXXXXXXX", contactEmail: "cosmetic@shop.com", contactLocation: "স্টেডিয়াম মার্কেট", offerDetails: "সব ধরনের কসমেটিকস পণ্যে Buy 2 Get 1 Free!", validUntil: new Date(Date.now() + 6*86400000).toISOString(), priority: 'high', views: 520, status: 'active' },
  { id: 10, shopName: "ফুটওয়্যার", offerTitle: "৫০০ টাকা ছাড়", description: "২০০০+ টাকায়", bannerColor: "from-orange-600 to-red-500", shopLogo: "👟", contactName: "সজিব", contactPhone: "016XXXXXXXX", contactEmail: "shoe@shop.com", contactLocation: "বড় বাজার", offerDetails: "২০০০ টাকার বেশি কেনাকাটায় ৫০০ টাকা ছাড়!", validUntil: new Date(Date.now() + 8*86400000).toISOString(), discountCode: "SHOE500", priority: 'medium', views: 290, status: 'active' },
  { id: 11, shopName: "হার্ডওয়্যার", offerTitle: "১০% এক্সট্রা", description: "সব টুলসে", bannerColor: "from-gray-700 to-gray-600", shopLogo: "🔧", contactName: "মনির", contactPhone: "017XXXXXXXX", contactEmail: "hardware@shop.com", contactLocation: "থানা রোড", offerDetails: "সব ধরনের হার্ডওয়্যার টুলস ও ম্যাটেরিয়ালসে ১০% এক্সট্রা ছাড়!", validUntil: new Date(Date.now() + 14*86400000).toISOString(), priority: 'low', views: 110, status: 'active' },
  { id: 12, shopName: "টয় শপ", offerTitle: "২০-৫০% ছাড়", description: "সব খেলনায়", bannerColor: "from-blue-400 to-cyan-300", shopLogo: "🧸", contactName: "মিতা", contactPhone: "015XXXXXXXX", contactEmail: "toy@shop.com", contactLocation: "পার্ক রোড", offerDetails: "বাচ্চাদের সব ধরনের খেলনায় ২০-৫০% পর্যন্ত ছাড়!", validUntil: new Date(Date.now() + 9*86400000).toISOString(), priority: 'medium', views: 340, status: 'active' },
];

// প্রোডাক্ট ডাটা
const defaultProducts: Product[] = [
  { id: 1, title: "iPhone 15 Pro Max", price: 75000, originalPrice: 85000, image: "📱", shopName: "আলিফ ইলেকট্রনিক্স", discount: 12 },
  { id: 2, title: "Samsung 4K TV", price: 45000, originalPrice: 60000, image: "📺", shopName: "আলিফ ইলেকট্রনিক্স", discount: 25 },
  { id: 3, title: "Nike Air Max", price: 8500, originalPrice: 12000, image: "👟", shopName: "ফুটওয়্যার", discount: 30 },
  { id: 4, title: "শাড়ি - সিল্ক", price: 3500, originalPrice: 5000, image: "🥻", shopName: "কুষ্টিয়া ফ্যাশন", discount: 30 },
  { id: 5, title: "চাল ২৫ কেজি", price: 1600, originalPrice: 1800, image: "🍚", shopName: "দেশি বাজার", discount: 11 },
  { id: 6, title: "Power Bank 20000mAh", price: 1200, originalPrice: 1800, image: "🔋", shopName: "মোবাইল হাট", discount: 33 },
];

export default function OfferZonePage() {
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [banners, setBanners] = useState<OfferBanner[]>(defaultBanners);
  const [products] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(offerAnimationUrl)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => {});
      
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* হেডার */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone size={24} />
              <div>
                <h1 className="text-xl font-black">অফার জোন</h1>
                <p className="text-xs opacity-90">কুষ্টিয়ার সেরা ডিল</p>
              </div>
            </div>
            {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 50, height: 50 }} />}
          </div>
        </div>
      </div>

      {/* দোকানের ব্যানার - ২ কলাম (মোবাইল), ৪ কলাম (PC) */}
      <div className="max-w-6xl mx-auto px-3 py-4">
        <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Store size={16} className="text-[#f85606]" /> দোকানের অফার
        </h2>
        
        {/* স্ক্রলেবল এরিয়া - মোবাইলে ২০টি ব্যানার দেখানোর জন্য */}
        <div className="overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
          <div className="grid grid-flow-col auto-cols-[160px] sm:auto-cols-[180px] md:grid-cols-3 lg:grid-cols-4 gap-3">
            {banners.slice(0, 20).map(banner => (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className={`relative bg-gradient-to-br ${banner.bannerColor} rounded-xl shadow-md cursor-pointer active:scale-[0.98] transition-transform overflow-hidden flex-shrink-0`}
              >
                <div className="p-3 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{banner.shopLogo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate">{banner.shopName}</p>
                      <p className="text-[9px] opacity-80 truncate">{banner.contactLocation}</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-2 text-center">
                    <p className="text-sm font-black">{banner.offerTitle}</p>
                    <p className="text-[10px] font-medium">{banner.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-[9px] opacity-80">
                    <span className="flex items-center gap-0.5"><Eye size={9} /> {banner.views}</span>
                    <span className="flex items-center gap-0.5"><Clock size={9} /> {getDaysLeft(banner.validUntil)}d</span>
                    {banner.discountCode && <span className="bg-white/20 px-1.5 py-0.5 rounded">{banner.discountCode}</span>}
                  </div>
                </div>
                
                {banner.priority === 'high' && (
                  <div className="absolute -top-1 -right-1">
                    <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">🔥</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* প্রোডাক্ট সেকশন */}
      <div className="max-w-6xl mx-auto px-3 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#f85606]" /> ট্রেন্ডিং প্রোডাক্ট
          </h2>
          <Link href="/category/offer" className="text-[10px] text-[#f85606]">সব দেখুন →</Link>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {products.map(product => (
            <Link key={product.id} href={`/post/${product.id}`}>
              <div className="bg-white rounded-lg shadow-sm border p-2 hover:shadow-md transition">
                <div className="text-2xl text-center mb-1">{product.image}</div>
                <h3 className="text-[10px] font-medium line-clamp-1">{product.title}</h3>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs font-bold text-[#f85606]">৳{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[8px] text-gray-400 line-through">৳{product.originalPrice}</span>
                  )}
                </div>
                <p className="text-[8px] text-gray-400 truncate">{product.shopName}</p>
                {product.discount && (
                  <span className="text-[8px] bg-red-100 text-red-600 px-1 rounded">-{product.discount}%</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* বিস্তারিত মডাল */}
      {selectedBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center" onClick={() => setSelectedBanner(null)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${selectedBanner.bannerColor} text-white p-4`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedBanner.shopLogo}</span>
                <div>
                  <h2 className="text-xl font-black">{selectedBanner.shopName}</h2>
                  <p className="text-xs opacity-90">{selectedBanner.contactLocation}</p>
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
                <p className="text-xs flex items-center gap-2"><Mail size={12} className="text-[#f85606]" /> {selectedBanner.contactEmail}</p>
                <p className="text-xs flex items-center gap-2 mt-1"><Clock size={12} className="text-[#f85606]" /> {getDaysLeft(selectedBanner.validUntil)} দিন বাকি</p>
                {selectedBanner.discountCode && (
                  <p className="text-xs flex items-center gap-2 mt-1"><Tag size={12} className="text-[#f85606]" /> কোড: {selectedBanner.discountCode}</p>
                )}
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

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}