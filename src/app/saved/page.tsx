"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Trash2, ShoppingBag, X } from "lucide-react";

type SavedItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  seller: string;
  savedAt: string;
};

const dummySavedItems: SavedItem[] = [
  { id: 1, title: "iPhone 15 Pro Max", price: 75000, image: "📱", seller: "রহিম উদ্দিন", savedAt: "২ দিন আগে" },
  { id: 2, title: "MacBook Pro M2", price: 180000, image: "💻", seller: "করিম মিয়া", savedAt: "৩ দিন আগে" },
  { id: 3, title: "Samsung Galaxy S23", price: 95000, image: "📱", seller: "শাহিনুর রহমান", savedAt: "৫ দিন আগে" },
  { id: 4, title: "Nike Air Max", price: 8500, image: "👟", seller: "জবের আহমেদ", savedAt: "১ সপ্তাহ আগে" },
];

export default function SavedPage() {
  const router = useRouter();
  const [savedItems, setSavedItems] = useState(dummySavedItems);
  const [showRemoveModal, setShowRemoveModal] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
    setShowRemoveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            সংরক্ষিত পণ্য
          </h1>
        </div>

        {savedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো সংরক্ষিত পণ্য নেই</h2>
            <p className="text-gray-500 mb-4">আপনার পছন্দের পণ্য সংরক্ষণ করে রাখুন</p>
            <Link href="/" className="inline-block bg-[#f85606] text-white px-6 py-2 rounded-xl">
              পণ্য ব্রাউজ করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-4xl">
                    {item.image}
                  </div>
                  <div className="flex-1">
                    <Link href={`/post/${item.id}`}>
                      <h3 className="font-bold text-gray-800 hover:text-[#f85606] transition">{item.title}</h3>
                    </Link>
                    <p className="text-[#f85606] font-bold text-lg">৳{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>👤 {item.seller}</span>
                      <span>📅 {item.savedAt}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRemoveModal(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link href={`/post/${item.id}`} className="flex-1 bg-[#f85606] text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1">
                    <ShoppingBag size={14} /> এখনই কিনুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* রিমুভ কনফার্মেশন মডাল */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">সংরক্ষিত তালিকা থেকে সরান</h3>
                <button onClick={() => setShowRemoveModal(null)}><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">আপনি কি এই পণ্যটি সংরক্ষিত তালিকা থেকে সরাতে চান?</p>
              <div className="flex gap-3">
                <button onClick={() => handleRemove(showRemoveModal)} className="flex-1 bg-red-600 text-white py-2 rounded-xl">সরান</button>
                <button onClick={() => setShowRemoveModal(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl">বাতিল</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}