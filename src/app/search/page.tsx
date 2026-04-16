"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, X, Filter, Heart, Eye, MapPin, 
  Loader2, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  location: string;
  image: string;
  views: number;
};

// সিম্পল ক্যাশিং সিস্টেম
const searchCache = new Map<string, { data: Product[]; total: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 মিনিট

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // অ্যাবর্ট কন্ট্রোলারের জন্য রেফারেন্স
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  // ক্যাশ কী জেনারেটর
  const getCacheKey = useCallback(() => {
    return JSON.stringify({ query, filters });
  }, [query, filters]);

  // সার্চ ফাংশন (অ্যাবর্ট + ক্যাশ + রেট লিমিট সহ)
  const performSearch = useCallback(async () => {
    // আগের পেন্ডিং রিকোয়েস্ট বাতিল করুন
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // নতুন অ্যাবর্ট কন্ট্রোলার তৈরি করুন
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setLoading(true);
    setError(null);
    
    const cacheKey = getCacheKey();
    
    // ক্যাশ চেক করুন
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setResults(cached.data);
      setTotal(cached.total);
      setLoading(false);
      return;
    }
    
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    try {
      const response = await fetch(`/api/search?${params.toString()}`, {
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        throw new Error('সার্চ করতে সমস্যা হয়েছে');
      }
      
      const data = await response.json();
      setResults(data.data);
      setTotal(data.total);
      
      // ক্যাশে সেভ করুন
      searchCache.set(cacheKey, {
        data: data.data,
        total: data.total,
        timestamp: Date.now(),
      });
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // রিকোয়েস্ট বাতিল হয়েছে, কিছু করবেন না
        return;
      }
      setError(err.message || 'সার্চ করতে সমস্যা হয়েছে');
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, [query, filters, getCacheKey]);

  // ডিবাউন্স সার্চ (৫০০ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query || filters.category || filters.location || filters.minPrice || filters.maxPrice) {
        performSearch();
      } else if (!query && !filters.category && !filters.location && !filters.minPrice && !filters.maxPrice) {
        setResults([]);
        setTotal(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, filters, performSearch]);

  // ক্লিনআপ (কম্পোনেন্ট আনমাউন্ট হলে)
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const categories = ["মোবাইল", "কম্পিউটার", "ইলেকট্রনিক্স", "ফ্যাশন", "গাড়ি", "চাকরি", "সার্ভিস"];

  const clearFilters = () => {
    setFilters({ category: '', location: '', minPrice: '', maxPrice: '' });
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2">
              <X size={20} className="text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="পণ্য, ক্যাটাগরি বা লোকেশন সার্চ করুন..."
                className="w-full p-3 pl-10 pr-12 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-gray-100 rounded-xl"
            >
              <Filter size={18} className="text-[#f85606]" />
            </button>
          </div>

          {/* ফিল্টার প্যানেল */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="p-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">সব ক্যাটাগরি</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  placeholder="অঞ্চল"
                  className="p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  placeholder="ন্যূনতম দাম"
                  className="p-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="সর্বোচ্চ দাম"
                  className="p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={clearFilters}
                className="w-full text-center text-sm text-[#f85606] py-2 hover:underline"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* রেজাল্ট */}
      <div className="max-w-4xl mx-auto p-4">
        
        {/* সারাংশ */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {loading ? 'সার্চ হচ্ছে...' : `${total} টি ফলাফল পাওয়া গেছে`}
          </p>
          {query && !loading && (
            <p className="text-sm text-gray-400">
              "{query}" এর জন্য
            </p>
          )}
        </div>

        {/* এরর মেসেজ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => performSearch()} className="ml-auto text-sm text-red-600 underline">
              পুনরায় চেষ্টা
            </button>
          </div>
        )}

        {/* লোডিং */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#f85606]" />
          </div>
        )}

        {/* নো রেজাল্ট */}
        {!loading && !error && results.length === 0 && (query || filters.category || filters.location || filters.minPrice || filters.maxPrice) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো ফলাফল পাওয়া যায়নি</h2>
            <p className="text-gray-500 mb-6">আপনার সার্চের সাথে মিলে এমন কোনো পণ্য নেই</p>
            <button onClick={clearFilters} className="bg-[#f85606] text-white px-6 py-2 rounded-xl">
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

        {/* রেজাল্ট গ্রিড */}
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((product) => (
              <Link key={product.id} href={`/post/${product.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-4 flex items-center justify-center h-32">
                    <div className="text-5xl">{product.image}</div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-1 group-hover:text-[#f85606]">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin size={10} />
                      <span>{product.location}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-black text-[#f85606]">৳{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye size={10} /> {product.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}