"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Gavel, Clock, Users, Heart, Share2, Flag, 
  User, MapPin, Eye, CheckCircle, AlertCircle, ChevronLeft, 
  ChevronRight, MessageCircle, Phone, TrendingUp, Award,
  Zap, BarChart3, Settings, X
} from "lucide-react";

type Bid = {
  id: number;
  userName: string;
  userAvatar: string;
  amount: number;
  time: string;
};

type Auction = {
  id: number;
  title: string;
  currentPrice: number;
  startPrice: number;
  minIncrement: number;
  images: string[];
  endTime: string;
  totalBids: number;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    totalAuctions: number;
  };
  description: string;
  location: string;
  views: number;
  condition: string;
  brand: string;
  warranty: string;
};

// ডামি ডাটা
const getAuctionById = (id: string): Auction => {
  return {
    id: parseInt(id),
    title: "iPhone 15 Pro Max - 128GB",
    currentPrice: 65000,
    startPrice: 50000,
    minIncrement: 1000,
    images: ["📱", "📱", "📱", "📱"],
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    totalBids: 23,
    seller: {
      name: "রহিম উদ্দিন",
      rating: 4.8,
      verified: true,
      totalAuctions: 12,
    },
    description: "ব্র্যান্ড নতুন iPhone 15 Pro Max। 128GB স্টোরেজ, ফুল বক্স সহ।",
    location: "ঢাকা",
    views: 1240,
    condition: "new",
    brand: "Apple",
    warranty: "12",
  };
};

const getBids = (): Bid[] => {
  return [
    { id: 1, userName: "করিম মিয়া", userAvatar: "👨", amount: 65000, time: "২ মিনিট আগে" },
    { id: 2, userName: "জবের আহমেদ", userAvatar: "👨", amount: 64000, time: "৫ মিনিট আগে" },
    { id: 3, userName: "শাহিনুর রহমান", userAvatar: "👨", amount: 63000, time: "১০ মিনিট আগে" },
  ];
};

// টাইমার কম্পোনেন্ট
function Timer({ endTime, onEnd }: { endTime: string; onEnd: () => void }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isEnded: false });

  useEffect(() => {
    const interval = setInterval(() => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
        onEnd();
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (3600000)) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft({ hours, minutes, seconds, isEnded: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  if (timeLeft.isEnded) {
    return <div className="text-center bg-red-100 rounded-xl p-3"><span className="text-red-600 font-bold">নিলাম সমাপ্ত!</span></div>;
  }

  return (
    <div className="bg-gradient-to-r from-[#f85606] to-orange-500 rounded-xl p-4 text-center text-white">
      <p className="text-xs opacity-90">নিলাম শেষ হতে বাকি</p>
      <div className="text-2xl md:text-3xl font-bold font-mono">
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

// গ্যালারি কম্পোনেন্ট
function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevImage = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white">
      <div className="relative h-80 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-8xl">{images[activeIndex]}</div>
        {images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md">
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button key={idx} onClick={() => setActiveIndex(idx)} className={`h-1.5 rounded-full transition-all ${activeIndex === idx ? "w-6 bg-[#f85606]" : "w-1.5 bg-gray-400"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto border-t">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setActiveIndex(idx)} className={`w-16 h-16 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-2xl border-2 transition ${activeIndex === idx ? "border-[#f85606]" : "border-transparent"}`}>
              {img}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;
  
  const [auction, setAuction] = useState(() => getAuctionById(auctionId));
  const [bids, setBids] = useState(() => getBids());
  const [bidAmount, setBidAmount] = useState(auction.currentPrice + auction.minIncrement);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const handleBid = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (isAuctionEnded) {
      alert("নিলাম শেষ হয়ে গেছে!");
      return;
    }
    if (bidAmount < auction.currentPrice + auction.minIncrement) {
      alert(`সর্বনিম্ন বিড ${(auction.currentPrice + auction.minIncrement).toLocaleString()} টাকা`);
      return;
    }
    
    const newBid: Bid = {
      id: bids.length + 1,
      userName: "বর্তমান ব্যবহারকারী",
      userAvatar: "👤",
      amount: bidAmount,
      time: "এখনই",
    };
    
    setBids([newBid, ...bids]);
    setAuction({
      ...auction,
      currentPrice: bidAmount,
      totalBids: auction.totalBids + 1,
    });
    setBidAmount(bidAmount + auction.minIncrement);
    alert("বিড সফল হয়েছে!");
  };

  const handleAuctionEnd = () => {
    setIsAuctionEnded(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("লিংক কপি হয়েছে!");
      setShowShareModal(false);
    } catch (err) {
      alert("লিংক কপি করতে সমস্যা হয়েছে");
    }
  };

  const getWarrantyText = (months: string) => {
    switch(months) {
      case "1": return "১ মাস ওয়ারেন্টি";
      case "3": return "৩ মাস ওয়ারেন্টি";
      case "6": return "৬ মাস ওয়ারেন্টি";
      case "12": return "১ বছর ওয়ারেন্টি";
      case "24": return "২ বছর ওয়ারেন্টি";
      default: return null;
    }
  };

  const highestBid = bids.length > 0 ? bids[0].amount : auction.startPrice;

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b shadow-sm flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1"><ArrowLeft size={24} className="text-gray-600" /></button>
        <div className="flex gap-3">
          <button onClick={() => setIsLiked(!isLiked)} className="p-1"><Heart size={22} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500"} /></button>
          <button onClick={() => setShowShareModal(true)} className="p-1"><Share2 size={22} className="text-gray-500" /></button>
          <button onClick={() => setShowReportModal(true)} className="p-1"><Flag size={22} className="text-gray-500" /></button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        
        <ImageGallery images={auction.images} />

        <div className="p-4 space-y-4">
          
          {/* টাইটেল ও ব্যাজ */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">{auction.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${auction.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {auction.condition === 'new' ? '✨ নতুন' : '📦 পুরাতন'}
              </span>
              {auction.brand && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🏷️ {auction.brand}</span>}
              {getWarrantyText(auction.warranty) && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🛡️ {getWarrantyText(auction.warranty)}</span>}
            </div>
          </div>

          {/* প্রাইস ও টাইমার */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">বর্তমান দাম</p>
                <div className="text-2xl md:text-3xl font-black text-[#f85606]">৳{auction.currentPrice.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">স্টার্ট: ৳{auction.startPrice.toLocaleString()}</p>
              </div>
              <Timer endTime={auction.endTime} onEnd={handleAuctionEnd} />
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>⭐ {auction.seller.rating}</span>
              <span>•</span>
              <span>🔍 {auction.views} বার দেখা</span>
              <span>•</span>
              <span>📊 {auction.totalBids} টি বিড</span>
            </div>
          </div>

          {/* বিড সেকশন - বাটন ঠিক করা */}
          {!isAuctionEnded ? (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                আপনার বিড (ন্যূনতম ৳{(auction.currentPrice + auction.minIncrement).toLocaleString()})
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="number" 
                  value={bidAmount} 
                  onChange={(e) => setBidAmount(parseInt(e.target.value))} 
                  className="flex-1 p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]" 
                />
                <button 
                  onClick={handleBid} 
                  className="bg-[#f85606] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Gavel size={18} /> বিড করুন
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[10px] text-gray-400">✓ বিড ফ্রি</p>
                <p className="text-[10px] text-gray-400">✓ জিতলে ২% কমিশন</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <Award size={40} className="mx-auto text-green-600 mb-2" />
              <p className="text-green-700 font-bold">নিলাম সমাপ্ত!</p>
              <p className="text-sm text-green-600">বিজয়ী: করিম মিয়া (৳{highestBid.toLocaleString()})</p>
            </div>
          )}

          {/* বিড হিস্ট্রি */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Users size={18} className="text-[#f85606]" /> বিড হিস্ট্রি ({bids.length})</h2>
              <span className="text-xs text-gray-400">সর্বোচ্চ: ৳{highestBid.toLocaleString()}</span>
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {bids.map((bid, idx) => (
                <div key={bid.id} className={`flex justify-between items-center py-3 border-b border-gray-100 ${idx === 0 ? "bg-green-50 -mx-2 px-2 rounded-lg" : ""}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">{bid.userAvatar}</div>
                    <div><p className="font-medium text-sm text-gray-800">{bid.userName}</p><p className="text-[10px] text-gray-400">{bid.time}</p></div>
                  </div>
                  <div className="text-right"><p className="font-bold text-[#f85606]">৳{bid.amount.toLocaleString()}</p>{idx === 0 && <span className="text-[8px] text-green-600">সর্বোচ্চ বিড</span>}</div>
                </div>
              ))}
            </div>
          </div>

          {/* বিক্রেতার তথ্য */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><User size={18} className="text-[#f85606]" /> বিক্রেতার তথ্য</h2>
            <div className="flex justify-between items-center">
              <div><p className="font-medium">{auction.seller.name}</p><div className="flex items-center gap-2 text-xs text-gray-500 mt-1"><span>⭐ {auction.seller.rating}</span><span>•</span><span>{auction.seller.totalAuctions} টি নিলাম</span></div></div>
              {auction.seller.verified && <div className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> ভেরিফাইড</div>}
            </div>
            <button onClick={() => setShowPhone(!showPhone)} className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-xl flex items-center justify-center gap-2"><Phone size={16} /> {showPhone ? auction.seller.name : "ফোন নম্বর দেখুন"}</button>
            {showPhone && <div className="mt-2 text-center"><a href={`tel:017XXXXXXXX`} className="text-sm text-[#f85606]">017XXXXXXXX</a></div>}
          </div>

          {/* বিবরণ ও লোকেশন */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Eye size={18} className="text-[#f85606]" /> পণ্যের বিবরণ</h2>
            <p className="text-sm text-gray-600">{auction.description}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2"><MapPin size={16} className="text-gray-400" /><span className="text-sm text-gray-600">{auction.location}</span></div>
          </div>

        </div>
      </div>

      {/* মডাল গুলো */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">শেয়ার করুন</h3><button onClick={() => setShowShareModal(false)}><X size={20} /></button></div>
            <button onClick={handleShare} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold">ওয়াটসঅ্যাপে শেয়ার করুন</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("লিংক কপি হয়েছে!"); setShowShareModal(false); }} className="w-full mt-2 bg-gray-200 py-3 rounded-xl">লিংক কপি করুন</button>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">রিপোর্ট করুন</h3><button onClick={() => setShowReportModal(false)}><X size={20} /></button></div>
            <p className="text-sm text-gray-600 mb-4">আপনি কি এই নিলামটি রিপোর্ট করতে চান?</p>
            <button onClick={() => { alert("রিপোর্ট করা হয়েছে"); setShowReportModal(false); }} className="w-full bg-[#f85606] text-white py-3 rounded-xl">হ্যাঁ, রিপোর্ট করুন</button>
            <button onClick={() => setShowReportModal(false)} className="w-full mt-2 bg-gray-200 py-3 rounded-xl">বাতিল</button>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-2">লগইন প্রয়োজন</h3>
            <p className="text-sm text-gray-600 mb-4">বিড করতে অনুগ্রহ করে লগইন করুন।</p>
            <Link href="/login" className="block w-full bg-[#f85606] text-white py-3 rounded-xl text-center">লগইন করুন</Link>
            <button onClick={() => setShowLoginModal(false)} className="w-full mt-2 bg-gray-200 py-3 rounded-xl">বাতিল</button>
          </div>
        </div>
      )}

    </div>
  );
}