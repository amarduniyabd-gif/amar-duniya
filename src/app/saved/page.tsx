"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Heart, Trash2, ShoppingBag, X, Loader2, AlertCircle, Eye 
} from "lucide-react";
type SavedItem = {
  id: string;
  post_id: string;
  title: string;
  price: number;
  thumbnail: string;
  seller_name: string;
  saved_at: string;
  views: number;
  condition: string;
};

export default function SavedPage() {
  const router = useRouter();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  // ============ সেভড আইটেম লোড ============
  useEffect(() => {
    const loadSavedItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/saved');
          return;
        }
        setCurrentUserId(user.id);

        const { data, error: fetchError } = await supabase
          .from('saved_posts')
          .select(`
            id,
            post_id,
            created_at,
            post:posts(
              id, title, price, condition, views,
              seller:profiles!seller_id(name),
              images:post_images(thumbnail_url, order_index)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedItems: SavedItem[] = (data || []).map((item: any) => ({
          id: item.id,
          post_id: item.post_id,
          title: item.post?.title || 'পণ্য',
          price: item.post?.price || 0,
          thumbnail: item.post?.images?.[0]?.thumbnail_url || '📦',
          seller_name: item.post?.seller?.name || 'বিক্রেতা',
          saved_at: timeAgo(item.created_at),
          views: item.post?.views || 0,
          condition: item.post?.condition === 'new' ? 'নতুন' : 'পুরাতন',
        }));

        setSavedItems(formattedItems);
        
        // লোকাল স্টোরেজে সেভ (ফলব্যাক)
        localStorage.setItem('savedItems', JSON.stringify(formattedItems));
      } catch (err: any) {
        console.error('Load error:', err);
        setError('সংরক্ষিত পণ্য লোড করতে সমস্যা হয়েছে!');
        
        // লোকাল ফলব্যাক
        const saved = localStorage.getItem('savedItems');
        if (saved) setSavedItems(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, [router]);

  // ============ টাইম এগো ============
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

  // ============ রিমুভ হ্যান্ডলার ============
  const handleRemove = useCallback(async (id: string) => {
    setRemoveLoading(true);
    
    try {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedItems(prev => prev.filter(item => item.id !== id));
      localStorage.setItem('savedItems', JSON.stringify(savedItems.filter(item => item.id !== id)));
      setShowRemoveModal(null);
    } catch (err) {
      alert('সরাতে সমস্যা হয়েছে!');
    } finally {
      setRemoveLoading(false);
    }
  }, [savedItems]);

  // ============ সব রিমুভ ============
  const handleRemoveAll = useCallback(async () => {
    if (!currentUserId) return;
    if (!confirm('সব সংরক্ষিত পণ্য সরাতে চান?')) return;

    setRemoveLoading(true);
    try {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', currentUserId);

      if (error) throw error;

      setSavedItems([]);
      localStorage.removeItem('savedItems');
    } catch (err) {
      alert('সরাতে সমস্যা হয়েছে!');
    } finally {
      setRemoveLoading(false);
    }
  }, [currentUserId]);

  // ============ লোডিং স্টেট ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
              সংরক্ষিত পণ্য {savedItems.length > 0 && `(${savedItems.length})`}
            </h1>
          </div>
          
          {savedItems.length > 0 && (
            <button
              onClick={handleRemoveAll}
              disabled={removeLoading}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg transition"
            >
              <Trash2 size={12} /> সব সরান
            </button>
          )}
        </div>

        {/* এরর */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="ml-auto text-sm text-red-600 underline">
              পুনরায় চেষ্টা
            </button>
          </div>
        )}

        {/* খালি স্টেট */}
        {savedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো সংরক্ষিত পণ্য নেই</h2>
            <p className="text-gray-500 mb-4">আপনার পছন্দের পণ্য ❤️ দিয়ে সংরক্ষণ করে রাখুন</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">
              পণ্য ব্রাউজ করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex gap-3">
                  {/* ইমেজ */}
                  <Link href={`/post/${item.post_id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl flex items-center justify-center text-4xl shadow-sm overflow-hidden">
                      {item.thumbnail.startsWith('http') ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span>{item.thumbnail}</span>
                      )}
                    </div>
                  </Link>
                  
                  {/* তথ্য */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/post/${item.post_id}`}>
                      <h3 className="font-bold text-gray-800 hover:text-[#f85606] transition truncate">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-[#f85606] font-black text-xl">৳{item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">👤 {item.seller_name}</span>
                      <span className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.condition === 'নতুন' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        {item.condition}
                      </span>
                      <span className="flex items-center gap-1"><Eye size={10} /> {item.views}</span>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 mt-1">📅 {item.saved_at}</p>
                  </div>
                  
                  {/* রিমুভ বাটন */}
                  <button 
                    onClick={() => setShowRemoveModal(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* অ্যাকশন বাটন */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link 
                    href={`/post/${item.post_id}`} 
                    className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
                  >
                    <ShoppingBag size={14} /> বিস্তারিত দেখুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* রিমুভ কনফার্মেশন মডাল */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRemoveModal(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">সংরক্ষিত তালিকা থেকে সরান</h3>
                <button onClick={() => setShowRemoveModal(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                আপনি কি এই পণ্যটি সংরক্ষিত তালিকা থেকে সরাতে চান?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleRemove(showRemoveModal)} 
                  disabled={removeLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {removeLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {removeLoading ? 'সরানো হচ্ছে...' : 'সরান'}
                </button>
                <button 
                  onClick={() => setShowRemoveModal(null)} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}