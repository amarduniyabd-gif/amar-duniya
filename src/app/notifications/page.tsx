"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Heart, MessageCircle, ShoppingBag, Gavel, CheckCircle, X, Trash2 } from "lucide-react";

type Notification = {
  id: number;
  type: "like" | "comment" | "bid" | "sold" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
};

const dummyNotifications: Notification[] = [
  { id: 1, type: "like", title: "লাইক", message: "করিম মিয়া আপনার পোস্টটি লাইক করেছেন", time: "৫ মিনিট আগে", read: false, link: "/post/1" },
  { id: 2, type: "bid", title: "নতুন বিড", message: "শাহিনুর রহমান আপনার নিলামে ৬৫,০০০ টাকা বিড করেছেন", time: "৩০ মিনিট আগে", read: false, link: "/auction/1" },
  { id: 3, type: "comment", title: "মন্তব্য", message: "জবের আহমেদ আপনার পোস্টে মন্তব্য করেছেন", time: "১ ঘন্টা আগে", read: true, link: "/post/2" },
  { id: 4, type: "sold", title: "বিক্রিত", message: "আপনার iPhone 15 Pro বিক্রি হয়েছে!", time: "২ ঘন্টা আগে", read: true, link: "/post/1" },
  { id: 5, type: "system", title: "সিস্টেম", message: "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে", time: "১ দিন আগে", read: true },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  const getIcon = (type: string) => {
    switch(type) {
      case "like": return <Heart size={18} className="text-red-500" />;
      case "comment": return <MessageCircle size={18} className="text-blue-500" />;
      case "bid": return <Gavel size={18} className="text-green-500" />;
      case "sold": return <ShoppingBag size={18} className="text-purple-500" />;
      default: return <Bell size={18} className="text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    setShowDeleteModal(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                নোটিফিকেশন
              </h1>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">{unreadCount}টি অপরিচিত</span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-[#f85606] font-semibold hover:underline"
            >
              সব পড়া হয়েছে
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো নোটিফিকেশন নেই</h2>
            <p className="text-gray-500">নতুন নোটিফিকেশন এলে এখানে দেখাবে</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-white rounded-2xl p-4 transition-all duration-300 ${!notif.read ? 'border-l-4 border-l-[#f85606] shadow-md' : 'shadow-sm'}`}
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                      </div>
                      <div className="flex gap-1">
                        {!notif.read && (
                          <button 
                            onClick={() => markAsRead(notif.id)}
                            className="text-green-500 hover:text-green-600 p-1"
                            title="পড়া হয়েছে"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setShowDeleteModal(notif.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="ডিলিট"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {notif.link && (
                      <Link href={notif.link} className="inline-block mt-2 text-xs text-[#f85606] hover:underline">
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
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">নোটিফিকেশন ডিলিট করুন</h3>
                <button onClick={() => setShowDeleteModal(null)}><X size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">আপনি কি এই নোটিফিকেশনটি ডিলিট করতে চান?</p>
              <div className="flex gap-3">
                <button onClick={() => deleteNotification(showDeleteModal)} className="flex-1 bg-red-600 text-white py-2 rounded-xl">ডিলিট করুন</button>
                <button onClick={() => setShowDeleteModal(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl">বাতিল</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}