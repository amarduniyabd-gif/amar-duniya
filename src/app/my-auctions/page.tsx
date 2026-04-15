"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gavel, Clock, Users, Eye, Trash2, Edit2, X } from "lucide-react";

type Auction = {
  id: number;
  title: string;
  currentPrice: number;
  image: string;
  endTime: string;
  totalBids: number;
  status: "active" | "ended";
};

const dummyAuctions: Auction[] = [
  { id: 1, title: "iPhone 15 Pro Max", currentPrice: 65000, image: "📱", endTime: "২ ঘন্টা বাকি", totalBids: 23, status: "active" },
  { id: 2, title: "MacBook Pro M2", currentPrice: 145000, image: "💻", endTime: "সমাপ্ত", totalBids: 45, status: "ended" },
];

export default function MyAuctionsPage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState(dummyAuctions);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<Auction | null>(null);

  const handleDelete = (id: number) => {
    setAuctions(auctions.filter(auction => auction.id !== id));
    setShowDeleteModal(null);
    alert("নিলাম ডিলিট করা হয়েছে!");
  };

  const handleEdit = (updatedAuction: Auction) => {
    setAuctions(auctions.map(auction => auction.id === updatedAuction.id ? updatedAuction : auction));
    setShowEditModal(null);
    alert("নিলাম আপডেট করা হয়েছে!");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            আমার নিলাম
          </h1>
        </div>

        <div className="space-y-3">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-4xl">
                  {auction.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{auction.title}</h3>
                  <p className="text-[#f85606] font-bold text-lg">৳{auction.currentPrice.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span><Clock size={12} /> {auction.endTime}</span>
                    <span><Users size={12} /> {auction.totalBids} বিড</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Link href={`/auction/${auction.id}`} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition">
                  <Eye size={14} /> দেখুন
                </Link>
                {auction.status === "active" && (
                  <button 
                    onClick={() => setShowEditModal(auction)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition"
                  >
                    <Edit2 size={14} /> এডিট
                  </button>
                )}
                <button 
                  onClick={() => setShowDeleteModal(auction.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-red-100 transition"
                >
                  <Trash2 size={14} /> ডিলিট
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ডিলিট কনফার্মেশন মডাল */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">নিলাম ডিলিট করুন</h3>
                <button onClick={() => setShowDeleteModal(null)}><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">আপনি কি এই নিলামটি ডিলিট করতে চান?</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(showDeleteModal)} className="flex-1 bg-red-600 text-white py-2 rounded-xl">হ্যাঁ, ডিলিট করুন</button>
                <button onClick={() => setShowDeleteModal(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl">বাতিল</button>
              </div>
            </div>
          </div>
        )}

        {/* এডিট মডাল */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">নিলাম এডিট করুন</h3>
                <button onClick={() => setShowEditModal(null)}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={showEditModal.title} onChange={(e) => setShowEditModal({...showEditModal, title: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" />
                <input type="number" value={showEditModal.currentPrice} onChange={(e) => setShowEditModal({...showEditModal, currentPrice: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 border rounded-xl" />
                <select value={showEditModal.status} onChange={(e) => setShowEditModal({...showEditModal, status: e.target.value as any})} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="active">সক্রিয়</option>
                  <option value="ended">সমাপ্ত</option>
                </select>
                <button onClick={() => handleEdit(showEditModal)} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold">সংরক্ষণ করুন</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}