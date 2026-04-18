"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Search, CheckCircle, XCircle, Trash2, Eye, 
  Clock, FileText, Download, Loader2, AlertCircle, Filter } from "lucide-react";

type DocumentRequest = {
  id: string;
  postId: number;
  postTitle: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  documentUrl: string;
  status: 'pending' | 'released';
  fee: number;
  createdAt: string;
  releasedAt?: string;
};

// ডামি ডকুমেন্ট ডাটা
const dummyDocuments: DocumentRequest[] = [
  {
    id: "DOC_001",
    postId: 1,
    postTitle: "iPhone 15 Pro Max",
    sellerId: "seller_1",
    sellerName: "রহিম উদ্দিন",
    buyerId: "buyer_1",
    buyerName: "করিম মিয়া",
    documentUrl: "https://example.com/iphone-bill.pdf",
    status: "pending",
    fee: 1500,
    createdAt: "২০২৬-০৪-১৬",
  },
  {
    id: "DOC_002",
    postId: 2,
    postTitle: "MacBook Pro M2",
    sellerId: "seller_2",
    sellerName: "করিম মিয়া",
    buyerId: "buyer_2",
    buyerName: "শাহিনুর রহমান",
    documentUrl: "https://example.com/macbook-bill.pdf",
    status: "released",
    fee: 3600,
    createdAt: "২০২৬-০৪-১৫",
    releasedAt: "২০২৬-০৪-১৬",
  },
  {
    id: "DOC_003",
    postId: 3,
    postTitle: "Samsung Galaxy S23",
    sellerId: "seller_3",
    sellerName: "শাহিনুর রহমান",
    buyerId: "buyer_3",
    buyerName: "আব্দুল করিম",
    documentUrl: "https://example.com/samsung-bill.pdf",
    status: "pending",
    fee: 1900,
    createdAt: "২০২৬-০৪-১৪",
  },
];

export default function AdminDocuments() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState(dummyDocuments);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRequest | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("documentRequests");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setDocuments(parsed);
        }
      } catch (e) {
        console.error("Error parsing documents");
      }
    }
  }, []);

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const filteredDocs = documents.filter(doc => {
    if (search && !doc.postTitle.toLowerCase().includes(search.toLowerCase()) && 
        !doc.sellerName.toLowerCase().includes(search.toLowerCase()) &&
        !doc.buyerName.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== "all" && doc.status !== filter) return false;
    return true;
  });

  const updateStatus = (id: string, status: 'pending' | 'released') => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, status, releasedAt: status === 'released' ? new Date().toLocaleDateString('bn-BD') : undefined } : doc
    ));
    alert(`ডকুমেন্ট ${status === 'released' ? 'রিলিজ' : 'পেন্ডিং'} করা হয়েছে!`);
  };

  const deleteDocument = (id: string) => {
    if (confirm("ডকুমেন্ট রিকোয়েস্ট ডিলিট করতে চান?")) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'released': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ রিলিজড</span>;
      case 'pending': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⏳ পেন্ডিং</span>;
      default: return null;
    }
  };

  const stats = {
    pending: documents.filter(d => d.status === 'pending').length,
    released: documents.filter(d => d.status === 'released').length,
    totalFee: documents.reduce((sum, d) => sum + d.fee, 0),
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
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-gray-800">ডকুমেন্ট সার্ভিস</h1>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">পেন্ডিং ডকুমেন্ট</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">রিলিজড ডকুমেন্ট</p>
              <p className="text-3xl font-bold">{stats.released}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">মোট ফি</p>
              <p className="text-3xl font-bold">৳{stats.totalFee.toLocaleString()}</p>
            </div>
          </div>

          {/* সার্চ ও ফিল্টার */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="পণ্য, বিক্রেতা বা ক্রেতার নাম..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white w-full md:w-48">
                <option value="all">সব</option>
                <option value="pending">পেন্ডিং</option>
                <option value="released">রিলিজড</option>
              </select>
            </div>
          </div>

          {/* ডকুমেন্ট টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">পণ্য</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">বিক্রেতা</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">ক্রেতা</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">ফি</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">তারিখ</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">স্ট্যাটাস</th>
                    <th className="p-3 text-center text-xs font-medium text-gray-500">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-[#f85606]" size={24} /></td></tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">কোনো ডকুমেন্ট রিকোয়েস্ট নেই</td></tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="p-3"><p className="font-medium text-sm">{doc.postTitle}</p><p className="text-xs text-gray-400">ID: {doc.id}</p></td>
                        <td className="p-3 text-sm">{doc.sellerName}</td>
                        <td className="p-3 text-sm">{doc.buyerName}</td>
                        <td className="p-3 text-sm font-medium text-[#f85606]">৳{doc.fee.toLocaleString()}</td>
                        <td className="p-3 text-sm">{doc.createdAt}</td>
                        <td className="p-3">{getStatusBadge(doc.status)}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setSelectedDoc(doc)} className="p-1 text-gray-400 hover:text-blue-600"><Eye size={16} /></button>
                            {doc.status === 'pending' && (
                              <button onClick={() => updateStatus(doc.id, 'released')} className="p-1 text-gray-400 hover:text-green-600"><CheckCircle size={16} /></button>
                            )}
                            <button onClick={() => deleteDocument(doc.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
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

      {/* ডকুমেন্ট ভিউ মডাল */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">ডকুমেন্ট বিস্তারিত</h3>
              <button onClick={() => setSelectedDoc(null)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-xs text-gray-500">পণ্যের নাম</label><p className="font-medium">{selectedDoc.postTitle}</p></div>
              <div><label className="text-xs text-gray-500">বিক্রেতা</label><p>{selectedDoc.sellerName}</p></div>
              <div><label className="text-xs text-gray-500">ক্রেতা</label><p>{selectedDoc.buyerName}</p></div>
              <div><label className="text-xs text-gray-500">ডকুমেন্ট ফি</label><p className="text-[#f85606] font-bold">৳{selectedDoc.fee.toLocaleString()}</p></div>
              <div><label className="text-xs text-gray-500">স্ট্যাটাস</label><p>{getStatusBadge(selectedDoc.status)}</p></div>
              <div><label className="text-xs text-gray-500">ডকুমেন্ট লিংক</label><a href={selectedDoc.documentUrl} target="_blank" className="text-blue-600 break-all">{selectedDoc.documentUrl}</a></div>
              <button className="w-full bg-[#f85606] text-white py-2 rounded-xl flex items-center justify-center gap-2"><Download size={16} /> ডকুমেন্ট ডাউনলোড</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}