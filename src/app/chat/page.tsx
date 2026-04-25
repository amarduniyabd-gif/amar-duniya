"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, MessageCircle, Clock, Search, 
  Trash2, MoreVertical, AlertCircle, Loader2 
} from "lucide-react";

type Conversation = {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productName: string;
  productImage: string;
  productId: string;
  otherUserId: string;
};

export default function ChatListPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // ✅ Supabase ক্লায়েন্ট লোড
  useEffect(() => {
    const loadSupabase = async () => {
      try {
        const { getSupabaseClient } = await import('@/lib/supabase/client');
        const client = getSupabaseClient();
        setSupabase(client);
      } catch (error) {
        console.error('Failed to load Supabase:', error);
      } finally {
        setMounted(true);
      }
    };
    
    loadSupabase();
  }, []);

  // ============ কনভারসেশন লোড ============
  useEffect(() => {
    if (!supabase) return;
    
    const loadConversations = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // ✅ লগইন না থাকলে খালি লিস্ট দেখাবে
        if (!user) {
          setCurrentUserId(null);
          setConversations([]);
          setLoading(false);
          return;
        }
        
        setCurrentUserId(user.id);

        const { data: convs, error } = await supabase
          .from('conversations')
          .select(`
            id,
            post_id,
            buyer_id,
            seller_id,
            last_message_at,
            post:posts(id, title),
            buyer:profiles!buyer_id(id, name, avatar),
            seller:profiles!seller_id(id, name, avatar)
          `)
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('last_message_at', { ascending: false });

        if (error) throw error;

        const formattedConvs: Conversation[] = [];
        
        for (const conv of (convs || [])) {
          const isBuyer = conv.buyer_id === user.id;
          const otherUser = isBuyer ? conv.seller : conv.buyer;
          
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('text, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          formattedConvs.push({
            id: conv.id,
            userName: otherUser?.name || 'ইউজার',
            userAvatar: otherUser?.avatar || '👤',
            lastMessage: lastMsg?.text || 'কোনো মেসেজ নেই',
            lastMessageTime: conv.last_message_at ? timeAgo(conv.last_message_at) : '',
            unreadCount: unreadCount || 0,
            productName: conv.post?.title || 'পণ্য',
            productImage: '📦',
            productId: conv.post_id,
            otherUserId: otherUser?.id,
          });
        }

        setConversations(formattedConvs);
        if (formattedConvs.length > 0) {
          localStorage.setItem('chatConversations', JSON.stringify(formattedConvs));
        }
      } catch (error) {
        console.log('Using local storage fallback');
        const savedConvs = JSON.parse(localStorage.getItem('chatConversations') || '[]');
        if (savedConvs.length > 0) setConversations(savedConvs);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [supabase, router]);

  // ============ Realtime সাবস্ক্রিপশন ============
  useEffect(() => {
    if (!supabase || !currentUserId) return;

    const channel = supabase
      .channel('chat-list')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload: any) => {
        const newMsg = payload.new;
        setConversations(prev => prev.map(conv => {
          if (conv.id === newMsg.conversation_id) {
            return {
              ...conv,
              lastMessage: newMsg.text,
              lastMessageTime: 'এইমাত্র',
              unreadCount: newMsg.sender_id !== currentUserId 
                ? conv.unreadCount + 1 
                : conv.unreadCount,
            };
          }
          return conv;
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserId]);

  // ============ টাইম এগো ============
  const timeAgo = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} দিন আগে`;
    if (hours > 0) return `${hours} ঘন্টা আগে`;
    if (minutes > 0) return `${minutes} মিনিট আগে`;
    return 'এইমাত্র';
  };

  // ============ ফিল্টার করা কনভারসেশন ============
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv =>
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  // ============ ডিলিট হ্যান্ডলার ============
  const handleDeleteConversation = useCallback(async (id: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase.from('conversations').delete().eq('id', id);
      if (error) throw error;
      
      setConversations(prev => prev.filter(c => c.id !== id));
      setShowDeleteConfirm(null);
      setShowActionMenu(null);
    } catch (error) {
      alert('ডিলিট করতে সমস্যা হয়েছে!');
    }
  }, [supabase]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 active:scale-95 transition">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
              চ্যাট {conversations.length > 0 && `(${conversations.length})`}
            </h1>
          </div>
          
          <div className="mt-3 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="নাম বা পণ্য দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-1">
                <AlertCircle size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {searchTerm ? 'কোনো চ্যাট পাওয়া যায়নি' : 'কোনো চ্যাট নেই'}
              </h2>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'অন্য নাম দিয়ে খুঁজুন' : 'পণ্যে আগ্রহী হলে বিক্রেতার সাথে চ্যাট করুন'}
              </p>
              <Link href="/" className="inline-block bg-[#f85606] text-white px-6 py-2 rounded-xl">
                পণ্য ব্রাউজ করুন
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <Link href={`/chat/${conv.id}`}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-2xl shadow-sm">
                          {conv.userAvatar}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-[#f85606] text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow-md">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-800 truncate">{conv.userName}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400 truncate">
                                {conv.productImage} {conv.productName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 ml-2 flex-shrink-0">
                            <Clock size={10} />
                            <span>{conv.lastMessageTime}</span>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowActionMenu(showActionMenu === conv.id ? null : conv.id); }}
                  className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition z-10 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
                
                {showActionMenu === conv.id && (
                  <div className="absolute top-12 right-3 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-20 min-w-[140px]">
                    <button onClick={() => { setShowDeleteConfirm(conv.id); setShowActionMenu(null); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                      <Trash2 size={14} /> ডিলিট করুন
                    </button>
                    <button onClick={() => { alert(`⚠️ "${conv.userName}" রিপোর্ট করা হয়েছে!`); setShowActionMenu(null); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-50 text-yellow-600 flex items-center gap-2">
                      <AlertCircle size={14} /> রিপোর্ট করুন
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">কনভারসেশন ডিলিট করবেন?</h3>
              <p className="text-sm text-gray-500 mb-6">এই কনভারসেশন স্থায়ীভাবে ডিলিট হয়ে যাবে।</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={() => handleDeleteConversation(showDeleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold">ডিলিট করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}