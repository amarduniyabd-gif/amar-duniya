"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Search, CheckCircle, XCircle, Trash2, Eye, 
  AlertCircle, Flag, Filter, Download, Printer } from "lucide-react";

type Report = {
  id: number;
  postId: number;
  postTitle: string;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  date: string;
  seller: string;
};

const dummyReports: Report[] = [
  { id: 1, postId: 101, postTitle: "iPhone 15 Pro Max", reportedBy: "করিম মিয়া", reason: "ফেইক পোস্ট", status: "pending", date: "২০২৬-০৪-১৬", seller: "রহিম উদ্দ인" },
  { id: 2, postId: 102, postTitle: "MacBook Pro M2", reportedBy: "শাহিনুর রহমান", reason: "প্রতারক", status: "reviewed", date: "২০২৬-০৪-১৫", seller: "করিম মিয়া" },
  { id: 3, postId: 103, postTitle: "Samsung Galaxy S23", reportedBy: "নাজমা বেগম", reason: "অশ্লীল কন্টেন্ট", status: "pending", date: "২০২৬-০৪-১৪", seller: "শাহিনুর রহমান" },
];

export default function AdminReports() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState(dummyReports);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const filteredReports = reports.filter(r => {
    if (search && !r.postTitle.toLowerCase().includes(search.toLowerCase()) && !r.reportedBy.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== "all" && r.status !== filter) return false;
    return true;
  });

  const updateStatus = (id: number, status: 'pending' | 'reviewed' | 'resolved') => {
    setReports(reports.map(r => r.id === id ? { ...r, status } : r));
    alert(`রিপোর্ট ${status === 'resolved' ? 'রিসলভড' : status === 'reviewed' ? 'রিভিউ করা' : 'পেন্ডিং'} করা হয়েছে!`);
  };

  const deletePost = (postId: number, postTitle: string) => {
    if (confirm(`"${postTitle}" পোস্টটি ডিলিট করতে চান?`)) {
      alert(`"${postTitle}" পোস্টটি ডিলিট করা হয়েছে!`);
      setReports(reports.filter(r => r.postId !== postId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⏳ পেন্ডিং</span>;
      case 'reviewed': return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🔍 রিভিউ করা</span>;
      case 'resolved': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ রিসলভড</span>;
      default: return null;
    }
  };

  const exportToCSV = () => {
    const headers = ["আইডি", "পণ্য", "বিক্রেতা", "রিপোর্টার", "কারণ", "স্ট্যাটাস", "তারিখ"];
    const rows = filteredReports.map(r => [r.id, r.postTitle, r.seller, r.reportedBy, r.reason, r.status, r.date]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
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
          <h1 className="text-xl font-bold text-gray-800">রিপোর্ট ম্যানেজমেন্ট</h1>
          <div className="flex gap-2">
            <button onClick={exportToCSV} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><Download size={14} /> এক্সপোর্ট</button>
            <button onClick={() => window.print()} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><Printer size={14} /> প্রিন্ট</button>
          </div>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">পেন্ডিং রিপোর্ট</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">রিভিউ করা</p>
              <p className="text-3xl font-bold">{stats.reviewed}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <p className="text-sm opacity-90">রিসলভড</p>
              <p className="text-3xl font-bold">{stats.resolved}</p>
            </div>
          </div>

          {/* সার্চ ও ফিল্টার */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="পণ্য বা রিপোর্টারের নাম..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" /></div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white w-full md:w-48">
                <option value="all">সব</option>
                <option value="pending">পেন্ডিং</option>
                <option value="reviewed">রিভিউ করা</option>
                <option value="resolved">রিসলভড</option>
              </select>
            </div>
          </div>

          {/* রিপোর্ট টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">পণ্য</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">বিক্রেতা</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">রিপোর্টার</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">কারণ</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">তারিখ</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">স্ট্যাটাস</th>
                    <th className="p-3 text-center text-xs font-medium text-gray-500">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="p-3"><p className="font-medium text-sm">{report.postTitle}</p><p className="text-xs text-gray-400">ID: {report.postId}</p></td>
                      <td className="p-3 text-sm">{report.seller}</td>
                      <td className="p-3 text-sm">{report.reportedBy}</td>
                      <td className="p-3 text-sm flex items-center gap-1"><AlertCircle size={12} className="text-red-500" />{report.reason}</td>
                      <td className="p-3 text-sm">{report.date}</td>
                      <td className="p-3">{getStatusBadge(report.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => router.push(`/post/${report.postId}`)} className="p-1 text-gray-400 hover:text-blue-600" title="পোস্ট দেখুন"><Eye size={16} /></button>
                          <button onClick={() => updateStatus(report.id, 'reviewed')} className="p-1 text-gray-400 hover:text-blue-600" title="রিভিউ করুন"><CheckCircle size={16} /></button>
                          <button onClick={() => updateStatus(report.id, 'resolved')} className="p-1 text-gray-400 hover:text-green-600" title="রিসলভ করুন"><Flag size={16} /></button>
                          <button onClick={() => deletePost(report.postId, report.postTitle)} className="p-1 text-gray-400 hover:text-red-600" title="পোস্ট ডিলিট"><Trash2 size={16} /></button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* নো ডাটা মেসেজ */}
          {filteredReports.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-4">
              <Flag size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">কোনো রিপোর্ট পাওয়া যায়নি</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}