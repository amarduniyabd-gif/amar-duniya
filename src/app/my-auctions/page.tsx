"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Gavel, Clock, Users, Eye, 
  PlusCircle, Trash2, Edit, Loader2, AlertCircle
} from "lucide-react";
type MyAuction = {
  id: string;
  title: string;
  current_price: number;
  start_price: number;
  image: string;
  end_time: string;
  total_bids: number;
  status: string;
  views: number;
};

// টাইমার কম্পোনেন্ট
function Timer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("সমাপ্ত");
        setIsEnded(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours}ঘ ${minutes}ম ${seconds}স`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${isEnded ? "text-red-500" : "text-green-600"}`}>
      <Clock size={12} />
      {timeLeft}
    </span>
  );
}

export default function MyAuctionsPage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<MyAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  

  // ============ নিলাম লোড ============
  useEffect(() => {
    const loadAuctions = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/my-auctions');
          return;
        }
        setCurrentUserId(user.id);

        const { data, error: fetchError } = await supabase
          .from('auctions')
          .select(`
            id, title, current_price, start_price, end_time, status, views,
            images:auction_images(thumbnail_url, order_index),
            bids:bids(count)
          `)
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedAuctions: MyAuction[] = (data || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          current_price: a.current_price || a.start_price,
          start_price: a.start_price,
          image: a.images?.[0]?.thumbnail_url ? '🖼️' : '🔨',
          thumbnail_url: a.images?.[0]?.thumbnail_url,
          end_time: a.end_time,
          total_bids: a.bids?.[0]?.count || 0,
          status: a.status,
          views: a.views || 0,
        }));

        setAuctions(formattedAuctions);
        
        // লোকাল স্টোরেজে সেভ (ফলব্যাক)
        localStorage.setItem('myAuctions', JSON.stringify(formattedAuctions));
      } catch (err: any) {
        console.error('Load error:', err);
        setError('নিলাম লোড করতে সমস্যা হয়েছে!');
        
        // লোকাল ফলব্যাক
        const saved = localStorage.getItem('myAuctions');
        if (saved) setAuctions(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    loadAuctions();
  }, [router]);

  // ============ ডিলিট হ্যান্ডলার ============
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('নিলাম ডিলিট করবেন? এই কাজটি আনডু করা যাবে না।')) return;

    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAuctions(prev => prev.filter(a => a.id !== id));
      localStorage.setItem('myAuctions', JSON.stringify(auctions.filter(a => a.id !== id)));
    } catch (err) {
      alert('ডিলিট করতে সমস্যা হয়েছে!');
    } finally {
      setDeleteLoading(null);
    }
  }, [auctions]);

  // ============ স্ট্যাটাস ব্যাজ ============
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />চলমান</span>;
      case 'ended': return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">সমাপ্ত</span>;
      case 'cancelled': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">বাতিল</span>;
      case 'pending': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">পেন্ডিং</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 active:scale-95 transition">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                আমার নিলাম {auctions.length > 0 && `(${auctions.length})`}
              </h1>
            </div>
            <Link href="/auction/create">
              <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition active:scale-95">
                <PlusCircle size={16} />
                নতুন নিলাম
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        
        {/* এরর */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="ml-auto text-sm text-red-600 underline">
              পুনরায় চেষ্টা
            </button>
          </div>
        )}

        {/* নিলাম লিস্ট */}
        {auctions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🔨</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো নিলাম নেই</h2>
            <p className="text-gray-500 mb-6">আপনি এখনো কোনো নিলাম তৈরি করেননি</p>
            <Link href="/auction/create">
              <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">
                প্রথম নিলাম তৈরি করুন
              </button>
            </Link>
          </div>
        ) : (
          auctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-4xl shadow-sm">
                  {auction.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 truncate">{auction.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(auction.status)}
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} /> {auction.views}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2 flex-shrink-0">
                      {auction.status === 'active' && (
                        <>
                          <Link href={`/auction/${auction.id}/edit`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Edit size={16} />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(auction.id)}
                            disabled={deleteLoading === auction.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          >
                            {deleteLoading === auction.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div>
                      <p className="text-[10px] text-gray-400">বর্তমান দাম</p>
                      <p className="text-sm font-black text-[#f85606]">৳{auction.current_price?.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400">শুরু দাম</p>
                      <p className="text-sm font-semibold text-gray-700">৳{auction.start_price?.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400">মোট বিড</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Users size={12} /> {auction.total_bids}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400">{auction.status === 'active' ? 'বাকি সময়' : 'শেষ হয়েছে'}</p>
                      {auction.status === 'active' ? (
                        <Timer endTime={auction.end_time} />
                      ) : (
                        <span className="text-xs text-gray-500">সমাপ্ত</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {auction.status === 'active' && (
                <Link href={`/auction/${auction.id}`}>
                  <button className="w-full mt-3 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition active:scale-[0.99]">
                    নিলাম দেখুন
                  </button>
                </Link>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}
