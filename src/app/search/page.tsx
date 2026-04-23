"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, X, Filter, Heart, Eye, MapPin, 
  Loader2, AlertCircle, ChevronRight
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  image: string;
  thumbnail_url?: string;
  views: number;
  created_at: string;
  condition: string;
  is_urgent: boolean;
};

// সিম্পল ক্যাশিং সিস্টেম
const searchCache = new Map<string, { data: Product[]; total: number; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // ২ মিনিট

// টাইম এগো
const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} দিন`;
  if (hours > 0) return `${hours} ঘন্টা`;
  return `${minutes} মিনিট`;
};

// প্রোডাক্ট কার্ড (মেমোইজড)
const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/post/${product.id}`}>
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
      <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 p-4 flex items-center justify-center h-36">
        {product.thumbnail_url ? (
          <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-contain" loading="lazy" />
        ) : (
          <div className="text-5xl">{product.image || '📦'}</div>
        )}
        {product.is_urgent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">জরুরি</div>
        )}
        <button className="absolute bottom-2 right-2 p-1.5 bg-white/80 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.preventDefault()}>
          <Heart size={14} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 line-clamp-1 group-hover:text-[#f85606] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
          <MapPin size={10} />
          <span>{product.location || 'ঢাকা'}</span>
          <span className="mx-1">•</span>
          <span>{product.condition === 'new' ? 'নতুন' : 'পুরাতন'}</span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-base font-black text-[#f85606]">৳{product.price?.toLocaleString() || '০'}</span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Eye size={10} /> {product.views || 0}
          </span>
        </div>
        <p className="text-[9px] text-gray-400 mt-1">{timeAgo(product.created_at)} আগে</p>
      </div>
    </div>
  </Link>
);

// স্কেলেটন কার্ড
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-36 bg-gray-200" />
    <div className="p-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
  });

  // ক্যাটাগরি লোড
useEffect(() => {
  const loadCategories = async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase.from('categories').select('name').eq('is_active', true);
    if (data) setCategories(data.map((c: any) => c.name)); // ✅ c: any যোগ করা হয়েছে
  };
  loadCategories();
}, []);

  // ক্যাশ কী
  const getCacheKey = useCallback(() => {
    return JSON.stringify({ query, filters, page });
  }, [query, filters, page]);

  // সার্চ ফাংশন
  const performSearch = useCallback(async (pageNum: number = 1, reset: boolean = true) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    
    const cacheKey = getCacheKey();
    
    // ক্যাশ চেক (শুধু প্রথম পেজের জন্য)
    if (reset && pageNum === 1) {
      const cached = searchCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setResults(cached.data);
        setTotal(cached.total);
        setHasMore(cached.data.length === 20);
        setLoading(false);
        return;
      }
    }
    
    try {
      const supabase = getSupabaseClient();
      const from = (pageNum - 1) * 20;
      const to = from + 19;
      
      let supabaseQuery = supabase
        .from('posts')
        .select(`
          id, title, price, location, views, created_at, condition, is_urgent,
          images:post_images(thumbnail_url, order_index)
        `, { count: 'exact' })
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      // টেক্সট সার্চ
      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }
      
      // ফিল্টার
      if (filters.location) {
        supabaseQuery = supabaseQuery.ilike('location', `%${filters.location}%`);
      }
      if (filters.condition) {
        supabaseQuery = supabaseQuery.eq('condition', filters.condition);
      }
      if (filters.minPrice) {
        supabaseQuery = supabaseQuery.gte('price', parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        supabaseQuery = supabaseQuery.lte('price', parseInt(filters.maxPrice));
      }
      
      const { data, error: supabaseError, count } = await supabaseQuery;
      
      if (supabaseError) throw supabaseError;
      
      const formattedData: Product[] = (data || []).map((p: any) => ({
        ...p,
        image: p.images?.[0]?.thumbnail_url ? '🖼️' : '📦',
        thumbnail_url: p.images?.[0]?.thumbnail_url,
        category: p.category || 'অন্যান্য',
      }));
      
      if (reset) {
        setResults(formattedData);
        setTotal(count || 0);
        searchCache.set(cacheKey, { data: formattedData, total: count || 0, timestamp: Date.now() });
      } else {
        setResults(prev => [...prev, ...formattedData]);
      }
      
      setHasMore(formattedData.length === 20);
      
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Search error:', err);
      setError('সার্চ করতে সমস্যা হয়েছে');
      
      // লোকাল ফলব্যাক
      const localPosts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
      const filtered = localPosts.filter((p: any) => 
        !query || p.title?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 20));
      setTotal(filtered.length);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, filters, getCacheKey]);

  // ডিবাউন্স সার্চ (৪০০ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasFilters = query || filters.category || filters.location || filters.minPrice || filters.maxPrice;
      if (hasFilters) {
        setPage(1);
        performSearch(1, true);
      } else {
        setResults([]);
        setTotal(0);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, filters, performSearch]);

  // ইনফিনিট স্ক্রল
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore && results.length > 0) {
          const nextPage = page + 1;
          setPage(nextPage);
          performSearch(nextPage, false);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, page, performSearch, results.length]);

  // ক্লিনআপ
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const clearFilters = () => {
    setFilters({ category: '', location: '', minPrice: '', maxPrice: '', condition: '' });
    setQuery('');
    setPage(1);
  };

  const hasActiveFilters = query || filters.category || filters.location || filters.minPrice || filters.maxPrice || filters.condition;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 active:scale-95 transition">
              <X size={20} className="text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="পণ্য সার্চ করুন..."
                className="w-full p-3 pl-10 pr-12 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl transition ${showFilters ? 'bg-[#f85606] text-white' : 'bg-gray-100 text-[#f85606]'}`}>
              <Filter size={18} />
            </button>
          </div>

          {/* ফিল্টার প্যানেল */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-2 gap-3">
                <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">সব ক্যাটাগরি</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})} className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                  <option value="">সব অবস্থা</option>
                  <option value="new">নতুন</option>
                  <option value="old">পুরাতন</option>
                </select>
              </div>
              <input type="text" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} placeholder="📍 অঞ্চল" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} placeholder="৳ ন্যূনতম" className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white" />
                <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} placeholder="৳ সর্বোচ্চ" className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white" />
              </div>
              <button onClick={clearFilters} className="w-full text-center text-sm text-[#f85606] py-2 hover:underline">
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* রেজাল্ট */}
      <div className="max-w-4xl mx-auto p-4">
        
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {loading ? 'সার্চ হচ্ছে...' : `🔍 ${total} টি ফলাফল`}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-[#f85606] flex items-center gap-1">
              <X size={12} /> ক্লিয়ার
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => performSearch(1, true)} className="ml-auto text-sm text-red-600 underline">পুনরায় চেষ্টা</button>
          </div>
        )}

        {loading && results.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && results.length === 0 && hasActiveFilters && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো ফলাফল পাওয়া যায়নি</h2>
            <p className="text-gray-500 mb-6">আপনার সার্চের সাথে মিলে এমন কোনো পণ্য নেই</p>
            <button onClick={clearFilters} className="bg-[#f85606] text-white px-6 py-2 rounded-xl">ফিল্টার রিসেট করুন</button>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {results.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {loadingMore && <Loader2 className="animate-spin text-[#f85606]" size={24} />}
              {!hasMore && results.length > 0 && (
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span>🎉</span> সব পণ্য দেখানো হয়েছে
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}