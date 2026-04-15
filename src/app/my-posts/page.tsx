"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Heart, Trash2, Edit2, MoreVertical, CheckCircle, X } from "lucide-react";

type Post = {
  id: number;
  title: string;
  price: number;
  image: string;
  views: number;
  likes: number;
  status: "active" | "sold" | "expired";
  time: string;
};

const dummyPosts: Post[] = [
  { id: 1, title: "iPhone 15 Pro Max", price: 75000, image: "📱", views: 1240, likes: 56, status: "active", time: "২ দিন আগে" },
  { id: 2, title: "MacBook Pro M2", price: 180000, image: "💻", views: 890, likes: 34, status: "active", time: "৫ দিন আগে" },
  { id: 3, title: "Samsung Galaxy S23", price: 95000, image: "📱", views: 2100, likes: 89, status: "sold", time: "৭ দিন আগে" },
];

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState(dummyPosts);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<Post | null>(null);

  const handleDelete = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    setShowDeleteModal(null);
    alert("পোস্ট ডিলিট করা হয়েছে!");
  };

  const handleEdit = (updatedPost: Post) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
    setShowEditModal(null);
    alert("পোস্ট আপডেট করা হয়েছে!");
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active": return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">সক্রিয়</span>;
      case "sold": return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">বিক্রিত</span>;
      case "expired": return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">মেয়াদোত্তীর্ণ</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            আমার পোস্ট
          </h1>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-4xl">
                  {post.image}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  <p className="text-[#f85606] font-bold text-lg">৳{post.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                    <span>📅 {post.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <Link href={`/post/${post.id}`} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition">
                  <Eye size={14} /> দেখুন
                </Link>
                <button 
                  onClick={() => setShowEditModal(post)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-gray-200 transition"
                >
                  <Edit2 size={14} /> এডিট
                </button>
                <button 
                  onClick={() => setShowDeleteModal(post.id)}
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
                <h3 className="text-lg font-bold">পোস্ট ডিলিট করুন</h3>
                <button onClick={() => setShowDeleteModal(null)}><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">আপনি কি এই পোস্টটি ডিলিট করতে চান?</p>
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
                <h3 className="text-lg font-bold">পোস্ট এডিট করুন</h3>
                <button onClick={() => setShowEditModal(null)}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={showEditModal.title} onChange={(e) => setShowEditModal({...showEditModal, title: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="পণ্যের নাম" />
                <input type="number" value={showEditModal.price} onChange={(e) => setShowEditModal({...showEditModal, price: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="দাম" />
                <select value={showEditModal.status} onChange={(e) => setShowEditModal({...showEditModal, status: e.target.value as any})} className="w-full p-3 bg-gray-50 border rounded-xl">
                  <option value="active">সক্রিয়</option>
                  <option value="sold">বিক্রিত</option>
                  <option value="expired">মেয়াদোত্তীর্ণ</option>
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