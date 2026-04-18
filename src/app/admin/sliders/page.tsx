"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Search, Plus, Edit2, Trash2, 
  Eye, ChevronRight, Save, RefreshCw,
  CheckCircle, AlertCircle, ArrowUp, ArrowDown,
  Image as ImageIcon, Tag, Palette, Link as LinkIcon,
  Sparkles, Upload, GripVertical
} from "lucide-react";

type Slider = {
  id: number;
  title: string;
  discount: string;
  color: string;
  emoji: string;
  link: string;
  order: number;
  status: 'active' | 'inactive';
};

// প্রিসেট কালার অপশন
const colorOptions = [
  { name: "অরেঞ্জ", value: "from-[#f85606] to-orange-500" },
  { name: "লাল", value: "from-red-500 to-red-600" },
  { name: "নীল", value: "from-blue-500 to-blue-600" },
  { name: "সবুজ", value: "from-green-500 to-green-600" },
  { name: "পার্পল", value: "from-purple-500 to-purple-600" },
  { name: "পিঙ্ক", value: "from-pink-500 to-pink-600" },
  { name: "হলুদ", value: "from-yellow-500 to-yellow-600" },
  { name: "সায়ান", value: "from-cyan-500 to-cyan-600" },
  { name: "গাঢ় কমলা", value: "from-[#e65c00] to-[#ff9933]" },
  { name: "টমেটো", value: "from-[#e63946] to-[#d90429]" },
  { name: "সাগর", value: "from-[#2a9d8f] to-[#264653]" },
  { name: "সোনালী", value: "from-[#e9c46a] to-[#f4a261]" },
  { name: "নেভি", value: "from-[#0077b6] to-[#023e8a]" },
  { name: "বেগুনি", value: "from-[#7209b7] to-[#4c0bce]" },
  { name: "রুবি", value: "from-[#ef476f] to-[#d90429]" },
];

const defaultSliders: Slider[] = [
  { id: 1, title: "সব ধরণের পণ্য পাচ্ছেন", discount: "১৫% পর্যন্ত ছাড়", color: "from-[#f85606] to-orange-500", emoji: "🛍️", link: "/category/offer", order: 1, status: "active" },
  { id: 2, title: "মোবাইল মেলায় স্বাগতম", discount: "সর্বোচ্চ ৩০% ছাড়", color: "from-[#e65c00] to-[#ff9933]", emoji: "📱", link: "/category/mobile", order: 2, status: "active" },
  { id: 3, title: "সেরা দামে সেরা ল্যাপটপ", discount: "বিশেষ অফার", color: "from-[#cc5200] to-[#ff7733]", emoji: "💻", link: "/category/computer", order: 3, status: "active" },
  { id: 4, title: "ইলেকট্রনিক্স সপ্তাহ", discount: "৫০% পর্যন্ত ছাড়", color: "from-[#f85606] to-[#ff4d4d]", emoji: "📺", link: "/category/electronics", order: 4, status: "active" },
  { id: 5, title: "ফ্যাশন ফেস্টিভ্যাল", discount: "সব ব্র্যান্ডে ৩০% ছাড়", color: "from-[#ff6b35] to-[#f7931e]", emoji: "👔", link: "/category/fashion", order: 5, status: "active" },
  { id: 6, title: "গাড়ি মেলা", discount: "শুধু আজ ৪০% ছাড়", color: "from-[#e63946] to-[#d90429]", emoji: "🚗", link: "/category/car", order: 6, status: "active" },
  { id: 7, title: "চাকরির জগৎ", discount: "সর্বোচ্চ পদত্যাগ", color: "from-[#2a9d8f] to-[#264653]", emoji: "💼", link: "/category/job", order: 7, status: "active" },
  { id: 8, title: "সার্ভিস সেন্টার", discount: "সকল সেবায় ২০% ছাড়", color: "from-[#e9c46a] to-[#f4a261]", emoji: "🔧", link: "/category/service", order: 8, status: "active" },
  { id: 9, title: "জমি ক্রয়-বিক্রয়", discount: "ফ্রি কনসালটেন্সি", color: "from-[#0077b6] to-[#023e8a]", emoji: "🏠", link: "/category/property", order: 9, status: "active" },
  { id: 10, title: "সবার জন্য তথ্য", discount: "জেনে রাখুন", color: "from-[#7209b7] to-[#4c0bce]", emoji: "📢", link: "/category/info", order: 10, status: "active" },
  { id: 11, title: "পাত্র-পাত্রী খুঁজুন", discount: "যোগাযোগ করুন", color: "from-[#ef476f] to-[#d90429]", emoji: "💑", link: "/category/matrimony", order: 11, status: "active" },
  { id: 12, title: "ভাড়া নিন বা দিন", discount: "সর্বোচ্চ সুবিধা", color: "from-[#fca311] to-[#ffba08]", emoji: "🔑", link: "/category/rent", order: 12, status: "active" },
  { id: 13, title: "জরুরি সেবা", discount: "২৪/৭ সেবা", color: "from-[#f77f00] to-[#fcbf49]", emoji: "🚑", link: "/category/emergency", order: 13, status: "active" },
  { id: 14, title: "বিশেষ অফার", discount: "৬০% পর্যন্ত ছাড়", color: "from-[#06d6a0] to-[#118ab2]", emoji: "🎉", link: "/category/offer", order: 14, status: "active" },
  { id: 15, title: "উইকেন্ড স্পেশাল", discount: "শনি-রবিবার ৩৫% ছাড়", color: "from-[#9c89b8] to-[#b8a9c9]", emoji: "🎊", link: "/category/offer", order: 15, status: "active" },
];

export default function AdminSliders() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewSlider, setPreviewSlider] = useState<Slider | null>(null);
  
  const [newSlider, setNewSlider] = useState({
    title: "", discount: "", color: "from-[#f85606] to-orange-500", 
    emoji: "🎉", link: "/category/offer", status: "active"
  });

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
    
    // লোকাল স্টোরেজ থেকে স্লাইডার লোড
    const savedSliders = localStorage.getItem("homeSliders");
    if (savedSliders) {
      setSliders(JSON.parse(savedSliders));
    } else {
      setSliders(defaultSliders);
      localStorage.setItem("homeSliders", JSON.stringify(defaultSliders));
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const saveSliders = (newSliders: Slider[]) => {
    setSliders(newSliders);
    localStorage.setItem("homeSliders", JSON.stringify(newSliders));
  };

  const filteredSliders = sliders.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.discount.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSlider = () => {
    if (!newSlider.title || !newSlider.discount) {
      alert("টাইটেল এবং ডিসকাউন্ট প্রয়োজন!");
      return;
    }
    
    const newId = Math.max(...sliders.map(s => s.id), 0) + 1;
    const slider: Slider = {
      id: newId,
      title: newSlider.title,
      discount: newSlider.discount,
      color: newSlider.color,
      emoji: newSlider.emoji,
      link: newSlider.link,
      order: sliders.length + 1,
      status: newSlider.status as 'active' | 'inactive',
    };
    
    const updatedSliders = [...sliders, slider];
    saveSliders(updatedSliders);
    setSuccessMessage(`"${slider.title}" স্লাইডার যোগ করা হয়েছে!`);
    setShowAddModal(false);
    setNewSlider({ title: "", discount: "", color: "from-[#f85606] to-orange-500", emoji: "🎉", link: "/category/offer", status: "active" });
  };

  const handleEditSlider = () => {
    if (selectedSlider) {
      const updatedSliders = sliders.map(s => 
        s.id === selectedSlider.id ? selectedSlider : s
      );
      saveSliders(updatedSliders);
      setSuccessMessage(`"${selectedSlider.title}" স্লাইডার আপডেট করা হয়েছে!`);
      setShowEditModal(false);
    }
  };

  const handleDeleteSlider = (id: number, title: string) => {
    if (confirm(`"${title}" স্লাইডার ডিলিট করতে চান?`)) {
      const updatedSliders = sliders.filter(s => s.id !== id);
      saveSliders(updatedSliders);
      setSuccessMessage(`"${title}" স্লাইডার ডিলিট করা হয়েছে!`);
    }
  };

  const toggleStatus = (id: number) => {
    const updatedSliders = sliders.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' } : s
    );
    saveSliders(updatedSliders);
    setSuccessMessage("স্ট্যাটাস পরিবর্তন করা হয়েছে!");
  };

  const moveSlider = (id: number, direction: 'up' | 'down') => {
    const index = sliders.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      const updated = [...sliders];
      [updated[index-1], updated[index]] = [updated[index], updated[index-1]];
      saveSliders(updated.map((s, i) => ({ ...s, order: i + 1 })));
    } else if (direction === 'down' && index < sliders.length - 1) {
      const updated = [...sliders];
      [updated[index], updated[index+1]] = [updated[index+1], updated[index]];
      saveSliders(updated.map((s, i) => ({ ...s, order: i + 1 })));
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ সক্রিয়</span>
      : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ নিষ্ক্রিয়</span>;
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-2 rounded-lg shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="fixed inset-y-0 left-0 z-40 w-64 hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-64">
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={20} className="text-[#f85606]" />
            হোম পেজ স্লাইডার ম্যানেজমেন্ট
          </h1>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <Plus size={16} /> নতুন স্লাইডার
          </button>
        </div>

        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <CheckCircle size={16} className="inline mr-2" />{successMessage}
          </div>
        )}

        <div className="p-6">
          {/* স্ট্যাটাস */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">মোট স্লাইডার</p>
              <p className="text-2xl font-bold">{sliders.length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">সক্রিয়</p>
              <p className="text-2xl font-bold">{sliders.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3 text-white">
              <p className="text-xs opacity-90">নিষ্ক্রিয়</p>
              <p className="text-2xl font-bold">{sliders.filter(s => s.status === 'inactive').length}</p>
            </div>
          </div>

          {/* সার্চ */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="স্লাইডার খুঁজুন..." 
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* স্লাইডার লিস্ট */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">ক্রম</th>
                    <th className="p-3 text-left">প্রিভিউ</th>
                    <th className="p-3 text-left">টাইটেল</th>
                    <th className="p-3 text-left">ডিসকাউন্ট</th>
                    <th className="p-3 text-left">লিংক</th>
                    <th className="p-3 text-left">স্ট্যাটাস</th>
                    <th className="p-3 text-center">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSliders.sort((a, b) => a.order - b.order).map((slider) => (
                    <tr key={slider.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveSlider(slider.id, 'up')} className="p-1 hover:bg-gray-200 rounded">
                            <ArrowUp size={14} />
                          </button>
                          <span className="w-6 text-center">{slider.order}</span>
                          <button onClick={() => moveSlider(slider.id, 'down')} className="p-1 hover:bg-gray-200 rounded">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className={`w-20 h-12 bg-gradient-to-r ${slider.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                          {slider.emoji}
                        </div>
                      </td>
                      <td className="p-3 font-medium">{slider.title}</td>
                      <td className="p-3 text-sm text-gray-600">{slider.discount}</td>
                      <td className="p-3 text-sm text-blue-600">{slider.link}</td>
                      <td className="p-3">
                        <button onClick={() => toggleStatus(slider.id)}>
                          {getStatusBadge(slider.status)}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => setPreviewSlider(slider)} 
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="প্রিভিউ"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => { setSelectedSlider(slider); setShowEditModal(true); }} 
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="এডিট"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSlider(slider.id, slider.title)} 
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="ডিলিট"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* অ্যাড মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[#f85606]" /> নতুন স্লাইডার যোগ করুন
            </h3>
            
            {/* প্রিভিউ */}
            <div className={`mb-4 p-4 rounded-xl bg-gradient-to-r ${newSlider.color} text-white text-center`}>
              <div className="text-4xl mb-2">{newSlider.emoji || "🎉"}</div>
              <p className="font-bold">{newSlider.title || "টাইটেল"}</p>
              <p className="text-sm opacity-90">{newSlider.discount || "ডিসকাউন্ট"}</p>
            </div>

            <div className="space-y-3">
              <input type="text" value={newSlider.title} onChange={(e) => setNewSlider({...newSlider, title: e.target.value})} placeholder="টাইটেল *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newSlider.discount} onChange={(e) => setNewSlider({...newSlider, discount: e.target.value})} placeholder="ডিসকাউন্ট টেক্সট *" className="w-full p-3 border rounded-xl" />
              
              <div>
                <label className="text-sm text-gray-600 mb-1 block">কালার</label>
                <select value={newSlider.color} onChange={(e) => setNewSlider({...newSlider, color: e.target.value})} className="w-full p-3 border rounded-xl">
                  {colorOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                </select>
              </div>
              
              <input type="text" value={newSlider.emoji} onChange={(e) => setNewSlider({...newSlider, emoji: e.target.value})} placeholder="ইমোজি" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newSlider.link} onChange={(e) => setNewSlider({...newSlider, link: e.target.value})} placeholder="লিংক (যেমন: /category/offer)" className="w-full p-3 border rounded-xl" />
              
              <select value={newSlider.status} onChange={(e) => setNewSlider({...newSlider, status: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="active">✅ সক্রিয়</option>
                <option value="inactive">❌ নিষ্ক্রিয়</option>
              </select>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddSlider} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">যোগ করুন</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* এডিট মডাল */}
      {showEditModal && selectedSlider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-[#f85606]" /> স্লাইডার এডিট করুন
            </h3>
            
            <div className={`mb-4 p-4 rounded-xl bg-gradient-to-r ${selectedSlider.color} text-white text-center`}>
              <div className="text-4xl mb-2">{selectedSlider.emoji}</div>
              <p className="font-bold">{selectedSlider.title}</p>
              <p className="text-sm opacity-90">{selectedSlider.discount}</p>
            </div>

            <div className="space-y-3">
              <input type="text" value={selectedSlider.title} onChange={(e) => setSelectedSlider({...selectedSlider, title: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" value={selectedSlider.discount} onChange={(e) => setSelectedSlider({...selectedSlider, discount: e.target.value})} className="w-full p-3 border rounded-xl" />
              <select value={selectedSlider.color} onChange={(e) => setSelectedSlider({...selectedSlider, color: e.target.value})} className="w-full p-3 border rounded-xl">
                {colorOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
              </select>
              <input type="text" value={selectedSlider.emoji} onChange={(e) => setSelectedSlider({...selectedSlider, emoji: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="text" value={selectedSlider.link} onChange={(e) => setSelectedSlider({...selectedSlider, link: e.target.value})} className="w-full p-3 border rounded-xl" />
              <select value={selectedSlider.status} onChange={(e) => setSelectedSlider({...selectedSlider, status: e.target.value as 'active' | 'inactive'})} className="w-full p-3 border rounded-xl">
                <option value="active">✅ সক্রিয়</option>
                <option value="inactive">❌ নিষ্ক্রিয়</option>
              </select>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={handleEditSlider} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">সংরক্ষণ করুন</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* প্রিভিউ মডাল */}
      {previewSlider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewSlider(null)}>
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className={`relative h-60 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r ${previewSlider.color}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-7xl mb-4">{previewSlider.emoji}</div>
                <h2 className="text-2xl font-bold">{previewSlider.title}</h2>
                <p className="text-lg mt-2 opacity-90">{previewSlider.discount}</p>
              </div>
            </div>
            <div className="mt-3 bg-gradient-to-r ${previewSlider.color} rounded-xl p-3 text-center text-white">
              <p className="font-bold">{previewSlider.title}</p>
              <p className="text-sm">{previewSlider.discount}</p>
            </div>
            <button onClick={() => setPreviewSlider(null)} className="mt-4 w-full bg-white py-3 rounded-xl font-semibold">বন্ধ করুন</button>
          </div>
        </div>
      )}

    </div>
  );
}