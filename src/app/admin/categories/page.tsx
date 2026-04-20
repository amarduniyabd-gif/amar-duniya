"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Search, Plus, Edit2, Trash2, 
  Eye, ChevronRight, FolderTree, Tag, 
  CheckCircle, AlertCircle, ChevronDown,
  ChevronUp, Grid3x3, List, RefreshCw, Save,
  Upload, Download, Filter, MoreVertical, Image
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  icon: string;
  image?: string;
  parentId: string | null;
  hasPayment?: boolean;
  status: 'active' | 'inactive';
  order: number;
  postCount: number;
  createdAt: string;
};

// ডামি ক্যাটাগরি ডাটা
const dummyCategories: Category[] = [
  { id: "offer", name: "অফার জোন", nameEn: "Offer Zone", slug: "offer", icon: "🎁", parentId: null, status: "active", order: 1, postCount: 234, createdAt: "2026-01-01" },
  { id: "mobile", name: "মোবাইল", nameEn: "Mobile", slug: "mobile", icon: "📱", parentId: null, status: "active", order: 2, postCount: 1240, createdAt: "2026-01-01" },
  { id: "computer", name: "কম্পিউটার", nameEn: "Computer", slug: "computer", icon: "💻", parentId: null, status: "active", order: 3, postCount: 890, createdAt: "2026-01-01" },
  { id: "electronics", name: "ইলেকট্রনিক্স", nameEn: "Electronics", slug: "electronics", icon: "📺", parentId: null, status: "active", order: 4, postCount: 567, createdAt: "2026-01-01" },
  { id: "fashion", name: "ফ্যাশন", nameEn: "Fashion", slug: "fashion", icon: "👕", parentId: null, status: "active", order: 5, postCount: 2340, createdAt: "2026-01-01" },
  { id: "car", name: "গাড়ি", nameEn: "Car", slug: "car", icon: "🚗", parentId: null, status: "active", order: 6, postCount: 456, createdAt: "2026-01-01" },
  { id: "job", name: "চাকরি", nameEn: "Job", slug: "job", icon: "💼", parentId: null, status: "active", order: 7, postCount: 789, createdAt: "2026-01-01" },
  { id: "service", name: "সার্ভিস", nameEn: "Service", slug: "service", icon: "🔧", parentId: null, status: "active", order: 8, postCount: 345, createdAt: "2026-01-01" },
  { id: "property", name: "জমি / প্রপার্টি", nameEn: "Property", slug: "property", icon: "🏠", parentId: null, status: "active", order: 9, postCount: 234, createdAt: "2026-01-01" },
  { id: "info", name: "ইনফরমেশন / বিজ্ঞপ্তি", nameEn: "Information", slug: "info", icon: "📢", parentId: null, status: "active", order: 10, postCount: 123, createdAt: "2026-01-01" },
  { id: "matrimony", name: "পাত্র-পাত্রী চায়", nameEn: "Matrimony", slug: "matrimony", icon: "💑", parentId: null, hasPayment: true, status: "active", order: 11, postCount: 456, createdAt: "2026-01-01" },
  { id: "rent", name: "ভাড়া / রেন্ট", nameEn: "Rent", slug: "rent", icon: "🔑", parentId: null, status: "active", order: 12, postCount: 567, createdAt: "2026-01-01" },
  { id: "emergency", name: "জরুরি সেবা", nameEn: "Emergency", slug: "emergency", icon: "🚑", parentId: null, status: "active", order: 13, postCount: 89, createdAt: "2026-01-01" },
  { id: "agriculture", name: "কৃষি", nameEn: "Agriculture", slug: "agriculture", icon: "🌾", parentId: null, status: "active", order: 14, postCount: 234, createdAt: "2026-01-01" },
  { id: "animal", name: "পশু", nameEn: "Animal", slug: "animal", icon: "🐄", parentId: null, status: "active", order: 15, postCount: 345, createdAt: "2026-01-01" },
  { id: "daily", name: "প্রতিদিনের বাজার", nameEn: "Daily Market", slug: "daily", icon: "🛒", parentId: null, status: "active", order: 16, postCount: 678, createdAt: "2026-01-01" },
];

const subCategories: Category[] = [
  { id: "mobile_iphone", name: "iPhone", nameEn: "iPhone", slug: "iphone", icon: "📱", parentId: "mobile", status: "active", order: 1, postCount: 456, createdAt: "2026-01-01" },
  { id: "mobile_samsung", name: "Samsung", nameEn: "Samsung", slug: "samsung", icon: "📱", parentId: "mobile", status: "active", order: 2, postCount: 345, createdAt: "2026-01-01" },
  { id: "mobile_xiaomi", name: "Xiaomi", nameEn: "Xiaomi", slug: "xiaomi", icon: "📱", parentId: "mobile", status: "active", order: 3, postCount: 234, createdAt: "2026-01-01" },
  { id: "computer_laptop", name: "ল্যাপটপ", nameEn: "Laptop", slug: "laptop", icon: "💻", parentId: "computer", status: "active", order: 1, postCount: 567, createdAt: "2026-01-01" },
  { id: "computer_desktop", name: "ডেস্কটপ", nameEn: "Desktop", slug: "desktop", icon: "🖥️", parentId: "computer", status: "active", order: 2, postCount: 234, createdAt: "2026-01-01" },
  { id: "car_motorcycle", name: "মোটরসাইকেল", nameEn: "Motorcycle", slug: "motorcycle", icon: "🏍️", parentId: "car", status: "active", order: 1, postCount: 456, createdAt: "2026-01-01" },
  { id: "car_car", name: "গাড়ি", nameEn: "Car", slug: "car-car", icon: "🚗", parentId: "car", status: "active", order: 2, postCount: 345, createdAt: "2026-01-01" },
  { id: "fashion_men", name: "পুরুষ", nameEn: "Men", slug: "men", icon: "👔", parentId: "fashion", status: "active", order: 1, postCount: 789, createdAt: "2026-01-01" },
  { id: "fashion_women", name: "মহিলা", nameEn: "Women", slug: "women", icon: "👗", parentId: "fashion", status: "active", order: 2, postCount: 890, createdAt: "2026-01-01" },
  { id: "job_teach", name: "পড়াতে চায়", nameEn: "Want to Teach", slug: "teach", icon: "📚", parentId: "job", status: "active", order: 1, postCount: 234, createdAt: "2026-01-01" },
  { id: "job_seek", name: "চাকরি চায়", nameEn: "Job Seek", slug: "seek", icon: "🔍", parentId: "job", status: "active", order: 2, postCount: 567, createdAt: "2026-01-01" },
  { id: "service_plumber", name: "প্লাম্বার", nameEn: "Plumber", slug: "plumber", icon: "🔧", parentId: "service", status: "active", order: 1, postCount: 123, createdAt: "2026-01-01" },
  { id: "service_electrician", name: "ইলেকট্রিশিয়ান", nameEn: "Electrician", slug: "electrician", icon: "⚡", parentId: "service", status: "active", order: 2, postCount: 156, createdAt: "2026-01-01" },
];

export default function AdminCategories() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCats, setSubCats] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedParents, setExpandedParents] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState({ 
    name: "", nameEn: "", icon: "📦", parentId: "", slug: "", status: "active", image: "" 
  });
  const [editCategory, setEditCategory] = useState({ 
    name: "", nameEn: "", icon: "📦", parentId: "", slug: "", status: "active", image: "" 
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============ ইনিশিয়াল লোড ============
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
    
    // 🔥 লোকাল স্টোরেজ থেকে ক্যাটাগরি লোড
    const savedCategories = localStorage.getItem("siteCategories");
    if (savedCategories) {
      const allCategories: Category[] = JSON.parse(savedCategories);
      const rootCats = allCategories.filter(c => c.parentId === null);
      const subCatsList = allCategories.filter(c => c.parentId !== null);
      setCategories(rootCats);
      setSubCats(subCatsList);
    } else {
      // প্রথমবার - ডিফল্ট সেভ
      setCategories(dummyCategories);
      setSubCats(subCategories);
      const allCategories = [...dummyCategories, ...subCategories];
      localStorage.setItem("siteCategories", JSON.stringify(allCategories));
    }
  }, [router]);

  // ============ লোকাল স্টোরেজ সিঙ্ক ============
  const syncToLocalStorage = (updatedCategories: Category[], updatedSubCats: Category[]) => {
    const allCategories = [...updatedCategories, ...updatedSubCats];
    localStorage.setItem("siteCategories", JSON.stringify(allCategories));
  };

  // ============ সাকসেস মেসেজ অটো হাইড ============
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ============ ফিল্টার ============
  const filteredCategories = categories.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const getSubCategories = (parentId: string) => subCats.filter(c => c.parentId === parentId);

  // ============ ইমেজ আপলোড ============
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) {
        setErrorMessage("ইমেজ সাইজ ১০০KB এর কম হতে হবে");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        if (isEdit) {
          setEditCategory({ ...editCategory, image: imageData });
          setEditImagePreview(imageData);
        } else {
          setNewCategory({ ...newCategory, image: imageData });
          setImagePreview(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ============ ক্যাটাগরি অ্যাড ============
  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.nameEn) {
      setErrorMessage("বাংলা ও ইংরেজি নাম প্রয়োজন");
      return;
    }
    
    const newId = newCategory.name.toLowerCase().replace(/\s/g, "_") + "_" + Date.now();
    const newCat: Category = {
      id: newId,
      name: newCategory.name,
      nameEn: newCategory.nameEn,
      slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s/g, "-"),
      icon: newCategory.icon,
      image: newCategory.image || undefined,
      parentId: newCategory.parentId || null,
      status: newCategory.status as 'active' | 'inactive',
      order: newCategory.parentId ? subCats.length + 1 : categories.length + 1,
      postCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      hasPayment: false,
    };
    
    let updatedCategories = categories;
    let updatedSubCats = subCats;
    
    if (newCategory.parentId) {
      updatedSubCats = [...subCats, newCat];
      setSubCats(updatedSubCats);
    } else {
      updatedCategories = [...categories, newCat];
      setCategories(updatedCategories);
    }
    
    // 🔥 লোকাল স্টোরেজ সিঙ্ক
    syncToLocalStorage(updatedCategories, updatedSubCats);
    
    setSuccessMessage(`✅ "${newCategory.name}" ক্যাটাগরি যোগ করা হয়েছে!`);
    setShowAddModal(false);
    setNewCategory({ name: "", nameEn: "", icon: "📦", parentId: "", slug: "", status: "active", image: "" });
    setImagePreview("");
  };

  // ============ ক্যাটাগরি এডিট ============
  const handleEditCategory = () => {
    if (!selectedCategory) return;
    
    const updatedCategory: Category = {
      ...selectedCategory,
      name: editCategory.name,
      nameEn: editCategory.nameEn,
      slug: editCategory.slug,
      icon: editCategory.icon,
      image: editCategory.image || selectedCategory.image,
      status: editCategory.status as 'active' | 'inactive',
    };
    
    let updatedCategories = categories;
    let updatedSubCats = subCats;
    
    if (selectedCategory.parentId) {
      updatedSubCats = subCats.map(c => c.id === selectedCategory.id ? updatedCategory : c);
      setSubCats(updatedSubCats);
    } else {
      updatedCategories = categories.map(c => c.id === selectedCategory.id ? updatedCategory : c);
      setCategories(updatedCategories);
    }
    
    // 🔥 লোকাল স্টোরেজ সিঙ্ক
    syncToLocalStorage(updatedCategories, updatedSubCats);
    
    setSuccessMessage(`✅ "${editCategory.name}" ক্যাটাগরি আপডেট করা হয়েছে!`);
    setShowEditModal(false);
    setEditImagePreview("");
  };

  // ============ ক্যাটাগরি ডিলিট ============
  const handleDeleteCategory = (id: string, name: string, isSub: boolean = false) => {
    if (confirm(`"${name}" ক্যাটাগরি ডিলিট করতে চান? ${!isSub ? 'সব সাব-ক্যাটাগরি ও পোস্ট মুছে যাবে!' : ''}`)) {
      let updatedCategories = categories;
      let updatedSubCats = subCats;
      
      if (isSub) {
        updatedSubCats = subCats.filter(c => c.id !== id);
        setSubCats(updatedSubCats);
      } else {
        updatedCategories = categories.filter(c => c.id !== id);
        updatedSubCats = subCats.filter(c => c.parentId !== id);
        setCategories(updatedCategories);
        setSubCats(updatedSubCats);
      }
      
      // 🔥 লোকাল স্টোরেজ সিঙ্ক
      syncToLocalStorage(updatedCategories, updatedSubCats);
      
      setSuccessMessage(`✅ "${name}" ক্যাটাগরি ডিলিট করা হয়েছে!`);
    }
  };

  // ============ স্ট্যাটাস টগল ============
  const toggleStatus = (id: string, isSub: boolean = false) => {
    let updatedCategories = categories;
    let updatedSubCats = subCats;
    
    if (isSub) {
      updatedSubCats = subCats.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c);
      setSubCats(updatedSubCats);
    } else {
      updatedCategories = categories.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c);
      setCategories(updatedCategories);
    }
    
    // 🔥 লোকাল স্টোরেজ সিঙ্ক
    syncToLocalStorage(updatedCategories, updatedSubCats);
    
    setSuccessMessage("✅ স্ট্যাটাস পরিবর্তন করা হয়েছে!");
  };

  // ============ এক্সপান্ড টগল ============
  const toggleExpand = (id: string) => {
    setExpandedParents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ============ স্ট্যাটাস ব্যাজ ============
  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap"><CheckCircle size={10} /> সক্রিয়</span>
      : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap"><AlertCircle size={10} /> নিষ্ক্রিয়</span>;
  };

  // ============ স্ট্যাটিসটিক্স ============
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === "active").length,
    inactive: categories.filter(c => c.status === "inactive").length,
    subTotal: subCats.length,
    totalPosts: [...categories, ...subCats].reduce((sum, c) => sum + c.postCount, 0),
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল বাটন */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ডেস্কটপ সাইডবার */}
      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block">
        <AdminSidebar />
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* মোবাইল সাইডবার */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      {/* মেন কন্টেন্ট */}
      <div className="md:ml-72">
        {/* হেডার */}
        <div className="bg-white shadow-sm px-4 md:px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FolderTree size={20} className="text-[#f85606]" />
            ক্যাটাগরি ম্যানেজমেন্ট
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1">
              {viewMode === "list" ? <Grid3x3 size={16} /> : <List size={16} />}
              <span className="hidden sm:inline">{viewMode === "list" ? "গ্রিড ভিউ" : "লিস্ট ভিউ"}</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Plus size={16} /> <span className="hidden sm:inline">নতুন ক্যাটাগরি</span>
            </button>
          </div>
        </div>

        {/* সাকসেস/এরর মেসেজ */}
        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
            <CheckCircle size={16} className="inline mr-2" />{successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="fixed top-20 right-6 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
            <AlertCircle size={16} className="inline mr-2" />{errorMessage}
          </div>
        )}

        <div className="p-4 md:p-6">
          {/* স্ট্যাটাস কার্ড */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">মূল ক্যাটাগরি</p><p className="text-xl md:text-2xl font-bold">{stats.total}</p></div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">সক্রিয়</p><p className="text-xl md:text-2xl font-bold">{stats.active}</p></div>
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">নিষ্ক্রিয়</p><p className="text-xl md:text-2xl font-bold">{stats.inactive}</p></div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-white"><p className="text-xs opacity-90">সাব-ক্যাটাগরি</p><p className="text-xl md:text-2xl font-bold">{stats.subTotal}</p></div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-3 text-white col-span-2 md:col-span-1"><p className="text-xs opacity-90">মোট পোস্ট</p><p className="text-xl md:text-2xl font-bold">{stats.totalPosts}</p></div>
          </div>

          {/* সার্চ ও ফিল্টার */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ক্যাটাগরি খুঁজুন..." className="w-full p-3 pl-10 border border-gray-200 rounded-xl" /></div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-3 border border-gray-200 rounded-xl bg-white"><option value="all">সব স্ট্যাটাস</option><option value="active">সক্রিয়</option><option value="inactive">নিষ্ক্রিয়</option></select>
            </div>
          </div>

          {/* ক্যাটাগরি লিস্ট */}
          {viewMode === "list" ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr><th className="p-3 text-left">আইকন</th><th className="p-3 text-left">নাম (বাংলা)</th><th className="p-3 text-left hidden md:table-cell">নাম (ইংরেজি)</th><th className="p-3 text-left hidden lg:table-cell">স্লাগ</th><th className="p-3 text-center">পোস্ট</th><th className="p-3 text-center">স্ট্যাটাস</th><th className="p-3 text-center">একশন</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCategories.map((cat) => (
                      <React.Fragment key={cat.id}>
                        <tr className="hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                              ) : (
                                <span className="text-2xl">{cat.icon}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-medium">
                            {cat.name} 
                            {cat.hasPayment && <span className="text-xs bg-green-100 text-green-700 ml-2 px-1 rounded whitespace-nowrap">💰 পেইড</span>}
                          </td>
                          <td className="p-3 text-gray-600 hidden md:table-cell">{cat.nameEn}</td>
                          <td className="p-3 text-gray-500 text-sm hidden lg:table-cell">{cat.slug}</td>
                          <td className="p-3 text-center text-sm">{cat.postCount}</td>
                          <td className="p-3 text-center"><button onClick={() => toggleStatus(cat.id)}>{getStatusBadge(cat.status)}</button></td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center gap-1 md:gap-2">
                              <button onClick={() => toggleExpand(cat.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                {expandedParents.includes(cat.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              <button onClick={() => { 
                                setSelectedCategory(cat); 
                                setEditCategory({ 
                                  name: cat.name, nameEn: cat.nameEn, icon: cat.icon, 
                                  parentId: cat.parentId || "", slug: cat.slug, 
                                  status: cat.status, image: cat.image || "" 
                                });
                                setEditImagePreview(cat.image || "");
                                setShowEditModal(true); 
                              }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedParents.includes(cat.id) && getSubCategories(cat.id).map((sub) => (
                          <tr key={sub.id} className="bg-gray-50 hover:bg-gray-100">
                            <td className="p-3 pl-10">
                              <div className="flex items-center gap-2">
                                {sub.image ? (
                                  <img src={sub.image} alt={sub.name} className="w-6 h-6 rounded-lg object-cover" />
                                ) : (
                                  <span className="text-xl">{sub.icon}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-medium text-gray-600">{sub.name}</td>
                            <td className="p-3 text-gray-500 hidden md:table-cell">{sub.nameEn}</td>
                            <td className="p-3 text-gray-400 text-sm hidden lg:table-cell">{sub.slug}</td>
                            <td className="p-3 text-center text-sm">{sub.postCount}</td>
                            <td className="p-3 text-center"><button onClick={() => toggleStatus(sub.id, true)}>{getStatusBadge(sub.status)}</button></td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-1 md:gap-2">
                                <button onClick={() => { 
                                  setSelectedCategory(sub); 
                                  setEditCategory({ 
                                    name: sub.name, nameEn: sub.nameEn, icon: sub.icon, 
                                    parentId: sub.parentId || "", slug: sub.slug, 
                                    status: sub.status, image: sub.image || "" 
                                  });
                                  setEditImagePreview(sub.image || "");
                                  setShowEditModal(true); 
                                }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteCategory(sub.id, sub.name, true)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="text-3xl">{cat.icon}</div>
                      )}
                      <div>
                        <h3 className="font-bold">{cat.name}</h3>
                        <p className="text-xs text-gray-400">{cat.nameEn}</p>
                      </div>
                    </div>
                    {getStatusBadge(cat.status)}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>📦 {cat.postCount} পোস্ট</span>
                    <span>🔗 {cat.slug}</span>
                  </div>
                  {getSubCategories(cat.id).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">সাব-ক্যাটাগরি:</p>
                      <div className="flex flex-wrap gap-1">
                        {getSubCategories(cat.id).slice(0, 3).map(sub => (
                          <span key={sub.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{sub.icon} {sub.name}</span>
                        ))}
                        {getSubCategories(cat.id).length > 3 && <span className="text-xs text-gray-400">+{getSubCategories(cat.id).length - 3}</span>}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={() => { 
                      setSelectedCategory(cat); 
                      setEditCategory({ 
                        name: cat.name, nameEn: cat.nameEn, icon: cat.icon, 
                        parentId: cat.parentId || "", slug: cat.slug, 
                        status: cat.status, image: cat.image || "" 
                      });
                      setEditImagePreview(cat.image || "");
                      setShowEditModal(true); 
                    }} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* অ্যাড ক্যাটাগরি মডাল */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[#f85606]" /> নতুন ক্যাটাগরি যোগ করুন
            </h3>
            <div className="space-y-3">
              {/* ইমেজ আপলোড */}
              <div>
                <label className="block text-sm font-medium mb-2">ক্যাটাগরি ইমেজ</label>
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-200 transition">
                    <Upload size={14} /> ইমেজ আপলোড
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-1">সর্বোচ্চ ১০০KB, WebP/PNG/JPG</p>
              </div>
              
              <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s/g, "-")})} placeholder="বাংলা নাম *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newCategory.nameEn} onChange={(e) => setNewCategory({...newCategory, nameEn: e.target.value})} placeholder="ইংরেজি নাম *" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newCategory.icon} onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})} placeholder="আইকন (ইমোজি)" className="w-full p-3 border rounded-xl" />
              <input type="text" value={newCategory.slug} onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})} placeholder="স্লাগ (auto-generated)" className="w-full p-3 border rounded-xl" />
              
              <select value={newCategory.parentId} onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="">মূল ক্যাটাগরি</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              
              <select value={newCategory.status} onChange={(e) => setNewCategory({...newCategory, status: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="active">✅ সক্রিয়</option><option value="inactive">❌ নিষ্ক্রিয়</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddCategory} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">যোগ করুন</button>
              <button onClick={() => { setShowAddModal(false); setImagePreview(""); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
            </div>
          </div>
        </div>
      )}

      {/* এডিট ক্যাটাগরি মডাল */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Edit2 size={18} className="text-[#f85606]" /> ক্যাটাগরি এডিট করুন
            </h3>
            <div className="space-y-3">
              {/* ইমেজ আপলোড */}
              <div>
                <label className="block text-sm font-medium mb-2">ক্যাটাগরি ইমেজ</label>
                <div className="flex items-center gap-3">
                  {(editImagePreview || selectedCategory.image) && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={editImagePreview || selectedCategory.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-200 transition">
                    <Upload size={14} /> ইমেজ পরিবর্তন
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                  </label>
                </div>
              </div>
              
              <input type="text" value={editCategory.name} onChange={(e) => setEditCategory({...editCategory, name: e.target.value})} placeholder="বাংলা নাম" className="w-full p-3 border rounded-xl" />
              <input type="text" value={editCategory.nameEn} onChange={(e) => setEditCategory({...editCategory, nameEn: e.target.value})} placeholder="ইংরেজি নাম" className="w-full p-3 border rounded-xl" />
              <input type="text" value={editCategory.icon} onChange={(e) => setEditCategory({...editCategory, icon: e.target.value})} placeholder="আইকন" className="w-full p-3 border rounded-xl" />
              
              <select value={editCategory.status} onChange={(e) => setEditCategory({...editCategory, status: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="active">✅ সক্রিয়</option><option value="inactive">❌ নিষ্ক্রিয়</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleEditCategory} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold">সংরক্ষণ করুন</button>
              <button onClick={() => { setShowEditModal(false); setEditImagePreview(""); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}