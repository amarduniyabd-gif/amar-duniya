"use client";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { 
  Phone, Mail, MapPin, X, ExternalLink, Sparkles,
  Clock, Eye, Tag, Gift, Calendar, TrendingUp, Loader2
} from "lucide-react";
import Lottie from "lottie-react";

type OfferBanner = {
  id: string;
  shop_name: string;
  offer_title: string;
  description: string;
  shop_image?: string;
  shop_logo: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  contact_location: string;
  offer_details: string;
  valid_until: string;
  discount_code?: string;
  priority: 'high' | 'medium' | 'low';
  views: number;
  status: 'active' | 'inactive' | 'expired';
  banner_color?: string;
};

// Lottie URL
const OFFER_ANIMATION_URL = "https://assets10.lottiefiles.com/packages/lf20_5ngs2ksb.json";

// হেল্পার ফাংশন
const getDaysLeft = (validUntil: string): number => {
  const end = new Date(validUntil).getTime();
  const now = Date.now();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const getPriorityColor = (priority: string): string => {
  switch(priority) {
    case 'high': return 'border-red-500 bg-red-50';
    case 'medium': return 'border-yellow-500 bg-yellow-50';
    case 'low': return 'border-green-500 bg-green-50';
    default: return 'border-gray-200 bg-white';
  }
};

// ============ ব্যানার কার্ড ============
const BannerCard = memo(({ banner, onClick }: { banner: OfferBanner; onClick: (banner: OfferBanner) => void }) => {
  const daysLeft = useMemo(() => getDaysLeft(banner.valid_until), [banner.valid_until]);
  const priorityColor = useMemo(() => getPriorityColor(banner.priority), [banner.priority]);
  
  return (
    <div onClick={() => onClick(banner)} className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer transform-gpu hover:-translate-y-1 border-2 ${priorityColor}`}>
      {banner.priority === 'high' && <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full z-10">🔥 হট</div>}
      <div className={`h-32 bg-gradient-to-br ${banner.banner_color || 'from-orange-100 to-amber-100'} rounded-t-xl flex items-center justify-center text-5xl overflow-hidden`}>
        {banner.shop_image ? <img src={banner.shop_image} alt={banner.shop_name} className="w-full h-full object-cover" /> : <span>{banner.shop_logo || '🏪'}</span>}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{banner.offer_title}</h3>
        <p className="text-xs text-[#f85606] font-semibold mt-1">{banner.shop_name}</p>
        <p className="text-[10px] text-gray-500 line-clamp-1">{banner.description}</p>
        <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><Eye size={10} /> {banner.views || 0}</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {daysLeft} দিন</span>
        </div>
      </div>
    </div>
  );
});
BannerCard.displayName = 'BannerCard';

// ============ বিস্তারিত মডাল ============
const BannerDetailModal = memo(({ banner, onClose }: { banner: OfferBanner; onClose: () => void }) => {
  const daysLeft = useMemo(() => getDaysLeft(banner.valid_until), [banner.valid_until]);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col transform-gpu" style={{ maxHeight: 'calc(100vh - 40px)' }} onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center flex-shrink-0 rounded-t-2xl">
          <h3 className="font-bold text-lg flex items-center gap-2"><Gift size={20} /> অফার বিস্তারিত</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition active:scale-95"><X size={20} /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-4xl shadow-md flex-shrink-0 overflow-hidden">
              {banner.shop_image ? <img src={banner.shop_image} alt={banner.shop_name} className="w-full h-full object-cover" /> : <span>{banner.shop_logo || '🏪'}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-800">{banner.offer_title}</h2>
              <p className="text-[#f85606] font-semibold text-sm">{banner.shop_name}</p>
              {banner.discount_code && <div className="mt-1 inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg"><Tag size={14} className="text-[#f85606]" /><span className="font-mono font-bold text-sm">{banner.discount_code}</span></div>}
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{banner.offer_details || banner.description}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-1"><span className="w-1 h-4 bg-[#f85606] rounded-full"></span>যোগাযোগের তথ্য</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-3 text-sm"><Phone size={16} className="text-[#f85606] flex-shrink-0" /><span className="text-gray-700">{banner.contact_name} - {banner.contact_phone}</span></p>
              {banner.contact_email && <p className="flex items-center gap-3 text-sm"><Mail size={16} className="text-[#f85606] flex-shrink-0" /><span className="text-gray-700">{banner.contact_email}</span></p>}
              <p className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-[#f85606] flex-shrink-0" /><span className="text-gray-700">{banner.contact_location}</span></p>
              <p className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-[#f85606] flex-shrink-0" /><span className="text-gray-700">মেয়াদ: {new Date(banner.valid_until).toLocaleDateString('bn-BD')} ({daysLeft} দিন বাকি)</span></p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.location.href = `tel:${banner.contact_phone}`} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#e04e00] transition active:scale-95 shadow-md"><Phone size={18} /> কল করুন</button>
            <button onClick={() => window.open(`https://wa.me/${banner.contact_phone.replace(/[^0-9]/g, '')}`, '_blank')} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition active:scale-95 shadow-md"><ExternalLink size={18} /> WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
});
BannerDetailModal.displayName = 'BannerDetailModal';

// ============ মেইন পেজ ============
export default function OfferZonePage() {
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [animationData, setAnimationData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

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
  }, []);

  // Lottie অ্যানিমেশন লোড
  useEffect(() => {
    let isMounted = true;
    fetch(OFFER_ANIMATION_URL)
      .then(res => res.json())
      .then(data => { if (isMounted) setAnimationData(data); })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Supabase থেকে ব্যানার লোড
  useEffect(() => {
    if (!supabase) return;
    
    const loadBanners = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('offer_banners')
          .select('*')
          .eq('status', 'active')
          .gte('valid_until', new Date().toISOString())
          .order('priority', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setBanners(data);
        } else {
          const savedBanners = localStorage.getItem("offerBanners");
          if (savedBanners) {
            const parsed = JSON.parse(savedBanners);
            setBanners(parsed.filter((b: any) => b.status === 'active'));
          }
        }
      } catch (error) {
        console.log('Using local storage fallback');
        const savedBanners = localStorage.getItem("offerBanners");
        if (savedBanners) {
          const parsed = JSON.parse(savedBanners);
          setBanners(parsed.filter((b: any) => b.status === 'active'));
        }
      } finally {
        setMounted(true);
        setLoading(false);
      }
    };

    loadBanners();
  }, [supabase]);

  const filteredBanners = useMemo(() => {
    if (filterPriority === 'all') return banners;
    return banners.filter(b => b.priority === filterPriority);
  }, [banners, filterPriority]);

  const handleBannerClick = useCallback(async (banner: OfferBanner) => {
    setSelectedBanner(banner);
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, views: (b.views || 0) + 1 } : b));
    if (supabase) {
      await supabase.from('offer_banners').update({ views: (banner.views || 0) + 1 }).eq('id', banner.id);
    }
  }, [supabase]);

  const filterOptions = useMemo(() => [
    { id: 'all', label: 'সব', color: 'bg-gray-500' },
    { id: 'high', label: 'হট ডিল', color: 'bg-red-500' },
    { id: 'medium', label: 'জনপ্রিয়', color: 'bg-yellow-500' },
    { id: 'low', label: 'নিয়মিত', color: 'bg-green-500' },
  ], []);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="text-center">
          {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 150, height: 150 }} />}
          <Loader2 className="animate-spin text-[#f85606] mx-auto mt-4" size={24} />
          <p className="text-gray-500 mt-2">অফার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30"><Sparkles size={16} /><span className="text-sm font-semibold">সেরা ডিল</span></div>
              <h1 className="text-4xl md:text-6xl font-bold mb-3">🎁 অফার জোন</h1>
              <p className="text-lg opacity-90 mb-6">সেরা ডিল ও বিশেষ ছাড় - শুধু আপনার জন্য</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm"><Tag size={16} /> ৫০% পর্যন্ত ছাড়</div>
                <div className="flex items-center gap-2 text-sm"><Clock size={16} /> সীমিত সময়ের অফার</div>
                <div className="flex items-center gap-2 text-sm"><Gift size={16} /> ফ্রি ডেলিভারি</div>
              </div>
            </div>
            <div className="w-48 h-48 md:w-64 md:h-64">{animationData && <Lottie animationData={animationData} loop={true} />}</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><TrendingUp size={20} className="text-[#f85606]" /> চলমান অফার ({filteredBanners.length})</h2>
          <div className="flex gap-2">
            {filterOptions.map((filter) => (
              <button key={filter.id} onClick={() => setFilterPriority(filter.id as any)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${filterPriority === filter.id ? `${filter.color} text-white shadow-md` : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>{filter.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {filteredBanners.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredBanners.map(banner => <BannerCard key={banner.id} banner={banner} onClick={handleBannerClick} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-500">কোনো অফার পাওয়া যায়নি</p>
            <button onClick={() => setFilterPriority('all')} className="mt-4 text-[#f85606] text-sm font-semibold">সব অফার দেখুন</button>
          </div>
        )}
      </div>

      {selectedBanner && <BannerDetailModal banner={selectedBanner} onClose={() => setSelectedBanner(null)} />}
    </div>
  );
}