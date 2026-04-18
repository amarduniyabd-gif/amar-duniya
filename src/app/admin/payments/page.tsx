"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Search, CheckCircle, XCircle, Download, Filter, 
  Eye, RefreshCw, Trash2, DollarSign, TrendingUp, Users,
  Calendar, CreditCard, AlertCircle, Printer, FileText,
  Send, Receipt, Wallet, Banknote, Loader2, MoreVertical } from "lucide-react";

type Payment = {
  id: string;
  user: string;
  userId: number;
  userEmail: string;
  userPhone: string;
  type: 'featured' | 'document' | 'bid' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  postTitle?: string;
  postId?: number;
  transactionId: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'wallet';
  reference?: string;
  notes?: string;
};

const dummyPayments: Payment[] = [
  { id: "PAY_001", user: "রহিম উদ্দিন", userId: 1, userEmail: "rahim@gmail.com", userPhone: "017XXXXXXXX", type: "featured", amount: 100, status: "completed", date: "2026-04-16", postTitle: "iPhone 15 Pro Max", postId: 1, transactionId: "TXN_001", paymentMethod: "bkash", notes: "ফিচার্ড লিস্টিং" },
  { id: "PAY_002", user: "করিম মিয়া", userId: 2, userEmail: "karim@gmail.com", userPhone: "018XXXXXXXX", type: "featured", amount: 100, status: "completed", date: "2026-04-15", postTitle: "MacBook Pro M2", postId: 2, transactionId: "TXN_002", paymentMethod: "nagad" },
  { id: "PAY_003", user: "শাহিনুর রহমান", userId: 3, userEmail: "shahinur@gmail.com", userPhone: "019XXXXXXXX", type: "document", amount: 1500, status: "pending", date: "2026-04-14", postTitle: "Samsung Galaxy S23", postId: 3, transactionId: "TXN_003", paymentMethod: "bkash" },
  { id: "PAY_004", user: "আব্দুল করিম", userId: 4, userEmail: "abdul@gmail.com", userPhone: "016XXXXXXXX", type: "bid", amount: 2, status: "completed", date: "2026-04-13", postTitle: "Nike Air Max", postId: 4, transactionId: "TXN_004", paymentMethod: "wallet" },
  { id: "PAY_005", user: "নাজমা বেগম", userId: 5, userEmail: "najma@gmail.com", userPhone: "015XXXXXXXX", type: "document", amount: 1900, status: "failed", date: "2026-04-12", postTitle: "Leather Bag", postId: 5, transactionId: "TXN_005", paymentMethod: "card" },
  { id: "PAY_006", user: "আলমগীর হোসেন", userId: 6, userEmail: "alamgir@gmail.com", userPhone: "014XXXXXXXX", type: "withdrawal", amount: 5000, status: "pending", date: "2026-04-11", transactionId: "TXN_006", paymentMethod: "bkash", notes: "উইথড্রয়াল রিকোয়েস্ট" },
];

export default function AdminPayments() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [payments, setPayments] = useState(dummyPayments);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundNote, setRefundNote] = useState("");

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const stats = {
      total: payments.reduce((sum, p) => sum + p.amount, 0),
      completed: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      failed: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0),
      refunded: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
      count: payments.length,
      featuredCount: payments.filter(p => p.type === 'featured').length,
      documentCount: payments.filter(p => p.type === 'document').length,
      bidCount: payments.filter(p => p.type === 'bid').length,
    };
    setStats(stats);
  }, [payments]);

  const [stats, setStats] = useState({
    total: 0, completed: 0, pending: 0, failed: 0, refunded: 0,
    count: 0, featuredCount: 0, documentCount: 0, bidCount: 0
  });

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const filteredPayments = payments.filter(p => {
    if (search && !p.user.toLowerCase().includes(search.toLowerCase()) && !p.postTitle?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== "all" && p.status !== filter) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (methodFilter !== "all" && p.paymentMethod !== methodFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "date") return b.date.localeCompare(a.date);
    return 0;
  });

  const updateStatus = (id: string, status: 'completed' | 'pending' | 'failed' | 'refunded') => {
    setPayments(payments.map(p => p.id === id ? { ...p, status } : p));
    alert(`পেমেন্ট ${status === 'completed' ? 'সফল' : status === 'refunded' ? 'রিফান্ডেড' : status === 'failed' ? 'ব্যর্থ' : 'পেন্ডিং'} করা হয়েছে!`);
    setShowRefundModal(false);
  };

  const deletePayment = (id: string) => {
    if (confirm("পেমেন্ট রেকর্ড ডিলিট করতে চান?")) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handleRefund = () => {
    if (selectedPayment && refundNote) {
      updateStatus(selectedPayment.id, 'refunded');
      alert(`রিফান্ড প্রসেস করা হয়েছে!\nনোট: ${refundNote}`);
      setRefundNote("");
    }
  };

  const exportToCSV = () => {
    const headers = ["আইডি", "ইউজার", "টাইপ", "পরিমাণ", "স্ট্যাটাস", "তারিখ", "লেনদেন আইডি", "পেমেন্ট মেথড"];
    const rows = filteredPayments.map(p => [p.id, p.user, p.type, p.amount, p.status, p.date, p.transactionId, p.paymentMethod]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'featured': return <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">⭐ ফিচার্ড</span>;
      case 'document': return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📄 ডকুমেন্ট</span>;
      case 'bid': return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🔨 বিড</span>;
      case 'withdrawal': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">💸 উইথড্রয়াল</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ সফল</span>;
      case 'pending': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⏳ পেন্ডিং</span>;
      case 'failed': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ ব্যর্থ</span>;
      case 'refunded': return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">🔄 রিফান্ডেড</span>;
      default: return null;
    }
  };

  const getMethodBadge = (method: string) => {
    switch(method) {
      case 'bkash': return <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">bKash</span>;
      case 'nagad': return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">নগদ</span>;
      case 'rocket': return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">রকেট</span>;
      case 'card': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">কার্ড</span>;
      case 'wallet': return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">ওয়ালেট</span>;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD');
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
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">পেমেন্ট ম্যানেজমেন্ট</h1>
          <div className="flex gap-2">
            <button onClick={exportToCSV} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><Download size={14} /> এক্সপোর্ট</button>
            <button onClick={() => window.print()} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><Printer size={14} /> প্রিন্ট</button>
          </div>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট লেনদেন</p><p className="text-xl font-bold">৳{stats.total.toLocaleString()}</p><p className="text-[10px] opacity-75">{stats.count} টি</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">সফল</p><p className="text-xl font-bold">৳{stats.completed.toLocaleString()}</p></div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">পেন্ডিং</p><p className="text-xl font-bold">৳{stats.pending.toLocaleString()}</p></div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">ব্যর্থ</p><p className="text-xl font-bold">৳{stats.failed.toLocaleString()}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">ফিচার্ড</p><p className="text-xl font-bold">{stats.featuredCount}</p></div>
          </div>

          {/* ফিল্টার সেকশন */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ইউজার বা পণ্যের নাম..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" /></div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব স্ট্যাটাস</option><option value="completed">সফল</option><option value="pending">পেন্ডিং</option><option value="failed">ব্যর্থ</option><option value="refunded">রিফান্ডেড</option></select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব টাইপ</option><option value="featured">ফিচার্ড</option><option value="document">ডকুমেন্ট</option><option value="bid">বিড</option><option value="withdrawal">উইথড্রয়াল</option></select>
              <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব মেথড</option><option value="bkash">bKash</option><option value="nagad">নগদ</option><option value="rocket">রকেট</option><option value="card">কার্ড</option><option value="wallet">ওয়ালেট</option></select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="date">সর্বশেষ</option><option value="amount">সর্বোচ্চ দাম</option></select>
            </div>
          </div>

          {/* পেমেন্ট টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr><th className="p-3">আইডি</th><th className="p-3">ইউজার</th><th className="p-3">পণ্য</th><th className="p-3">টাইপ</th><th className="p-3">পরিমাণ</th><th className="p-3">মেথড</th><th className="p-3">তারিখ</th><th className="p-3">স্ট্যাটাস</th><th className="p-3">একশন</th></tr></thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="p-3 text-sm font-mono">{payment.id}</td>
                      <td className="p-3"><p className="font-medium">{payment.user}</p><p className="text-xs text-gray-400">{payment.userEmail}</p></td>
                      <td className="p-3 text-sm">{payment.postTitle || "-"}</td>
                      <td className="p-3">{getTypeBadge(payment.type)}</td>
                      <td className="p-3 text-[#f85606] font-bold">৳{payment.amount.toLocaleString()}</td>
                      <td className="p-3">{getMethodBadge(payment.paymentMethod)}</td>
                      <td className="p-3 text-sm">{formatDate(payment.date)}</td>
                      <td className="p-3">{getStatusBadge(payment.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1 flex-wrap">
                          <button onClick={() => { setSelectedPayment(payment); setShowDetailsModal(true); }} className="p-1 text-gray-400 hover:text-blue-600"><Eye size={16} /></button>
                          {payment.status === 'pending' && <button onClick={() => updateStatus(payment.id, 'completed')} className="p-1 text-gray-400 hover:text-green-600"><CheckCircle size={16} /></button>}
                          {payment.status === 'pending' && <button onClick={() => updateStatus(payment.id, 'failed')} className="p-1 text-gray-400 hover:text-red-600"><XCircle size={16} /></button>}
                          {payment.status === 'completed' && <button onClick={() => { setSelectedPayment(payment); setShowRefundModal(true); }} className="p-1 text-gray-400 hover:text-orange-600"><RefreshCw size={16} /></button>}
                          <button onClick={() => deletePayment(payment.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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

      {/* পেমেন্ট বিস্তারিত মডাল */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center"><h3 className="text-lg font-bold">পেমেন্ট বিস্তারিত</h3><button onClick={() => setShowDetailsModal(false)} className="text-gray-400"><X size={20} /></button></div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3"><div className="flex justify-between"><span className="text-sm text-gray-500">লেনদেন আইডি</span><span className="font-mono text-sm">{selectedPayment.transactionId}</span></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500">ইউজার</label><p className="font-medium">{selectedPayment.user}</p><p className="text-xs text-gray-400">{selectedPayment.userEmail}</p></div><div><label className="text-xs text-gray-500">পেমেন্ট মেথড</label><p>{getMethodBadge(selectedPayment.paymentMethod)}</p></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500">টাইপ</label><p>{getTypeBadge(selectedPayment.type)}</p></div><div><label className="text-xs text-gray-500">পরিমাণ</label><p className="text-xl font-bold text-[#f85606]">৳{selectedPayment.amount.toLocaleString()}</p></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500">তারিখ</label><p>{formatDate(selectedPayment.date)}</p></div><div><label className="text-xs text-gray-500">স্ট্যাটাস</label><p>{getStatusBadge(selectedPayment.status)}</p></div></div>
              {selectedPayment.postTitle && <div><label className="text-xs text-gray-500">পণ্য</label><p>{selectedPayment.postTitle}</p></div>}
              {selectedPayment.notes && <div><label className="text-xs text-gray-500">নোট</label><p className="text-sm bg-gray-50 p-2 rounded">{selectedPayment.notes}</p></div>}
            </div>
          </div>
        </div>
      )}

      {/* রিফান্ড মডাল */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5"><h3 className="text-lg font-bold mb-4">রিফান্ড প্রসেস</h3><p className="text-sm text-gray-600 mb-2">ইউজার: {selectedPayment.user}</p><p className="text-sm text-gray-600 mb-4">পরিমাণ: ৳{selectedPayment.amount.toLocaleString()}</p><textarea value={refundNote} onChange={(e) => setRefundNote(e.target.value)} placeholder="রিফান্ডের কারণ লিখুন..." rows={3} className="w-full p-3 border rounded-xl mb-4" /><div className="flex gap-2"><button onClick={handleRefund} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">রিফান্ড করুন</button><button onClick={() => setShowRefundModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div></div>
        </div>
      )}

    </div>
  );
}