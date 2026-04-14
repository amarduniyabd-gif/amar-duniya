"use client";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ImageUp, X, ArrowLeft, Tag, DollarSign, MapPin, Phone, 
  FileText, Sparkles, Shield, Camera, Trash2, CheckCircle,
  PlusCircle, Video, AlertCircle, FileCheck, Lock
} from "lucide-react";
import { categories, getRootCategories } from "@/data/categories";

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

// কন্টেন্ট ভ্যালিডেশন ফাংশন
const validateContent = (title: string, description: string): { valid: boolean; reason: string } => {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const fullText = lowerTitle + ' ' + lowerDesc;
  
  for (const keyword of blockedKeywords) {
    if (fullText.includes(keyword)) {
      return { 
        valid: false, 
        reason: `আপনার পোস্টে অনুমোদিত নয় এমন শব্দ (${keyword}) পাওয়া গেছে। দয়া করে সরিয়ে ফেলুন।` 
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
  const [video, setVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [useDocumentService, setUseDocumentService] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: preSelectedCategory || "",
    subCategory: "",
    description: "",
    phone: "",
    location: "",
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

  // ইমেজ কম্প্রেস ফাংশন (৫০KB এর মধ্যে)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
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
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          let quality = 0.5;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          while (dataUrl.length > 50000 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve(compressedFile);
            })
            .catch(reject);
        };
      };
      reader.onerror = reject;
    });
  };

  // ভিডিও ভ্যালিডেশন (১০০KB)
  const validateVideo = (file: File): boolean => {
    if (!file.type.startsWith('video/')) {
      setVideoError('শুধু ভিডিও ফাইল আপলোড করুন');
      return false;
    }
    
    if (file.size > 100 * 1024) {
      setVideoError('ভিডিও সাইজ ১০০KB এর বেশি হতে পারবে না');
      return false;
    }
    
    // চেক করা ফাইল এক্সটেনশন
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (blockedExtensions.includes(ext)) {
      setVideoError('এই ধরনের ফাইল আপলোড করা যাবে না');
      return false;
    }
    
    setVideoError(null);
    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newErrors: string[] = [];
      
      if (images.length + files.length > 4) {
        alert('সর্বোচ্চ ৪টি ছবি আপলোড করতে পারবেন');
        return;
      }
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          newErrors.push(`${file.name} ছবি নয়`);
          continue;
        }
        
        // চেক করা ফাইল এক্সটেনশন
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (blockedExtensions.includes(ext)) {
          newErrors.push(`${file.name} এই ধরনের ফাইল আপলোড করা যাবে না`);
          continue;
        }
        
        try {
          const compressed = await compressImage(file);
          setImages(prev => [...prev, compressed]);
        } catch (error) {
          newErrors.push(`${file.name} কম্প্রেস করতে সমস্যা হয়েছে`);
        }
      }
      setImageErrors(newErrors);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateVideo(file);
      setVideo(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // টাইটেল বা বিবরণ পরিবর্তন হলে কন্টেন্ট চেক ক্লিয়ার করুন
    if (name === 'title' || name === 'description') {
      setContentError(null);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      alert(`"${newCategoryName}" ক্যাটাগরি যোগ করার অনুরোধ পাঠানো হয়েছে। অ্যাডমিন রিভিউ করে যোগ করবেন।`);
      setShowNewCategory(false);
      setNewCategoryName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('ফ্রি পোস্টের শর্তাবলী পড়ে সম্মতি দিন');
      return;
    }
    
    // কন্টেন্ট ভ্যালিডেশন চেক
    const validation = validateContent(formData.title, formData.description);
    if (!validation.valid) {
      setContentError(validation.reason);
      return;
    }
    
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
          
          {/* কন্টেন্ট এরর দেখালে */}
          {contentError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-500 mt-0.5" />
              <p className="text-sm text-red-600">{contentError}</p>
            </div>
          )}

          {/* ছবি আপলোড */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Camera size={18} className="text-[#f85606]" />
              ছবি আপলোড করুন
              <span className="text-xs text-gray-400 font-normal">(সর্বোচ্চ ৪টি, প্রতি ছবি ৫০KB)</span>
            </label>
            
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-sm group">
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt="preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              {images.length < 4 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f85606] hover:bg-orange-50 transition-all group">
                  <ImageUp size={28} className="text-gray-400 group-hover:text-[#f85606] transition" />
                  <span className="text-[10px] text-gray-500 mt-1 group-hover:text-[#f85606]">আপলোড</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            {imageErrors.length > 0 && (
              <p className="text-red-500 text-xs mt-1">{imageErrors[0]}</p>
            )}
            <p className="text-[10px] text-gray-400 mt-2">✓ ছবি স্বয়ংক্রিয়ভাবে ৫০KB এ কম্প্রেস হবে</p>
          </div>

          {/* ভিডিও আপলোড */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Video size={18} className="text-[#f85606]" />
              ভিডিও (ঐচ্ছিক)
              <span className="text-xs text-gray-400 font-normal">(সর্বোচ্চ ১০০KB)</span>
            </label>
            
            {!video ? (
              <label className="w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-6 cursor-pointer hover:border-[#f85606] hover:bg-orange-50 transition-all group">
                <Video size={40} className="text-gray-400 group-hover:text-[#f85606] transition" />
                <span className="text-sm text-gray-500 mt-2 group-hover:text-[#f85606]">ভিডিও আপলোড করুন</span>
                <span className="text-[10px] text-gray-400">MP4, WebM (সর্বোচ্চ ১০০KB)</span>
                <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              </label>
            ) : (
              <div className="relative">
                <video 
                  src={URL.createObjectURL(video)} 
                  controls 
                  className="w-full rounded-xl max-h-48"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            {videoError && <p className="text-red-500 text-xs mt-2">{videoError}</p>}
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              required
            />
          </div>

          {/* দাম ও ক্যাটাগরি */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={18} className="text-[#f85606]" />
                দাম (৳)
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
            
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={18} className="text-[#f85606]" />
                ক্যাটাগরি
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

              {subCategories.length > 0 && (
                <div className="mt-3">
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
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
            <p className="text-[10px] text-gray-400 mt-2">✓ বিস্তারিত বিবরণ দিলে ক্রেতা আগ্রহী হয়</p>
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

          {/* ডকুমেন্ট সার্ভিস */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
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
                  <span className="bg-[#f85606] text-white text-[10px] px-2 py-0.5 rounded-full">পণ্যের ২% চার্জ</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  আমার দুনিয়া কর্তৃপক্ষ আপনার পণ্যের ডকুমেন্ট প্রোভাইড করবে। ক্রেতা পণ্য পেলে ডকুমেন্ট রিলিজ হবে।
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ নিরাপদ লেনদেনের জন্য সেরা সুবিধা
                </p>
              </div>
            </label>
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

          {/* ফ্রি পোস্টের দায়িত্ব অস্বীকার */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">ফ্রি পোস্টের শর্তাবলী</p>
                <p className="text-xs text-amber-700 mt-1">
                  ফ্রি পোস্ট দিলে আমার দুনিয়া কর্তৃপক্ষ কোনো দায় বহন করবে না। 
                  পণ্যের গুণগত মান, ডেলিভারি, পেমেন্ট সংক্রান্ত সব দায়িত্ব বিক্রেতা ও ক্রেতার নিজস্ব।
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
            className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                পোস্ট হচ্ছে...
              </>
            ) : (
              <>
                {useDocumentService ? <Lock size={18} /> : <CheckCircle size={18} />}
                {useDocumentService ? "ডকুমেন্ট সার্ভিস সহ পোস্ট করুন" : "ফ্রি পোস্ট করুন"}
              </>
            )}
          </button>
        </form>

        {/* নিরাপত্তা নোটিশ */}
        <div className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
          <Shield size={14} />
          নিরাপদ লেনদেনের জন্য ডকুমেন্ট সার্ভিস ব্যবহার করুন
        </div>
      </div>
    </div>
  );
}