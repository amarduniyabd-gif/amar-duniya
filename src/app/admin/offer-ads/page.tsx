"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Plus, Edit2, Trash2, 
  CheckCircle, AlertCircle, Gift,
  Phone, MapPin, Save
} from "lucide-react";

type OfferBanner = {
  id: number;
  title: string;
  description: string;
  image: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactLocation: string;
  offerDetails: string;
  validUntil: string;
  discountCode?: string;
  priority: string;
  views: number;
  clicks: number;
  status: string;
};

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
  
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    image: "🎁",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactLocation: "কুষ্টিয়া",
    offerDetails: "",
    discountCode: "",
    priority: "medium",
    status: "active",
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }
    setIsLoggedIn(true);
    
    const savedBanners = localStorage.getItem("offerBanners");
    if (savedBanners) {
      try {
        const parsed = JSON.parse(savedBanners);
        setBanners(parsed);
      } catch {
        setBanners([]);
      }
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

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.contactPhone) {
      alert("টাইটেল এবং ফোন নম্বর আবশ্যক!");
      return;
    }
    
    const banner: OfferBanner = {
      id: Date.now(),
      title: newBanner.title,
      description: newBanner.description,
      image: newBanner.image,
      contactName: newBanner.contactName,
      contactPhone: newBanner.contactPhone,
      contactEmail: newBanner.contactEmail,
      contactLocation: "কুষ্টিয়া",
      offerDetails: newBanner.offerDetails,
      validUntil: new Date(newBanner.validUntil).toISOString(),
      discountCode: newBanner.discountCode || undefined,
      priority: newBanner.priority,
      views: 0,
      clicks: 0,
      status: newBanner.status,
    };
    
    saveBanners([...banners, banner]);
    setSuccessMessage("✅ অফার যোগ করা হয়েছে!");
    setShowAddModal(false);
    setNewBanner({
      title: "",
      description: "",
      image: "🎁",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactLocation: "কুষ্টিয়া",
      offerDetails: "",
      discountCode: "",
      priority: "medium",
      status: "active",
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  const handleEditBanner = () => {
    if (!selectedBanner) return;
    const updatedBanners = banners.map(b => b.id === selectedBanner.id ? selectedBanner : b);
    saveBanners(updatedBanners);
    setSuccessMessage("✅ অফার আপডেট করা হয়েছে!");
    setShowEditModal(false);
    setSelectedBanner(null);
  };

  const handleDeleteBanner = (id: number) => {
    if (confirm("অফার ডিলিট করবেন?")) {
      saveBanners(banners.filter(b => b.id !== id));
      setSuccessMessage("✅ অফার ডিলিট করা হয়েছে!");
    }
  };

  const toggleStatus = (id: number) => {
    const updatedBanners = banners.map(b => 
      b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
    );
    saveBanners(updatedBanners);
    setSuccessMessage("✅ স্ট্যাটাস পরিবর্তন করা হয়েছে!");
  };

  const filteredBanners = banners.filter(b => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.title.toLowerCase().includes(q) || 
             b.contactPhone.includes(q) ||
             b.contactName.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: banners.length,
    active: banners.filter(b => b.status === 'active').length,
    inactive: banners.filter(b => b.status === 'inactive').length,
  };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block">
        <AdminSidebar />
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-72">
        <div className="bg-white shadow-sm px-4 md:px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Gift size={20} className="text-[#f85606]" />
            কুষ্টিয়া অফার জোন
          </h1>
          <button onClick={() => setShowAddModal(true)} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> নতুন অফার
          </button>
        </div>

        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <CheckCircle size={16} className="inline mr-2" />{successMessage}
          </div>
        )}

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white">
              <p className="text-xs">মোট অফার</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white">
              <p className="text-xs">সক্রিয়</p>
              <p className="text-xl font-bold">{stats.active}</p>
            </div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3 text-white">
              <p className="text-xs">নিষ্ক্রিয়</p>
              <p className="text-xl font-bold">{stats.inactive}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="অফার খুঁজুন..." 
              className="w-full p-3 border border-gray-200 rounded-xl" 
            />
          </div>

          {filteredBanners.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Gift size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">কোন অফার নেই</p>
              <button onClick={() => setShowAddModal(true)} className="mt-4 text-[#f85606] text-sm">+ নতুন অফার যোগ করুন</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBanners.map(banner => (
                <div key={banner.id} className="bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-2xl">
                        {banner.image}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{banner.title}</h3>
                        <p className="text-xs text-[#f85606]">{banner.description}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleStatus(banner.id)}>
                      {banner.status === 'active' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">সক্রিয়</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">নিষ্ক্রিয়</span>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <p className="flex items-center gap-1"><Phone size={10} /> {banner.contactPhone}</p>
                    <p className="flex items-center gap-1"><MapPin size={10} /> {banner.contactLocation}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t">
                    <button onClick={() => { setSelectedBanner(banner); setShowEditModal(true); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs flex items-center gap-1">
                      <Edit2 size={12} /> এডিট
                    </button>
                    <button onClick={() => handleDeleteBanner(banner.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs flex items-center gap-1">
                      <Trash2 size={12} /> ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* অ্যাড মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">কুষ্টিয়ার জন্য নতুন অফার</h3>
            
            <div className="space-y-3">
              <input type="text" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} placeholder="টাইটেল *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newBanner.description} onChange={e => setNewBanner({...newBanner, description: e.target.value})} placeholder="ডিসক্রিপশন" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newBanner.contactName} onChange={e => setNewBanner({...newBanner, contactName: e.target.value})} placeholder="কন্টাক্ট নাম *" className="w-full p-3 border rounded-xl" />
              <input type="tel" value={newBanner.contactPhone} onChange={e => setNewBanner({...newBanner, contactPhone: e.target.value})} placeholder="ফোন নম্বর *" className="w-full p-3 border rounded-xl" />
              <input type="date" value={newBanner.validUntil} onChange={e => setNewBanner({...newBanner, validUntil: e.target.value})} className="w-full p-3 border rounded-xl" />
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddBanner} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">যোগ করুন</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* এডিট মডাল */}
      {showEditModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">অফার এডিট করুন</h3>
            
            <div className="space-y-3">
              <input type="text" value={selectedBanner.title} onChange={e => setSelectedBanner({...selectedBanner, title: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" value={selectedBanner.contactPhone} onChange={e => setSelectedBanner({...selectedBanner, contactPhone: e.target.value})} className="w-full p-3 border rounded-xl" />
              <select value={selectedBanner.status} onChange={e => setSelectedBanner({...selectedBanner, status: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="active">সক্রিয়</option>
                <option value="inactive">নিষ্ক্রিয়</option>
              </select>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={handleEditBanner} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">সংরক্ষণ</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}