"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Grid3x3, Loader2, Heart, Eye } from 'lucide-react';
import { getCategoryBySlug, getSubCategories, categories } from '@/data/categories';
import { getSupabaseClient } from '@/lib/supabase/client';

type Post = {
  id: string;
  title: string;
  price: number;
  condition: string;
  location: string;
  created_at: string;
  is_urgent: boolean;
  is_featured: boolean;
  views: number;
  likes: number;
  post_images: any[];
  seller: any;
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

// পোস্ট কার্ড
// পোস্ট কার্ড
const PostCard = ({ post }: { post: Post }) => (
  <Link href={`/post/${post.id}`}>
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="relative h-40 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        {post.post_images?.[0]?.thumbnail_url ? (
          <img src={post.post_images[0].thumbnail_url} alt={post.title} className="w-full h-full object-contain p-2" loading="lazy" />
        ) : (
          <div className="text-5xl">📦</div>
        )}
        {post.is_urgent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">জরুরি</div>
        )}
        {post.is_featured && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">⭐ ফিচার্ড</div>
        )}
        <button className="absolute bottom-2 right-2 p-1.5 bg-white/80 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition">
          <Heart size={14} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 group-hover:text-[#f85606] transition-colors">
          {post.title}
        </h3>
        <p className="text-[#f85606] font-bold text-lg mt-1">৳{post.price.toLocaleString()}</p>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
          <span>{post.location}</span>
          <span className="flex items-center gap-1"><Eye size={10} /> {post.views || 0}</span>
        </div>
        <p className="text-[9px] text-gray-400 mt-1">{timeAgo(post.created_at)}</p>
      </div>
    </div>
  </Link>
);

// স্কেলেটন কার্ড
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // ক্যাটাগরি ডাটা
  const currentCategory = useMemo(() => getCategoryBySlug(slug), [slug]);
  const subCategories = useMemo(() => currentCategory ? getSubCategories(currentCategory.id) : [], [currentCategory]);
  
  // পোস্ট লোড
const loadPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
  if (!currentCategory) return;
  
  if (reset) setLoading(true);
  else setLoadingMore(true);
  
  try {
    // ডাইনামিক import
    const { getSupabaseClient } = await import('@/lib/supabase/client');
    const supabase = getSupabaseClient();
    
    const from = (pageNum - 1) * 12;
    const to = from + 11;
    
    let query = supabase
      .from('posts')
      .select(`
        id, title, price, condition, location, created_at, is_urgent, is_featured, views, likes,
        seller:profiles!seller_id(id, name, is_verified),
        post_images(thumbnail_url, order_index)
      `, { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(from, to);
    
    // ক্যাটাগরি ফিল্টার
    if (currentCategory.id === 'matrimony') {
      query = query.eq('category_id', currentCategory.id);
    } else {
      const categoryIds = [currentCategory.id, ...subCategories.map((s: any) => s.id)];
      query = query.in('category_id', categoryIds);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.log('Supabase error, using local storage');
      throw error;
    }
    
    if (reset) {
      setPosts(data || []);
    } else {
      setPosts(prev => [...prev, ...(data || [])]);
    }
    
    setTotalPosts(count || 0);
    setHasMore((data?.length || 0) === 12);
    
  } catch (error: any) {
    console.log('Using local storage fallback');
    
    // লোকাল স্টোরেজ ফলব্যাক
    const localPosts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
    const filtered = localPosts.filter((p: any) => {
      if (currentCategory.id === 'matrimony') {
        return p.category === currentCategory.id;
      }
      return p.category === currentCategory.id || 
             subCategories.some((s: any) => s.id === p.subCategory);
    });
    
    const paginated = filtered.slice(0, 12);
    
    if (reset) {
      setPosts(paginated);
    } else {
      setPosts(prev => [...prev, ...filtered.slice((pageNum - 1) * 12, pageNum * 12)]);
    }
    
    setTotalPosts(filtered.length);
    setHasMore(filtered.length > pageNum * 12);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
}, [currentCategory, subCategories]);
  
  useEffect(() => {
    if (currentCategory) {
      loadPosts(1, true);
    }
  }, [currentCategory, loadPosts]);
  
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage, false);
    }
  }, [page, loadingMore, hasMore, loadPosts]);
  
  // স্ক্রল ট্রিগার
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);
  
  // ক্যাটাগরি না পাওয়া গেলে
  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ক্যাটাগরি পাওয়া যায়নি</h1>
          <p className="text-gray-500 mb-4">আপনার খুঁজা ক্যাটাগরিটি বিদ্যমান নেই</p>
          <Link href="/" className="bg-[#f85606] text-white px-6 py-2 rounded-lg inline-block">
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  // পাত্র-পাত্রী ক্যাটাগরির জন্য বিশেষ হ্যান্ডলিং
  if (currentCategory.id === "matrimony") {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b shadow-sm flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-[#f85606]">{currentCategory.name}</h1>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl shadow-sm p-6 text-center border border-pink-100">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              পাত্র-পাত্রী বিভাগে স্বাগতম
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              এখানে আপনি পাত্র বা পাত্রী খুঁজতে পারবেন। ছবি দেখতে ছোট একটি চার্জ প্রযোজ্য হবে।
            </p>
            <Link 
              href="/category/matrimony" 
              className="inline-block bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              পাত্র-পাত্রী দেখুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 active:scale-95 transition">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-[#f85606]">{currentCategory.name}</h1>
        <span className="text-xs text-gray-400 ml-auto">{totalPosts} টি পোস্ট</span>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        
        {/* সাব-ক্যাটাগরি গ্রিড */}
        {subCategories.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 size={18} className="text-[#f85606]" />
              <h2 className="text-sm font-medium text-gray-500">সাব-ক্যাটাগরি</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {subCategories.map((subCat: any) => (
                <Link
                  key={subCat.id}
                  href={`/category/${subCat.slug}`}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group text-center"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {subCat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xs group-hover:text-[#f85606]">
                    {subCat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* পোস্ট লিস্ট */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <span>📦</span> সব পোস্ট
          </h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
            
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-[#f85606]" size={24} />
              </div>
            )}
            
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-gray-400">🎉 সব পোস্ট দেখানো হয়েছে</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">কোনো পোস্ট নেই</h2>
            <p className="text-gray-400 text-sm mb-6">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই</p>
            <Link 
              href={`/post-ad?category=${currentCategory.id}`} 
              className="bg-[#f85606] text-white px-6 py-3 rounded-xl inline-block font-semibold shadow-md hover:shadow-lg transition"
            >
              প্রথম পোস্ট দিন
            </Link>
          </div>
        )}

        {/* নতুন ক্যাটাগরি লিংক */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <Link
            href="/post-ad"
            className="flex items-center justify-center gap-2 text-gray-500 text-sm hover:text-[#f85606] transition-colors"
          >
            <span>➕</span>
            <span>আপনার পণ্যের ক্যাটাগরি এখানে নেই? নতুন ক্যাটাগরিতে পোস্ট করুন</span>
          </Link>
        </div>

      </div>
    </div>
  );
}