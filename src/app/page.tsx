"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    Search, Gavel, Users, User, 
    ShoppingBag, Plus, Heart, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRootCategories } from '@/data/categories';
import { getSupabaseClient } from '@/lib/supabase/client';

type AdItem = {
  id: number | string;
  title: string;
  price: number;
  condition: string;
  time: string;
  image: string;
  urgent: boolean;
  created_at?: string;
  images?: any[];
  is_urgent?: boolean;
};

type SliderItem = {
  title: string;
  discount: string;
  color: string;
  emoji: string;
  link: string;
  status?: string;
  image?: string;
  id?: string | number;
  order_index?: number;
};

// Supabase থেকে স্লাইডার লোড
const loadSlidersFromSupabase = async (): Promise<SliderItem[]> => {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('sliders')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  
  if (data && data.length > 0) {
    return data.map((s: any) => ({
      title: s.title || 'আমার দুনিয়া',
      discount: 'সেরা ডিল',
      color: 'from-[#f85606] to-orange-500',
      emoji: '🛍️',
      link: s.link || '/',
      status: 'active',
      image: s.image_url,
    }));
  }
  return [];
};

// Supabase থেকে পোস্ট লোড
const loadPostsFromSupabase = async (page: number, limit: number): Promise<AdItem[]> => {
  const supabase = getSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data } = await supabase
    .from('posts')
    .select(`
      id, title, price, condition, created_at, is_urgent,
      images:post_images(thumbnail_url, order_index)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(from, to);
  
  if (data) {
    return data.map((post: any) => ({
      id: post.id,
      title: post.title,
      price: post.price,
      condition: post.condition === 'new' ? 'নতুন' : 'পুরাতন',
      time: timeAgo(post.created_at),
      image: post.images?.[0]?.thumbnail_url || '📱',
      urgent: post.is_urgent || false,
    }));
  }
  return [];
};

// টাইম এগো হেল্পার
const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} দিন আগে`;
  if (hours > 0) return `${hours} ঘন্টা আগে`;
  if (minutes > 0) return `${minutes} মিনিট আগে`;
  return 'এইমাত্র';
};

// ডামি জেনারেটর (ফলব্যাক)
const generateMockAds = (page: number, limit: number): AdItem[] => {
  const items = [];
  const startId = (page - 1) * limit;
  const emojis = ['📱', '📱', '👟', '👜', '⌚', '🎧', '💻', '📷', '🪑', '⌚'];
  const titles = ['iPhone 15 Pro', 'Samsung TV', 'Nike Shoes', 'Leather Bag', 'Watch', 'Headphones', 'Laptop', 'Camera', 'Gaming Chair', 'Smart Watch'];
  
  for (let i = 0; i < limit; i++) {
    const id = startId + i + 1;
    items.push({
      id: id,
      title: titles[i % 10],
      price: Math.floor(Math.random() * 50000 + 1000),
      condition: ['নতুন', 'পুরাতন', 'ভালো', 'মোটামুটি'][Math.floor(Math.random() * 4)],
      time: `${Math.floor(Math.random() * 60)} মিনিট আগে`,
      image: emojis[i % 10],
      urgent: Math.random() > 0.7,
    });
  }
  return items;
};

// অ্যাড কার্ড
const AdCard = ({ ad }: { ad: AdItem }) => {
  return (
    <Link href={`/post/${ad.id}`}>
      <div className="rounded-xl overflow-hidden shadow-sm border cursor-pointer hover:shadow-md transition-all group bg-white border-gray-100">
        <div className="relative p-6 flex items-center justify-center h-40 bg-gradient-to-br from-orange-50 to-orange-100">
          {ad.image.startsWith('http') ? (
            <img src={ad.image} alt={ad.title} className="w-full h-full object-contain" />
          ) : (
            <div className="text-6xl">{ad.image}</div>
          )}
          {ad.urgent && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
              জরুরি
            </div>
          )}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }} 
            className="absolute top-2 right-2 rounded-full p-1 shadow-sm z-10 transition bg-white/80 hover:bg-white"
          >
            <Heart size={14} className="text-gray-500 hover:text-red-500 transition" />
          </button>
        </div>
        <div className="p-2">
          <h3 className="font-bold text-xs line-clamp-1 transition-colors group-hover:text-[#f85606] text-gray-800">
            {ad.title}
          </h3>
          <p className="text-[9px] mt-1 uppercase flex items-center gap-1 text-gray-400">
            <span>{ad.condition}</span> • <span>{ad.time}</span>
          </p>
          <div className="mt-1 text-[#f85606] font-black text-sm">
            ৳ {ad.price.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

// স্কেলেটন কার্ড
const SkeletonCard = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border animate-pulse bg-white border-gray-100">
      <div className="h-40 bg-gray-200" />
      <div className="p-2">
        <div className="h-3 rounded w-3/4 mb-2 bg-gray-200" />
        <div className="h-2 rounded w-1/2 mb-2 bg-gray-200" />
        <div className="h-3 rounded w-1/3 bg-gray-200" />
      </div>
    </div>
  );
};

const AmarDuniyaHome = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // ডিফল্ট স্লাইড (ফলব্যাক)
  const defaultSlides: SliderItem[] = [
    { title: "সব ধরণের পণ্য পাচ্ছেন", discount: "১৫% পর্যন্ত ছাড়", color: "from-[#f85606] to-orange-500", emoji: "🛍️", link: "/category/offer" },
    { title: "মোবাইল মেলায় স্বাগতম", discount: "সর্বোচ্চ ৩০% ছাড়", color: "from-[#e65c00] to-[#ff9933]", emoji: "📱", link: "/category/mobile" },
    { title: "সেরা দামে সেরা ল্যাপটপ", discount: "বিশেষ অফার", color: "from-[#cc5200] to-[#ff7733]", emoji: "💻", link: "/category/computer" },
    { title: "ইলেকট্রনিক্স সপ্তাহ", discount: "৫০% পর্যন্ত ছাড়", color: "from-[#f85606] to-[#ff4d4d]", emoji: "📺", link: "/category/electronics" },
    { title: "ফ্যাশন ফেস্টিভ্যাল", discount: "সব ব্র্যান্ডে ৩০% ছাড়", color: "from-[#ff6b35] to-[#f7931e]", emoji: "👔", link: "/category/fashion" },
    { title: "গাড়ি মেলা", discount: "শুধু আজ ৪০% ছাড়", color: "from-[#e63946] to-[#d90429]", emoji: "🚗", link: "/category/car" },
    { title: "চাকরির জগৎ", discount: "সর্বোচ্চ পদত্যাগ", color: "from-[#2a9d8f] to-[#264653]", emoji: "💼", link: "/category/job" },
    { title: "সার্ভিস সেন্টার", discount: "সকল সেবায় ২০% ছাড়", color: "from-[#e9c46a] to-[#f4a261]", emoji: "🔧", link: "/category/service" },
    { title: "জমি ক্রয়-বিক্রয়", discount: "ফ্রি কনসালটেন্সি", color: "from-[#0077b6] to-[#023e8a]", emoji: "🏠", link: "/category/property" },
    { title: "সবার জন্য তথ্য", discount: "জেনে রাখুন", color: "from-[#7209b7] to-[#4c0bce]", emoji: "📢", link: "/category/info" },
    { title: "পাত্র-পাত্রী খুঁজুন", discount: "যোগাযোগ করুন", color: "from-[#ef476f] to-[#d90429]", emoji: "💑", link: "/category/matrimony" },
    { title: "ভাড়া নিন বা দিন", discount: "সর্বোচ্চ সুবিধা", color: "from-[#fca311] to-[#ffba08]", emoji: "🔑", link: "/category/rent" },
    { title: "জরুরি সেবা", discount: "২৪/৭ সেবা", color: "from-[#f77f00] to-[#fcbf49]", emoji: "🚑", link: "/category/emergency" },
    { title: "বিশেষ অফার", discount: "৬০% পর্যন্ত ছাড়", color: "from-[#06d6a0] to-[#118ab2]", emoji: "🎉", link: "/category/offer" },
    { title: "উইকেন্ড স্পেশাল", discount: "শনি-রবিবার ৩৫% ছাড়", color: "from-[#9c89b8] to-[#b8a9c9]", emoji: "🎊", link: "/category/offer" },
  ];

  const [slides, setSlides] = useState<SliderItem[]>(defaultSlides);
  const [recentAds, setRecentAds] = useState<AdItem[]>([]);
  const [recentPage, setRecentPage] = useState(1);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);
  const recentObserverRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRecent = useRef(false);
  
  // Supabase ডাটা লোড হয়েছে কিনা ট্র্যাক
  const [supabaseSlidersLoaded, setSupabaseSlidersLoaded] = useState(false);
  const [supabasePostsLoaded, setSupabasePostsLoaded] = useState(false);

  const rootCategories = getRootCategories();

  // mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Supabase থেকে স্লাইডার লোড (প্রথম priority)
  useEffect(() => {
    const loadSliders = async () => {
      try {
        const supabaseSliders = await loadSlidersFromSupabase();
        if (supabaseSliders.length > 0) {
          setSlides(supabaseSliders);
          setSupabaseSlidersLoaded(true);
        } else {
          // লোকাল স্টোরেজ থেকে লোড (আগের সিস্টেম)
          const savedSliders = localStorage.getItem("homeSliders");
          if (savedSliders) {
            try {
              const allSliders = JSON.parse(savedSliders);
              const activeSliders = allSliders.filter((s: SliderItem) => s.status === 'active');
              if (activeSliders.length > 0) {
                setSlides(activeSliders);
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    };
    loadSliders();
  }, []);

  // অটো স্লাইড টাইমার
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // পোস্ট লোড
  const loadRecentAds = useCallback(async (reset: boolean = false) => {
    if (isLoadingRecent.current || (reset === false && !hasMoreRecent)) return;
    isLoadingRecent.current = true;
    setLoadingRecent(true);
    
    try {
      const currentPage = reset ? 1 : recentPage + 1;
      
      // Supabase থেকে লোড করার চেষ্টা
      const supabasePosts = await loadPostsFromSupabase(currentPage, 3);
      
      if (supabasePosts.length > 0) {
        setSupabasePostsLoaded(true);
        if (reset) {
          setRecentAds(supabasePosts);
          setRecentPage(1);
          setHasMoreRecent(supabasePosts.length === 3);
        } else {
          setRecentAds(prev => [...prev, ...supabasePosts]);
          setRecentPage(currentPage);
          setHasMoreRecent(supabasePosts.length === 3);
        }
      } else {
        // ফলব্যাক: ডামি ডাটা
        await new Promise(r => setTimeout(r, 500));
        const newAds = generateMockAds(currentPage, 3);
        
        if (reset) {
          setRecentAds(newAds);
          setRecentPage(1);
          setHasMoreRecent(true);
        } else {
          setRecentAds(prev => [...prev, ...newAds]);
          setRecentPage(currentPage);
        }
        
        if (newAds.length < 3) setHasMoreRecent(false);
      }
    } catch (e) {} finally {
      setLoadingRecent(false);
      isLoadingRecent.current = false;
    }
  }, [recentPage, hasMoreRecent]);

  useEffect(() => {
    loadRecentAds(true);
  }, []);

  useEffect(() => {
    if (!recentObserverRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRecent && hasMoreRecent) {
          loadRecentAds(false);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(recentObserverRef.current);
    return () => observer.disconnect();
  }, [loadingRecent, hasMoreRecent, loadRecentAds]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (slides.length === 0) return;
    if (direction === 'left') {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f3f7]">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f3f7]">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 font-sans w-full overflow-x-hidden transition-colors duration-300 bg-[#f2f3f7]" suppressHydrationWarning>
      
      {/* হেডার */}
      <header className="px-4 py-3 sticky top-0 z-[100] border-b shadow-sm transition-colors duration-300 bg-white border-gray-100">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center rounded-xl px-4 py-1.5 border focus-within:border-[#f85606] transition-all flex-1 bg-[#f0f1f5] border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="আমার দুনিয়ায় খুঁজুন..."
              className="bg-transparent border-none outline-none ml-2 w-full text-xs text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleSearch}
              className="bg-[#f85606] text-white px-4 py-1.5 rounded-lg text-xs font-bold shrink-0 active:scale-95 transition-transform"
            >
              খুঁজুন
            </button>
          </div>
          <ShoppingBag size={20} className="shrink-0 cursor-pointer text-gray-600" />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto">
        
        {/* ব্যানার স্লাইডার */}
        <div className="mx-2 md:mx-0">
          <div className="relative h-44 md:h-80 overflow-hidden md:mt-4 md:rounded-3xl shadow-sm">
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = offset.x;
                    const swipeVelocity = velocity.x;
                    if (swipe < -50 || swipeVelocity < -500) {
                      handleSwipe('left');
                    } else if (swipe > 50 || swipeVelocity > 500) {
                      handleSwipe('right');
                    }
                  }}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Link href={slides[currentSlide].link}>
                    <div className={`w-full h-full bg-gradient-to-r ${slides[currentSlide].color} flex flex-col items-center justify-center text-white`}>
                      {slides[currentSlide].image ? (
                        <img 
                          src={slides[currentSlide].image} 
                          alt={slides[currentSlide].title} 
                          className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4" 
                        />
                      ) : (
                        <div className="text-6xl md:text-8xl mb-4">{slides[currentSlide].emoji}</div>
                      )}
                      <h2 className="text-xl md:text-3xl font-black text-center px-4">
                        {slides[currentSlide].title}
                      </h2>
                      <p className="text-sm md:text-lg mt-2 opacity-90">
                        {slides[currentSlide].discount}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* স্লাইডার ডটস */}
            <div className="absolute bottom-4 w-full flex justify-center gap-1.5 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === i ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ব্যানারের নিচের টেক্সট */}
          <Link href={slides[currentSlide].link}>
            <div className={`bg-gradient-to-r ${slides[currentSlide].color} mt-3 rounded-xl p-3 text-center shadow-md cursor-pointer`}>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xs md:text-sm text-white/90 font-medium mt-1">
                {slides[currentSlide].discount}
              </p>
            </div>
          </Link>
        </div>

        {/* ক্যাটাগরি */}
        <nav className="py-6 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 px-3 md:rounded-2xl md:mt-4 shadow-sm transition-colors duration-300 bg-white">
          {rootCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border transition-all shadow-sm bg-gray-50 border-gray-100 group-hover:bg-orange-50 group-hover:border-[#f85606] overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl md:text-3xl">{cat.icon}</span>
                )}
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-center mt-2 transition-colors line-clamp-1 px-1 text-gray-600 group-hover:text-[#f85606]">
                {cat.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* রিসেন্ট অ্যাডস */}
        <section className="mt-4 p-3 rounded-2xl shadow-sm transition-colors duration-300 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-black text-gray-800">
              🔥 রিসেন্ট অ্যাডস
            </h2>
            <button className="text-[11px] font-bold text-[#f85606]">
              সব দেখুন &gt;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {recentAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
            {loadingRecent && recentAds.length === 0 && (
              [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
          
          <div ref={recentObserverRef} className="flex justify-center py-3">
            {loadingRecent && recentAds.length > 0 && (
              <Loader2 className="animate-spin text-[#f85606]" size={18} />
            )}
            {!hasMoreRecent && recentAds.length > 0 && (
              <p className="text-[9px] text-gray-400">
                সব পণ্য দেখানো হয়েছে
              </p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AmarDuniyaHome;