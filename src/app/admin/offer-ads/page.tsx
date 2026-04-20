"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Plus, Edit2, Trash2, 
  CheckCircle, AlertCircle, Gift,
  Phone, MapPin, Save, Upload, Image
} from "lucide-react";

type OfferBanner = {
  id: number;
  shopName: string;
  offerTitle: string;
  description: string;
  bannerColor: string;
  shopLogo: string;
  shopImage?: string; // 🆕 WebP ইমেজ
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactLocation: string;
  offerDetails: string;
  validUntil: string;
  discountCode?: string;
  priority: 'high' | 'medium' | 'low';
  views: number;
  status: 'active' | 'inactive'; // 🔥 টাইপ ফিক্সড
};

// WebP কম্প্রেশন ফাংশন
const compressToWebP = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.7));
      };
    };
  });
};

// কালার অপশন
const colorOptions = [
  { value: 'from-blue-600 to-cyan-500', label: 'নীল' },
  { value: 'from-pink-600 to-rose-500', label: 'গোলাপী' },
  { value: 'from-green-600 to-emerald-500', label: 'সবুজ' },
  { value: 'from-purple-600 to-violet-500', label: 'বেগুনি' },
  { value: 'from-amber-600 to-orange-500', label: 'কমলা' },
  { value: 'from-red-600 to-pink-500', label: 'লাল' },
];

export default function AdminOfferAdsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<OfferBanner | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [newBanner, setNewBanner] = useState({
    shopName: "", offerTitle: "", description: "", bannerColor: "from-blue-600 to-cyan-500",
    shopLogo: "🏪", shopImage: "", contactName: "", contactPhone: "", contactEmail: "",
    contactLocation: "কুষ্টিয়া", offerDetails: "", discountCode: "",
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'active' as 'active' | 'inactive',
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") { router.push("/admin/login"); return; }
    setIsLoggedIn(true);
    const savedBanners = localStorage.getItem("offerBanners");
    if (savedBanners) {
      try { setBanners(JSON.parse(savedBanners)); } catch { setBanners([]); }
    }
  }, [router]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const saveBanners = (updatedBanners: OfferBanner[]) => {
    setBanners(updatedBanners);
    localStorage.setItem("offerBanners", JSON.stringify(updatedBanners));
  };

  // 🆕 ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const webpImage = await compressToWebP(file);
      setNewBanner({ ...newBanner, shopImage: webpImage });
      setImagePreview(webpImage);
    } catch { alert("ইমেজ আপলোড ব্যর্থ!"); }
    setIsUploading(false);
  };

  const handleAddBanner = () => {
    if (!newBanner.shopName || !newBanner.offerTitle || !newBanner.contactPhone) {
      alert("দোকানের নাম, অফার টাইটেল এবং ফোন নম্বর আবশ্যক!"); return;
    }
    const banner: OfferBanner = {
      id: Date.now(), shopName: newBanner.shopName, offerTitle: newBanner.offerTitle,
      description: newBanner.description, bannerColor: newBanner.bannerColor,
      shopLogo: newBanner.shopLogo, shopImage: newBanner.shopImage || undefined,
      contactName: newBanner.contactName, contactPhone: newBanner.contactPhone,
      contactEmail: newBanner.contactEmail, contactLocation: "কুষ্টিয়া",
      offerDetails: newBanner.offerDetails, validUntil: new Date(newBanner.validUntil).toISOString(),
      discountCode: newBanner.discountCode || undefined, priority: newBanner.priority,
      views: 0, status: newBanner.status,
    };
    saveBanners([...banners, banner]);
    setSuccessMessage("✅ অফার যোগ করা হয়েছে!");
    setShowAddModal(false); setImagePreview("");
    setNewBanner({
      shopName: "", offerTitle: "", description: "", bannerColor: "from-blue-600 to-cyan-500",
      shopLogo: "🏪", shopImage: "", contactName: "", contactPhone: "", contactEmail: "",
      contactLocation: "কুষ্টিয়া", offerDetails: "", discountCode: "",
      priority: 'medium', status: 'active',
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  const handleEditBanner = () => {
    if (!selectedBanner) return;
    saveBanners(banners.map(b => b.id === selectedBanner.id ? selectedBanner : b));
    setSuccessMessage("✅ অফার আপডেট করা হয়েছে!");
    setShowEditModal(false); setSelectedBanner(null);
  };

  const handleDeleteBanner = (id: number) => {
    if (confirm("অফার ডিলিট করবেন?")) {
      saveBanners(banners.filter(b => b.id !== id));
      setSuccessMessage("✅ অফার ডিলিট করা হয়েছে!");
    }
  };

  const toggleStatus = (id: number) => {
    saveBanners(banners.map(b => b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
    setSuccessMessage("✅ স্ট্যাটাস পরিবর্তন করা হয়েছে!");
  };

  const filteredBanners = banners.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.shopName.toLowerCase().includes(q) || b.offerTitle.toLowerCase().includes(q) || b.contactPhone.includes(q);
    }
    return true;
  });

  const getDaysLeft = (validUntil: string) => Math.ceil((new Date(validUntil).getTime() - Date.now()) / 86400000);

  const stats = {
    total: banners.length,
    active: banners.filter(b => b.status === 'active').length,
    inactive: banners.filter(b => b.status === 'inactive').length,
    totalViews: banners.reduce((sum, b) => sum + b.views, 0),
  };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block"><AdminSidebar /></div>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-72">
        <div className="bg-white shadow-sm px-4 md:px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2"><Gift size={20} className="text-[#f85606]" />কুষ্টিয়া অফার জোন</h1>
          <button onClick={() => setShowAddModal(true)} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Plus size={16} /> নতুন অফার</button>
        </div>

        {successMessage && <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"><CheckCircle size={16} className="inline mr-2" />{successMessage}</div>}

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs">মোট</p><p className="text-xl font-bold">{stats.total}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs">সক্রিয়</p><p className="text-xl font-bold">{stats.active}</p></div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3 text-white"><p className="text-xs">নিষ্ক্রিয়</p><p className="text-xl font-bold">{stats.inactive}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs">ভিউ</p><p className="text-xl font-bold">{stats.totalViews}</p></div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="খুঁজুন..." className="flex-1 p-3 border rounded-xl" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="p-3 border rounded-xl"><option value="all">সব</option><option value="active">সক্রিয়</option><option value="inactive">নিষ্ক্রিয়</option></select>
            </div>
          </div>

          {filteredBanners.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center"><Gift size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-400">কোন অফার নেই</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBanners.map(banner => (
                <div key={banner.id} className={`bg-gradient-to-br ${banner.bannerColor} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-4 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                          {banner.shopImage ? <img src={banner.shopImage} alt="" className="w-full h-full object-cover" /> : banner.shopLogo}
                        </div>
                        <div><h3 className="font-bold">{banner.shopName}</h3><p className="text-xs opacity-80">{banner.contactLocation}</p></div>
                      </div>
                      <button onClick={() => toggleStatus(banner.id)}>
                        {banner.status === 'active' ? <span className="text-xs bg-green-500 px-2 py-1 rounded-full">সক্রিয়</span> : <span className="text-xs bg-red-500 px-2 py-1 rounded-full">নিষ্ক্রিয়</span>}
                      </button>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 mb-3"><p className="font-bold text-lg">{banner.offerTitle}</p><p className="text-sm">{banner.description}</p></div>
                    <div className="flex items-center justify-between text-xs opacity-80 mb-3">
                      <span>👁️ {banner.views}</span><span>⏰ {getDaysLeft(banner.validUntil)}d</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-white/20">
                      <button onClick={() => { setSelectedBanner(banner); setShowEditModal(true); }} className="flex-1 bg-white/20 py-2 rounded-lg text-xs flex items-center justify-center gap-1"><Edit2 size={12} /> এডিট</button>
                      <button onClick={() => handleDeleteBanner(banner.id)} className="flex-1 bg-red-500/30 py-2 rounded-lg text-xs flex items-center justify-center gap-1"><Trash2 size={12} /> ডিলিট</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* অ্যাড মডাল - WebP ইমেজ সহ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">নতুন অফার</h3>
            <div className="space-y-3">
              {/* 🆕 ইমেজ আপলোড */}
              <div className="flex items-center gap-3">
                {imagePreview ? <img src={imagePreview} className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">{newBanner.shopLogo}</div>}
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                  <Upload size={14} /> WebP আপলোড
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>
              <input type="text" value={newBanner.shopName} onChange={e => setNewBanner({...newBanner, shopName: e.target.value})} placeholder="দোকানের নাম *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newBanner.shopLogo} onChange={e => setNewBanner({...newBanner, shopLogo: e.target.value})} placeholder="ইমোজি (ইমেজ না থাকলে)" className="w-full p-3 border rounded-xl" />
              <select value={newBanner.bannerColor} onChange={e => setNewBanner({...newBanner, bannerColor: e.target.value})} className="w-full p-3 border rounded-xl">{colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
              <input type="text" value={newBanner.offerTitle} onChange={e => setNewBanner({...newBanner, offerTitle: e.target.value})} placeholder="অফার টাইটেল *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newBanner.description} onChange={e => setNewBanner({...newBanner, description: e.target.value})} placeholder="ডিসক্রিপশন" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newBanner.contactName} onChange={e => setNewBanner({...newBanner, contactName: e.target.value})} placeholder="কন্টাক্ট নাম *" className="w-full p-3 border rounded-xl" />
              <input type="tel" value={newBanner.contactPhone} onChange={e => setNewBanner({...newBanner, contactPhone: e.target.value})} placeholder="ফোন *" className="w-full p-3 border rounded-xl" />
              <input type="email" value={newBanner.contactEmail} onChange={e => setNewBanner({...newBanner, contactEmail: e.target.value})} placeholder="ইমেইল" className="w-full p-3 border rounded-xl" />
              <textarea value={newBanner.offerDetails} onChange={e => setNewBanner({...newBanner, offerDetails: e.target.value})} placeholder="বিস্তারিত" className="w-full p-3 border rounded-xl" rows={2} />
              <input type="text" value={newBanner.discountCode} onChange={e => setNewBanner({...newBanner, discountCode: e.target.value})} placeholder="কোড" className="w-full p-3 border rounded-xl" />
              <input type="date" value={newBanner.validUntil} onChange={e => setNewBanner({...newBanner, validUntil: e.target.value})} className="w-full p-3 border rounded-xl" />
              <select value={newBanner.priority} onChange={e => setNewBanner({...newBanner, priority: e.target.value as any})} className="w-full p-3 border rounded-xl"><option value="high">🔥 হাই</option><option value="medium">⭐ মিডিয়াম</option><option value="low">✅ লো</option></select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddBanner} disabled={isUploading} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">{isUploading ? "আপলোড হচ্ছে..." : "যোগ করুন"}</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* এডিট মডাল */}
      {showEditModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">অফার এডিট</h3>
            <div className="space-y-3">
              <input type="text" value={selectedBanner.shopName} onChange={e => setSelectedBanner({...selectedBanner, shopName: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" value={selectedBanner.offerTitle} onChange={e => setSelectedBanner({...selectedBanner, offerTitle: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="tel" value={selectedBanner.contactPhone} onChange={e => setSelectedBanner({...selectedBanner, contactPhone: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="date" value={selectedBanner.validUntil.split('T')[0]} onChange={e => setSelectedBanner({...selectedBanner, validUntil: new Date(e.target.value).toISOString()})} className="w-full p-3 border rounded-xl" />
              <select value={selectedBanner.priority} onChange={e => setSelectedBanner({...selectedBanner, priority: e.target.value as any})} className="w-full p-3 border rounded-xl"><option value="high">🔥 হাই</option><option value="medium">⭐ মিডিয়াম</option><option value="low">✅ লো</option></select>
              <select value={selectedBanner.status} onChange={e => setSelectedBanner({...selectedBanner, status: e.target.value as 'active' | 'inactive'})} className="w-full p-3 border rounded-xl"><option value="active">সক্রিয়</option><option value="inactive">নিষ্ক্রিয়</option></select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleEditBanner} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><Save size={16} /> সংরক্ষণ</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}