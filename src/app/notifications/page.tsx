"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bell, Heart, MessageCircle, ShoppingBag, Gavel, 
  CheckCircle, X, Trash2, Loader2, AlertCircle 
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  data?: any;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  // ============ নোটিফিকেশন লোড ============
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/notifications');
          return;
        }
        setCurrentUserId(user.id);

        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedNotifications: Notification[] = (data || []).map((n: any) => ({
          id: n.id,
          type: n.type || 'system',
          title: n.title || 'নোটিফিকেশন',
          message: n.message || '',
          time: timeAgo(n.created_at),
          read: n.is_read || false,
          link: getNotificationLink(n.type, n.data),
          data: n.data,
        }));

        setNotifications(formattedNotifications);
        
        // লোকাল স্টোরেজে সেভ
        localStorage.setItem('notifications', JSON.stringify(formattedNotifications));
      } catch (err: any) {
        console.error('Load error:', err);
        setError('নোটিফিকেশন লোড করতে সমস্যা হয়েছে!');
        
        // লোকাল ফলব্যাক
        const saved = localStorage.getItem('notifications');
        if (saved) setNotifications(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [router]);

  // ============ Realtime সাবস্ক্রিপশন ============
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUserId}`,
      }, (payload: any) => {
        const newNotif = payload.new;
        setNotifications(prev => [{
          id: newNotif.id,
          type: newNotif.type || 'system',
          title: newNotif.title || 'নোটিফিকেশন',
          message: newNotif.message || '',
          time: 'এইমাত্র',
          read: false,
          link: getNotificationLink(newNotif.type, newNotif.data),
        }, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // ============ হেল্পার ফাংশন ============
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

  const getNotificationLink = (type: string, data: any): string | undefined => {
    if (!data) return undefined;
    switch(type) {
      case 'like':
      case 'comment': return `/post/${data.post_id}`;
      case 'bid': return `/auction/${data.auction_id}`;
      case 'message': return `/chat/${data.conversation_id}`;
      case 'sold': return `/post/${data.post_id}`;
      default: return undefined;
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "like": return <Heart size={18} className="text-red-500" />;
      case "comment": return <MessageCircle size={18} className="text-blue-500" />;
      case "bid": return <Gavel size={18} className="text-green-500" />;
      case "sold": return <ShoppingBag size={18} className="text-purple-500" />;
      case "message": return <MessageCircle size={18} className="text-indigo-500" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  // ============ মার্ক অ্যাজ রিড ============
  const markAsRead = useCallback(async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      // লোকাল আপডেট
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!currentUserId) return;
    
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', currentUserId)
        .eq('is_read', false);

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [currentUserId]);

  // ============ ডিলিট নোটিফিকেশন ============
  const deleteNotification = useCallback(async (id: string) => {
    setDeleteLoading(true);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== id));
      setShowDeleteModal(null);
    } catch (error) {
      // লোকাল ডিলিট
      setNotifications(prev => prev.filter(n => n.id !== id));
      setShowDeleteModal(null);
    } finally {
      setDeleteLoading(false);
    }
  }, []);

  const deleteAllRead = useCallback(async () => {
    if (!currentUserId) return;
    if (!confirm('সব পড়া নোটিফিকেশন ডিলিট করবেন?')) return;

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', currentUserId)
        .eq('is_read', true);

      setNotifications(prev => prev.filter(n => !n.read));
    } catch (error) {
      setNotifications(prev => prev.filter(n => !n.read));
    }
  }, [currentUserId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ============ লোডিং স্টেট ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition active:scale-95"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                নোটিফিকেশন
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">{unreadCount}টি অপঠিত</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-sm text-[#f85606] font-semibold hover:underline">
                সব পড়া হয়েছে
              </button>
            )}
            {notifications.filter(n => n.read).length > 0 && (
              <button onClick={deleteAllRead} className="text-sm text-gray-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* এরর */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* খালি স্টেট */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো নোটিফিকেশন নেই</h2>
            <p className="text-gray-500">নতুন নোটিফিকেশন এলে এখানে দেখাবে</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-white rounded-2xl p-4 transition-all duration-300 group ${
                  !notif.read 
                    ? 'border-l-4 border-l-[#f85606] shadow-md' 
                    : 'shadow-sm border border-gray-100'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notif.read ? 'bg-[#f85606]/10' : 'bg-gray-100'
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{notif.title}</h3>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        {!notif.read && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="text-green-500 hover:text-green-600 p-1 opacity-0 group-hover:opacity-100 transition"
                            title="পড়া হয়েছে"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setShowDeleteModal(notif.id)}
                          className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"
                          title="ডিলিট"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {notif.link && (
                      <Link 
                        href={notif.link} 
                        onClick={() => !notif.read && markAsRead(notif.id)}
                        className="inline-block mt-2 text-xs text-[#f85606] hover:underline"
                      >
                        বিস্তারিত দেখুন →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ডিলিট কনফার্মেশন মডাল */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">নোটিফিকেশন ডিলিট করুন</h3>
                <button onClick={() => setShowDeleteModal(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-5">আপনি কি এই নোটিফিকেশনটি ডিলিট করতে চান?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => deleteNotification(showDeleteModal)} 
                  disabled={deleteLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {deleteLoading ? 'ডিলিট হচ্ছে...' : 'ডিলিট করুন'}
                </button>
                <button onClick={() => setShowDeleteModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}