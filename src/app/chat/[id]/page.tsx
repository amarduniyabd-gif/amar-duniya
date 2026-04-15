"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCheck, User, Circle } from "lucide-react";

type Message = {
  id: number;
  text: string;
  isSender: boolean;
  time: string;
  status: "sent" | "delivered" | "read";
};

const getConversationById = (id: string) => {
  return {
    id: parseInt(id),
    userName: "রহিম উদ্দিন",
    userAvatar: "👨",
    isOnline: true,
    rating: 4.8,
    totalSales: 128,
  };
};

const getMessages = (): Message[] => {
  return [
    { id: 1, text: "হ্যালো, পণ্যটি এখনো আছে?", isSender: false, time: "১০:৩০ AM", status: "read" },
    { id: 2, text: "হ্যাঁ, আছে। আপনি কিনতে চান?", isSender: true, time: "১০:৩২ AM", status: "read" },
    { id: 3, text: "দাম একটু কমাতে পারবেন?", isSender: false, time: "১০:৩৫ AM", status: "read" },
    { id: 4, text: "নগদে নিলে ২০০০ টাকা ছাড় দিতে পারি", isSender: true, time: "১০:৩৮ AM", status: "delivered" },
    { id: 5, text: "ঠিক আছে, আমি নিচ্ছি", isSender: false, time: "১০:৪০ AM", status: "delivered" },
  ];
};

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [conversation] = useState(() => getConversationById(chatId));
  const [messages, setMessages] = useState(() => getMessages());
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(Math.random() > 0.85);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    inputRef.current?.focus();
    
    setTimeout(() => {
      const replyMsg: Message = {
        id: messages.length + 2,
        text: "আমি দেখছি, একটু পর reply দিচ্ছি...",
        isSender: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "read",
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "sent": return <CheckCheck size={12} className="text-gray-400" />;
      case "delivered": return <CheckCheck size={12} className="text-blue-500" />;
      case "read": return <CheckCheck size={12} className="text-green-500" />;
      default: return null;
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      
      {/* হেডার - বিলিয়ন ডলার লুক */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-20 shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGoBack} 
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border-2 border-white/50 shadow-lg">
                    {conversation.userAvatar}
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-lg tracking-tight">{conversation.userName}</h2>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="flex items-center gap-1">⭐ {conversation.rating}</span>
                    <span>•</span>
                    <span>{conversation.totalSales} বিক্রয়</span>
                    <span>•</span>
                    {conversation.isOnline ? (
                      <span className="flex items-center gap-1">
                        <Circle size={6} fill="#4ade80" className="text-green-400" />
                        অনলাইন
                      </span>
                    ) : (
                      <span>অফলাইন</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* মেসেজ এলাকা */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-28">
        <div className="flex justify-center my-3">
          <div className="bg-gray-200/80 backdrop-blur-sm text-gray-600 text-xs px-4 py-1.5 rounded-full shadow-sm">
            আজ
          </div>
        </div>
        
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {!msg.isSender && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm mr-2 self-end shadow-sm">
                {conversation.userAvatar}
              </div>
            )}
            <div className={`max-w-[75%] ${msg.isSender ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-3 rounded-2xl shadow-md ${
                  msg.isSender
                    ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}
              >
                <p className="text-sm break-words leading-relaxed">{msg.text}</p>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1">
                <span>{msg.time}</span>
                {msg.isSender && getStatusIcon(msg.status)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm mr-2">
              {conversation.userAvatar}
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-md border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* ইনপুট এলাকা - ফিক্সড নিচে */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <div className="max-w-3xl mx-auto p-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="মেসেজ লিখুন..."
                className="w-full p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#f85606] text-sm pr-12 transition-all"
              />
              {newMessage.length > 0 && (
                <button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-1.5 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
          {/* নিরাপত্তা বার্তা - ছোট করে */}
          <div className="flex items-center justify-center gap-1 mt-2 text-[9px] text-gray-400">
            <span>🔒 এন্ড-টু-এন্ড এনক্রিপ্টেড</span>
            <span>•</span>
            <span>স্প্যাম রিপোর্ট করুন</span>
          </div>
        </div>
      </div>

    </div>
  );
}