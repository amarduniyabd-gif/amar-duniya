"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Search, CheckCircle, XCircle, Trash2, Eye, 
  Filter, Calendar, DollarSign, Users, Award, Edit2, 
  AlertCircle, BarChart3, FileText, Send, RefreshCw,
  Star, Clock, TrendingUp, Image, MessageCircle, Share2,
  MoreVertical, PlusCircle, Download, Printer } from "lucide-react";

type Post = {
  id: number;
  title: string;
  seller: string;
  sellerId: number;
  price: number;
  category: string;
  subCategory: string;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  images: string[];
  description: string;
  location: string;
  condition: 'new' | 'old';
  brand: string;
  warranty: string;
  featured: boolean;
  urgent: boolean;
};

const dummyPosts: Post[] = [
  { id: 1, title: "iPhone 15 Pro Max - 128GB", seller: "রহিম উদ্দিন", sellerId: 1, price: 75000, category: "মোবাইল", subCategory: "iPhone", status: "pending", date: "2026-04-16", views: 1240, likes: 56, comments: 12, shares: 8, images: ["📱", "📱"], description: "ব্র্যান্ড নতুন আইফোন, ফুল বক্স সহ", location: "ঢাকা", condition: "new", brand: "Apple", warranty: "1 year", featured: false, urgent: true },
  { id: 2, title: "MacBook Pro M2 - 256GB", seller: "করিম মিয়া", sellerId: 2, price: 180000, category: "কম্পিউটার", subCategory: "Laptop", status: "approved", date: "2026-04-15", views: 890, likes: 34, comments: 5, shares: 3, images: ["💻"], description: "ম্যাকবুক প্রো, ৮জিবি র্যাম", location: "চট্টগ্রাম", condition: "new", brand: "Apple", warranty: "2 years", featured: true, urgent: false },
  { id: 3, title: "Samsung Galaxy S23 Ultra", seller: "শাহিনুর রহমান", sellerId: 3, price: 95000, category: "মোবাইল", subCategory: "Samsung", status: "rejected", date: "2026-04-14", views: 2100, likes: 89, comments: 23, shares: 15, images: ["📱", "📱", "📱"], description: "স্যামসাং ফ্ল্যাগশিপ", location: "খুলনা", condition: "new", brand: "Samsung", warranty: "1 year", featured: false, urgent: false },
  { id: 4, title: "Nike Air Max", seller: "আব্দুল করিম", sellerId: 4, price: 12000, category: "ফ্যাশন", subCategory: "Shoes", status: "pending", date: "2026-04-13", views: 340, likes: 23, comments: 4, shares: 2, images: ["👟"], description: "নাইকি জুতা, অরিজিনাল", location: "রাজশাহী", condition: "new", brand: "Nike", warranty: "none", featured: false, urgent: false },
  { id: 5, title: "Sony WH-1000XM5", seller: "নাজমা বেগম", sellerId: 5, price: 35000, category: "ইলেকট্রনিক্স", subCategory: "Headphone", status: "approved", date: "2026-04-12", views: 560, likes: 45, comments: 8, shares: 4, images: ["🎧"], description: "সনি হেডফোন, নয়েজ ক্যান্সেলিং", location: "সিলেট", condition: "new", brand: "Sony", warranty: "1 year", featured: true, urgent: false },
];

export default function AdminPosts() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState(dummyPosts);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const stats = {
      total: posts.length,
      pending: posts.filter(p => p.status === 'pending').length,
      approved: posts.filter(p => p.status === 'approved').length,
      rejected: posts.filter(p => p.status === 'rejected').length,
      featured: posts.filter(p => p.featured).length,
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      totalValue: posts.reduce((sum, p) => sum + p.price, 0),
    };
    setStats(stats);
  }, [posts]);

  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, rejected: 0, featured: 0, totalViews: 0, totalValue: 0
  });

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const categories = ["মোবাইল", "কম্পিউটার", "ফ্যাশন", "ইলেকট্রনিক্স", "গাড়ি", "চাকরি", "সার্ভিস"];

  const filteredPosts = posts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.seller.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "views") return b.views - a.views;
    if (sortBy === "likes") return b.likes - a.likes;
    return b.date.localeCompare(a.date);
  });

  const updateStatus = (id: number, status: 'pending' | 'approved' | 'rejected') => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
    alert(`পোস্ট ${status === 'approved' ? 'অনুমোদিত' : status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'} করা হয়েছে!`);
  };

  const deletePost = (id: number) => {
    if (confirm("পোস্ট ডিলিট করতে চান? সব তথ্য মুছে যাবে!")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const makeFeatured = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, featured: !p.featured, status: p.featured ? p.status : 'approved' } : p));
    alert(`পোস্ট ${posts.find(p => p.id === id)?.featured ? 'ফিচার্ড থেকে রিমুভ' : 'ফিচার্ড করা'} হয়েছে!`);
  };

  const makeUrgent = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, urgent: !p.urgent } : p));
  };

  const sendMessageToSeller = (seller: string, postTitle: string) => {
    if (messageText) {
      alert(`মেসেজ পাঠানো হয়েছে ${seller} কে:\nপোস্ট: ${postTitle}\nমেসেজ: ${messageText}`);
      setMessageText("");
      setShowMessageModal(false);
    }
  };

  const handleBulkAction = () => {
    if (selectedPosts.length === 0) return;
    if (bulkAction === "approve") {
      setPosts(posts.map(p => selectedPosts.includes(p.id) ? { ...p, status: 'approved' } : p));
      alert(`${selectedPosts.length} টি পোস্ট অনুমোদিত করা হয়েছে!`);
    } else if (bulkAction === "reject") {
      setPosts(posts.map(p => selectedPosts.includes(p.id) ? { ...p, status: 'rejected' } : p));
      alert(`${selectedPosts.length} টি পোস্ট বাতিল করা হয়েছে!`);
    } else if (bulkAction === "delete") {
      if (confirm(`${selectedPosts.length} টি পোস্ট ডিলিট করতে চান?`)) {
        setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
        alert(`${selectedPosts.length} টি পোস্ট ডিলিট করা হয়েছে!`);
      }
    }
    setSelectedPosts([]);
    setShowBulkModal(false);
    setBulkAction("");
  };

  const toggleSelectPost = (id: number) => {
    setSelectedPosts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id));
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "টাইটেল", "বিক্রেতা", "দাম", "ক্যাটাগরি", "স্ট্যাটাস", "ভিউ", "তারিখ"];
    const rows = filteredPosts.map(p => [p.id, p.title, p.seller, p.price, p.category, p.status, p.views, p.date]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `posts-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ অনুমোদিত</span>;
      case 'pending': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⏳ পেন্ডিং</span>;
      case 'rejected': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ বাতিল</span>;
      default: return null;
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল বাটন */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-2 rounded-lg shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ডেস্কটপ সাইডবার */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 hidden md:block">
        <AdminSidebar />
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* মোবাইল সাইডবার */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      {/* মেন কন্টেন্ট */}
      <div className="md:ml-64">
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">পোস্ট ম্যানেজমেন্ট</h1>
          <div className="flex gap-2">
            <button onClick={exportToCSV} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><Download size={14} /> এক্সপোর্ট</button>
            {selectedPosts.length > 0 && <button onClick={() => setShowBulkModal(true)} className="bg-[#f85606] text-white px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">{selectedPosts.length} টি সিলেক্টেড</button>}
          </div>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট পোস্ট</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">পেন্ডিং</p><p className="text-2xl font-bold">{stats.pending}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">অনুমোদিত</p><p className="text-2xl font-bold">{stats.approved}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট ভিউ</p><p className="text-2xl font-bold">{stats.totalViews}</p></div>
          </div>

          {/* ফিল্টার সেকশন */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="পণ্য বা বিক্রেতার নাম..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব স্ট্যাটাস</option><option value="pending">পেন্ডিং</option><option value="approved">অনুমোদিত</option><option value="rejected">বাতিল</option></select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব ক্যাটাগরি</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="date">সর্বশেষ</option><option value="price">সর্বোচ্চ দাম</option><option value="views">সর্বোচ্চ ভিউ</option><option value="likes">সর্বোচ্চ লাইক</option></select>
            </div>
          </div>

          {/* পোস্ট টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr><th className="p-3 w-8"><input type="checkbox" checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0} onChange={selectAll} className="w-4 h-4 rounded" /></th><th className="p-3">পণ্য</th><th className="p-3">বিক্রেতা</th><th className="p-3">দাম/ভিউ</th><th className="p-3">ক্যাটাগরি</th><th className="p-3">স্ট্যাটাস</th><th className="p-3">একশন</th></tr></thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="p-3"><input type="checkbox" checked={selectedPosts.includes(post.id)} onChange={() => toggleSelectPost(post.id)} className="w-4 h-4 rounded" /></td>
                      <td className="p-3"><p className="font-medium">{post.title}</p><p className="text-xs text-gray-400">{post.date} • {post.condition === 'new' ? 'নতুন' : 'পুরাতন'}</p>{post.urgent && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">🚨 জরুরি</span>}{post.featured && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded ml-1">⭐ ফিচার্ড</span>}</td>
                      <td className="p-3 text-sm">{post.seller}</td>
                      <td className="p-3"><p className="text-[#f85606] font-bold">৳{post.price.toLocaleString()}</p><p className="text-xs text-gray-400">👁️ {post.views} ভিউ • ❤️ {post.likes}</p></td>
                      <td className="p-3 text-sm">{post.category}</td>
                      <td className="p-3">{getStatusBadge(post.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1 flex-wrap">
                          <button onClick={() => { setSelectedPost(post); setShowDetailsModal(true); }} className="p-1 text-gray-400 hover:text-blue-600"><Eye size={16} /></button>
                          <button onClick={() => { setEditPost(post); setShowEditModal(true); }} className="p-1 text-gray-400 hover:text-green-600"><Edit2 size={16} /></button>
                          <button onClick={() => makeFeatured(post.id)} className="p-1 text-gray-400 hover:text-amber-600"><Star size={16} /></button>
                          <button onClick={() => makeUrgent(post.id)} className="p-1 text-gray-400 hover:text-red-600"><AlertCircle size={16} /></button>
                          <button onClick={() => { setSelectedPost(post); setShowMessageModal(true); }} className="p-1 text-gray-400 hover:text-blue-600"><Send size={16} /></button>
                          <button onClick={() => updateStatus(post.id, 'approved')} className="p-1 text-gray-400 hover:text-green-600"><CheckCircle size={16} /></button>
                          <button onClick={() => updateStatus(post.id, 'rejected')} className="p-1 text-gray-400 hover:text-red-600"><XCircle size={16} /></button>
                          <button onClick={() => deletePost(post.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* পোস্ট বিস্তারিত মডাল */}
      {showDetailsModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center"><h3 className="text-lg font-bold">পোস্ট বিস্তারিত</h3><button onClick={() => setShowDetailsModal(false)} className="text-gray-400"><X size={20} /></button></div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3"><div className="text-5xl">{selectedPost.images[0]}</div><div><h2 className="text-xl font-bold">{selectedPost.title}</h2><p className="text-gray-500">{selectedPost.category} &gt; {selectedPost.subCategory}</p></div></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-gray-500">বিক্রেতা</label><p>{selectedPost.seller}</p></div><div><label className="text-xs text-gray-500">দাম</label><p className="text-xl font-bold text-[#f85606]">৳{selectedPost.price.toLocaleString()}</p></div><div><label className="text-xs text-gray-500">অবস্থান</label><p>{selectedPost.location}</p></div><div><label className="text-xs text-gray-500">ব্র্যান্ড</label><p>{selectedPost.brand}</p></div><div><label className="text-xs text-gray-500">ওয়ারেন্টি</label><p>{selectedPost.warranty}</p></div><div><label className="text-xs text-gray-500">স্ট্যাটাস</label><p>{getStatusBadge(selectedPost.status)}</p></div></div>
              <div><label className="text-xs text-gray-500">বিবরণ</label><p>{selectedPost.description}</p></div>
              <div className="flex gap-2"><button onClick={() => updateStatus(selectedPost.id, 'approved')} className="flex-1 bg-green-500 text-white py-2 rounded-lg">অনুমোদন করুন</button><button onClick={() => updateStatus(selectedPost.id, 'rejected')} className="flex-1 bg-red-500 text-white py-2 rounded-lg">বাতিল করুন</button><button onClick={() => deletePost(selectedPost.id)} className="flex-1 bg-gray-500 text-white py-2 rounded-lg">ডিলিট করুন</button></div>
            </div>
          </div>
        </div>
      )}

      {/* এডিট পোস্ট মডাল */}
      {showEditModal && editPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5"><h3 className="text-lg font-bold mb-4">পোস্ট এডিট</h3><div className="space-y-3"><input type="text" value={editPost.title} onChange={(e) => setEditPost({...editPost, title: e.target.value})} className="w-full p-2 border rounded-lg" /><input type="number" value={editPost.price} onChange={(e) => setEditPost({...editPost, price: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" /><select value={editPost.category} onChange={(e) => setEditPost({...editPost, category: e.target.value})} className="w-full p-2 border rounded-lg">{categories.map(c => <option key={c}>{c}</option>)}</select><select value={editPost.condition} onChange={(e) => setEditPost({...editPost, condition: e.target.value as 'new' | 'old'})} className="w-full p-2 border rounded-lg"><option value="new">নতুন</option><option value="old">পুরাতন</option></select><input type="text" value={editPost.location} onChange={(e) => setEditPost({...editPost, location: e.target.value})} className="w-full p-2 border rounded-lg" /><textarea value={editPost.description} onChange={(e) => setEditPost({...editPost, description: e.target.value})} rows={3} className="w-full p-2 border rounded-lg" /></div><div className="flex gap-2 mt-4"><button onClick={() => { setPosts(posts.map(p => p.id === editPost.id ? editPost : p)); setShowEditModal(false); alert("আপডেট করা হয়েছে!"); }} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">সংরক্ষণ করুন</button><button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div></div>
        </div>
      )}

      {/* মেসেজ পাঠান মডাল */}
      {showMessageModal && selectedPost && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl max-w-md w-full p-5"><h3 className="text-lg font-bold mb-4">মেসেজ পাঠান: {selectedPost.seller}</h3><textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={4} className="w-full p-2 border rounded-lg mb-3" /><div className="flex gap-2"><button onClick={() => sendMessageToSeller(selectedPost.seller, selectedPost.title)} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">পাঠান</button><button onClick={() => setShowMessageModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div></div></div>)}

      {/* বাল্ক অ্যাকশন মডাল */}
      {showBulkModal && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl max-w-md w-full p-5"><h3 className="text-lg font-bold mb-4">বাল্ক অ্যাকশন ({selectedPosts.length} টি পোস্ট)</h3><select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="w-full p-3 border rounded-xl mb-4"><option value="">সিলেক্ট করুন</option><option value="approve">সব অনুমোদন করুন</option><option value="reject">সব বাতিল করুন</option><option value="delete">সব ডিলিট করুন</option></select><div className="flex gap-2"><button onClick={handleBulkAction} disabled={!bulkAction} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">প্রয়োগ করুন</button><button onClick={() => setShowBulkModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div></div></div>)}

    </div>
  );
}