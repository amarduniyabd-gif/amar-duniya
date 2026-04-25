"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Database, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { migrateAllData } from "@/lib/migrate-data";
export default function MigratePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [localCounts, setLocalCounts] = useState({ posts: 0, offers: 0, matrimony: 0 });
  const [migrated, setMigrated] = useState(false);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }
    
    setLocalCounts({
      posts: JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]').length,
      offers: JSON.parse(localStorage.getItem('offerBanners') || '[]').length,
      matrimony: JSON.parse(localStorage.getItem('matrimonyProfiles') || '[]').length,
    });
    
    const getUser = async () => {
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, [router]);

  const handleMigrate = async () => {
    if (!userId) {
      alert("ইউজার পাওয়া যায়নি। আগে লগইন করুন।");
      return;
    }
    
    setLoading(true);
    try {
      await migrateAllData(userId);
      setMigrated(true);
      alert("✅ সব ডাটা সফলভাবে মাইগ্রেট হয়েছে!");
    } catch (error) {
      alert("❌ মাইগ্রেশন ব্যর্থ হয়েছে!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block">
        <AdminSidebar />
      </div>
      
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-72">
        <div className="bg-white shadow-sm px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Database size={20} className="text-[#f85606]" />
            ডাটা মাইগ্রেশন
          </h1>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">লোকাল স্টোরেজ ডাটা</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">পোস্ট</p>
                <p className="text-3xl font-bold text-blue-600">{localCounts.posts}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">অফার</p>
                <p className="text-3xl font-bold text-green-600">{localCounts.offers}</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">পাত্র-পাত্রী</p>
                <p className="text-3xl font-bold text-pink-600">{localCounts.matrimony}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            {migrated ? (
              <div className="py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">মাইগ্রেশন সম্পন্ন!</h3>
                <p className="text-gray-500">সব ডাটা Supabase এ ট্রান্সফার হয়েছে।</p>
              </div>
            ) : (
              <>
                <Database size={48} className="text-[#f85606] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">মাইগ্রেশন শুরু করুন</h3>
                <p className="text-gray-500 mb-6">লোকাল স্টোরেজের সব ডাটা Supabase এ ট্রান্সফার হবে।</p>
                <button
                  onClick={handleMigrate}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  {loading ? "মাইগ্রেট হচ্ছে..." : "মাইগ্রেট করুন"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
