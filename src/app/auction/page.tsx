"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Users, Gavel, Heart, Eye, PlusCircle } from "lucide-react";

type Auction = {
  id: number;
  title: string;
  currentPrice: number;
  startPrice: number;
  image: string;
  endTime: string;
  totalBids: number;
  seller: string;
};

const dummyAuctions: Auction[] = [
  {
    id: 1,
    title: "iPhone 15 Pro Max - 128GB",
    currentPrice: 65000,
    startPrice: 50000,
    image: "📱",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    totalBids: 23,
    seller: "রহিম উদ্দিন",
  },
  {
    id: 2,
    title: "MacBook Pro M2 - 256GB",
    currentPrice: 145000,
    startPrice: 120000,
    image: "💻",
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    totalBids: 45,
    seller: "করিম মিয়া",
  },
  {
    id: 3,
    title: "Samsung Galaxy S23 Ultra",
    currentPrice: 85000,
    startPrice: 70000,
    image: "📱",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    totalBids: 67,
    seller: "শাহিনুর রহমান",
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
    <span className="flex items-center gap-1 text-xs font-semibold">
      <Clock size={12} className={timeLeft === "সমাপ্ত" ? "text-red-500" : "text-green-600"} />
      <span className={timeLeft === "সমাপ্ত" ? "text-red-500" : "text-gray-700"}>{timeLeft}</span>
    </span>
  );
}

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState(dummyAuctions);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* হেডার */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-[#f85606] flex items-center gap-2">
            <Gavel size={24} />
            লাইভ নিলাম
          </h1>
          <p className="text-xs text-gray-500 mt-1">বিড ফ্রি, জিতলে ২% কমিশন</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        
        {/* নতুন নিলাম তৈরি বাটন */}
        <Link href="/auction/create">
          <button className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md">
            <PlusCircle size={18} />
            নতুন নিলাম তৈরি করুন
          </button>
        </Link>

        {/* নিলাম লিস্ট */}
        {auctions.map((auction) => (
          <Link key={auction.id} href={`/auction/${auction.id}`}>
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-4xl">
                  {auction.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{auction.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{auction.seller}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400">বর্তমান দাম</span>
                      <span className="text-sm font-black text-[#f85606]">৳{auction.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400">মোট বিড</span>
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Users size={12} /> {auction.totalBids}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <Timer endTime={auction.endTime} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}