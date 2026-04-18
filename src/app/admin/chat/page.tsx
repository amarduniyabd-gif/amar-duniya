"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Search, MessageCircle, Users, Send, 
  CheckCircle, Clock, Filter, MoreVertical, Eye,
  AlertCircle, Ban, RefreshCw, Trash2, Shield,
  User, Package, ChevronRight, ArrowLeft, CheckCheck
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

type Message = {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
};

type Conversation = {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  postId?: number;
  postTitle?: string;
  messages: Message[];
};

const dummyMonitoredUsers: MonitoredUser[] = [
  { id: 1, name: "রহিম উদ্দিন", email: "rahim@gmail.com", avatar: "👨", totalConversations: 5, totalMessages: 34, lastActive: "এখনই", status: "active", reports: 0 },
  { id: 2, name: "করিম মিয়া", email: "karim@gmail.com", avatar: "👨", totalConversations: 3, totalMessages: 18, lastActive: "৫ মিনিট আগে", status: "active", reports: 1 },
  { id: 3, name: "শাহিনুর রহমান", email: "shahinur@gmail.com", avatar: "👨", totalConversations: 8, totalMessages: 56, lastActive: "১ ঘন্টা আগে", status: "blocked", reports: 3 },
  { id: 4, name: "নাজমা বেগম", email: "nazma@gmail.com", avatar: "👩", totalConversations: 2, totalMessages: 12, lastActive: "এখনই", status: "active", reports: 0 },
  { id: 5, name: "আলমগীর হোসেন", email: "alamgir@gmail.com", avatar: "👨", totalConversations: 12, totalMessages: 89, lastActive: "১০ মিনিট আগে", status: "active", reports: 2 },
];

const dummyConversations: Conversation[] = [
  {
    id: 1, userId: 1, userName: "রহিম উদ্দিন", userAvatar: "👨",
    otherUserId: 2, otherUserName: "করিম মিয়া", otherUserAvatar: "👨",
    lastMessage: "iPhone টা কত দাম?", lastMessageTime: "১০:৩০", unreadCount: 0,
    postId: 101, postTitle: "iPhone 15 Pro Max",
    messages: [
      { id: 1, senderId: 1, senderName: "রহিম উদ্দিন", content: "iPhone টা কত দাম?", timestamp: "১০:৩০", isRead: true },
      { id: 2, senderId: 2, senderName: "করিম মিয়া", content: "৭৫,০০০ টাকা।", timestamp: "১০:৩২", isRead: true },
      { id: 3, senderId: 1, senderName: "রহিম উদ্দিন", content: "একটু কম হবে?", timestamp: "১০:৩৩", isRead: false },
    ],
  },
  {
    id: 2, userId: 1, userName: "রহিম উদ্দিন", userAvatar: "👨",
    otherUserId: 4, otherUserName: "নাজমা বেগম", otherUserAvatar: "👩",
    lastMessage: "Samsung টা বিক্রি হবে?", lastMessageTime: "০৯:১৫", unreadCount: 2,
    postId: 102, postTitle: "Samsung Galaxy S23",
    messages: [
      { id: 1, senderId: 1, senderName: "রহিম উদ্দিন", content: "Samsung টা বিক্রি হবে?", timestamp: "০৯:১০", isRead: true },
      { id: 2, senderId: 4, senderName: "নাজমা বেগম", content: "জি, ৬৫,০০০ টাকা।", timestamp: "০৯:১২", isRead: true },
      { id: 3, senderId: 1, senderName: "রহিম উদ্দিন", content: "ঠিক আছে, আমি নিচ্ছি।", timestamp: "০৯:১৫", isRead: true },
    ],
  },
  {
    id: 3, userId: 2, userName: "করিম মিয়া", userAvatar: "👨",
    otherUserId: 5, otherUserName: "আলমগীর হোসেন", otherUserAvatar: "👨",
    lastMessage: "MacBook Pro available?", lastMessageTime: "গতকাল", unreadCount: 0,
    messages: [
      { id: 1, senderId: 2, senderName: "করিম মিয়া", content: "MacBook Pro available?", timestamp: "গতকাল", isRead: true },
      { id: 2, senderId: 5, senderName: "আলমগীর হোসেন", content: "Yes, 180k.", timestamp: "গতকাল", isRead: true },
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
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations);
  const [selectedUser, setSelectedUser] = useState<MonitoredUser | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [viewMode, setViewMode] = useState<'users' | 'conversations' | 'chat'>('users');
  const [adminMessage, setAdminMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [conversationSearch, setConversationSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, [router]);

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
    if (confirm("ইউজার ডিলিট করবেন?")) {
      setMonitoredUsers(prev => prev.filter(u => u.id !== userId));
      setConversations(prev => prev.filter(c => c.userId !== userId && c.otherUserId !== userId));
    }
  };

  const handleViewConversations = (user: MonitoredUser) => {
    setSelectedUser(user);
    setViewMode('conversations');
  };

  const handleViewChat = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setViewMode('chat');
    scrollToBottom();
  };

  const handleBackToUsers = () => {
    setViewMode('users');
    setSelectedUser(null);
    setSelectedConversation(null);
  };

  const handleBackToConversations = () => {
    setViewMode('conversations');
    setSelectedConversation(null);
  };

  const handleSendAdminMessage = () => {
    if (!adminMessage.trim() || !selectedConversation) return;
    
    const newMessage: Message = {
      id: selectedConversation.messages.length + 1,
      senderId: 0,
      senderName: "অ্যাডমিন",
      content: adminMessage,
      timestamp: "এখনই",
      isRead: false,
    };
    
    setConversations(prev => prev.map(c => 
      c.id === selectedConversation.id 
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: adminMessage, lastMessageTime: "এখনই" }
        : c
    ));
    
    setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
    setAdminMessage("");
    scrollToBottom();
  };

  const handleDeleteConversation = (convId: number) => {
    if (confirm("কনভারসেশন ডিলিট করবেন?")) {
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (selectedConversation?.id === convId) {
        setSelectedConversation(null);
      }
    }
  };

  const handleDeleteMessage = (convId: number, msgId: number) => {
    setConversations(prev => prev.map(c => 
      c.id === convId 
        ? { ...c, messages: c.messages.filter(m => m.id !== msgId) }
        : c
    ));
    if (selectedConversation?.id === convId) {
      setSelectedConversation(prev => prev ? { ...prev, messages: prev.messages.filter(m => m.id !== msgId) } : null);
    }
  };

  const handleWarnUser = (userId: number, userName: string) => {
    alert(`⚠️ "${userName}" কে সতর্কবার্তা পাঠানো হয়েছে!`);
  };

  const filteredUsers = monitoredUsers.filter(u => {
    if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const filteredConversations = conversations.filter(c => {
    if (!selectedUser) return false;
    if (c.userId !== selectedUser.id && c.otherUserId !== selectedUser.id) return false;
    if (conversationSearch) {
      const q = conversationSearch.toLowerCase();
      return (c.otherUserName.toLowerCase().includes(q)) ||
             (c.postTitle && c.postTitle.toLowerCase().includes(q));
    }
    return true;
  });

  const stats = {
    total: monitoredUsers.length,
    active: monitoredUsers.filter(u => u.status === 'active').length,
    blocked: monitoredUsers.filter(u => u.status === 'blocked').length,
    totalReports: monitoredUsers.reduce((sum, u) => sum + u.reports, 0),
    totalMessages: monitoredUsers.reduce((sum, u) => sum + u.totalMessages, 0),
    totalConversations: conversations.length,
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
          <div className="flex items-center gap-3">
            {viewMode !== 'users' && (
              <button onClick={viewMode === 'chat' ? handleBackToConversations : handleBackToUsers} className="p-2 hover:bg-gray-100 rounded-xl">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} className="text-[#f85606]" />
              {viewMode === 'users' && 'চ্যাট মনিটরিং'}
              {viewMode === 'conversations' && `${selectedUser?.name} এর কনভারসেশন`}
              {viewMode === 'chat' && `${selectedConversation?.otherUserName} এর সাথে চ্যাট`}
            </h1>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <RefreshCw size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* ইউজার ভিউ */}
          {viewMode === 'users' && (
            <>
              {/* স্ট্যাটাস কার্ড */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মোট ইউজার</p><p className="text-2xl font-bold">{stats.total}</p></div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">সক্রিয়</p><p className="text-2xl font-bold">{stats.active}</p></div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">ব্লক</p><p className="text-2xl font-bold">{stats.blocked}</p></div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">রিপোর্ট</p><p className="text-2xl font-bold">{stats.totalReports}</p></div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মেসেজ</p><p className="text-2xl font-bold">{stats.totalMessages}</p></div>
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">কনভারসেশন</p><p className="text-2xl font-bold">{stats.totalConversations}</p></div>
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
            </>
          )}

          {/* কনভারসেশন ভিউ */}
          {viewMode === 'conversations' && selectedUser && (
            <div className="space-y-4">
              {/* সার্চ */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={conversationSearch} onChange={(e) => setConversationSearch(e.target.value)} placeholder="কনভারসেশন খুঁজুন..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" />
                </div>
              </div>

              {/* কনভারসেশন লিস্ট */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredConversations.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">কোনো কনভারসেশন নেই</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conv) => (
                      <div key={conv.id} className="p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => handleViewChat(conv)}>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xl">
                            {conv.otherUserAvatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                  {conv.otherUserName}
                                  {conv.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                                  )}
                                </h3>
                                {conv.postTitle && (
                                  <p className="text-xs text-[#f85606] flex items-center gap-1 mt-0.5">
                                    <Package size={10} /> {conv.postTitle}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{conv.lastMessage}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* চ্যাট ভিউ */}
          {viewMode === 'chat' && selectedConversation && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* চ্যাট হেডার */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xl">
                    {selectedConversation.otherUserAvatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConversation.otherUserName}</h3>
                    {selectedConversation.postTitle && (
                      <p className="text-xs text-[#f85606]">{selectedConversation.postTitle}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteConversation(selectedConversation.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* মেসেজ লিস্ট */}
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${msg.senderId === 0 ? 'order-2' : 'order-1'}`}>
                      {msg.senderId !== 0 && (
                        <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
                      )}
                      <div className={`p-3 rounded-2xl ${
                        msg.senderId === 0 
                          ? 'bg-[#f85606] text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                        {msg.senderId === 0 && (
                          <CheckCheck size={12} className={msg.isRead ? 'text-blue-500' : 'text-gray-300'} />
                        )}
                      </div>
                    </div>
                    {msg.senderId !== 0 && (
                      <button 
                        onClick={() => handleDeleteMessage(selectedConversation.id, msg.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* মেসেজ ইনপুট */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendAdminMessage()}
                    placeholder="অ্যাডমিন হিসেবে মেসেজ লিখুন..."
                    className="flex-1 p-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  />
                  <button
                    onClick={handleSendAdminMessage}
                    disabled={!adminMessage.trim()}
                    className="p-3 bg-[#f85606] text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}