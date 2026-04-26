"use client";
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    Search, ShoppingBag, Heart, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRootCategories } from '@/data/categories';
import { getSupabaseClient } from '@/lib/supabase/client';

// ============ টাইপ ডেফিনিশন ============
type AdItem = {
  id: number | string;
  title: string;
  price: number;
  condition: string;
  time: string;
  image: string;
  webpImage?: string;
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
  webpImage?: string;
  id?: string | number;
  order_index?: number;
};

// ============ WebP URL জেনারেটর ============
const getWebPUrl = (url: string, width: number = 400, quality: number = 80): string => {
  if (!url || !url.startsWith('http')) return url;
  
  if (url.includes('supabase.co/storage/v1/object/public')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?format=webp&quality=${quality}&width=${width}`;
  }
  
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', '/upload/f_webp,q_auto,w_' + width + '/');
  }
  
  return url;
};

// ============ ইমেজ প্রিলোডার ============
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(); return; }
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
};

// ============ টাইম এগো হেল্পার ============
const timeAgo = (date: string): string => {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'এইমাত্র';
  if (minutes < 60) return `${minutes} মিনিট আগে`;
  if (hours < 24) return `${hours} ঘন্টা আগে`;
  if (days < 7) return `${days} দিন আগে`;
  if (weeks < 4) return `${weeks} সপ্তাহ আগে`;
  if (months < 12) return `${months} মাস আগে`;
  return `${Math.floor(days / 365)} বছর আগে`;
};

// ============ ডামি জেনারেটর (হাইড্রেশন সেফ) ============
const generateMockAds = (page: number, limit: number): AdItem[] => {
  const items: AdItem[] = [];
  const startId = (page - 1) * limit;
  
  const seededRandom = (seed: number, index: number): number => {
    const x = Math.sin(seed * 1000 + index) * 10000;
    return x - Math.floor(x);
  };
  
  const products = [
    { emoji: '📱', title: 'iPhone 15 Pro Max', price: 185000 },
    { emoji: '💻', title: 'MacBook Air M3', price: 145000 },
    { emoji: '👟', title: 'Nike Air Jordan', price: 15000 },
    { emoji: '👜', title: 'Gucci Leather Bag', price: 8500 },
    { emoji: '⌚', title: 'Apple Watch Ultra', price: 65000 },
    { emoji: '🎧', title: 'Sony WH-1000XM5', price: 32000 },
    { emoji: '📷', title: 'Canon EOS R6', price: 195000 },
    { emoji: '🪑', title: 'Herman Miller Chair', price: 120000 },
    { emoji: '📺', title: 'Samsung QLED 65"', price: 155000 },
    { emoji: '🚗', title: 'Toyota Premio 2020', price: 2850000 },
    { emoji: '🏍️', title: 'Yamaha R15 V4', price: 520000 },
    { emoji: '🎮', title: 'PS5 Digital Edition', price: 55000 },
  ];
  
  for (let i = 0; i < limit; i++) {
    const rand = seededRandom(page, i);
    const product = products[i % products.length];
    items.push({
      id: startId + i + 1,
      title: product.title,
      price: product.price + Math.floor(rand * 5000),
      condition: ['নতুন', 'পুরাতন', 'ভালো', 'মোটামুটি'][Math.floor(rand * 4)],
      time: timeAgo(new Date(Date.now() - Math.floor(rand * 7 * 86400000)).toISOString()),
      image: product.emoji,
      urgent: rand > 0.75,
    });
  }
  return items;
};

// ============ অ্যাড কার্ড ============
const AdCard = memo(({ ad, index }: { ad: AdItem; index: number }) => {
  const webpSrc = ad.webpImage || (ad.image.startsWith('http') ? getWebPUrl(ad.image, 300, 75) : '');
  
  return (
    <Link href={`/post/${ad.id}`} prefetch={true}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="rounded-xl overflow-hidden shadow-sm border cursor-pointer hover:shadow-lg transition-all duration-300 group bg-white border-gray-100 hover:border-orange-200 hover:scale-[1.02]"
      >
        <div className="relative p-4 flex items-center justify-center h-36 md:h-44 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
          {ad.image.startsWith('http') ? (
            <picture>
              {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
              {webpSrc && <source srcSet={webpSrc.replace('format=webp', 'format=avif')} type="image/avif" />}
              <img 
                src={ad.image} 
                alt={ad.title} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </picture>
          ) : (
            <div className="text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-125">
              {ad.image}
            </div>
          )}
          
          {ad.urgent && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg z-10">
              জরুরি
            </div>
          )}
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }} 
            className="absolute top-2 right-2 rounded-full p-1.5 shadow-md z-10 transition-all duration-300 bg-white/90 hover:bg-white hover:scale-110"
            aria-label="ফেবারিটে যোগ করুন"
          >
            <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors duration-300" />
          </button>
          
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[8px] px-2 py-0.5 rounded-full">
            {ad.condition}
          </div>
        </div>
        
        <div className="p-2.5">
          <h3 className="font-bold text-xs line-clamp-2 transition-colors duration-300 group-hover:text-[#f85606] text-gray-800 min-h-[2rem]">
            {ad.title}
          </h3>
          <p className="text-[9px] mt-1 text-gray-400">
            {ad.time}
          </p>
          <div className="mt-1.5 text-[#f85606] font-black text-sm md:text-base">
            ৳ {ad.price.toLocaleString('bn-BD')}
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

AdCard.displayName = 'AdCard';

// ============ স্কেলেটন কার্ড ============
const SkeletonCard = memo(() => {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border animate-pulse bg-white border-gray-100">
      <div className="h-36 md:h-44 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 rounded bg-gray-200 w-3/4" />
        <div className="h-3 rounded bg-gray-200 w-1/2" />
        <div className="h-2 rounded bg-gray-200 w-1/3" />
        <div className="h-4 rounded bg-gray-200 w-1/2" />
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

// ============ স্লাইডার নেভিগেশন ============
const SliderNav = memo(({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => (
  <>
    <button 
      onClick={onPrev}
      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all flex items-center justify-center text-white"
      aria-label="আগের স্লাইড"
    >
      <ChevronLeft size={20} />
    </button>
    <button 
      onClick={onNext}
      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all flex items-center justify-center text-white"
      aria-label="পরের স্লাইড"
    >
      <ChevronRight size={20} />
    </button>
  </>
));

SliderNav.displayName = 'SliderNav';

// ============ মেইন হোম কম্পোনেন্ট ============
const AmarDuniyaHome = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // ডিফল্ট স্লাইড (ফলব্যাক)
  const defaultSlides: SliderItem[] = [
    { title: "সব ধরণের পণ্য পাচ্ছেন", discount: "১৫% পর্যন্ত ছাড়", color: "from-[#f85606] to-orange-500", emoji: "🛍️", link: "/category/offer" },
    { title: "মোবাইল মেলায় স্বাগতম", discount: "সর্বোচ্চ ৩০% ছাড়", color: "from-[#e65c00] to-[#ff9933]", emoji: "📱", link: "/category/mobile" },
    { title: "সেরা দামে সেরা ল্যাপটপ", discount: "বিশেষ অফার", color: "from-[#cc5200] to-[#ff7733]", emoji: "💻", link: "/category/computer" },
    { title: "ইলেকট্রনিক্স সপ্তাহ", discount: "৫০% পর্যন্ত ছাড়", color: "from-[#f85606] to-[#ff4d4d]", emoji: "📺", link: "/category/electronics" },
    { title: "ফ্যাশন ফেস্টিভ্যাল", discount: "সব ব্র্যান্ডে ৩০% ছাড়", color: "from-[#ff6b35] to-[#f7931e]", emoji: "👔", link: "/category/fashion" },
    { title: "গাড়ি মেলা", discount: "শুধু আজ ৪০% ছাড়", color: "from-[#e63946] to-[#d90429]", emoji: "🚗", link: "/category/car" },
    { title: "চাকরির জগৎ", discount: "সর্বোচ্চ সুযোগ", color: "from-[#2a9d8f] to-[#264653]", emoji: "💼", link: "/category/job" },
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
  const [sliderLoading, setSliderLoading] = useState(true);
  const recentObserverRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRecent = useRef(false);
  const sliderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const rootCategories = getRootCategories();

  // ✅ হাইড্রেশন ফিক্স
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);

  // ============ অনলাইন/অফলাইন ডিটেকশন ============
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ============ Supabase থেকে ডাটা লোড ============
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        const supabase = getSupabaseClient();
        
        // --- স্লাইডার লোড ---
        setSliderLoading(true);
        const { data: sliderData, error: sliderError } = await supabase
          .from('sliders')
          .select('id, title, discount_text, link, image_url, is_active, order_index')
          .eq('is_active', true)
          .order('order_index', { ascending: true })
          .limit(15);
        
        if (isMounted && sliderData && sliderData.length > 0) {
          const formattedSliders = sliderData.map((s: any) => ({
            id: s.id,
            title: s.title || 'আমার দুনিয়া',
            discount: s.discount_text || 'সেরা ডিল',
            color: 'from-[#f85606] to-orange-500',
            emoji: '🛍️',
            link: s.link || '/',
            status: 'active',
            image: s.image_url,
            webpImage: s.image_url ? getWebPUrl(s.image_url, 800, 85) : undefined,
            order_index: s.order_index,
          }));
          setSlides(formattedSliders);
          
          formattedSliders.forEach((slide: SliderItem) => {
            if (slide.webpImage) preloadImage(slide.webpImage);
            if (slide.image) preloadImage(slide.image);
          });
        } else if (isMounted) {
          try {
            const savedSliders = localStorage.getItem("homeSliders");
            if (savedSliders) {
              const parsed = JSON.parse(savedSliders);
              const activeSliders = parsed.filter((s: any) => s.status === 'active');
              if (activeSliders.length > 0) setSlides(activeSliders);
            }
          } catch (e) {}
        }
        if (isMounted) setSliderLoading(false);
        
        // --- পোস্ট লোড (প্রথম ৫টা) ---
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
  id, title, price, condition, created_at, is_urgent,
  post_images(thumbnail_url, webp_url, order_index)
`)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .range(0, 4); // ✅ প্রথম ৫টা (0-4)
        
        if (isMounted && postData && postData.length > 0 && !postError) {
          const formattedPosts: AdItem[] = postData.map((post: any) => ({
            id: post.id,
            title: post.title,
            price: post.price,
            condition: post.condition === 'new' ? 'নতুন' : 'পুরাতন',
            time: timeAgo(post.created_at),
            image: post.post_images?.[0]?.thumbnail_url || '📱',
webpImage: post.post_images?.[0]?.webp_url || (post.post_images?.[0]?.thumbnail_url ? getWebPUrl(post.post_images[0].thumbnail_url, 300, 75) : undefined),
            urgent: post.is_urgent || false,
          }));
          setRecentAds(formattedPosts);
          setRecentPage(1);
          setHasMoreRecent(formattedPosts.length === 5); // ✅ ৫ চেক
        } else if (isMounted) {
          const mockAds = generateMockAds(1, 5); // ✅ ৫টা ডামি
          setRecentAds(mockAds);
          setRecentPage(1);
          setHasMoreRecent(true);
        }
      } catch (error) {
        if (isMounted) {
          console.log('Initial load failed, using fallback');
          const mockAds = generateMockAds(1, 5); // ✅ ৫টা ডামি
          setRecentAds(mockAds);
          setRecentPage(1);
          setHasMoreRecent(true);
          setSliderLoading(false);
        }
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // ============ অটো স্লাইড টাইমার ============
  useEffect(() => {
    if (slides.length === 0) return;
    
    const startTimer = () => {
      sliderTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 4000);
    };
    
    startTimer();
    
    return () => {
      if (sliderTimerRef.current) clearInterval(sliderTimerRef.current);
    };
  }, [slides.length]);

  // ============ টাচ সোয়াইপ ============
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleSwipe('left');
      else handleSwipe('right');
    }
  };

  // ============ পোস্ট লোড (৫টা করে লেজি লোডিং) ============
  const loadRecentAds = useCallback(async (reset: boolean = false) => {
    if (isLoadingRecent.current || (reset === false && !hasMoreRecent)) return;
    isLoadingRecent.current = true;
    setLoadingRecent(true);
    
    try {
      const supabase = getSupabaseClient();
      const currentPage = reset ? 1 : recentPage + 1;
      const LIMIT = 5; // ✅ ৫টা করে লোড
      const from = (currentPage - 1) * LIMIT;
      const to = from + LIMIT - 1;
      
      const { data, error } = await supabase
  .from('posts')
  .select(`
    id, title, price, condition, created_at, is_urgent,
    post_images(thumbnail_url, webp_url, order_index)
  `)
  .eq('status', 'approved')
  .order('created_at', { ascending: false })
  .range(from, to);

if (data && data.length > 0 && !error) {
  const formattedPosts: AdItem[] = data.map((post: any) => ({
    id: post.id,
    title: post.title,
    price: post.price,
    condition: post.condition === 'new' ? 'নতুন' : 'পুরাতন',
    time: timeAgo(post.created_at),
    image: post.post_images?.[0]?.thumbnail_url || '📱',
    webpImage: post.post_images?.[0]?.webp_url || (post.post_images?.[0]?.thumbnail_url ? getWebPUrl(post.post_images[0].thumbnail_url, 300, 75) : undefined),
    urgent: post.is_urgent || false,
  }));

        
        if (reset) {
          setRecentAds(formattedPosts);
          setRecentPage(1);
          setHasMoreRecent(formattedPosts.length === LIMIT);
        } else {
          setRecentAds(prev => [...prev, ...formattedPosts]);
          setRecentPage(currentPage);
          setHasMoreRecent(formattedPosts.length === LIMIT);
        }
      } else {
        // ডামি ফ্যালব্যাক (৫টা করে)
        await new Promise(r => setTimeout(r, 300));
        const newAds = generateMockAds(currentPage, LIMIT);
        
        if (reset) {
          setRecentAds(newAds);
          setRecentPage(1);
          setHasMoreRecent(true);
        } else {
          setRecentAds(prev => [...prev, ...newAds]);
          setRecentPage(currentPage);
        }
      }
    } catch (e) {
      console.log('Load failed, using fallback');
      const currentPage = reset ? 1 : recentPage + 1;
      const newAds = generateMockAds(currentPage, 5);
      
      if (reset) {
        setRecentAds(newAds);
        setRecentPage(1);
        setHasMoreRecent(true);
      } else {
        setRecentAds(prev => [...prev, ...newAds]);
        setRecentPage(currentPage);
      }
    } finally {
      setLoadingRecent(false);
      isLoadingRecent.current = false;
    }
  }, [recentPage, hasMoreRecent]);

  // ============ ইন্টারসেকশন অবজার্ভার (আগে ট্রিগার) ============
  useEffect(() => {
    if (!recentObserverRef.current || !isClient) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRecent && hasMoreRecent) {
          loadRecentAds(false);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "400px" // ✅ 400px আগে ট্রিগার
      }
    );
    
    observer.observe(recentObserverRef.current);
    return () => observer.disconnect();
  }, [loadingRecent, hasMoreRecent, loadRecentAds, isClient]);

  // ============ সোয়াইপ ============
  const handleSwipe = (direction: 'left' | 'right') => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => {
      if (direction === 'left') return prev === slides.length - 1 ? 0 : prev + 1;
      return prev === 0 ? slides.length - 1 : prev - 1;
    });
  };

  // ============ সার্চ ============
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, router]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  }, [handleSearch]);

  // ============ স্লাইডার পজ/রিজিউম ============
  const pauseSlider = () => {
    if (sliderTimerRef.current) clearInterval(sliderTimerRef.current);
  };
  
  const resumeSlider = () => {
    if (slides.length === 0) return;
    sliderTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
  };

  // ✅ SSR ফ্যালব্যাক
  if (!isClient) {
    return <div className="min-h-screen bg-[#f2f3f7]" />;
  }

  // ✅ মাউন্টেড চেক
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f3f7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#f85606]" size={48} />
          <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-24 font-sans w-full overflow-x-hidden transition-colors duration-300 bg-[#f2f3f7]" 
      suppressHydrationWarning
    >
      
      {/* অফলাইন নোটিফিকেশন */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-xs font-bold z-[200]">
          ⚠️ আপনি অফলাইনে আছেন। কিছু ফিচার কাজ নাও করতে পারে।
        </div>
      )}
      
      {/* হেডার */}
      <header className="px-4 py-3 sticky top-0 z-[100] border-b shadow-sm transition-colors duration-300 bg-white/95 backdrop-blur-sm border-gray-100">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center rounded-xl px-4 py-1.5 border focus-within:border-[#f85606] focus-within:shadow-md transition-all flex-1 bg-[#f0f1f5] border-gray-200">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="আমার দুনিয়ায় খুঁজুন..."
              className="bg-transparent border-none outline-none ml-2 w-full text-xs text-gray-800 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="সার্চ"
            />
            <button 
              onClick={handleSearch}
              className="bg-[#f85606] hover:bg-[#e04e00] text-white px-4 py-1.5 rounded-lg text-xs font-bold shrink-0 active:scale-95 transition-all duration-200"
            >
              খুঁজুন
            </button>
          </div>
          
          <Link href="/saved" className="shrink-0 relative" aria-label="সংরক্ষিত">
            <ShoppingBag size={20} className="cursor-pointer text-gray-600 hover:text-[#f85606] transition-colors" />
            <span className="absolute -top-1 -right-1 bg-[#f85606] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto">
        
        {/* ব্যানার স্লাইডার */}
        <div className="mx-2 md:mx-0">
          <div 
            className="relative h-44 md:h-80 overflow-hidden md:mt-4 md:rounded-3xl shadow-sm group/slider"
            onMouseEnter={pauseSlider}
            onMouseLeave={resumeSlider}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sliderLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-200 animate-pulse">
                <Loader2 className="animate-spin text-gray-400" size={40} />
              </div>
            )}
            
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Link href={slides[currentSlide]?.link || '/'} prefetch={true}>
                    <div className={`w-full h-full bg-gradient-to-r ${slides[currentSlide]?.color || 'from-[#f85606] to-orange-500'} flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
                      </div>
                      
                      {slides[currentSlide]?.image ? (
                        <picture className="relative z-10">
                          {slides[currentSlide].webpImage && (
                            <source srcSet={slides[currentSlide].webpImage} type="image/webp" />
                          )}
                          <img 
                            src={slides[currentSlide].image} 
                            alt={slides[currentSlide]?.title || 'স্লাইড'} 
                            className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 drop-shadow-lg" 
                            loading="eager"
                            fetchPriority="high"
                          />
                        </picture>
                      ) : (
                        <div className="text-6xl md:text-8xl mb-4 relative z-10 drop-shadow-lg">
                          {slides[currentSlide]?.emoji || '🛍️'}
                        </div>
                      )}
                      
                      <h2 className="text-xl md:text-3xl font-black text-center px-4 relative z-10 drop-shadow-md">
                        {slides[currentSlide]?.title || 'আমার দুনিয়া'}
                      </h2>
                      <p className="text-sm md:text-lg mt-2 opacity-90 relative z-10">
                        {slides[currentSlide]?.discount || 'সেরা ডিল'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
              <SliderNav 
                onPrev={() => handleSwipe('right')} 
                onNext={() => handleSwipe('left')} 
              />
            </div>
            
            <div className="absolute bottom-4 w-full flex justify-center gap-1.5 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    currentSlide === i 
                      ? "w-6 h-1.5 bg-white" 
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`স্লাইড ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <Link href={slides[currentSlide]?.link || '/'} prefetch={true}>
            <div className={`bg-gradient-to-r ${slides[currentSlide]?.color || 'from-[#f85606] to-orange-500'} mt-3 rounded-xl p-3 text-center shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300`}>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                {slides[currentSlide]?.title || 'আমার দুনিয়া'}
              </h2>
              <p className="text-xs md:text-sm text-white/90 font-medium mt-1">
                {slides[currentSlide]?.discount || 'সেরা ডিল'} 🔥
              </p>
            </div>
          </Link>
        </div>

        {/* ক্যাটাগরি সেকশন */}
        <nav className="py-6 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-3 md:gap-4 px-3 md:rounded-2xl md:mt-4 shadow-sm transition-colors duration-300 bg-white">
          {rootCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center group"
              prefetch={true}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border transition-all duration-300 shadow-sm bg-gray-50 border-gray-100 group-hover:bg-orange-50 group-hover:border-[#f85606] group-hover:shadow-md group-hover:scale-110 overflow-hidden">
                {cat.image ? (
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-125">
                    {cat.icon}
                  </span>
                )}
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-center mt-2 transition-colors duration-300 line-clamp-1 px-1 text-gray-600 group-hover:text-[#f85606]">
                {cat.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* রিসেন্ট অ্যাডস */}
        <section className="mt-4 p-3 rounded-2xl shadow-sm transition-colors duration-300 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              🔥 রিসেন্ট অ্যাডস
              {recentAds.length > 0 && (
                <span className="text-xs font-normal text-gray-400">
                  ({recentAds.length}টি)
                </span>
              )}
            </h2>
            <Link 
              href="/category/all" 
              className="text-[11px] font-bold text-[#f85606] hover:underline"
            >
              সব দেখুন &gt;
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {recentAds.map((ad, index) => (
              <AdCard key={ad.id} ad={ad} index={index} />
            ))}
            
            {/* স্কেলেটন - প্রথম লোডে ৫টা */}
            {loadingRecent && recentAds.length === 0 && (
              [...Array(5)].map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
            )}
          </div>
          
          {/* ইনফিনিট স্ক্রল ট্রিগার */}
          <div ref={recentObserverRef} className="flex justify-center py-4">
            {loadingRecent && recentAds.length > 0 && (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-[#f85606]" size={18} />
                <span className="text-[11px] text-gray-400">আরো ৫টি লোড হচ্ছে...</span>
              </div>
            )}
            {!hasMoreRecent && recentAds.length > 0 && (
              <p className="text-[11px] text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                ✅ সব পণ্য দেখানো হয়েছে ({recentAds.length}টি)
              </p>
            )}
            {!loadingRecent && recentAds.length === 0 && (
              <p className="text-xs text-gray-400">
                কোনো পণ্য পাওয়া যায়নি
              </p>
            )}
          </div>
        </section>

        <div className="h-4" />
        
      </div>
    </div>
  );
};

export default AmarDuniyaHome;