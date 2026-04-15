"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Clock, User, Search, Plus } from "lucide-react";

type Conversation = {
  id: number;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productName: string;
  productImage: string;
};

const dummyConversations: Conversation[] = [
  {
    id: 1,
    userName: "রহিম উদ্দিন",
    userAvatar: "👨",
    lastMessage: "হ্যালো, পণ্যটি এখনো আছে?",
    lastMessageTime: "৫ মিনিট আগে",
    unreadCount: 2,
    productName: "iPhone 15 Pro Max",
    productImage: "📱",
  },
  {
    id: 2,
    userName: "করিম মিয়া",
    userAvatar: "👨",
    lastMessage: "দাম একটু কমাতে পারবেন?",
    lastMessageTime: "১ ঘন্টা আগে",
    unreadCount: 0,
    productName: "MacBook Pro M2",
    productImage: "💻",
  },
  {
    id: 3,
    userName: "শাহিনুর রহমান",
    userAvatar: "👨",
    lastMessage: "ধন্যবাদ!",
    lastMessageTime: "২ ঘন্টা আগে",
    unreadCount: 0,
    productName: "Samsung Galaxy S23",
    productImage: "📱",
  },
];

export default function ChatListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState(dummyConversations);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto">
        
        {/* হেডার */}
        <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
              চ্যাট
            </h1>
          </div>
          
          {/* সার্চ বার */}
          <div className="mt-3 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="নাম বা পণ্য দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* চ্যাট লিস্ট */}
        <div className="p-4 space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো চ্যাট নেই</h2>
              <p className="text-gray-500 mb-4">পণ্যে আগ্রহী হলে বিক্রেতার সাথে চ্যাট করুন</p>
              <Link href="/" className="inline-block bg-[#f85606] text-white px-6 py-2 rounded-xl">
                পণ্য ব্রাউজ করুন
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex gap-3">
                    {/* অ্যাভাটার */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-2xl">
                        {conv.userAvatar}
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-[#f85606] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    {/* তথ্য */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">{conv.userName}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">{conv.productImage} {conv.productName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          <span>{conv.lastMessageTime}</span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'} line-clamp-1`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}