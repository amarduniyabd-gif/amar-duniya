"use client";
import { useState, useEffect, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Plus, Edit2, Trash2, Search, Filter,
  CheckCircle, AlertCircle, Package, TrendingUp,
  Save, Upload, Image, Tag, DollarSign, Star,
  Clock, Eye, ShoppingBag, Gift, Zap, BarChart3
} from "lucide-react";
import Lottie from "lottie-react";

// ============ টাইপ ============
type MallProduct = {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subCategory?: string;
  stock: number;
  sold: number;
  rating: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleEnd?: string;
  isNew: boolean;
  isPopular: boolean;
  tags: string[];
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  status: 'active' | 'inactive';
};

// ============ WebP কম্প্রেশন ============
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
        let width = img.width, height = img.height;
        if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.7));
      };
    };
  });
};

// ============ ডিফল্ট ডাটা ============
const defaultCategories: Category[] = [
  { id: "mobile", name: "মোবাইল", icon: "📱", productCount: 24, status: 'active' },
  { id: "computer", name: "কম্পিউটার", icon: "💻", productCount: 18, status: 'active' },
  { id: "fashion", name: "ফ্যাশন", icon: "👕", productCount: 35, status: 'active' },
  { id: "electronics", name: "ইলেকট্রনিক্স", icon: "📺", productCount: 22, status: 'active' },
  { id: "gaming", name: "গেমিং", icon: "🎮", productCount: 12, status: 'active' },
  { id: "daily", name: "ডেইলি নিডস", icon: "🛒", productCount: 40, status: 'active' },
  { id: "health", name: "হেলথ", icon: "💊", productCount: 15, status: 'active' },
  { id: "beauty", name: "বিউটি", icon: "💄", productCount: 28, status: 'active' },
];

const defaultProducts: MallProduct[] = [
  {
    id: 1, title: "iPhone 15 Pro Max", price: 85000, originalPrice: 95000,
    images: ["📱"], category: "mobile", stock: 15, sold: 120, rating: 4.8,
    isFeatured: true, isFlashSale: true, flashSalePrice: 75000, isNew: false, isPopular: true,
    tags: ["smartphone", "apple"], description: "ব্র্যান্ড নতুন iPhone 15 Pro Max",
    status: 'active', createdAt: new Date().toISOString(),
  },
  {
    id: 2, title: "MacBook Pro M3", price: 165000, originalPrice: 185000,
    images: ["💻"], category: "computer", stock: 8, sold: 45, rating: 4.9,
    isFeatured: true, isFlashSale: false, isNew: true, isPopular: true,
    tags: ["laptop", "apple"], description: "MacBook Pro M3 চিপ",
    status: 'active', createdAt: new Date().toISOString(),
  },
  {
    id: 3, title: "Nike Air Max", price: 8500, originalPrice: 12000,
    images: ["👟"], category: "fashion", stock: 25, sold: 230, rating: 4.5,
    isFeatured: false, isFlashSale: true, flashSalePrice: 6500, isNew: false, isPopular: true,
    tags: ["shoes", "nike"], description: "Nike Air Max রানিং শু",
    status: 'active', createdAt: new Date().toISOString(),
  },
  {
    id: 4, title: "Sony WH-1000XM5", price: 25000, originalPrice: 32000,
    images: ["🎧"], category: "electronics", stock: 12, sold: 80, rating: 4.7,
    isFeatured: true, isFlashSale: false, isNew: true, isPopular: false,
    tags: ["headphone", "sony"], description: "Sony Noise Cancelling Headphone",
    status: 'active', createdAt: new Date().toISOString(),
  },
  {
    id: 5, title: "Dettol Hand Wash", price: 180, originalPrice: 250,
    images: ["🧼"], category: "daily", stock: 100, sold: 500, rating: 4.6,
    isFeatured: false, isFlashSale: true, flashSalePrice: 129, isNew: false, isPopular: true,
    tags: ["hygiene", "dettol"], description: "Dettol Hand Wash 200ml",
    status: 'active', createdAt: new Date().toISOString(),
  },
  {
    id: 6, title: "Vitamin C 1000mg", price: 850, originalPrice: 1200,
    images: ["💊"], category: "health", stock: 50, sold: 150, rating: 4.4,
    isFeatured: false, isFlashSale: false, isNew: true, isPopular: false,
    tags: ["supplement", "vitamin"], description: "Vitamin C 1000mg ট্যাবলেট",
    status: 'active', createdAt: new Date().toISOString(),
  },
];

// ============ মেইন কম্পোনেন্ট ============
export default function AdminBazarPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'flashsale' | 'featured' | 'analytics'>('products');
  const [products, setProducts] = useState<MallProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MallProduct | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    title: "", price: "", originalPrice: "", category: "mobile",
    stock: "", description: "", tags: "",
    isFeatured: false, isFlashSale: false, flashSalePrice: "",
    isNew: false, isPopular: false, status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") { router.push("/admin/login"); return; }
    setIsLoggedIn(true);
    
    const savedProducts = localStorage.getItem("bazarProducts");
    const savedCategories = localStorage.getItem("bazarCategories");
    
    setProducts(savedProducts ? JSON.parse(savedProducts) : defaultProducts);
    setCategories(savedCategories ? JSON.parse(savedCategories) : defaultCategories);
  }, [router]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const saveProducts = (updated: MallProduct[]) => {
    setProducts(updated);
    localStorage.setItem("bazarProducts", JSON.stringify(updated));
  };

  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem("bazarCategories", JSON.stringify(updated));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);
    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 4); i++) {
      try { newImages.push(await compressToWebP(files[i])); } catch {}
    }
    setUploadedImages(prev => [...prev, ...newImages].slice(0, 4));
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price) { alert("টাইটেল এবং দাম আবশ্যক!"); return; }
    
    const product: MallProduct = {
      id: Date.now(), title: newProduct.title, price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
      images: uploadedImages.length > 0 ? uploadedImages : ["📦"],
      category: newProduct.category, stock: Number(newProduct.stock) || 10,
      sold: 0, rating: 0, isFeatured: newProduct.isFeatured,
      isFlashSale: newProduct.isFlashSale,
      flashSalePrice: newProduct.flashSalePrice ? Number(newProduct.flashSalePrice) : undefined,
      isNew: newProduct.isNew, isPopular: newProduct.isPopular,
      tags: newProduct.tags.split(',').map(t => t.trim()).filter(t => t),
      description: newProduct.description, status: newProduct.status,
      createdAt: new Date().toISOString(),
    };
    
    saveProducts([...products, product]);
    setSuccessMessage("✅ প্রোডাক্ট যোগ করা হয়েছে!");
    setShowAddModal(false);
    setUploadedImages([]);
    setNewProduct({
      title: "", price: "", originalPrice: "", category: "mobile",
      stock: "", description: "", tags: "", isFeatured: false,
      isFlashSale: false, flashSalePrice: "", isNew: false, isPopular: false,
      status: 'active',
    });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    saveProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
    setSuccessMessage("✅ প্রোডাক্ট আপডেট করা হয়েছে!");
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("প্রোডাক্ট ডিলিট করবেন?")) {
      saveProducts(products.filter(p => p.id !== id));
      setSuccessMessage("✅ প্রোডাক্ট ডিলিট করা হয়েছে!");
    }
  };

  const toggleProductStatus = (id: number) => {
    saveProducts(products.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
    setSuccessMessage("✅ স্ট্যাটাস পরিবর্তন করা হয়েছে!");
  };

  const toggleCategoryStatus = (id: string) => {
    saveCategories(categories.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    setSuccessMessage("✅ ক্যাটাগরি স্ট্যাটাস পরিবর্তন করা হয়েছে!");
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    flashSale: products.filter(p => p.isFlashSale).length,
    featured: products.filter(p => p.isFeatured).length,
    totalSold: products.reduce((s, p) => s + p.sold, 0),
    totalStock: products.reduce((s, p) => s + p.stock, 0),
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
          <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#f85606]" />
            আমার দুনিয়া বাজার
          </h1>
          <button onClick={() => { setShowAddModal(true); setUploadedImages([]); }} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus size={16} /> নতুন প্রোডাক্ট
          </button>
        </div>

        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <CheckCircle size={16} className="inline mr-2" />{successMessage}
          </div>
        )}

        <div className="p-4 md:p-6">
          {/* ট্যাব */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { id: 'products', label: 'প্রোডাক্ট', icon: <Package size={16} /> },
              { id: 'categories', label: 'ক্যাটাগরি', icon: <Filter size={16} /> },
              { id: 'flashsale', label: 'ফ্ল্যাশ সেল', icon: <Zap size={16} /> },
              { id: 'featured', label: 'ফিচার্ড', icon: <Star size={16} /> },
              { id: 'analytics', label: 'অ্যানালিটিক্স', icon: <BarChart3 size={16} /> },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#f85606] text-white' : 'bg-white text-gray-600'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* স্ট্যাটিসটিক্স */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-2.5 text-white"><p className="text-[10px]">মোট</p><p className="text-lg font-bold">{stats.total}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-2.5 text-white"><p className="text-[10px]">সক্রিয়</p><p className="text-lg font-bold">{stats.active}</p></div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-2.5 text-white"><p className="text-[10px]">ফ্ল্যাশ</p><p className="text-lg font-bold">{stats.flashSale}</p></div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-2.5 text-white"><p className="text-[10px]">ফিচার্ড</p><p className="text-lg font-bold">{stats.featured}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-2.5 text-white"><p className="text-[10px]">বিক্রি</p><p className="text-lg font-bold">{stats.totalSold}</p></div>
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-2.5 text-white"><p className="text-[10px]">স্টক</p><p className="text-lg font-bold">{stats.totalStock}</p></div>
          </div>

          {/* প্রোডাক্ট ট্যাব */}
          {activeTab === 'products' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="প্রোডাক্ট খুঁজুন..." className="flex-1 p-2.5 border rounded-lg text-sm" />
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-2.5 border rounded-lg text-sm">
                    <option value="all">সব ক্যাটাগরি</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2.5 border rounded-lg text-sm">
                    <option value="all">সব স্ট্যাটাস</option><option value="active">সক্রিয়</option><option value="inactive">নিষ্ক্রিয়</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">{p.images[0]}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{p.title}</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-[#f85606] font-bold">৳{p.price}</span>
                          {p.originalPrice && <span className="text-xs text-gray-400 line-through">৳{p.originalPrice}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {p.isFlashSale && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">⚡ ফ্ল্যাশ</span>}
                          {p.isFeatured && <span className="text-[9px] bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded">⭐ ফিচার্ড</span>}
                          {p.isNew && <span className="text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded">🆕 নতুন</span>}
                        </div>
                      </div>
                      <button onClick={() => toggleProductStatus(p.id)}>
                        {p.status === 'active' ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">সক্রিয়</span> : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">নিষ্ক্রিয়</span>}
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <button onClick={() => { setSelectedProduct(p); setShowEditModal(true); }} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"><Edit2 size={12} /> এডিট</button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1"><Trash2 size={12} /> ডিলিট</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ক্যাটাগরি ট্যাব */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(c => (
                <div key={c.id} className="bg-white rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-400">{c.productCount} প্রোডাক্ট</p>
                  <button onClick={() => toggleCategoryStatus(c.id)} className="mt-2">
                    {c.status === 'active' ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">সক্রিয়</span> : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">নিষ্ক্রিয়</span>}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ফ্ল্যাশ সেল ট্যাব */}
          {activeTab === 'flashsale' && (
            <div className="space-y-3">
              {products.filter(p => p.isFlashSale).map(p => (
                <div key={p.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{p.images[0]}</div>
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-sm"><span className="text-[#f85606] font-bold">৳{p.flashSalePrice}</span> <span className="text-gray-400 line-through text-xs">৳{p.price}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">স্টক: {p.stock}</p>
                    <p className="text-xs text-green-600">বিক্রি: {p.sold}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ফিচার্ড ট্যাব */}
          {activeTab === 'featured' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {products.filter(p => p.isFeatured).map(p => (
                <div key={p.id} className="bg-white rounded-xl p-3 text-center">
                  <div className="text-3xl mb-2">{p.images[0]}</div>
                  <p className="font-semibold text-xs truncate">{p.title}</p>
                  <p className="text-[#f85606] font-bold text-sm">৳{p.price}</p>
                  <p className="text-[10px] text-gray-400">⭐ {p.rating} • {p.sold}+ বিক্রি</p>
                </div>
              ))}
            </div>
          )}

          {/* অ্যানালিটিক্স ট্যাব */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold mb-4">📊 বিক্রয় পরিসংখ্যান</h3>
              <div className="space-y-4">
                <div><p className="text-sm">মোট আয়</p><p className="text-2xl font-bold text-[#f85606]">৳{products.reduce((s, p) => s + (p.sold * p.price), 0).toLocaleString()}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">সর্বোচ্চ বিক্রি</p><p className="font-semibold">{products.sort((a,b) => b.sold - a.sold)[0]?.title || "-"}</p></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-500">সর্বোচ্চ রেটিং</p><p className="font-semibold">{products.sort((a,b) => b.rating - a.rating)[0]?.title || "-"}</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* অ্যাড মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">নতুন প্রোডাক্ট যোগ করুন</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative w-16 h-16"><img src={img} className="w-full h-full object-cover rounded-lg" /><button onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button></div>
                ))}
                {uploadedImages.length < 4 && (
                  <label className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
                    <Upload size={20} className="text-gray-400" />
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                )}
              </div>
              <input type="text" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} placeholder="টাইটেল *" className="w-full p-2.5 border rounded-lg" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="দাম *" className="p-2.5 border rounded-lg" />
                <input type="number" value={newProduct.originalPrice} onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})} placeholder="আসল দাম" className="p-2.5 border rounded-lg" />
              </div>
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2.5 border rounded-lg">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} placeholder="স্টক" className="p-2.5 border rounded-lg" />
                <input type="number" value={newProduct.flashSalePrice} onChange={e => setNewProduct({...newProduct, flashSalePrice: e.target.value})} placeholder="ফ্ল্যাশ সেল দাম" className="p-2.5 border rounded-lg" />
              </div>
              <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="বিবরণ" className="w-full p-2.5 border rounded-lg" rows={2} />
              <input type="text" value={newProduct.tags} onChange={e => setNewProduct({...newProduct, tags: e.target.value})} placeholder="ট্যাগ (কমা দিয়ে)" className="w-full p-2.5 border rounded-lg" />
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-1"><input type="checkbox" checked={newProduct.isFlashSale} onChange={e => setNewProduct({...newProduct, isFlashSale: e.target.checked})} /> ফ্ল্যাশ সেল</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={newProduct.isFeatured} onChange={e => setNewProduct({...newProduct, isFeatured: e.target.checked})} /> ফিচার্ড</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={newProduct.isNew} onChange={e => setNewProduct({...newProduct, isNew: e.target.checked})} /> নতুন</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={newProduct.isPopular} onChange={e => setNewProduct({...newProduct, isPopular: e.target.checked})} /> জনপ্রিয়</label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddProduct} className="flex-1 bg-[#f85606] text-white py-2.5 rounded-lg font-semibold">যোগ করুন</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-2.5 rounded-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* এডিট মডাল */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">প্রোডাক্ট এডিট করুন</h3>
            <div className="space-y-3">
              <input type="text" value={selectedProduct.title} onChange={e => setSelectedProduct({...selectedProduct, title: e.target.value})} className="w-full p-2.5 border rounded-lg" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={selectedProduct.price} onChange={e => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})} className="p-2.5 border rounded-lg" />
                <input type="number" value={selectedProduct.stock} onChange={e => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})} className="p-2.5 border rounded-lg" />
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-1"><input type="checkbox" checked={selectedProduct.isFlashSale} onChange={e => setSelectedProduct({...selectedProduct, isFlashSale: e.target.checked})} /> ফ্ল্যাশ সেল</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={selectedProduct.isFeatured} onChange={e => setSelectedProduct({...selectedProduct, isFeatured: e.target.checked})} /> ফিচার্ড</label>
              </div>
              <select value={selectedProduct.status} onChange={e => setSelectedProduct({...selectedProduct, status: e.target.value as 'active' | 'inactive'})} className="w-full p-2.5 border rounded-lg">
                <option value="active">সক্রিয়</option><option value="inactive">নিষ্ক্রিয়</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleEditProduct} className="flex-1 bg-[#f85606] text-white py-2.5 rounded-lg font-semibold"><Save size={16} className="inline mr-1" /> সংরক্ষণ</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-gray-200 py-2.5 rounded-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}