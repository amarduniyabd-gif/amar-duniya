"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { supabase } from '@/lib/supabase/client'; 
import { Search, CheckCircle, XCircle, Trash2, Edit2, RefreshCw } from "lucide-react";

// UI এর জন্য কাস্টম টাইপ
type Post = {
  id: string; 
  title: string;
  seller: string;
  sellerId: string;
  price: number;
  category: string;
  subCategory: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  images: string[];
  description: string;
  location: string;
  condition: 'new' | 'old';
  brand: string;
  warranty: string;
  featured: boolean;
  urgent: boolean;
};

export default function AdminPosts() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]); 
  const [bulkAction, setBulkAction] = useState("");

  const supabaseClient = supabase();

  // ১. ডাটা ফেচিং
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select(`
          *,
          post_images (thumbnail_url, full_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPosts: Post[] = data.map((p: any) => ({
          id: p.id,
          title: p.title || '',
          seller: p.user_id?.slice(0, 8) || "ইউজার", 
          sellerId: p.user_id,
          price: p.price || 0,
          category: p.category_id || '', 
          subCategory: p.sub_category_id || '',
          status: p.status || 'pending',
          date: new Date(p.created_at).toLocaleDateString('en-CA'),
          images: p.post_images?.map((img: any) => img.thumbnail_url) || [],
          description: p.description || '',
          location: p.location || '',
          condition: p.condition || 'new',
          brand: p.brand || '',
          warranty: p.warranty || '',
          featured: p.is_featured || false,
          urgent: p.is_urgent || false,
        }));
        setPosts(formattedPosts);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn]);

  // ২. স্ট্যাটাস আপডেট
  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const { error } = await supabaseClient
      .from('posts')
      .update({ status: status })
      .eq('id', id);

    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
      alert(`পোস্টটি সফলভাবে ${status === 'approved' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে!`);
    } else {
      console.error(error);
      alert("আপডেট ব্যর্থ হয়েছে!");
    }
  };

  // ৩. ডিলিট পোস্ট
  const deletePost = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পোস্টটি চিরতরে ডিলিট করতে চান?")) return;
    const { error } = await supabaseClient.from('posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
      alert("পোস্টটি মুছে ফেলা হয়েছে!");
    }
  };

  // ৪. এডিট পোস্ট সেভ
  const handleUpdatePost = async (updatedPost: Post) => {
    const { error } = await supabaseClient
      .from('posts')
      .update({
        title: updatedPost.title,
        price: updatedPost.price,
        description: updatedPost.description,
        location: updatedPost.location,
        condition: updatedPost.condition,
        brand: updatedPost.brand,
        warranty: updatedPost.warranty
      })
      .eq('id', updatedPost.id);

    if (!error) {
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      setShowEditModal(false);
      alert("তথ্য আপডেট হয়েছে!");
    }
  };

  // ৫. বাল্ক অ্যাকশন
  const handleBulkAction = async () => {
    if (selectedPosts.length === 0 || !bulkAction) return;
    
    if (bulkAction === "delete") {
      if (!confirm(`${selectedPosts.length}টি পোস্ট ডিলিট হবে। নিশ্চিত?`)) return;
      const { error } = await supabaseClient.from('posts').delete().in('id', selectedPosts);
      if (!error) setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
    } else {
      const newStatus = bulkAction === "approve" ? "approved" : "rejected";
      const { error } = await supabaseClient.from('posts').update({ status: newStatus }).in('id', selectedPosts);
      if (!error) {
        setPosts(posts.map(p => selectedPosts.includes(p.id) ? { ...p, status: newStatus as any } : p));
        alert("বাল্ক অ্যাকশন সফল হয়েছে!");
      }
    }
    setSelectedPosts([]);
    setShowBulkModal(false);
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#f85606]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 hidden md:block border-r bg-white h-screen sticky top-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold">পোস্ট ম্যানেজমেন্ট ({filteredPosts.length})</h1>
          <div className="flex gap-2">
            <button onClick={fetchPosts} className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={20}/>
            </button>
            {selectedPosts.length > 0 && (
              <button 
                onClick={() => setShowBulkModal(true)} 
                className="bg-[#f85606] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
              >
                বাল্ক অ্যাকশন ({selectedPosts.length})
              </button>
            )}
          </div>
        </header>
        
        <main className="p-6">
          {/* সার্চ এবং ফিল্টার */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="পণ্যের নাম বা বিক্রেতা দিয়ে সার্চ করুন..." 
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#f85606] transition-all"
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <select 
              className="border rounded-xl px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-[#f85606]" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="pending">⏳ পেন্ডিং</option>
              <option value="approved">✅ অনুমোদিত</option>
              <option value="rejected">❌ বাতিল</option>
            </select>
          </div>

          {/* পোস্ট টেবিল */}
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        onChange={(e) => e.target.checked ? setSelectedPosts(filteredPosts.map(p=>p.id)) : setSelectedPosts([])} 
                      />
                    </th>
                    <th className="p-4">পণ্য</th>
                    <th className="p-4">মূল্য</th>
                    <th className="p-4">অবস্থা</th>
                    <th className="p-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPosts.map(post => (
                    <tr key={post.id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="rounded text-[#f85606]" 
                          checked={selectedPosts.includes(post.id)} 
                          onChange={() => setSelectedPosts(prev => 
                            prev.includes(post.id) 
                              ? prev.filter(i=>i!==post.id) 
                              : [...prev, post.id]
                          )} 
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.images[0] || 'https://via.placeholder.com/150'} 
                            alt={post.title} 
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-100" 
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                          />
                          <div>
                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{post.title}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{post.date} • {post.seller}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-black text-[#f85606]">৳{post.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          post.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : post.status === 'rejected' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => updateStatus(post.id, 'approved')} 
                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg" 
                            title="অনুমোদন"
                          >
                            <CheckCircle size={18}/>
                          </button>
                          <button 
                            onClick={() => updateStatus(post.id, 'rejected')} 
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg" 
                            title="বাতিল"
                          >
                            <XCircle size={18}/>
                          </button>
                          <button 
                            onClick={() => { setEditPost(post); setShowEditModal(true); }} 
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg" 
                            title="এডিট"
                          >
                            <Edit2 size={18}/>
                          </button>
                          <button 
                            onClick={() => deletePost(post.id)} 
                            className="text-gray-400 hover:text-red-600 p-2 rounded-lg" 
                            title="ডিলিট"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPosts.length === 0 && (
              <div className="p-20 text-center text-gray-400">
                কোন পোস্ট পাওয়া যায়নি!
              </div>
            )}
          </div>
        </main>
      </div>

      {/* এডিট মোডাল */}
      {showEditModal && editPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              📝 পোস্ট এডিট করুন
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">টাইটেল</label>
                <input 
                  className="w-full border border-gray-200 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#f85606]" 
                  value={editPost.title} 
                  onChange={(e) => setEditPost({...editPost, title: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">মূল্য</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-200 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#f85606]" 
                  value={editPost.price} 
                  onChange={(e) => setEditPost({...editPost, price: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">বিবরণ</label>
                <textarea 
                  rows={3} 
                  className="w-full border border-gray-200 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#f85606]" 
                  value={editPost.description} 
                  onChange={(e) => setEditPost({...editPost, description: e.target.value})} 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => handleUpdatePost(editPost)} 
                  className="flex-1 bg-[#f85606] text-white py-3.5 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                >
                  আপডেট
                </button>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="flex-1 bg-gray-100 text-gray-500 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* বাল্ক অ্যাকশন মোডাল */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="font-black text-gray-800 text-xl mb-2 text-center">বাল্ক অ্যাকশন</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              {selectedPosts.length}টি পোস্ট সিলেক্ট করা হয়েছে
            </p>
            <select 
              className="w-full border-2 border-gray-100 p-3.5 rounded-2xl mb-6 outline-none focus:border-[#f85606] font-bold bg-gray-50" 
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">অ্যাকশন সিলেক্ট করুন</option>
              <option value="approve">সবগুলো অ্যাপ্রুভ করুন</option>
              <option value="reject">সবগুলো রিজেক্ট করুন</option>
              <option value="delete">সবগুলো ডিলিট করুন</option>
            </select>
            <div className="flex gap-3">
              <button 
                onClick={handleBulkAction} 
                className="flex-1 bg-gray-900 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-all"
              >
                প্রয়োগ করুন
              </button>
              <button 
                onClick={() => setShowBulkModal(false)} 
                className="flex-1 bg-gray-100 text-gray-500 py-3.5 rounded-2xl font-bold"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}