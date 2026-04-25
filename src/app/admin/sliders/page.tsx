"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getSupabaseClient } from "@/lib/supabase/client";
import { 
  Menu, X, Search, Plus, Edit2, Trash2, 
  Eye, Save, RefreshCw,
  CheckCircle, ArrowUp, ArrowDown,
  Sparkles, Upload, Loader2
} from "lucide-react";

type Slider = {
  id: string | number;
  title: string;
  discount: string;
  color: string;
  emoji: string;
  link: string;
  order: number;
  status: 'active' | 'inactive';
  image_url?: string;
  image?: File | null;
};

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newSlider, setNewSlider] = useState({
    title: "", discount: "", color: "from-[#f85606] to-orange-500", 
    emoji: "🎉", link: "/category/offer", status: "active",
    image: null as File | null
  });

  const supabase = getSupabaseClient();

  // ✅ Supabase থেকে স্লাইডার লোড
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      router.push("/admin/login");
      return;
    }
    setIsLoggedIn(true);
    loadSliders();
  }, []);

  const loadSliders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sliders')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) {
        const formatted = data.map((s: any) => ({
          id: s.id,
          title: s.title,
          discount: s.discount || '',
          color: s.color || 'from-[#f85606] to-orange-500',
          emoji: s.emoji || '🛍️',
          link: s.link || '/',
          order: s.order_index || 0,
          status: s.is_active ? 'active' : 'inactive',
          image_url: s.image_url || '',
        }));
        setSliders(formatted);
      }
    } catch (e) {
      console.error('Slider load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredSliders = sliders.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.discount.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ ইমেজ আপলোড
  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const filename = `slider-${Date.now()}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('sliders')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true,
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('sliders')
      .getPublicUrl(filename);
    
    return urlData.publicUrl;
  };

  // ✅ স্লাইডার অ্যাড
  const handleAddSlider = async () => {
    if (!newSlider.title || !newSlider.discount) {
      alert("টাইটেল এবং ডিসকাউন্ট প্রয়োজন!");
      return;
    }
    
    setSaving(true);
    try {
      let imageUrl = '';
      if (newSlider.image) {
        imageUrl = await uploadImage(newSlider.image);
      }
      
      const { data, error } = await supabase
        .from('sliders')
        .insert({
          title: newSlider.title,
          discount: newSlider.discount,
          color: newSlider.color,
          emoji: newSlider.emoji,
          link: newSlider.link,
          is_active: newSlider.status === 'active',
          order_index: sliders.length + 1,
          image_url: imageUrl || null,
        })
        .select();
      
      if (error) throw error;
      
      setSuccessMessage(`"${newSlider.title}" স্লাইডার যোগ করা হয়েছে!`);
      setShowAddModal(false);
      setNewSlider({ title: "", discount: "", color: "from-[#f85606] to-orange-500", emoji: "🎉", link: "/category/offer", status: "active", image: null });
      loadSliders();
    } catch (e: any) {
      alert('স্লাইডার যোগ করতে সমস্যা হয়েছে: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ স্লাইডার এডিট
  const handleEditSlider = async () => {
    if (!selectedSlider) return;
    
    setSaving(true);
    try {
      let imageUrl = selectedSlider.image_url || '';
      if ((selectedSlider as any).image) {
        imageUrl = await uploadImage((selectedSlider as any).image);
      }
      
      const { error } = await supabase
        .from('sliders')
        .update({
          title: selectedSlider.title,
          discount: selectedSlider.discount,
          color: selectedSlider.color,
          emoji: selectedSlider.emoji,
          link: selectedSlider.link,
          is_active: selectedSlider.status === 'active',
          image_url: imageUrl,
        })
        .eq('id', selectedSlider.id);
      
      if (error) throw error;
      
      setSuccessMessage(`"${selectedSlider.title}" স্লাইডার আপডেট করা হয়েছে!`);
      setShowEditModal(false);
      loadSliders();
    } catch (e: any) {
      alert('স্লাইডার আপডেট করতে সমস্যা হয়েছে: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ স্লাইডার ডিলিট
  const handleDeleteSlider = async (id: string | number, title: string) => {
    if (!confirm(`"${title}" স্লাইডার ডিলিট করতে চান?`)) return;
    
    try {
      const { error } = await supabase
        .from('sliders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSuccessMessage(`"${title}" স্লাইডার ডিলিট করা হয়েছে!`);
      loadSliders();
    } catch (e: any) {
      alert('স্লাইডার ডিলিট করতে সমস্যা হয়েছে: ' + e.message);
    }
  };

  // ✅ স্ট্যাটাস টগল
  const toggleStatus = async (slider: Slider) => {
    try {
      const { error } = await supabase
        .from('sliders')
        .update({ is_active: slider.status !== 'active' })
        .eq('id', slider.id);
      
      if (error) throw error;
      
      setSuccessMessage("স্ট্যাটাস পরিবর্তন করা হয়েছে!");
      loadSliders();
    } catch (e: any) {
      alert('স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
    }
  };

  // ✅ অর্ডার পরিবর্তন
  const moveSlider = async (id: string | number, direction: 'up' | 'down') => {
    const index = sliders.findIndex(s => s.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sliders.length - 1) return;
    
    const newSliders = [...sliders];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSliders[index], newSliders[swapIndex]] = [newSliders[swapIndex], newSliders[index]];
    
    try {
      for (let i = 0; i < newSliders.length; i++) {
        await supabase
          .from('sliders')
          .update({ order_index: i + 1 })
          .eq('id', newSliders[i].id);
      }
      loadSliders();
    } catch (e) {
      console.error('Order update error:', e);
    }
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
            স্লাইডার ম্যানেজমেন্ট
            <button onClick={loadSliders} className="ml-2 p-1 hover:bg-gray-100 rounded" title="রিফ্রেশ">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
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
              <p className="text-xs opacity-90">মোট</p>
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
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="স্লাইডার খুঁজুন..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" />
            </div>
          </div>

          {/* লোডিং */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Loader2 className="animate-spin mx-auto mb-3 text-[#f85606]" size={32} />
              <p className="text-gray-500">স্লাইডার লোড হচ্ছে...</p>
            </div>
          ) : (
            /* স্লাইডার টেবিল */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">ক্রম</th>
                      <th className="p-3 text-left">ইমেজ</th>
                      <th className="p-3 text-left">টাইটেল</th>
                      <th className="p-3 text-left">ডিসকাউন্ট</th>
                      <th className="p-3 text-left">লিংক</th>
                      <th className="p-3 text-left">স্ট্যাটাস</th>
                      <th className="p-3 text-center">একশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSliders.map((slider) => (
                      <tr key={slider.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveSlider(slider.id, 'up')} className="p-1 hover:bg-gray-200 rounded"><ArrowUp size={14} /></button>
                            <span className="w-6 text-center">{slider.order}</span>
                            <button onClick={() => moveSlider(slider.id, 'down')} className="p-1 hover:bg-gray-200 rounded"><ArrowDown size={14} /></button>
                          </div>
                        </td>
                        <td className="p-3">
                          {slider.image_url ? (
                            <img src={slider.image_url} alt={slider.title} className="w-16 h-10 object-cover rounded" />
                          ) : (
                            <div className={`w-16 h-10 bg-gradient-to-r ${slider.color} rounded flex items-center justify-center text-lg`}>
                              {slider.emoji}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-medium">{slider.title}</td>
                        <td className="p-3 text-sm text-gray-600">{slider.discount}</td>
                        <td className="p-3 text-sm text-blue-600">{slider.link}</td>
                        <td className="p-3">
                          <button onClick={() => toggleStatus(slider)}>
                            {slider.status === 'active' 
                              ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ সক্রিয়</span>
                              : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">❌ নিষ্ক্রিয়</span>
                            }
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setPreviewSlider(slider)} className="p-1 text-gray-400 hover:text-blue-600"><Eye size={16} /></button>
                            <button onClick={() => { setSelectedSlider(slider); setShowEditModal(true); }} className="p-1 text-gray-400 hover:text-green-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteSlider(slider.id, slider.title)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* অ্যাড মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">নতুন স্লাইডার</h3>
            
            <div className="space-y-3">
              <input type="text" value={newSlider.title} onChange={(e) => setNewSlider({...newSlider, title: e.target.value})} placeholder="টাইটেল *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newSlider.discount} onChange={(e) => setNewSlider({...newSlider, discount: e.target.value})} placeholder="ডিসকাউন্ট *" className="w-full p-3 border rounded-xl" />
              <select value={newSlider.color} onChange={(e) => setNewSlider({...newSlider, color: e.target.value})} className="w-full p-3 border rounded-xl">
                {colorOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
              </select>
              <input type="text" value={newSlider.emoji} onChange={(e) => setNewSlider({...newSlider, emoji: e.target.value})} placeholder="ইমোজি" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newSlider.link} onChange={(e) => setNewSlider({...newSlider, link: e.target.value})} placeholder="লিংক" className="w-full p-3 border rounded-xl" />
              
              {/* ইমেজ আপলোড */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">ইমেজ (JPEG/PNG/WebP, Max 5MB)</label>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setNewSlider({...newSlider, image: e.target.files?.[0] || null})}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              
              <select value={newSlider.status} onChange={(e) => setNewSlider({...newSlider, status: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="active">✅ সক্রিয়</option>
                <option value="inactive">❌ নিষ্ক্রিয়</option>
              </select>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddSlider} disabled={saving} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">
                {saving ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'যোগ করুন'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* এডিট + প্রিভিউ মডাল (আগের মতোই) - শুধু Supabase কল যোগ করো */}
    </div>
  );
}