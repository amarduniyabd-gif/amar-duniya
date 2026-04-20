"use client";
import { useState, useEffect } from "react";
import { 
  Phone, Mail, MapPin, X, Sparkles,
  Clock, Eye, TrendingUp, Gift, Tag, Calendar
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
  clicks: number;
  status: 'active' | 'inactive';
};

const offerAnimationUrl = "https://assets10.lottiefiles.com/packages/lf20_5ngs2ksb.json";

export default function OfferZonePage() {
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(offerAnimationUrl)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.log('Animation load failed:', err));
  }, []);

  useEffect(() => {
    const savedBanners = localStorage.getItem("offerBanners");
    if (savedBanners) {
      const activeBanners = JSON.parse(savedBanners).filter((b: OfferBanner) => b.status === 'active');
      setBanners(activeBanners);
    } else {
      const defaultBanners: OfferBanner[] = Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        title: `স্পেশাল অফার ${i + 1}`,
        description: `${50 - i}% পর্যন্ত ছাড়`,
        image: "🎁",
        contactName: "অফার টিম",
        contactPhone: "017XXXXXXXX",
        contactEmail: "offer@amarduniya.com",
        contactLocation: "ঢাকা, বাংলাদেশ",
        offerDetails: `সব পণ্যে বিশেষ ছাড়! ${i + 1} দিনের জন্য।`,
        validUntil: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
        discountCode: `OFFER${i + 1}`,
        priority: i < 5 ? 'high' : i < 10 ? 'medium' : 'low',
        views: Math.floor(Math.random() * 1000),
        clicks: Math.floor(Math.random() * 500),
        status: 'active',
      }));
      setBanners(defaultBanners);
      localStorage.setItem("offerBanners", JSON.stringify(defaultBanners));
    }
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

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-200 bg-white';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="text-center">
          {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 150, height: 150 }} />}
          <p className="text-gray-500 mt-4">অফার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* হিরো সেকশন */}
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">সেরা ডিল</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-3">🎁 অফার জোন</h1>
              <p className="text-lg opacity-90 mb-6">সেরা ডিল ও বিশেষ ছাড় - শুধু আপনার জন্য</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm"><Tag size={16} /> ৫০% পর্যন্ত ছাড়</div>
                <div className="flex items-center gap-2 text-sm"><Clock size={16} /> সীমিত সময়ের অফার</div>
                <div className="flex items-center gap-2 text-sm"><Gift size={16} /> ফ্রি ডেলিভারি</div>
              </div>
            </div>
            
            <div className="w-48 h-48 md:w-64 md:h-64">
              {animationData && <Lottie animationData={animationData} loop={true} />}
            </div>
          </div>
        </div>
      </div>

      {/* ফিল্টার */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#f85606]" />
            চলমান অফার ({filteredBanners.length})
          </h2>
          
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'সব', color: 'bg-gray-500' },
              { id: 'high', label: 'হট ডিল', color: 'bg-red-500' },
              { id: 'medium', label: 'জনপ্রিয়', color: 'bg-yellow-500' },
              { id: 'low', label: 'নিয়মিত', color: 'bg-green-500' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterPriority(filter.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filterPriority === filter.id
                    ? `${filter.color} text-white`
                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ব্যানার গ্রিড */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredBanners.map(banner => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner)}
              className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 ${getPriorityColor(banner.priority)}`}
            >
              {banner.priority === 'high' && (
                <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full z-10 animate-pulse">
                  🔥 হট
                </div>
              )}
              
              <div className="h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-t-xl flex items-center justify-center text-5xl">
                {banner.image}
              </div>
              
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{banner.title}</h3>
                <p className="text-xs text-[#f85606] font-semibold mt-1">{banner.description}</p>
                
                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><Eye size={10} /> {banner.views}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {getDaysLeft(banner.validUntil)} দিন</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredBanners.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-500">কোনো অফার পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* বিস্তারিত তথ্য প্যানেল - ফিক্সড */}
      {selectedBanner && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBanner(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Gift size={20} /> অফার বিস্তারিত
              </h3>
              <button onClick={() => setSelectedBanner(null)} className="p-1 hover:bg-white/20 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                  {selectedBanner.image}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{selectedBanner.title}</h2>
                  <p className="text-[#f85606] font-semibold mt-1">{selectedBanner.description}</p>
                  {selectedBanner.discountCode && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                      <Tag size={14} className="text-[#f85606]" />
                      <span className="font-mono font-bold text-sm">{selectedBanner.discountCode}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{selectedBanner.offerDetails}</p>
              
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
                    <MapPin size={14} className="text-[#f85606]" />
                    {selectedBanner.contactLocation}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-[#f85606]" />
                    মেয়াদ: {new Date(selectedBanner.validUntil).toLocaleDateString('bn-BD')} ({getDaysLeft(selectedBanner.validUntil)} দিন বাকি)
                  </p>
                </div>
              </div>
              
              {/* 🔥 বাটন সেকশন - ফিক্সড */}
              <div className="space-y-2">
                <button 
                  onClick={() => handleCall(selectedBanner.contactPhone)}
                  className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
                >
                  <Phone size={18} /> কল করুন
                </button>
                <button 
                  onClick={() => handleWhatsApp(selectedBanner.contactPhone)}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.55 4.115 1.515 5.85L0 24l6.33-1.655A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                  হোয়াটসঅ্যাপ
                </button>
                {/* 🔥 বাতিল বাটন - এখন স্পষ্ট দেখা যাবে */}
                <button 
                  onClick={() => setSelectedBanner(null)}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  বাতিল করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}