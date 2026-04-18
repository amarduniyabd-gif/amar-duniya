"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Search, MessageCircle, Users, Send, 
  CheckCircle, Clock, Filter, MoreVertical, Eye,
  AlertCircle, Ban, RefreshCw, Trash2, Shield,
  User, Package, ChevronRight, ArrowLeft
} from "lucide-react";

type MonitoredUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  totalConversations: number;
  totalMessages: number;
  lastActive: string;
  status: 'active' | 'blocked';
  reports: number;
};

type ConversationDetail = {
  userId: number;
  userName: string;
  userAvatar: string;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatar: string;
  messages: Message[];
  postId?: number;
  postTitle?: string;
};

type Message = {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
};

const dummyMonitoredUsers: MonitoredUser[] = [
  { id: 1, name: "রহিম উদ্দিন", email: "rahim@gmail.com", avatar: "👨", totalConversations: 5, totalMessages: 34, lastActive: "এখনই", status: "active", reports: 0 },
  { id: 2, name: "করিম মিয়া", email: "karim@gmail.com", avatar: "👨", totalConversations: 3, totalMessages: 18, lastActive: "৫ মিনিট আগে", status: "active", reports: 1 },
  { id: 3, name: "শাহিনুর রহমান", email: "shahinur@gmail.com", avatar: "👨", totalConversations: 8, totalMessages: 56, lastActive: "১ ঘন্টা আগে", status: "blocked", reports: 3 },
  { id: 4, name: "নাজমা বেগম", email: "nazma@gmail.com", avatar: "👩", totalConversations: 2, totalMessages: 12, lastActive: "এখনই", status: "active", reports: 0 },
  { id: 5, name: "আলমগীর হোসেন", email: "alamgir@gmail.com", avatar: "👨", totalConversations: 12, totalMessages: 89, lastActive: "১০ মিনিট আগে", status: "active", reports: 2 },
];

const dummyConversationDetails: ConversationDetail[] = [
  {
    userId: 1,
    userName: "রহিম উদ্দিন",
    userAvatar: "👨",
    otherUserId: 2,
    otherUserName: "করিম মিয়া",
    otherUserAvatar: "👨",
    postId: 101,
    postTitle: "iPhone 15 Pro Max",
    messages: [
      { id: 1, senderId: 1, senderName: "রহিম উদ্দিন", content: "iPhone টা কত দাম?", timestamp: "১০:৩০", isRead: true },
      { id: 2, senderId: 2, senderName: "করিম মিয়া", content: "৭৫,০০০ টাকা।", timestamp: "১০:৩২", isRead: true },
      { id: 3, senderId: 1, senderName: "রহিম উদ্দিন", content: "একটু কম হবে?", timestamp: "১০:৩৩", isRead: true },
    ],
  },
];

export default function AdminChatPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monitoredUsers, setMonitoredUsers] = useState(dummyMonitoredUsers);
  const [selectedUser, setSelectedUser] = useState<MonitoredUser | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null);
  const [viewMode, setViewMode] = useState<'users' | 'conversations' | 'chat'>('users');
  const [adminMessage, setAdminMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleToggleUserStatus = (userId: number) => {
    setMonitoredUsers(prev => 
      prev.map(u => 
        u.id === userId 
          ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } 
          : u
      )
    );
  };

  const handleDeleteUser = (userId: number) => {
    setMonitoredUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleViewConversations = (user: MonitoredUser) => {
    setSelectedUser(user);
    setViewMode('conversations');
  };

  const handleViewChat = (conversation: ConversationDetail) => {
    setSelectedConversation(conversation);
    setViewMode('chat');
    scrollToBottom();
  };

  const handleSendAdminMessage = () => {
    if (!adminMessage.trim() || !selectedConversation) return;
    alert(`✅ মেসেজ পাঠানো হয়েছে: ${adminMessage}`);
    setAdminMessage("");
  };

  const handleWarnUser = (userId: number, userName: string) => {
    alert(`⚠️ "${userName}" কে সতর্কবার্তা পাঠানো হয়েছে!`);
  };

  const filteredUsers = monitoredUsers.filter(u => {
    if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: monitoredUsers.length,
    active: monitoredUsers.filter(u => u.status === 'active').length,
    blocked: monitoredUsers.filter(u => u.status === 'blocked').length,
    totalReports: monitoredUsers.reduce((sum, u) => sum + u.reports, 0),
    totalMessages: monitoredUsers.reduce((sum, u) => sum + u.totalMessages, 0),
  };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-2 rounded-lg shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="fixed inset-y-0 left-0 z-40 w-64 hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-64">
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle size={20} className="text-[#f85606]" />
            চ্যাট মনিটরিং
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition">
            <RefreshCw size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">মোট ইউজার</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">সক্রিয়</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">ব্লক</p>
              <p className="text-2xl font-bold">{stats.blocked}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">রিপোর্ট</p>
              <p className="text-2xl font-bold">{stats.totalReports}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">মোট মেসেজ</p>
              <p className="text-2xl font-bold">{stats.totalMessages}</p>
            </div>
          </div>

          {/* সার্চ ও ফিল্টার */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ইউজার খুঁজুন..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white">
                <option value="all">সব স্ট্যাটাস</option>
                <option value="active">সক্রিয়</option>
                <option value="blocked">ব্লক</option>
              </select>
            </div>
          </div>

          {/* ইউজার লিস্ট */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">ইউজার</th>
                    <th className="p-3 text-left">ইমেইল</th>
                    <th className="p-3 text-center">কনভারসেশন</th>
                    <th className="p-3 text-center">মেসেজ</th>
                    <th className="p-3 text-left">শেষ সক্রিয়</th>
                    <th className="p-3 text-center">রিপোর্ট</th>
                    <th className="p-3 text-center">স্ট্যাটাস</th>
                    <th className="p-3 text-center">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">{user.avatar}</div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{user.email}</td>
                      <td className="p-3 text-center text-sm">{user.totalConversations}</td>
                      <td className="p-3 text-center text-sm">{user.totalMessages}</td>
                      <td className="p-3 text-sm text-gray-500">{user.lastActive}</td>
                      <td className="p-3 text-center">
                        {user.reports > 0 ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{user.reports} টি</span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleToggleUserStatus(user.id)}>
                          {user.status === 'active' ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ সক্রিয়</span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ ব্লক</span>
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleViewConversations(user)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="কনভারসেশন দেখুন">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleWarnUser(user.id, user.name)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded" title="সতর্ক করুন">
                            <AlertCircle size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="ডিলিট">
                            <Trash2 size={16} />
                          </button>
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
    </div>
  );
}