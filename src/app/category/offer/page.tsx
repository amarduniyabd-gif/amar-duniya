"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, X, Sparkles,
  Clock, Eye, TrendingUp, Gift, Tag,
  Store, Package, Shirt, Coffee, Smartphone,
  ShoppingBag, AlertCircle
} from "lucide-react";
import Lottie from "lottie-react";

type OfferBanner = {
  id: number;
  title: string;
  description: string;
  image: string;
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

// প্রোডাক্ট টাইপ
type Product = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  shopName: string;
  location: string;
  discount?: number;
  soldCount?: number;
};

// Lottie অ্যানিমেশন
const offerAnimationUrl = "https://assets10.lottiefiles.com/packages/lf20_5ngs2ksb.json";
const loadingAnimationUrl = "https://assets3.lottiefiles.com/packages/lf20_p8bfn5to.json";

export default function OfferZonePage() {
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [animationData, setAnimationData] = useState(null);
  const [loadingAnimData, setLoadingAnimData] = useState(null);

  // Lottie অ্যানিমেশন লোড
  useEffect(() => {
    fetch(offerAnimationUrl)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.log('Animation load failed:', err));
      
    fetch(loadingAnimationUrl)
      .then(res => res.json())
      .then(data => setLoadingAnimData(data))
      .catch(err => console.log('Loading animation failed:', err));
  }, []);

  // ডামি প্রোডাক্ট জেনারেটর
  const generateProducts = (): Product[] => {
    const shops = ["আলিফ ইলেকট্রনিক্স", "কুষ্টিয়া ফ্যাশন", "দেশি বাজার", "মোবাইল হাট", "হোম স্টোর", "গিফট শপ"];
    const locations = ["কুষ্টিয়া", "কুমারখালী", "খোকসা", "মিরপুর", "ভেড়ামারা", "দৌলতপুর"];
    const images = ["📱", "💻", "👕", "👗", "🛋️", "🎁", "⌚", "👟", "👜", "📺", "🎮", "📷"];
    const titles = ["iPhone 15 Pro", "Samsung TV", "Nike Shoes", "Leather Bag", "Smart Watch", 
                    "Headphones", "Gaming Chair", "Camera", "Laptop", "Tablet", "Speaker", "Router"];
    
    return Array(12).fill(null).map((_, i) => ({
      id: i + 1,
      title: titles[i],
      price: Math.floor(Math.random() * 50000) + 500,
      originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 70000) + 1000 : undefined,
      image: images[i],
      shopName: shops[Math.floor(Math.random() * shops.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      discount: Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 10 : undefined,
      soldCount: Math.floor(Math.random() * 500),
    }));
  };

  // ব্যানার ও প্রোডাক্ট লোড
  useEffect(() => {
    const savedBanners = localStorage.getItem("offerBanners");
    if (savedBanners) {
      const activeBanners = JSON.parse(savedBanners).filter((b: OfferBanner) => b.status === 'active');
      setBanners(activeBanners);
    } else {
      const defaultBanners: OfferBanner[] = Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: `কুষ্টিয়া স্পেশাল ${i + 1}`,
        description: `${50 - i * 5}% পর্যন্ত ছাড়`,
        image: "🎁",
        contactName: "অফার টিম",
        contactPhone: "017XXXXXXXX",
        contactEmail: "offer@amarduniya.com",
        contactLocation: "কুষ্টিয়া",
        offerDetails: `কুষ্টিয়ার জন্য বিশেষ ছাড়!`,
        validUntil: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
        discountCode: `KUSHTIA${i + 1}`,
        priority: i < 3 ? 'high' : i < 6 ? 'medium' : 'low',
        views: Math.floor(Math.random() * 500),
        status: 'active',
      }));
      setBanners(defaultBanners);
      localStorage.setItem("offerBanners", JSON.stringify(defaultBanners));
    }
    
    setProducts(generateProducts());
    setLoading(false);
  }, []);

  const filteredBanners = filterPriority === 'all' 
    ? banners 
    : banners.filter(b => b.priority === filterPriority);

  const handleBannerClick = (banner: OfferBanner) => {
    setSelectedBanner(banner);
    const updatedBanners = banners.map(b => 
      b.id === banner.id ? { ...b, views: b.views + 1 } : b
    );
    setBanners(updatedBanners);
    localStorage.setItem("offerBanners", JSON.stringify(updatedBanners));
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'medium': return 'border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white';
      case 'low': return 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white';
      default: return 'border-l-4 border-l-gray-300 bg-white';
    }
  };

  const getDaysLeft = (validUntil: string) => {
    const end = new Date(validUntil).getTime();
    const now = Date.now();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        {loadingAnimData && (
          <Lottie animationData={loadingAnimData} loop={true} style={{ width: 200, height: 200 }} />
        )}
        <p className="text-gray-500 mt-2 animate-pulse">অফার লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* হিরো সেকশন - কমপ্যাক্ট */}
      <div className="relative bg-gradient-to-r from-[#f85606] to-orange-500 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {animationData && (
                <Lottie animationData={animationData} loop={true} style={{ width: 50, height: 50 }} />
              )}
              <div>
                <h1 className="text-xl font-bold flex items-center gap-1">
                  <Gift size={20} /> অফার জোন
                </h1>
                <p className="text-xs opacity-90">কুষ্টিয়ার সেরা ডিল</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                <Clock size={12} />
                <span className="text-xs">সীমিত সময়</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ফিল্টার চিপস - স্ক্রলেবল */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-3 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'সব অফার', icon: '🎯' },
              { id: 'high', label: 'হট ডিল', icon: '🔥' },
              { id: 'medium', label: 'জনপ্রিয়', icon: '⭐' },
              { id: 'low', label: 'নিয়মিত', icon: '✅' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterPriority(filter.id as any)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  filterPriority === filter.id
                    ? 'bg-[#f85606] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{filter.icon}</span> {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-3">
        {/* অফার ব্যানার - হরিজেন্টাল স্ক্রল (মোবাইল ফ্রেন্ডলি) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              <Sparkles size={14} className="text-[#f85606]" />
              বিশেষ অফার
            </h2>
            <span className="text-xs text-gray-400">{filteredBanners.length} টি</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {filteredBanners.map(banner => (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner)}
                className={`flex-shrink-0 w-64 rounded-xl shadow-md cursor-pointer transition hover:shadow-lg ${getPriorityColor(banner.priority)}`}
              >
                <div className="flex items-center gap-3 p-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                    {banner.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-sm text-gray-800 truncate">{banner.title}</h3>
                      {banner.priority === 'high' && <span className="text-xs">🔥</span>}
                    </div>
                    <p className="text-xs text-[#f85606] font-medium">{banner.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1"><Eye size={10} /> {banner.views}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {getDaysLeft(banner.validUntil)} দিন</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* প্রোডাক্ট গ্রিড - ৩ কলাম (Daraz স্টাইল) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              <ShoppingBag size={14} className="text-[#f85606]" />
              ট্রেন্ডিং প্রোডাক্ট
            </h2>
            <Link href="/category/offer" className="text-xs text-[#f85606]">সব দেখুন →</Link>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {products.map(product => (
              <Link key={product.id} href={`/post/${product.id}`}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  {/* প্রোডাক্ট ইমেজ */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-3xl">
                    {product.image}
                    {product.discount && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  
                  {/* প্রোডাক্ট ইনফো */}
                  <div className="p-1.5">
                    <h3 className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    
                    {/* প্রাইস */}
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs font-bold text-[#f85606]">৳{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[8px] text-gray-400 line-through">৳{product.originalPrice}</span>
                      )}
                    </div>
                    
                    {/* শপ ইনফো */}
                    <div className="flex items-center gap-0.5 mt-0.5 text-[7px] text-gray-400">
                      <Store size={7} />
                      <span className="truncate">{product.shopName}</span>
                    </div>
                    
                    {/* সোল্ড + লোকেশন */}
                    <div className="flex items-center justify-between mt-0.5 text-[7px] text-gray-400">
                      <span>{product.location}</span>
                      {product.soldCount && <span>{product.soldCount}+ বিক্রি</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ক্যাটাগরি চিপস */}
        <div className="mt-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {[
              { icon: <Smartphone size={12} />, label: "মোবাইল" },
              { icon: <Shirt size={12} />, label: "ফ্যাশন" },
              { icon: <Package size={12} />, label: "ইলেকট্রনিক্স" },
              { icon: <Store size={12} />, label: "দোকান" },
              { icon: <Coffee size={12} />, label: "খাবার" },
            ].map((cat, i) => (
              <button key={i} className="flex items-center gap-1 bg-white border px-3 py-1.5 rounded-full text-xs whitespace-nowrap shadow-sm">
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* বিস্তারিত প্যানেল - মোবাইল বটম শিট */}
      {selectedBanner && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setSelectedBanner(null)}
        >
          <div 
            className="bg-white rounded-t-2xl md:rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-3 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Gift size={18} /> অফার বিস্তারিত
              </h3>
              <button onClick={() => setSelectedBanner(null)} className="p-1">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-4xl shadow-md">
                  {selectedBanner.image}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedBanner.title}</h2>
                  <p className="text-[#f85606] font-medium">{selectedBanner.description}</p>
                  {selectedBanner.discountCode && (
                    <div className="mt-1 inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                      <Tag size={12} className="text-[#f85606]" />
                      <span className="font-mono text-xs font-bold">{selectedBanner.discountCode}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{selectedBanner.offerDetails}</p>
              
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <h4 className="font-semibold text-sm mb-2">যোগাযোগ</h4>
                <div className="space-y-1.5">
                  <p className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-[#f85606]" />
                    {selectedBanner.contactName} - {selectedBanner.contactPhone}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-[#f85606]" />
                    {selectedBanner.contactEmail}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-[#f85606]" />
                    {selectedBanner.contactLocation}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <a href={`tel:${selectedBanner.contactPhone}`} className="flex-1 bg-[#f85606] text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1">
                  <Phone size={16} /> কল
                </a>
                <a href={`https://wa.me/${selectedBanner.contactPhone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.55 4.115 1.515 5.85L0 24l6.33-1.655A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                  হোয়াটসঅ্যাপ
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}