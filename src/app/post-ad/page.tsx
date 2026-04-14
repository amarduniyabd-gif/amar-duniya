"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ImageUp, X, ArrowLeft, Tag, DollarSign, MapPin, Phone, 
  FileText, Sparkles, Shield, Camera, Trash2, CheckCircle,
  PlusCircle
} from "lucide-react";
import { categories, getRootCategories } from "@/data/categories";

export default function PostAdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCategory = searchParams.get("category");
  
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: preSelectedCategory || "",
    subCategory: "",
    description: "",
    phone: "",
    location: "",
  });

  // মূল ক্যাটাগরি গুলো
  const rootCategories = getRootCategories();
  
  // সিলেক্ট করা মূল ক্যাটাগরির উপর ভিত্তি করে সাব-ক্যাটাগরি
  const getSubCategoriesForSelected = () => {
    if (!formData.category) return [];
    const parentCat = categories.find(c => c.id === formData.category);
    if (!parentCat) return [];
    return categories.filter(c => c.parentId === parentCat.id);
  };
  
  const subCategories = getSubCategoriesForSelected();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      // নতুন ক্যাটাগরি যোগ করার লজিক (ডাটাবেজে সেভ হবে পরে)
      alert(`"${newCategoryName}" ক্যাটাগরি যোগ করার অনুরোধ পাঠানো হয়েছে। অ্যাডমিন রিভিউ করে যোগ করবেন।`);
      setShowNewCategory(false);
      setNewCategoryName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.back()} 
            className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            নতুন পোস্ট দিন
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ছবি আপলোড */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Camera size={18} className="text-[#f85606]" />
              ছবি আপলোড করুন
              <span className="text-xs text-gray-400 font-normal">(সর্বোচ্চ ৫টি)</span>
            </label>
            
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt="preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f85606] hover:bg-orange-50 transition-all group">
                <ImageUp size={28} className="text-gray-400 group-hover:text-[#f85606] transition" />
                <span className="text-[10px] text-gray-500 mt-1 group-hover:text-[#f85606]">আপলোড</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* পণ্যের নাম */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag size={18} className="text-[#f85606]" />
              পণ্যের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="যেমন: iPhone 15 Pro Max - 128GB"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition"
              required
            />
          </div>

          {/* দাম */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign size={18} className="text-[#f85606]" />
              দাম (৳) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="০"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              required
            />
          </div>

          {/* ক্যাটাগরি সিলেক্ট */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={18} className="text-[#f85606]" />
              ক্যাটাগরি <span className="text-red-500">*</span>
            </label>
            
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              required
            >
              <option value="">সিলেক্ট করুন</option>
              {rootCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            {/* সাব-ক্যাটাগরি */}
            {subCategories.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  সাব-ক্যাটাগরি (যদি থাকে)
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                >
                  <option value="">সিলেক্ট করুন</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* নতুন ক্যাটাগরি যোগ করার অপশন */}
            {!showNewCategory ? (
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="mt-3 text-sm text-[#f85606] flex items-center gap-1 hover:underline"
              >
                <PlusCircle size={16} />
                আপনার ক্যাটাগরি এখানে নেই? নতুন ক্যাটাগরি যোগ করুন
              </button>
            ) : (
              <div className="mt-3 p-3 bg-orange-50 rounded-xl">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="নতুন ক্যাটাগরির নাম লিখুন"
                  className="w-full p-2 border border-gray-200 rounded-lg mb-2"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="bg-[#f85606] text-white px-3 py-1 rounded-lg text-sm"
                  >
                    জমা দিন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* বিবরণ */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={18} className="text-[#f85606]" />
              বিবরণ
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="পণ্যের বিস্তারিত বিবরণ দিন..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
            />
          </div>

          {/* যোগাযোগ ও লোকেশন */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone size={18} className="text-[#f85606]" />
                মোবাইল নম্বর
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="০১XXXXXXXXX"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                required
              />
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={18} className="text-[#f85606]" />
                অঞ্চল
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="ঢাকা, চট্টগ্রাম..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              />
            </div>
          </div>

          {/* ফিচার্ড লিস্টিং */}
          <div className={`bg-gradient-to-r rounded-2xl shadow-md p-5 transition-all cursor-pointer ${isFeatured ? 'from-amber-50 to-orange-50 border-2 border-[#f85606]' : 'from-gray-50 to-gray-50 border border-gray-200'}`}>
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 text-[#f85606] rounded-lg mt-1 accent-[#f85606]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#f85606]" />
                  <span className="font-bold text-gray-800">ফিচার্ড লিস্টিং</span>
                  <span className="bg-[#f85606] text-white text-[10px] px-2 py-0.5 rounded-full">মাত্র ১০০ টাকা</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  আপনার পোস্ট সবার উপরে থাকবে ৭ দিন! বেশি লোক দেখবে, দ্রুত বিক্রি হবে।
                </p>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">✅ ১০x বেশি ভিউ</span>
                  <span className="flex items-center gap-1">✅ হোমপেজে টপ পজিশন</span>
                  <span className="flex items-center gap-1">✅ প্রিমিয়াম ব্যাজ</span>
                </div>
              </div>
            </label>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                পোস্ট হচ্ছে...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                পোস্ট করুন
              </>
            )}
          </button>
        </form>

        {/* নিরাপত্তা নোটিশ */}
        <div className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
          <Shield size={14} />
          নিরাপদ লেনদেনের জন্য আমাদের নিয়ম মেনে চলুন
        </div>
      </div>
    </div>
  );
}