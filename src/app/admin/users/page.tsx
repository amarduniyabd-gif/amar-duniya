"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Search, CheckCircle, XCircle, Trash2, 
  UserCheck, UserX, Shield, Mail, Phone, Star, 
  Loader2, Eye, MoreVertical, Award, Edit2, 
  Send, Lock, FileText, Activity, UserPlus,
  MapPin, Calendar, DollarSign, Package, TrendingUp } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'seller' | 'admin';
  status: 'active' | 'blocked';
  verified: boolean;
  joined: string;
  lastActive: string;
  posts: number;
  rating: number;
  totalSales: number;
  totalSpent: number;
  location: string;
  bio: string;
  notes: string[];
  activityLog: { action: string; date: string }[];
};

const dummyUsers: User[] = [
  { id: 1, name: "রহিম উদ্দিন", email: "rahim@gmail.com", phone: "017XXXXXXXX", role: "seller", status: "active", verified: true, joined: "২০২৬-০৪-১৬", lastActive: "২০২৬-০৪-১৭", posts: 12, rating: 4.8, totalSales: 25, totalSpent: 5000, location: "কুষ্টিয়া", bio: "প্রফেশনাল বিক্রেতা", notes: [], activityLog: [] },
  { id: 2, name: "করিম মিয়া", email: "karim@gmail.com", phone: "018XXXXXXXX", role: "user", status: "active", verified: false, joined: "২০২৬-০৪-১৫", lastActive: "২০২৬-০৪-১৬", posts: 8, rating: 4.5, totalSales: 0, totalSpent: 1200, location: "ঢাকা", bio: "", notes: [], activityLog: [] },
  { id: 3, name: "শাহিনুর রহমান", email: "shahinur@gmail.com", phone: "019XXXXXXXX", role: "seller", status: "blocked", verified: false, joined: "২০২৬-০৪-১৪", lastActive: "২০২৬-০৪-১৪", posts: 3, rating: 3.2, totalSales: 5, totalSpent: 800, location: "চট্টগ্রাম", bio: "", notes: [], activityLog: [] },
  { id: 4, name: "আব্দুল করিম", email: "abdul@gmail.com", phone: "016XXXXXXXX", role: "seller", status: "active", verified: true, joined: "২০২৬-০৪-১৩", lastActive: "২০২৬-০৪-১৭", posts: 25, rating: 4.9, totalSales: 120, totalSpent: 15000, location: "কুষ্টিয়া", bio: "টপ রেটেড সেলার", notes: [], activityLog: [] },
  { id: 5, name: "নাজমা বেগম", email: "najma@gmail.com", phone: "015XXXXXXXX", role: "user", status: "active", verified: false, joined: "২০২৬-০৪-১২", lastActive: "২০২৬-০৪-১৫", posts: 2, rating: 0, totalSales: 0, totalSpent: 500, location: "রাজশাহী", bio: "", notes: [], activityLog: [] },
];

export default function AdminUsers() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(dummyUsers);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifyFilter, setVerifyFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const filteredUsers = users.filter(user => {
    if (search && !user.name.toLowerCase().includes(search.toLowerCase()) && !user.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter !== "all" && user.status !== filter) return false;
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (verifyFilter !== "all" && user.verified !== (verifyFilter === "verified")) return false;
    return true;
  });

  const toggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
  };

  const toggleVerify = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user?.verified) {
      if (confirm("ভেরিফিকেশন রিমুভ করতে চান?")) {
        setUsers(users.map(u => u.id === id ? { ...u, verified: false } : u));
        alert("ভেরিফিকেশন রিমুভ করা হয়েছে!");
      }
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, verified: true } : u));
      alert(`${user?.name} ভেরিফাইড হয়েছে!`);
    }
  };

  const deleteUser = (id: number) => {
    if (confirm("আপনি কি এই ইউজার ডিলিট করতে চান? সব তথ্য মুছে যাবে!")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const updateRole = (id: number, role: 'user' | 'seller' | 'admin') => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    alert(`রোল পরিবর্তন করে ${role} করা হয়েছে!`);
  };

  const addNote = (id: number) => {
    if (newNote.trim()) {
      setUsers(users.map(u => u.id === id ? { ...u, notes: [...u.notes, `${newNote} - ${new Date().toLocaleDateString('bn-BD')}`] } : u));
      setNewNote("");
      setShowNoteModal(false);
      alert("নোট যোগ করা হয়েছে!");
    }
  };

  const sendEmail = (user: User) => {
    if (emailSubject && emailMessage) {
      alert(`ইমেইল পাঠানো হয়েছে: ${user.email}\nবিষয়: ${emailSubject}`);
      setEmailSubject("");
      setEmailMessage("");
      setShowEmailModal(false);
    }
  };

  const resetPassword = (user: User) => {
    if (confirm(`${user.name} এর পাসওয়ার্ড রিসেট করতে চান? নতুন পাসওয়ার্ড ইমেইলে পাঠানো হবে।`)) {
      alert(`পাসওয়ার্ড রিসেট লিংক ${user.email} এ পাঠানো হয়েছে!`);
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">অ্যাডমিন</span>;
      case 'seller': return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">সেলার</span>;
      case 'user': return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">ইউজার</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">সক্রিয়</span>;
      case 'blocked': return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">ব্লক</span>;
      default: return null;
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    verified: users.filter(u => u.verified).length,
    unverified: users.filter(u => !u.verified).length,
    sellers: users.filter(u => u.role === 'seller').length,
    totalSales: users.reduce((sum, u) => sum + u.totalSales, 0),
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
          <h1 className="text-xl font-bold text-gray-800">ইউজার ম্যানেজমেন্ট</h1>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট ইউজার</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">ভেরিফাইড</p><p className="text-2xl font-bold">{stats.verified}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">সেলার</p><p className="text-2xl font-bold">{stats.sellers}</p></div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট বিক্রয়</p><p className="text-2xl font-bold">{stats.totalSales}</p></div>
          </div>

          {/* ফিল্টার সেকশন */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" /></div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব স্ট্যাটাস</option><option value="active">সক্রিয়</option><option value="blocked">ব্লক</option></select>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব রোল</option><option value="user">ইউজার</option><option value="seller">সেলার</option><option value="admin">অ্যাডমিন</option></select>
              <select value={verifyFilter} onChange={(e) => setVerifyFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব ভেরিফিকেশন</option><option value="verified">ভেরিফাইড</option><option value="unverified">আনভেরিফাইড</option></select>
            </div>
          </div>

          {/* ইউজার টেবিল */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">ইউজার</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">যোগাযোগ</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">রোল</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">ভেরিফাই</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">পোস্ট/বিক্রয়</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">রেটিং</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500">স্ট্যাটাস</th>
                    <th className="p-3 text-center text-xs font-medium text-gray-500">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3"><p className="font-medium text-sm">{user.name}</p><p className="text-xs text-gray-400">সদস্য {user.joined}</p></td>
                      <td className="p-3"><p className="text-sm">{user.email}</p><p className="text-xs text-gray-400">{user.phone}</p></td>
                      <td className="p-3">{getRoleBadge(user.role)}</td>
                      <td className="p-3">{user.verified ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ ভেরিফাইড</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">⏳ আনভেরিফাইড</span>}</td>
                      <td className="p-3"><p className="text-sm">📦 {user.posts} পোস্ট</p><p className="text-xs text-gray-400">💰 {user.totalSales} বিক্রয়</p></td>
                      <td className="p-3"><div className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /><span className="text-sm">{user.rating}</span></div></td>
                      <td className="p-3">{getStatusBadge(user.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1 flex-wrap">
                          <button onClick={() => { setSelectedUser(user); setShowDetailsModal(true); }} className="p-1 text-gray-400 hover:text-blue-600" title="বিস্তারিত"><Eye size={16} /></button>
                          <button onClick={() => { setEditUser(user); setShowEditModal(true); }} className="p-1 text-gray-400 hover:text-green-600" title="এডিট"><Edit2 size={16} /></button>
                          <button onClick={() => toggleVerify(user.id)} className="p-1 text-gray-400 hover:text-green-600" title={user.verified ? "ভেরিফিকেশন রিমুভ" : "ভেরিফাই করুন"}>{user.verified ? <UserX size={16} /> : <UserCheck size={16} />}</button>
                          <button onClick={() => updateRole(user.id, user.role === 'user' ? 'seller' : user.role === 'seller' ? 'admin' : 'user')} className="p-1 text-gray-400 hover:text-purple-600" title="রোল পরিবর্তন"><Shield size={16} /></button>
                          <button onClick={() => { setSelectedUser(user); setShowEmailModal(true); }} className="p-1 text-gray-400 hover:text-blue-600" title="ইমেইল পাঠান"><Mail size={16} /></button>
                          <button onClick={() => resetPassword(user)} className="p-1 text-gray-400 hover:text-orange-600" title="পাসওয়ার্ড রিসেট"><Lock size={16} /></button>
                          <button onClick={() => { setSelectedUser(user); setShowNoteModal(true); }} className="p-1 text-gray-400 hover:text-green-600" title="নোট যোগ করুন"><FileText size={16} /></button>
                          <button onClick={() => toggleStatus(user.id)} className="p-1 text-gray-400 hover:text-yellow-600" title={user.status === 'active' ? "ব্লক" : "সক্রিয়"}>{user.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}</button>
                          <button onClick={() => deleteUser(user.id)} className="p-1 text-gray-400 hover:text-red-600" title="ডিলিট"><Trash2 size={16} /></button>
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

      {/* ইউজার ডিটেইল মডাল */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">ইউজার বিস্তারিত</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-full flex items-center justify-center text-3xl">{selectedUser.name.charAt(0)}</div>
                <div><h2 className="text-xl font-bold">{selectedUser.name}</h2><p className="text-gray-500">{selectedUser.email} | {selectedUser.phone}</p>{selectedUser.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ ভেরিফাইড সেলার</span>}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500">অঞ্চল</label><p className="flex items-center gap-1"><MapPin size={14} /> {selectedUser.location}</p></div>
                <div><label className="text-xs text-gray-500">সদস্য</label><p><Calendar size={14} className="inline" /> {selectedUser.joined}</p></div>
                <div><label className="text-xs text-gray-500">শেষ সক্রিয়</label><p>{selectedUser.lastActive}</p></div>
                <div><label className="text-xs text-gray-500">মোট খরচ</label><p><DollarSign size={14} className="inline" /> {selectedUser.totalSpent} ৳</p></div>
              </div>
              <div className="mt-4"><label className="text-xs text-gray-500">বায়ো</label><p>{selectedUser.bio || "কিছু লেখা নেই"}</p></div>
              <div className="mt-4"><label className="text-xs text-gray-500">নোট</label><div className="space-y-1">{selectedUser.notes.map((note, i) => <div key={i} className="bg-gray-50 p-2 rounded text-sm">{note}</div>)}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* এডিট ইউজার মডাল */}
      {showEditModal && editUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">ইউজার এডিট</h3>
            <div className="space-y-3">
              <input type="text" value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="email" value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="tel" value={editUser.phone} onChange={(e) => setEditUser({...editUser, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
              <input type="text" value={editUser.location} onChange={(e) => setEditUser({...editUser, location: e.target.value})} className="w-full p-2 border rounded-lg" />
              <textarea value={editUser.bio} onChange={(e) => setEditUser({...editUser, bio: e.target.value})} rows={3} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setUsers(users.map(u => u.id === editUser.id ? editUser : u)); setShowEditModal(false); alert("আপডেট করা হয়েছে!"); }} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">সংরক্ষণ করুন</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* ইমেইল মডাল */}
      {showEmailModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">ইমেইল পাঠান: {selectedUser.name}</h3>
            <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="বিষয়" className="w-full p-2 border rounded-lg mb-3" />
            <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} placeholder="বার্তা" rows={5} className="w-full p-2 border rounded-lg mb-3" />
            <div className="flex gap-2">
              <button onClick={() => sendEmail(selectedUser)} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">পাঠান</button>
              <button onClick={() => setShowEmailModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* নোট মডাল */}
      {showNoteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5">
            <h3 className="text-lg font-bold mb-4">নোট যোগ করুন: {selectedUser.name}</h3>
            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="নোট লিখুন..." rows={4} className="w-full p-2 border rounded-lg mb-3" />
            <div className="flex gap-2">
              <button onClick={() => addNote(selectedUser.id)} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">যোগ করুন</button>
              <button onClick={() => setShowNoteModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}