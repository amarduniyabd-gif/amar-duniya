"use client";
import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Send, CheckCheck, Circle, 
  MoreVertical, Trash2, AlertCircle, Ban
} from "lucide-react";

// ============ টাইপ ডেফিনিশন ============
type Message = {
  id: number;
  text: string;
  isSender: boolean;
  time: string;
  status: "sent" | "delivered" | "read";
};

// ============ মেমোইজড মেসেজ কম্পোনেন্ট (রি-রেন্ডার বন্ধ) ============
const MessageBubble = memo(({ 
  msg, 
  isSender, 
  userAvatar 
}: { 
  msg: Message; 
  isSender: boolean; 
  userAvatar: string;
}) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "sent": return <CheckCheck size={12} className="text-gray-400" />;
      case "delivered": return <CheckCheck size={12} className="text-blue-500" />;
      case "read": return <CheckCheck size={12} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-150`}>
      {!isSender && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm mr-2 self-end shadow-sm flex-shrink-0">
          {userAvatar}
        </div>
      )}
      <div className={`max-w-[75%] ${isSender ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3 rounded-2xl shadow-sm ${
            isSender
              ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white rounded-br-none'
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
          }`}
        >
          <p className="text-sm break-words leading-relaxed">{msg.text}</p>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-400 px-1">
          <span>{msg.time}</span>
          {isSender && getStatusIcon(msg.status)}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ============ টাইপিং ইন্ডিকেটর (মেমোইজড) ============
const TypingIndicator = memo(({ userAvatar }: { userAvatar: string }) => (
  <div className="flex justify-start animate-in fade-in duration-150">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm mr-2 flex-shrink-0">
      {userAvatar}
    </div>
    <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';

// ============ কনভারসেশন ডাটা (ক্যাশড) ============
const getConversationById = (id: string) => ({
  id: parseInt(id),
  userName: "রহিম উদ্দিন",
  userAvatar: "👨",
  isOnline: true,
  rating: 4.8,
  totalSales: 128,
});

const getMessages = (): Message[] => [
  { id: 1, text: "হ্যালো, পণ্যটি এখনো আছে?", isSender: false, time: "১০:৩০", status: "read" },
  { id: 2, text: "হ্যাঁ, আছে। আপনি কিনতে চান?", isSender: true, time: "১০:৩২", status: "read" },
  { id: 3, text: "দাম একটু কমাতে পারবেন?", isSender: false, time: "১০:৩৫", status: "read" },
  { id: 4, text: "নগদে নিলে ২০০০ টাকা ছাড় দিতে পারি", isSender: true, time: "১০:৩৮", status: "delivered" },
  { id: 5, text: "ঠিক আছে, আমি নিচ্ছি", isSender: false, time: "১০:৪০", status: "delivered" },
];

// ============ মেইন কম্পোনেন্ট ============
export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  // স্টেট - মিনিমাম রি-রেন্ডারের জন্য আলাদা
  const [conversation] = useState(() => getConversationById(chatId));
  const [messages, setMessages] = useState(() => getMessages());
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // রেফ
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============ অপটিমাইজড স্ক্রল (requestAnimationFrame) ============
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: smooth ? "smooth" : "auto",
          block: "end" 
        });
      });
    }, 16); // 60fps
  }, []);

  useEffect(() => {
    scrollToBottom();
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [messages, scrollToBottom]);

  // ============ অপটিমাইজড টাইপিং সিমুলেশন ============
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBlocked) {
        setIsTyping(Math.random() > 0.85);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isBlocked]);

  // ============ সুপার ফাস্ট মেসেজ সেন্ড (Optimistic UI) ============
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || isBlocked || isSending) return;
    
    const trimmedMessage = newMessage.trim();
    
    // Optimistic Update - সাথে সাথে UI আপডেট
    const optimisticMsg: Message = {
      id: Date.now(),
      text: trimmedMessage,
      isSender: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");
    setIsSending(true);
    
    // ইনপুট ফোকাস
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    
    // স্ক্রল
    scrollToBottom();
    
    // সিমুলেটেড API কল (দ্রুত)
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === optimisticMsg.id 
            ? { ...m, status: "delivered" } 
            : m
        )
      );
      
      // অটো রিপ্লাই
      setTimeout(() => {
        if (!isBlocked) {
          const replyMsg: Message = {
            id: Date.now() + 1,
            text: "আমি দেখছি, একটু পর reply দিচ্ছি...",
            isSender: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "read",
          };
          setMessages(prev => [...prev, replyMsg]);
          scrollToBottom();
        }
        setIsSending(false);
      }, 800);
    }, 200);
  }, [newMessage, isBlocked, isSending, scrollToBottom]);

  // ============ ডিবাউন্সড ইনপুট হ্যান্ডলার ============
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage, isSending]);

  // ============ মেমোইজড অ্যাকশন হ্যান্ডলার ============
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  const handleDeleteChat = useCallback(() => {
    setShowDeleteConfirm(false);
    setShowChatMenu(false);
    router.push("/chat");
  }, [router]);

  const handleBlockUser = useCallback(() => {
    setIsBlocked(prev => !prev);
    setShowBlockConfirm(false);
    setShowChatMenu(false);
  }, []);

  const handleReportUser = useCallback(() => {
    setShowChatMenu(false);
    alert("⚠️ ইউজার রিপোর্ট করা হয়েছে!");
  }, []);

  // ============ ক্লিনআপ ============
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // ============ মেমোইজড ভ্যালু ============
  const memoizedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      
      {/* হেডার - GPU Accelerated */}
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-20 shadow-xl transform-gpu">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGoBack} 
                className="p-2 hover:bg-white/20 rounded-full transition-transform active:scale-95"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center text-xl border-2 border-white/50 shadow-lg">
                    {conversation.userAvatar}
                  </div>
                  {conversation.isOnline && !isBlocked && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-base tracking-tight flex items-center gap-2">
                    {conversation.userName}
                    {isBlocked && (
                      <span className="text-[10px] bg-red-500/30 px-2 py-0.5 rounded-full">ব্লক</span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] text-white/80">
                    <span>⭐ {conversation.rating}</span>
                    <span>•</span>
                    <span>{conversation.totalSales} বিক্রয়</span>
                    <span>•</span>
                    {conversation.isOnline && !isBlocked ? (
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

            {/* মেনু */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChatMenu(!showChatMenu);
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-transform active:scale-95"
              >
                <MoreVertical size={20} />
              </button>
              
              {showChatMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 min-w-[150px] transform-gpu">
                  <button onClick={() => { setShowDeleteConfirm(true); setShowChatMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                    <Trash2 size={14} /> চ্যাট ডিলিট
                  </button>
                  <button onClick={() => { setShowBlockConfirm(true); setShowChatMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 text-orange-600 flex items-center gap-2">
                    <Ban size={14} /> {isBlocked ? 'আনব্লক' : 'ব্লক'}
                  </button>
                  <button onClick={handleReportUser} className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-50 text-yellow-600 flex items-center gap-2">
                    <AlertCircle size={14} /> রিপোর্ট
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* মেসেজ লিস্ট - Virtualized Ready */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 pb-28 will-change-scroll">
        <div className="flex justify-center my-3">
          <div className="bg-gray-200/80 backdrop-blur-sm text-gray-600 text-[10px] px-4 py-1.5 rounded-full shadow-sm">
            আজ
          </div>
        </div>
        
        {/* মেসেজ রেন্ডার - শুধু দৃশ্যমান */}
        {memoizedMessages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            msg={msg} 
            isSender={msg.isSender} 
            userAvatar={conversation.userAvatar} 
          />
        ))}
        
        {isTyping && !isBlocked && <TypingIndicator userAvatar={conversation.userAvatar} />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* ইনপুট - GPU Accelerated */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg transform-gpu">
        <div className="max-w-3xl mx-auto p-3">
          {isBlocked ? (
            <div className="bg-red-50 rounded-2xl p-3 text-center">
              <p className="text-sm text-red-600">❌ ইউজার ব্লক করা হয়েছে</p>
              <button onClick={() => setIsBlocked(false)} className="text-xs text-[#f85606] mt-1 underline">আনব্লক করুন</button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="মেসেজ লিখুন..."
                    disabled={isSending}
                    className="w-full p-3 pr-12 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#f85606] text-sm transition-all disabled:opacity-50"
                    autoComplete="off"
                  />
                  {newMessage.length > 0 && (
                    <button
                      onClick={handleSendMessage}
                      disabled={isSending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-1.5 rounded-full shadow-md hover:shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-[9px] text-gray-400">
                <span>🔒 এনক্রিপ্টেড</span>
                <span>•</span>
                <button onClick={handleReportUser} className="hover:text-[#f85606]">রিপোর্ট</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* মডালস - Lazy Loaded */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">চ্যাট ডিলিট করবেন?</h3>
              <p className="text-sm text-gray-500 mb-6">এই চ্যাট স্থায়ীভাবে ডিলিট হয়ে যাবে।</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={handleDeleteChat} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold">ডিলিট</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban size={32} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{isBlocked ? 'আনব্লক করবেন?' : 'ব্লক করবেন?'}</h3>
              <p className="text-sm text-gray-500 mb-6">{isBlocked ? 'ইউজার আবার মেসেজ পাঠাতে পারবে।' : 'ইউজার আর মেসেজ পাঠাতে পারবে না।'}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowBlockConfirm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={handleBlockUser} className={`flex-1 text-white py-3 rounded-xl font-semibold ${isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
                  {isBlocked ? 'আনব্লক' : 'ব্লক'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}