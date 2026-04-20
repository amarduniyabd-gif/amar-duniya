"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ImageUp, X, ArrowLeft, Tag, DollarSign, MapPin, Phone, 
  FileText, Sparkles, Shield, Camera, Trash2,
  PlusCircle, AlertCircle, FileCheck, 
  Package, Calendar, Truck, BadgeCheck, Crown
} from "lucide-react";
import { categories, getRootCategories } from "@/data/categories";
import PaymentModal from "@/components/PaymentModal";

// ব্লক করা কীওয়ার্ড লিস্ট
const blockedKeywords = [
  'porn', 'xxx', 'adult', 'sex', 'nude', 'naked', 'hot video', 'bangla sex',
  'গরম ভিডিও', 'অশ্লীল', 'মাদক', 'গাঁজা', 'হেরোইন', 'কোকেন',
  'অস্ত্র', 'বন্দুক', 'গান', 'ছুরি', 'ধারালো অস্ত্র',
  'জুয়া', 'ক্যাসিনো', 'লটারি', 'সাটা', 'ব্যাট',
  'প্রতারক', 'ফেইক', 'ভুয়া', 'নকল পণ্য',
  'অবৈধ', 'ইলিগাল', 'চুরি', 'হ্যাকিং'
];

// ব্লক করা ফাইল এক্সটেনশন
const blockedExtensions = ['.exe', '.bat', '.sh', '.apk', '.msi', '.dll', '.scr', '.vbs'];

const validateContent = (title: string, description: string): { valid: boolean; reason: string } => {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const fullText = lowerTitle + ' ' + lowerDesc;
  
  for (const keyword of blockedKeywords) {
    if (fullText.includes(keyword)) {
      return { 
        valid: false, 
        reason: `আপনার পোস্টে অনুমোদিত নয় এমন শব্দ পাওয়া গেছে।` 
      };
    }
  }
  return { valid: true, reason: '' };
};

export default function PostAdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCategory = searchParams.get("category");
  
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [useDocumentService, setUseDocumentService] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [contentError, setContentError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    condition: "new",
    category: preSelectedCategory || "",
    subCategory: "",
    description: "",
    phone: "",
    location: "কুষ্টিয়া",
    delivery: "pickup",
    warranty: "",
    brand: "",
    termsAccepted: false,
  });

  const rootCategories = getRootCategories();
  
  const getSubCategoriesForSelected = () => {
    if (!formData.category) return [];
    const parentCat = categories.find(c => c.id === formData.category);
    if (!parentCat) return [];
    return categories.filter(c => c.parentId === parentCat.id);
  };
  
  const subCategories = getSubCategoriesForSelected();

  // সুপার ফাস্ট ইমেজ কম্প্রেশন (WebP)
  const compressImageToWebP = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 600;
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
          ctx?.drawImage(img, 0, 0, width, height);
          
          let quality = 0.7;
          let dataUrl = canvas.toDataURL('image/webp', quality);
          while (dataUrl.length > 50000 && quality > 0.2) {
            quality -= 0.05;
            dataUrl = canvas.toDataURL('image/webp', quality);
          }
          
          fetch(dataUrl).then(res => res.blob()).then(blob => {
            const originalName = file.name.replace(/\.[^/.]+$/, '');
            resolve(new File([blob], `${originalName}.webp`, { type: 'image/webp' }));
          });
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (images.length + files.length > 4) {
        alert('সর্বোচ্চ ৪টি ছবি আপলোড করতে পারবেন');
        return;
      }
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (blockedExtensions.includes(ext)) continue;
        
        try {
          const compressed = await compressImageToWebP(file);
          setImages(prev => [...prev, compressed]);
        } catch (error) {
          // সাইলেন্ট ফেইল
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'title' || name === 'description') {
      setContentError(null);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      alert(`"${newCategoryName}" ক্যাটাগরি যোগ করার অনুরোধ পাঠানো হয়েছে।`);
      setShowNewCategory(false);
      setNewCategoryName("");
    }
  };

  const handleFeaturedSuccess = () => {
    setIsFeatured(true);
    alert("✅ আপনার পোস্ট ফিচার্ড হয়েছে! ৭ দিন হোমপেজের টপে থাকবে।");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('ফ্রি পোস্টের শর্তাবলী পড়ে সম্মতি দিন');
      return;
    }
    
    const validation = validateContent(formData.title, formData.description);
    if (!validation.valid) {
      setContentError(validation.reason);
      return;
    }
    
    setIsSubmitting(true);
    
    const newPostId = `POST_${Date.now()}`;
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (useDocumentService) {
        alert('✅ পোস্ট তৈরি হয়েছে! এখন আপনার ডকুমেন্ট আপলোড করুন।');
        router.push(`/documents/upload?postId=${newPostId}&postTitle=${encodeURIComponent(formData.title)}`);
      } else {
        alert('✅ আপনার পোস্ট সফলভাবে জমা দেওয়া হয়েছে!');
        router.push("/");
      }
    }, 1000); // আরও ফাস্ট!
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/30 via-orange-500/30 to-[#f85606]/30 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-[#f85606]/20 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft size={20} className="text-[#f85606]" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                নতুন পোস্ট দিন
              </h1>
              <p className="text-xs text-gray-500 mt-1 tracking-wide">আপনার পণ্য বিশ্ববাজারে তুলে ধরুন</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-[#f85606]/30">
              <Crown size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {contentError && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5" />
              <p className="text-sm text-red-600">{contentError}</p>
            </div>
          )}

          {/* ছবি আপলোড - সুপার ফাস্ট */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20 hover:shadow-2xl transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                <Camera size={16} className="text-[#f85606]" />
              </div>
              ছবি আপলোড করুন
              <span className="text-xs text-gray-400">(সর্বোচ্চ ৪টি, WebP ফরম্যাট)</span>
            </label>
            
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl overflow-hidden shadow-md group">
                  <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              
              {images.length < 4 && (
                <label className="w-24 h-24 border-2 border-dashed border-[#f85606]/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f85606] hover:bg-orange-50 transition-all group">
                  <ImageUp size={24} className="text-gray-400 group-hover:text-[#f85606]" />
                  <span className="text-[10px] text-gray-500 group-hover:text-[#f85606]">আপলোড</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">✓ ছবি অটোমেটিক WebP ফরম্যাটে কম্প্রেস হবে (৫০KB)</p>
          </div>

          {/* পণ্যের নাম */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                <Tag size={16} className="text-[#f85606]" />
              </div>
              পণ্যের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="যেমন: iPhone 15 Pro Max - 128GB"
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              required
            />
          </div>

          {/* ব্র্যান্ড */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                <BadgeCheck size={16} className="text-[#f85606]" />
              </div>
              ব্র্যান্ড (ঐচ্ছিক)
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="যেমন: Apple, Samsung, Nike..."
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
            />
          </div>

          {/* দাম ও অবস্থা */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={16} className="text-[#f85606]" />
                দাম (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="০"
                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                required
              />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Package size={16} className="text-[#f85606]" />
                পণ্যের অবস্থা <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                required
              >
                <option value="new">✨ নতুন (ব্র্যান্ড নিউ)</option>
                <option value="old">📦 পুরাতন (ইউজড)</option>
              </select>
            </div>
          </div>

          {/* ক্যাটাগরি */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-[#f85606]" />
              ক্যাটাগরি <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              required
            >
              <option value="">সিলেক্ট করুন</option>
              {rootCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            {subCategories.length > 0 && (
              <div className="mt-3">
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                >
                  <option value="">সাব-ক্যাটাগরি (ঐচ্ছিক)</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
                  ))}
                </select>
              </div>
            )}

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
              <div className="mt-3 p-4 bg-orange-50 rounded-xl">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="নতুন ক্যাটাগরির নাম লিখুন"
                  className="w-full p-3 border border-gray-200 rounded-lg mb-2"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddNewCategory} className="bg-[#f85606] text-white px-4 py-2 rounded-lg text-sm">জমা দিন</button>
                  <button type="button" onClick={() => setShowNewCategory(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">বাতিল</button>
                </div>
              </div>
            )}
          </div>

          {/* ওয়ারেন্টি */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} className="text-[#f85606]" />
              ওয়ারেন্টি (ঐচ্ছিক)
            </label>
            <select
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
            >
              <option value="">নেই</option>
              <option value="1">১ মাস</option>
              <option value="3">৩ মাস</option>
              <option value="6">৬ মাস</option>
              <option value="12">১ বছর</option>
              <option value="24">২ বছর</option>
            </select>
          </div>

          {/* বিবরণ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-[#f85606]" />
              বিবরণ
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="পণ্যের বিস্তারিত বিবরণ দিন..."
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
            />
          </div>

          {/* ডেলিভারি অপশন */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
    <Truck size={16} className="text-[#f85606]" />
    ডেলিভারি অপশন
  </label>
  <div className="space-y-3">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="delivery"
        value="pickup"
        checked={formData.delivery === "pickup"}
        onChange={handleChange}
        className="w-4 h-4 text-[#f85606]"
      />
      <span className="text-sm">🤝 হাতে হাতে নিবেন</span>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="delivery"
        value="delivery"
        checked={formData.delivery === "delivery"}
        onChange={handleChange}
        className="w-4 h-4 text-[#f85606]"
      />
      <span className="text-sm">🏠 হোম ডেলিভারি চাই</span>
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="delivery"
        value="amar_duniya_delivery"
        checked={formData.delivery === "amar_duniya_delivery"}
        onChange={handleChange}
        className="w-4 h-4 text-[#f85606]"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
          🚚 আমার দুনিয়া ডেলিভারি সার্ভিস
        </span>
        <span className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
          নিরাপদ ও দ্রুত
        </span>
      </div>
    </label>
  </div>
  
  {/* নির্বাচিত ডেলিভারি অনুযায়ী তথ্য */}
  {formData.delivery === "amar_duniya_delivery" && (
    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-[#f85606]/20">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-[#f85606] rounded-full flex items-center justify-center">
          <Shield size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">আমার দুনিয়া ডেলিভারি সার্ভিস</p>
          <p className="text-xs text-gray-600 mt-1">
            ✓ আমাদের প্রতিনিধি আপনার পণ্য সংগ্রহ করে ক্রেতার কাছে পৌঁছে দিবে
          </p>
          <p className="text-xs text-gray-600 mt-1">
            ✓ পেমেন্ট সুরক্ষিত থাকবে (ক্রেতা পণ্য পেয়ে পেমেন্ট করবে)
          </p>
          <p className="text-xs text-[#f85606] font-semibold mt-2">
            ডেলিভারি চার্জ: পণ্যের মূল্যের উপর নির্ভর করে (ন্যূনতম ১০০ টাকা)
          </p>
        </div>
      </div>
    </div>
  )}
</div>

          {/* যোগাযোগ ও লোকেশন */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} className="text-[#f85606]" />
                মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="০১XXXXXXXXX"
                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                required
              />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="text-[#f85606]" />
                অঞ্চল
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="কুষ্টিয়া"
                className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              />
            </div>
          </div>

          {/* ডকুমেন্ট সার্ভিস */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useDocumentService}
                onChange={(e) => setUseDocumentService(e.target.checked)}
                className="w-5 h-5 text-[#f85606] rounded-lg mt-0.5 accent-[#f85606]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck size={18} className="text-[#f85606]" />
                  <span className="font-semibold text-gray-800">ডকুমেন্ট সার্ভিস নিন</span>
                  <span className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">পণ্যের ২% চার্জ</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  আমার দুনিয়া কর্তৃপক্ষ আপনার পণ্যের ডকুমেন্ট প্রোভাইড করবে।
                </p>
              </div>
            </label>
          </div>

          {/* ফিচার্ড লিস্টিং */}
          <div className={`rounded-2xl shadow-xl p-5 transition-all duration-300 cursor-pointer ${isFeatured ? 'bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-2 border-[#f85606]' : 'bg-white/80 backdrop-blur-sm border border-[#f85606]/20'}`}>
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => {
                  if (e.target.checked) {
                    setShowFeaturedModal(true);
                  } else {
                    setIsFeatured(false);
                  }
                }}
                className="w-5 h-5 text-[#f85606] rounded-lg mt-1 accent-[#f85606]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#f85606]" />
                  <span className="font-bold text-gray-800">ফিচার্ড লিস্টিং</span>
                  <span className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">মাত্র ১০০ টাকা</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">আপনার পোস্ট সবার উপরে থাকবে ৭ দিন!</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">✅ ১০x বেশি ভিউ</span>
                  <span className="flex items-center gap-1">✅ হোমপেজে টপ পজিশন</span>
                  <span className="flex items-center gap-1">✅ প্রিমিয়াম ব্যাজ</span>
                </div>
              </div>
            </label>
            {isFeatured && (
              <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-center">
                <p className="text-xs text-green-700 font-semibold">✓ ফিচার্ড লিস্টিং সক্রিয়! ৭ দিন টপে থাকবে।</p>
              </div>
            )}
          </div>

          {/* ফ্রি পোস্টের দায়িত্ব অস্বীকার */}
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl backdrop-blur-sm border border-amber-200 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Shield size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">ফ্রি পোস্টের শর্তাবলী</p>
                <p className="text-xs text-amber-700 mt-1">
                  ফ্রি পোস্ট দিলে আমার দুনিয়া কর্তৃপক্ষ কোনো দায় বহন করবে না।
                </p>
                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#f85606] rounded accent-[#f85606]"
                    required
                  />
                  <span className="text-xs text-gray-600">আমি শর্তাবলী পড়েছি এবং সম্মতি জানাচ্ছি</span>
                </label>
              </div>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                পোস্ট হচ্ছে...
              </>
            ) : (
              <>
                <Crown size={20} />
                {useDocumentService ? "ডকুমেন্ট সার্ভিস সহ পোস্ট করুন" : "ফ্রি পোস্ট করুন"}
              </>
            )}
          </button>
        </form>

        {/* ফিচার্ড লিস্টিং পেমেন্ট মডাল */}
        <PaymentModal
          isOpen={showFeaturedModal}
          onClose={() => setShowFeaturedModal(false)}
          onSuccess={handleFeaturedSuccess}
          title="ফিচার্ড লিস্টিং"
          amount={100}
          description="আপনার পোস্ট ৭ দিন হোমপেজের টপে থাকবে"
        />

        {/* নিরাপত্তা নোটিশ */}
        <div className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
            <Shield size={12} className="text-[#f85606]" />
          </div>
          নিরাপদ লেনদেনের জন্য ডকুমেন্ট সার্ভিস ব্যবহার করুন
        </div>
      </div>
    </div>
  );
}