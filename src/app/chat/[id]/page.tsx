"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Send, CheckCheck, 
  MoreVertical, Trash2, AlertCircle, Ban, Loader2
} from "lucide-react";

// ============ টাইপ ডেফিনিশন ============
type Message = {
  id: string;
  text: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
  sender?: any;
};

type Conversation = {
  id: string;
  post_id: string;
  buyer_id: string;
  seller_id: string;
  user: {
    name: string;
    avatar: string;
    is_online: boolean;
  };
  post: {
    title: string;
    price: number;
  };
};

// ============ মেসেজ বাবল ============
const MessageBubble = memo(({ msg, isSender, userAvatar }: { 
  msg: Message; 
  isSender: boolean; 
  userAvatar: string;
}) => {
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-150`}>
      {!isSender && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm mr-2 self-end shadow-sm flex-shrink-0">
          {userAvatar || '👤'}
        </div>
      )}
      <div className={`max-w-[75%] ${isSender ? 'items-end' : 'items-start'}`}>
        <div className={`p-3 rounded-2xl shadow-sm ${
          isSender
            ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
        }`}>
          <p className="text-sm break-words leading-relaxed">{msg.text}</p>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-400 px-1">
          <span>{time}</span>
          {isSender && <CheckCheck size={12} className={msg.is_read ? "text-green-500" : "text-gray-400"} />}
        </div>
      </div>
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';

// ============ টাইপিং ইন্ডিকেটর ============
const TypingIndicator = memo(({ userAvatar }: { userAvatar: string }) => (
  <div className="flex justify-start animate-in fade-in duration-150">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm mr-2 flex-shrink-0">
      {userAvatar || '👤'}
    </div>
    <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm border border-gray-100">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
));
TypingIndicator.displayName = 'TypingIndicator';

// ============ মেইন কম্পোনেন্ট ============
export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<any>(null);

  // ✅ Supabase ক্লায়েন্ট লোড
  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const client = getSupabaseClient();
        setSupabase(client);
      } catch (error) {
        console.error('Failed to load Supabase:', error);
      }
    };
    loadSupabase();
  }, []);

  // ============ কনভারসেশন ও মেসেজ লোড ============
  useEffect(() => {
    if (!supabase) return;
    
    const loadConversation = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/login'); return; }
        setCurrentUserId(user.id);
        
        const { data: conv, error: convError } = await supabase
          .from('conversations')
          .select(`
            *,
            post:posts(id, title, price),
            buyer:profiles!buyer_id(id, name, avatar),
            seller:profiles!seller_id(id, name, avatar)
          `)
          .eq('id', chatId)
          .single();
        
        if (convError) throw convError;
        
        const otherUser = conv.buyer_id === user.id ? conv.seller : conv.buyer;
        
        setConversation({
          id: conv.id,
          post_id: conv.post_id,
          buyer_id: conv.buyer_id,
          seller_id: conv.seller_id,
          user: {
            name: otherUser?.name || 'ইউজার',
            avatar: otherUser?.avatar || '👤',
            is_online: false,
          },
          post: conv.post,
        });
        
        // মেসেজ লোড
        const { data: msgs } = await supabase
          .from('messages')
          .select(`*, sender:profiles!sender_id(name, avatar)`)
          .eq('conversation_id', chatId)
          .order('created_at', { ascending: true });
        
        if (msgs) setMessages(msgs);
        
        // আনরিড মেসেজ রিড করা
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', chatId)
          .eq('receiver_id', user.id)
          .eq('is_read', false);
          
      } catch (error) {
        console.log('Load error, redirecting to chat list');
        router.push('/chat');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
    
    return () => {
      if (channelRef.current && supabase) supabase.removeChannel(channelRef.current);
    };
  }, [chatId, router, supabase]);

  // ============ Realtime সাবস্ক্রিপশন ============
  useEffect(() => {
    if (!supabase || !chatId || !currentUserId) return;
    
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${chatId}`,
      }, (payload: any) => {
        const newMsg = payload.new as Message;
        if (newMsg.sender_id !== currentUserId) {
          setMessages(prev => [...prev, newMsg]);
          supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id);
        }
      })
      .subscribe();
    
    channelRef.current = channel;
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, chatId, currentUserId]);

  // ============ স্ক্রল ============
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ============ মেসেজ সেন্ড ============
  const handleSendMessage = useCallback(async () => {
    if (!supabase || !newMessage.trim() || isBlocked || isSending || !conversation || !currentUserId) return;
    
    const trimmedMessage = newMessage.trim();
    const receiverId = conversation.buyer_id === currentUserId ? conversation.seller_id : conversation.buyer_id;
    
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      text: trimmedMessage,
      sender_id: currentUserId,
      receiver_id: receiverId,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");
    setIsSending(true);
    inputRef.current?.focus();
    scrollToBottom();
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: chatId,
          sender_id: currentUserId,
          receiver_id: receiverId,
          text: trimmedMessage,
        });
      
      if (error) throw error;
      
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);
        
    } catch (error) {
      console.log('Send error');
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  }, [supabase, newMessage, isBlocked, isSending, conversation, currentUserId, chatId, scrollToBottom]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage, isSending]);

  // ============ ডিলিট চ্যাট ============
  const handleDeleteChat = useCallback(async () => {
    if (!supabase) return;
    try {
      await supabase.from('conversations').delete().eq('id', chatId);
      router.push('/chat');
    } catch (error) {
      alert('ডিলিট করতে সমস্যা হয়েছে!');
    }
    setShowDeleteConfirm(false);
  }, [supabase, chatId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  if (!conversation) return null;

  const otherUserAvatar = conversation.user.avatar || '👤';
  const isSender = (msg: Message) => msg.sender_id === currentUserId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      
      <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white sticky top-0 z-20 shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="p-2 hover:bg-white/20 rounded-full active:scale-95">
                <ArrowLeft size={22} />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center text-xl border-2 border-white/50 shadow-lg">
                    {otherUserAvatar}
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-base flex items-center gap-2">
                    {conversation.user.name}
                    {isBlocked && <span className="text-[10px] bg-red-500/30 px-2 py-0.5 rounded-full">ব্লক</span>}
                  </h2>
                  <p className="text-[10px] text-white/80">
                    {conversation.post?.title?.slice(0, 30)}...
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setShowChatMenu(!showChatMenu)} className="p-2 hover:bg-white/20 rounded-full active:scale-95">
                <MoreVertical size={20} />
              </button>
              
              {showChatMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 min-w-[150px]">
                  <button onClick={() => { setShowDeleteConfirm(true); setShowChatMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                    <Trash2 size={14} /> চ্যাট ডিলিট
                  </button>
                  <button onClick={() => { setIsBlocked(!isBlocked); setShowChatMenu(false); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 text-orange-600 flex items-center gap-2">
                    <Ban size={14} /> {isBlocked ? 'আনব্লক' : 'ব্লক'}
                  </button>
                  <button onClick={() => { setShowChatMenu(false); alert("রিপোর্ট করা হয়েছে!"); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-50 text-yellow-600 flex items-center gap-2">
                    <AlertCircle size={14} /> রিপোর্ট
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 pb-28">
        <div className="flex justify-center my-3">
          <div className="bg-gray-200/80 backdrop-blur-sm text-gray-600 text-[10px] px-4 py-1.5 rounded-full shadow-sm">আজ</div>
        </div>
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isSender={isSender(msg)} userAvatar={otherUserAvatar} />
        ))}
        
        {isTyping && !isBlocked && <TypingIndicator userAvatar={otherUserAvatar} />}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <div className="max-w-3xl mx-auto p-3">
          {isBlocked ? (
            <div className="bg-red-50 rounded-2xl p-3 text-center">
              <p className="text-sm text-red-600">❌ ইউজার ব্লক করা হয়েছে</p>
              <button onClick={() => setIsBlocked(false)} className="text-xs text-[#f85606] mt-1 underline">আনব্লক করুন</button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="মেসেজ লিখুন..."
                  disabled={isSending}
                  className="w-full p-3 pr-12 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#f85606] text-sm transition disabled:opacity-50"
                />
                {newMessage.length > 0 && (
                  <button onClick={handleSendMessage} disabled={isSending} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-1.5 rounded-full shadow-md active:scale-95 disabled:opacity-50">
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
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
      )}
    </div>
  );
}