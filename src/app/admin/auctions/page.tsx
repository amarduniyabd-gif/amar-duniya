"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Search, CheckCircle, XCircle, Trash2, Eye, Clock, TrendingUp, Loader2,
  Filter, DollarSign, Users, Award, Edit2, Send, RefreshCw, AlertCircle, X as XIcon } from "lucide-react";

type Auction = {
  id: number;
  title: string;
  seller: string;
  sellerId: number;
  currentPrice: number;
  startPrice: number;
  minIncrement: number;
  totalBids: number;
  status: 'active' | 'ended' | 'pending' | 'cancelled';
  endTime: string;
  startTime: string;
  date: string;
  views: number;
  category: string;
  condition: string;
  featured: boolean;
  description: string;
  images: string[];
};

const dummyAuctions: Auction[] = [
  { id: 1, title: "iPhone 15 Pro Max - 128GB", seller: "রহিম উদ্দিন", sellerId: 1, currentPrice: 65000, startPrice: 50000, minIncrement: 1000, totalBids: 23, status: "active", endTime: "2026-04-20T00:00:00Z", startTime: "2026-04-15T00:00:00Z", date: "২০২৬-০৪-১৬", views: 1240, category: "মোবাইল", condition: "new", featured: true, description: "ব্র্যান্ড নতুন আইফোন, ১২৮ জিবি, ফুল বক্স সহ। ১ বছর ওয়ারেন্টি।", images: ["📱"] },
  { id: 2, title: "MacBook Pro M2 - 256GB", seller: "করিম মিয়া", sellerId: 2, currentPrice: 145000, startPrice: 120000, minIncrement: 2000, totalBids: 45, status: "active", endTime: "2026-04-19T00:00:00Z", startTime: "2026-04-14T00:00:00Z", date: "২০২৬-০৪-১৫", views: 890, category: "কম্পিউটার", condition: "new", featured: false, description: "ম্যাকবুক প্রো এম২, ৮ জিবি র্যাম, ২৫৬ জিবি এসএসডি।", images: ["💻"] },
  { id: 3, title: "Samsung Galaxy S23 Ultra", seller: "শাহিনুর রহমান", sellerId: 3, currentPrice: 85000, startPrice: 70000, minIncrement: 1000, totalBids: 67, status: "ended", endTime: "2026-04-10T00:00:00Z", startTime: "2026-04-05T00:00:00Z", date: "২০২৬-০৪-১৪", views: 2100, category: "মোবাইল", condition: "new", featured: true, description: "স্যামসাং গ্যালাক্সি এস২৩ আলট্রা, ২৫৬ জিবি।", images: ["📱"] },
  { id: 4, title: "Nike Air Max", seller: "আব্দুল করিম", sellerId: 4, currentPrice: 12000, startPrice: 10000, minIncrement: 500, totalBids: 12, status: "pending", endTime: "2026-04-25T00:00:00Z", startTime: "2026-04-18T00:00:00Z", date: "২০২৬-০৪-১৭", views: 340, category: "ফ্যাশন", condition: "new", featured: false, description: "নাইকি এয়ার ম্যাক্স, অরিজিনাল। সাইজ ৪২।", images: ["👟"] },
  { id: 5, title: "Toyota Land Cruiser", seller: "রফিকুল ইসলাম", sellerId: 5, currentPrice: 5500000, startPrice: 5000000, minIncrement: 50000, totalBids: 8, status: "active", endTime: "2026-04-30T00:00:00Z", startTime: "2026-04-20T00:00:00Z", date: "২০২৬-০৪-১৮", views: 5600, category: "গাড়ি", condition: "old", featured: true, description: "টয়োটা ল্যান্ড ক্রুজার, ২০২২ মডেল।", images: ["🚗"] },
];

export default function AdminAuctions() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [auctions, setAuctions] = useState(dummyAuctions);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAuction, setEditAuction] = useState<Auction | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendHours, setExtendHours] = useState(24);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [showBidHistoryModal, setShowBidHistoryModal] = useState(false);
  const [stats, setStats] = useState({ active: 0, ended: 0, pending: 0, totalBids: 0, totalViews: 0 });

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    setStats({
      active: auctions.filter(a => a.status === 'active').length,
      ended: auctions.filter(a => a.status === 'ended').length,
      pending: auctions.filter(a => a.status === 'pending').length,
      totalBids: auctions.reduce((sum, a) => sum + a.totalBids, 0),
      totalViews: auctions.reduce((sum, a) => sum + a.views, 0),
    });
  }, [auctions]);

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const categories = ["মোবাইল", "কম্পিউটার", "ফ্যাশন", "ইলেকট্রনিক্স", "গাড়ি"];

  const filteredAuctions = auctions.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.seller.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price") return b.currentPrice - a.currentPrice;
    if (sortBy === "bids") return b.totalBids - a.totalBids;
    if (sortBy === "views") return b.views - a.views;
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  const updateStatus = (id: number, status: 'active' | 'ended' | 'pending' | 'cancelled') => {
    setAuctions(auctions.map(a => a.id === id ? { ...a, status } : a));
    alert(`নিলাম ${status === 'active' ? 'সক্রিয়' : status === 'ended' ? 'সমাপ্ত' : status === 'cancelled' ? 'বাতিল' : 'পেন্ডিং'} করা হয়েছে!`);
  };

  const deleteAuction = (id: number) => {
    if (confirm("নিলাম ডিলিট করতে চান? সব বিড ও তথ্য মুছে যাবে!")) {
      setAuctions(auctions.filter(a => a.id !== id));
    }
  };

  const extendTime = (id: number, hours: number) => {
    const auction = auctions.find(a => a.id === id);
    if (auction) {
      const newEndTime = new Date(auction.endTime);
      newEndTime.setHours(newEndTime.getHours() + hours);
      setAuctions(auctions.map(a => a.id === id ? { ...a, endTime: newEndTime.toISOString() } : a));
      alert(`${hours} ঘন্টা সময় বাড়ানো হয়েছে!`);
      setShowExtendModal(false);
    }
  };

  const makeFeatured = (id: number) => {
    setAuctions(auctions.map(a => a.id === id ? { ...a, featured: !a.featured } : a));
    alert(`নিলাম ${auctions.find(a => a.id === id)?.featured ? 'ফিচার্ড থেকে রিমুভ' : 'ফিচার্ড করা'} হয়েছে!`);
  };

  const sendMessageToSeller = (seller: string, auctionTitle: string) => {
    if (messageText) {
      alert(`মেসেজ পাঠানো হয়েছে ${seller} কে:\nনিলাম: ${auctionTitle}\nমেসেজ: ${messageText}`);
      setMessageText("");
      setShowMessageModal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🟢 চলমান</span>;
      case 'ended': return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">🔴 সমাপ্ত</span>;
      case 'pending': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🟡 পেন্ডিং</span>;
      case 'cancelled': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">⛔ বাতিল</span>;
      default: return null;
    }
  };

  const getTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    if (diff <= 0) return "সমাপ্ত";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60));
    if (days > 0) return `${days} দিন ${hours} ঘন্টা`;
    return `${hours} ঘন্টা বাকি`;
  };

  const loadBidHistory = (auctionId: number) => {
    setBidHistory([
      { id: 1, bidder: "করিম মিয়া", amount: 65000, time: "২ মিনিট আগে", status: "highest" },
      { id: 2, bidder: "জবের আহমেদ", amount: 64000, time: "৫ মিনিট আগে", status: "" },
      { id: 3, bidder: "শাহিনুর রহমান", amount: 63000, time: "১০ মিনিট আগে", status: "" },
      { id: 4, bidder: "রফিকুল ইসলাম", amount: 62000, time: "১৫ মিনিট আগে", status: "" },
    ]);
    setShowBidHistoryModal(true);
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
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* মোবাইল সাইডবার */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* মেন কন্টেন্ট */}
      <div className="md:ml-64">
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">নিলাম ম্যানেজমেন্ট</h1>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">সক্রিয় নিলাম</p><p className="text-2xl font-bold">{stats.active}</p></div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">পেন্ডিং</p><p className="text-2xl font-bold">{stats.pending}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট বিড</p><p className="text-2xl font-bold">{stats.totalBids}</p></div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট ভিউ</p><p className="text-2xl font-bold">{stats.totalViews}</p></div>
          </div>

          {/* ফিল্টার সেকশন */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="নিলাম বা বিক্রেতার নাম..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব স্ট্যাটাস</option><option value="active">সক্রিয়</option><option value="pending">পেন্ডিং</option><option value="ended">সমাপ্ত</option><option value="cancelled">বাতিল</option></select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব ক্যাটাগরি</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="date">সর্বশেষ</option><option value="price">সর্বোচ্চ দাম</option><option value="bids">সর্বোচ্চ বিড</option><option value="views">সর্বোচ্চ ভিউ</option></select>
            </div>
          </div>

          {/* নিলাম টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">নিলাম</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">বিক্রেতা</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">বর্তমান দাম</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">বিড/ভিউ</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">সময়</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">স্ট্যাটাস</th>
                    <th className="p-3 text-center text-xs font-medium text-gray-500">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-[#f85606]" size={24} /></td></tr>
                  ) : filteredAuctions.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">কোনো নিলাম পাওয়া যায়নি</td></tr>
                  ) : (
                    filteredAuctions.map((auction) => (
                      <tr key={auction.id} className="hover:bg-gray-50">
                        <td className="p-3"><p className="font-medium text-sm">{auction.title}</p><p className="text-xs text-gray-400">{auction.category} • {auction.date}</p>{auction.featured && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">⭐ ফিচার্ড</span>}</td>
                        <td className="p-3 text-sm">{auction.seller}</td>
                        <td className="p-3 text-sm font-medium text-[#f85606]">৳{auction.currentPrice.toLocaleString()}</td>
                        <td className="p-3 text-sm">💰 {auction.totalBids} বিড<br/>👁️ {auction.views} ভিউ</td>
                        <td className="p-3 text-sm"><Clock size={12} className="inline text-gray-400" /> {getTimeLeft(auction.endTime)}</td>
                        <td className="p-3">{getStatusBadge(auction.status)}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1 flex-wrap">
                            <button onClick={() => { setSelectedAuction(auction); setShowDetailsModal(true); }} className="p-1 text-gray-400 hover:text-blue-600" title="বিস্তারিত"><Eye size={16} /></button>
                            <button onClick={() => { setEditAuction(auction); setShowEditModal(true); }} className="p-1 text-gray-400 hover:text-green-600" title="এডিট"><Edit2 size={16} /></button>
                            <button onClick={() => loadBidHistory(auction.id)} className="p-1 text-gray-400 hover:text-purple-600" title="বিড হিস্ট্রি"><Users size={16} /></button>
                            <button onClick={() => makeFeatured(auction.id)} className="p-1 text-gray-400 hover:text-amber-600" title={auction.featured ? "ফিচার্ড রিমুভ" : "ফিচার্ড করুন"}><Award size={16} /></button>
                            {auction.status === 'active' && <button onClick={() => { setSelectedAuction(auction); setShowExtendModal(true); }} className="p-1 text-gray-400 hover:text-green-600" title="সময় বাড়ান"><RefreshCw size={16} /></button>}
                            <button onClick={() => { setSelectedAuction(auction); setShowMessageModal(true); }} className="p-1 text-gray-400 hover:text-blue-600" title="মেসেজ পাঠান"><Send size={16} /></button>
                            <button onClick={() => updateStatus(auction.id, auction.status === 'active' ? 'ended' : auction.status === 'pending' ? 'active' : 'active')} className="p-1 text-gray-400 hover:text-yellow-600" title="স্ট্যাটাস পরিবর্তন"><CheckCircle size={16} /></button>
                            <button onClick={() => deleteAuction(auction.id)} className="p-1 text-gray-400 hover:text-red-600" title="ডিলিট"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* নিলাম বিস্তারিত মডাল */}
      {showDetailsModal && selectedAuction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">নিলাম বিস্তারিত</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400"><XIcon size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3"><div className="text-5xl">{selectedAuction.images[0]}</div><div><h2 className="text-xl font-bold">{selectedAuction.title}</h2><p className="text-gray-500">{selectedAuction.category} • {selectedAuction.condition === 'new' ? 'নতুন' : 'পুরাতন'}</p></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500">বিক্রেতা</label><p>{selectedAuction.seller}</p></div>
                <div><label className="text-xs text-gray-500">বর্তমান দাম</label><p className="text-xl font-bold text-[#f85606]">৳{selectedAuction.currentPrice.toLocaleString()}</p></div>
                <div><label className="text-xs text-gray-500">শুরু দাম</label><p>৳{selectedAuction.startPrice.toLocaleString()}</p></div>
                <div><label className="text-xs text-gray-500">ন্যূনতম বৃদ্ধি</label><p>৳{selectedAuction.minIncrement.toLocaleString()}</p></div>
                <div><label className="text-xs text-gray-500">মোট বিড</label><p>{selectedAuction.totalBids} টি</p></div>
                <div><label className="text-xs text-gray-500">মোট ভিউ</label><p>{selectedAuction.views} বার</p></div>
                <div><label className="text-xs text-gray-500">শুরু</label><p>{new Date(selectedAuction.startTime).toLocaleString()}</p></div>
                <div><label className="text-xs text-gray-500">শেষ</label><p>{new Date(selectedAuction.endTime).toLocaleString()}</p></div>
              </div>
              <div><label className="text-xs text-gray-500">বিবরণ</label><p>{selectedAuction.description}</p></div>
              <div className="flex gap-2"><button onClick={() => updateStatus(selectedAuction.id, 'active')} className="flex-1 bg-green-500 text-white py-2 rounded-lg">সক্রিয় করুন</button><button onClick={() => updateStatus(selectedAuction.id, 'ended')} className="flex-1 bg-gray-500 text-white py-2 rounded-lg">সমাপ্ত করুন</button><button onClick={() => deleteAuction(selectedAuction.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg">ডিলিট করুন</button></div>
            </div>
          </div>
        </div>
      )}

      {/* এডিট নিলাম মডাল */}
      {showEditModal && editAuction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">নিলাম এডিট</h3>
            <div className="space-y-3">
              <input type="text" value={editAuction.title} onChange={(e) => setEditAuction({...editAuction, title: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="number" value={editAuction.currentPrice} onChange={(e) => setEditAuction({...editAuction, currentPrice: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
              <input type="number" value={editAuction.minIncrement} onChange={(e) => setEditAuction({...editAuction, minIncrement: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
              <select value={editAuction.category} onChange={(e) => setEditAuction({...editAuction, category: e.target.value})} className="w-full p-2 border rounded-lg">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <select value={editAuction.condition} onChange={(e) => setEditAuction({...editAuction, condition: e.target.value})} className="w-full p-2 border rounded-lg"><option value="new">নতুন</option><option value="old">পুরাতন</option></select>
              <textarea value={editAuction.description} onChange={(e) => setEditAuction({...editAuction, description: e.target.value})} rows={3} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setAuctions(auctions.map(a => a.id === editAuction.id ? editAuction : a)); setShowEditModal(false); alert("আপডেট করা হয়েছে!"); }} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">সংরক্ষণ করুন</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* সময় বাড়ান মডাল */}
      {showExtendModal && selectedAuction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">সময় বাড়ান: {selectedAuction.title}</h3>
            <select value={extendHours} onChange={(e) => setExtendHours(parseInt(e.target.value))} className="w-full p-2 border rounded-lg mb-4">
              <option value={12}>১২ ঘন্টা</option><option value={24}>২৪ ঘন্টা</option><option value={48}>৪৮ ঘন্টা</option><option value={72}>৭২ ঘন্টা</option>
            </select>
            <div className="flex gap-2"><button onClick={() => extendTime(selectedAuction.id, extendHours)} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">বাড়ান</button><button onClick={() => setShowExtendModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div>
          </div>
        </div>
      )}

      {/* মেসেজ পাঠান মডাল */}
      {showMessageModal && selectedAuction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">মেসেজ পাঠান: {selectedAuction.seller}</h3>
            <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="আপনার মেসেজ লিখুন..." rows={5} className="w-full p-2 border rounded-lg mb-3" />
            <div className="flex gap-2"><button onClick={() => sendMessageToSeller(selectedAuction.seller, selectedAuction.title)} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">পাঠান</button><button onClick={() => setShowMessageModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div>
          </div>
        </div>
      )}

      {/* বিড হিস্ট্রি মডাল */}
      {showBidHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">বিড হিস্ট্রি</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {bidHistory.map((bid) => (
                <div key={bid.id} className={`flex justify-between items-center p-3 rounded-lg ${bid.status === 'highest' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                  <div><p className="font-medium">{bid.bidder}</p><p className="text-xs text-gray-400">{bid.time}</p></div>
                  <div className="text-right"><p className="font-bold text-[#f85606]">৳{bid.amount.toLocaleString()}</p>{bid.status === 'highest' && <p className="text-[10px] text-green-600">সর্বোচ্চ বিড</p>}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowBidHistoryModal(false)} className="w-full mt-4 bg-gray-200 py-2 rounded-lg">বন্ধ করুন</button>
          </div>
        </div>
      )}

    </div>
  );
}