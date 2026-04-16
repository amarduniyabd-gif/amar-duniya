"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Gavel, Clock, Users, Eye, 
  PlusCircle, Trash2, Edit, TrendingUp, Crown
} from "lucide-react";

type MyAuction = {
  id: number;
  title: string;
  currentPrice: number;
  startPrice: number;
  image: string;
  endTime: string;
  totalBids: number;
  status: 'active' | 'ended' | 'sold';
  views: number;
};

const dummyMyAuctions: MyAuction[] = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - 128GB",
    currentPrice: 65000,
    startPrice: 50000,
    image: "📱",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    totalBids: 23,
    status: 'active',
    views: 1240,
  },
  {
    id: 2,
    title: "MacBook Pro M2 - 256GB",
    currentPrice: 145000,
    startPrice: 120000,
    image: "💻",
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    totalBids: 45,
    status: 'ended',
    views: 890,
  },
];

function Timer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("সমাপ্ত");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (3600000)) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours}ঘ ${minutes}ম ${seconds}স`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${timeLeft === "সমাপ্ত" ? "text-red-500" : "text-green-600"}`}>
      <Clock size={12} />
      {timeLeft}
    </span>
  );
}

export default function MyAuctionsPage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState(dummyMyAuctions);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
    if (loggedIn !== "true") {
      router.push("/login");
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">চলমান</span>;
      case 'ended':
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">সমাপ্ত</span>;
      case 'sold':
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">বিক্রিত</span>;
      default:
        return null;
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                আমার নিলাম
              </h1>
            </div>
            <Link href="/auction/create">
              <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                <PlusCircle size={16} />
                নতুন নিলাম
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        
        {/* নিলাম লিস্ট */}
        {auctions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔨</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো নিলাম নেই</h2>
            <p className="text-gray-500 mb-6">আপনি এখনো কোনো নিলাম তৈরি করেননি</p>
            <Link href="/auction/create">
              <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-2 rounded-xl">
                প্রথম নিলাম তৈরি করুন
              </button>
            </Link>
          </div>
        ) : (
          auctions.map((auction) => (
            <div key={auction.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-[#f85606]/10">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-4xl">
                  {auction.image}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{auction.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(auction.status)}
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} /> {auction.views}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {auction.status === 'active' && (
                        <>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-[10px] text-gray-400">বর্তমান দাম</p>
                      <p className="text-sm font-black text-[#f85606]">৳{auction.currentPrice.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400">শুরু দাম</p>
                      <p className="text-sm font-semibold text-gray-700">৳{auction.startPrice.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400">মোট বিড</p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Users size={12} /> {auction.totalBids}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-[10px] text-gray-400">{auction.status === 'active' ? 'বাকি সময়' : 'শেষ হয়েছে'}</p>
                      {auction.status === 'active' ? (
                        <Timer endTime={auction.endTime} />
                      ) : (
                        <span className="text-xs text-gray-500">সমাপ্ত</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {auction.status === 'active' && (
                <Link href={`/auction/${auction.id}`}>
                  <button className="w-full mt-3 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2 rounded-xl text-sm font-semibold">
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