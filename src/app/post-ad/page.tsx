"use client";
import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ImageUp, X, ArrowLeft, Tag, DollarSign, MapPin, Phone, 
  FileText, Sparkles, Shield, Camera, Trash2,
  PlusCircle, AlertCircle, FileCheck, 
  Package, Calendar, Truck, BadgeCheck, Crown, Loader2
} from "lucide-react";
import { categories, getRootCategories } from "@/data/categories";
import PaymentModal from "@/components/PaymentModal";

// ============ কনস্ট্যান্ট ============
const BLOCKED_KEYWORDS = [
  'porn', 'xxx', 'adult', 'sex', 'nude', 'naked',
  'গরম ভিডিও', 'অশ্লীল', 'মাদক', 'গাঁজা', 'হেরোইন',
  'অস্ত্র', 'বন্দুক', 'জুয়া', 'ক্যাসিনো', 'প্রতারক', 'অবৈধ'
];

const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.sh', '.apk', '.msi', '.dll', '.scr', '.vbs'];

const BANGLADESH_DISTRICTS = [
  "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ",
  "কুষ্টিয়া", "যশোর", "কুমিল্লা", "নোয়াখালী", "বগুড়া", "পাবনা", "টাঙ্গাইল", "গাজীপুর",
  "নারায়ণগঞ্জ", "ফরিদপুর", "মাদারীপুর", "কক্সবাজার", "রাঙ্গামাটি", "বান্দরবান"
];

// ============ ইমেজ টাইপ ============
interface CompressedImage {
  thumbnail: File;   // ৪০০px, ৫০KB
  full: File;        // অরিজিনাল সাইজ, ৮৫% কোয়ালিটি
  preview: string;   // প্রিভিউ URL
  width: number;
  height: number;
}

// ============ কন্টেন্ট ভ্যালিডেশন ============
const validateContent = (title: string, description: string): { valid: boolean; reason: string } => {
  const fullText = (title + ' ' + description).toLowerCase();
  for (const keyword of BLOCKED_KEYWORDS) {
    if (fullText.includes(keyword)) {
      return { valid: false, reason: `আপনার পোস্টে অনুমোদিত নয় এমন শব্দ পাওয়া গেছে।` };
    }
  }
  return { valid: true, reason: '' };
};

// ============ সুপার অপটিমাইজড ডুয়াল ইমেজ কম্প্রেশন ============
const compressImageWithThumbnail = async (file: File): Promise<CompressedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        // ===== থাম্বনেইল (৪০০px, ৫০KB টার্গেট) =====
        const thumbCanvas = document.createElement('canvas');
        let thumbWidth = originalWidth;
        let thumbHeight = originalHeight;
        const thumbMaxSize = 400;
        
        if (thumbWidth > thumbMaxSize) {
          thumbHeight = (thumbHeight * thumbMaxSize) / thumbWidth;
          thumbWidth = thumbMaxSize;
        }
        if (thumbHeight > thumbMaxSize) {
          thumbWidth = (thumbWidth * thumbMaxSize) / thumbHeight;
          thumbHeight = thumbMaxSize;
        }
        
        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;
        const thumbCtx = thumbCanvas.getContext('2d', { alpha: true });
        if (thumbCtx) {
          thumbCtx.imageSmoothingEnabled = true;
          thumbCtx.imageSmoothingQuality = 'high';
          thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
        }
        
        // থাম্বনেইল কোয়ালিটি অ্যাডজাস্ট (৫০KB টার্গেট)
        let thumbQuality = 0.7;
        let thumbDataUrl = thumbCanvas.toDataURL('image/webp', thumbQuality);
        while (thumbDataUrl.length > 50000 && thumbQuality > 0.25) {
          thumbQuality -= 0.05;
          thumbDataUrl = thumbCanvas.toDataURL('image/webp', thumbQuality);
        }
        
        // ===== ফুল সাইজ (অরিজিনাল ডাইমেনশন, ৮৫% কোয়ালিটি) =====
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = originalWidth;
        fullCanvas.height = originalHeight;
        const fullCtx = fullCanvas.getContext('2d', { alpha: true });
        if (fullCtx) {
          fullCtx.imageSmoothingEnabled = true;
          fullCtx.imageSmoothingQuality = 'high';
          fullCtx.drawImage(img, 0, 0);
        }
        
        const fullDataUrl = fullCanvas.toDataURL('image/webp', 0.85);
        
        // দুটোই ব্লব কনভার্ট
        Promise.all([
          fetch(thumbDataUrl).then(res => res.blob()),
          fetch(fullDataUrl).then(res => res.blob())
        ]).then(([thumbBlob, fullBlob]) => {
          const originalName = file.name.replace(/\.[^/.]+$/, '') || 'image';
          const timestamp = Date.now();
          
          resolve({
            thumbnail: new File([thumbBlob], `${originalName}_thumb_${timestamp}.webp`, { type: 'image/webp' }),
            full: new File([fullBlob], `${originalName}_full_${timestamp}.webp`, { type: 'image/webp' }),
            preview: thumbDataUrl,
            width: originalWidth,
            height: originalHeight,
          });
        }).catch(reject);
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
  });
};

// ============ ফর্ম সেকশন (মেমোইজড) ============
const FormSection = ({ icon, title, children, required }: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode; 
  required?: boolean 
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5 border border-gray-100">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
      <div className="w-8 h-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      {title} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// ============ মেইন পেজ ============
export default function PostAdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCategory = searchParams.get("category");
  
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [useDocumentService, setUseDocumentService] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
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

  const rootCategories = useMemo(() => getRootCategories(), []);
  
  const subCategories = useMemo(() => {
    if (!formData.category) return [];
    const parentCat = categories.find(c => c.id === formData.category);
    return parentCat ? categories.filter(c => c.parentId === parentCat.id) : [];
  }, [formData.category]);

  // ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    
    if (images.length + files.length > 4) {
      alert('সর্বোচ্চ ৪টি ছবি আপলোড করতে পারবেন');
      return;
    }
    
    setIsUploading(true);
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (BLOCKED_EXTENSIONS.includes(ext || '')) continue;
      
      try {
        const compressed = await compressImageWithThumbnail(file);
        setImages(prev => [...prev, compressed]);
      } catch (error) {
        alert('ছবি আপলোড ব্যর্থ! আবার চেষ্টা করুন।');
      }
    }
    
    setIsUploading(false);
    
    // ইনপুট ক্লিয়ার করে দিন যাতে একই ছবি আবার সিলেক্ট করা যায়
    e.target.value = '';
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title' || name === 'description') setContentError(null);
  }, []);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  }, []);

  const handleFeaturedSuccess = useCallback(() => {
    setIsFeatured(true);
    alert("✅ আপনার পোস্ট ফিচার্ড হয়েছে! ৭ দিন হোমপেজের টপে থাকবে।");
  }, []);

  const handleAddNewCategory = useCallback(() => {
    if (newCategoryName.trim()) {
      alert(`"${newCategoryName}" ক্যাটাগরি যোগ করার অনুরোধ পাঠানো হয়েছে।`);
      setShowNewCategory(false);
      setNewCategoryName("");
    }
  }, [newCategoryName]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ভ্যালিডেশন
    if (!formData.title.trim()) {
      alert('পণ্যের নাম আবশ্যক');
      return;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      alert('সঠিক দাম দিন');
      return;
    }
    if (!formData.category) {
      alert('ক্যাটাগরি সিলেক্ট করুন');
      return;
    }
    if (!formData.phone.trim()) {
      alert('মোবাইল নম্বর আবশ্যক');
      return;
    }
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
    
    // পোস্ট ডাটা তৈরি
    const postData = {
      id: `POST_${Date.now()}`,
      title: formData.title,
      price: parseInt(formData.price),
      condition: formData.condition,
      category: formData.category,
      subCategory: formData.subCategory,
      description: formData.description,
      phone: formData.phone,
      location: formData.location,
      delivery: formData.delivery,
      warranty: formData.warranty,
      brand: formData.brand,
      isFeatured,
      useDocumentService,
      images: images.map(img => ({
        thumbnail: img.preview,  // থাম্বনেইল (৪০০px, ৫০KB)
        full: URL.createObjectURL(img.full), // ফুল সাইজ
        width: img.width,
        height: img.height,
      })),
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
    
    // লোকাল স্টোরেজে সেভ
    setTimeout(() => {
      const existingPosts = JSON.parse(localStorage.getItem('amarDuniyaPosts') || '[]');
      existingPosts.push(postData);
      localStorage.setItem('amarDuniyaPosts', JSON.stringify(existingPosts));
      
      setIsSubmitting(false);
      
      if (useDocumentService) {
        router.push(`/documents/upload?postId=${postData.id}&postTitle=${encodeURIComponent(formData.title)}`);
      } else {
        alert('✅ আপনার পোস্ট সফলভাবে জমা দেওয়া হয়েছে!');
        router.push("/");
      }
    }, 800);
  }, [formData, images, isFeatured, useDocumentService, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 pb-8">
      <div className="max-w-2xl mx-auto px-3 md:px-4 py-4">
        
        {/* হেডার */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/20 via-orange-500/20 to-[#f85606]/20 rounded-3xl blur-xl"></div>
          <div className="relative flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white p-2.5 md:p-3 rounded-2xl shadow-lg border border-[#f85606]/20 active:scale-95 transition"
            >
              <ArrowLeft size={20} className="text-[#f85606]" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                নতুন পোস্ট দিন
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">আপনার পণ্য বিশ্ববাজারে তুলে ধরুন</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <Crown size={20} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* এরর মেসেজ */}
          {contentError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{contentError}</p>
            </div>
          )}

          {/* ছবি আপলোড */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center">
                <Camera size={16} className="text-[#f85606]" />
              </div>
              ছবি আপলোড করুন
              <span className="text-xs text-gray-400 font-normal">(সর্বোচ্চ ৪টি)</span>
            </label>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl overflow-hidden shadow-md group">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              
              {images.length < 4 && (
                <label className={`w-20 h-20 md:w-24 md:h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${
                  isUploading 
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                    : 'border-[#f85606]/30 hover:border-[#f85606] hover:bg-orange-50'
                }`}>
                  {isUploading ? (
                    <Loader2 size={24} className="text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <ImageUp size={24} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500 mt-0.5">আপলোড</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
            
            <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
              <span>✓ WebP ফরম্যাটে কম্প্রেস হবে</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>✓ ক্লিক করে বড় দেখা যাবে</span>
            </p>
          </div>

          {/* পণ্যের নাম */}
          <FormSection icon={<Tag size={16} className="text-[#f85606]" />} title="পণ্যের নাম" required>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="যেমন: iPhone 15 Pro Max - 128GB"
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
              required
            />
          </FormSection>

          {/* ব্র্যান্ড */}
          <FormSection icon={<BadgeCheck size={16} className="text-[#f85606]" />} title="ব্র্যান্ড">
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="যেমন: Apple, Samsung, Nike..."
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
            />
          </FormSection>

          {/* দাম ও অবস্থা */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <FormSection icon={<DollarSign size={16} className="text-[#f85606]" />} title="দাম (৳)" required>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="০"
                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
                required
              />
            </FormSection>
            
            <FormSection icon={<Package size={16} className="text-[#f85606]" />} title="অবস্থা" required>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
                required
              >
                <option value="new">✨ নতুন</option>
                <option value="old">📦 পুরাতন</option>
              </select>
            </FormSection>
          </div>

          {/* ক্যাটাগরি */}
          <FormSection icon={<FileText size={16} className="text-[#f85606]" />} title="ক্যাটাগরি" required>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
              required
            >
              <option value="">সিলেক্ট করুন</option>
              {rootCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            {subCategories.length > 0 && (
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm mt-3"
              >
                <option value="">সাব-ক্যাটাগরি (ঐচ্ছিক)</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.icon} {sub.name}</option>
                ))}
              </select>
            )}

            {!showNewCategory ? (
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="mt-3 text-sm text-[#f85606] flex items-center gap-1 hover:underline"
              >
                <PlusCircle size={14} />
                আপনার ক্যাটাগরি নেই? নতুন যোগ করুন
              </button>
            ) : (
              <div className="mt-3 p-3 md:p-4 bg-orange-50 rounded-xl">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="নতুন ক্যাটাগরির নাম"
                  className="w-full p-2.5 md:p-3 border border-gray-200 rounded-lg text-sm mb-2"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddNewCategory} className="bg-[#f85606] text-white px-3 py-2 rounded-lg text-sm">জমা দিন</button>
                  <button type="button" onClick={() => setShowNewCategory(false)} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">বাতিল</button>
                </div>
              </div>
            )}
          </FormSection>

          {/* ওয়ারেন্টি */}
          <FormSection icon={<Calendar size={16} className="text-[#f85606]" />} title="ওয়ারেন্টি">
            <select
              name="warranty"
              value={formData.warranty}
              onChange={handleChange}
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
            >
              <option value="">নেই</option>
              <option value="1">১ মাস</option>
              <option value="3">৩ মাস</option>
              <option value="6">৬ মাস</option>
              <option value="12">১ বছর</option>
              <option value="24">২ বছর</option>
            </select>
          </FormSection>

          {/* বিবরণ */}
          <FormSection icon={<FileText size={16} className="text-[#f85606]" />} title="বিবরণ">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="পণ্যের বিস্তারিত বিবরণ দিন..."
              className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm resize-none"
            />
          </FormSection>

          {/* ডেলিভারি */}
          <FormSection icon={<Truck size={16} className="text-[#f85606]" />} title="ডেলিভারি অপশন">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
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
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
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
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="delivery"
                  value="amar_duniya_delivery"
                  checked={formData.delivery === "amar_duniya_delivery"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#f85606]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#f85606]">🚚 আমার দুনিয়া ডেলিভারি</span>
                  <span className="bg-[#f85606] text-white text-[10px] px-2 py-0.5 rounded-full">নিরাপদ</span>
                </div>
              </label>
            </div>
            
            {formData.delivery === "amar_duniya_delivery" && (
              <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                <p className="text-xs text-gray-600">✓ আমাদের প্রতিনিধি পণ্য সংগ্রহ করে ক্রেতার কাছে পৌঁছে দিবে</p>
              </div>
            )}
          </FormSection>

          {/* ফোন ও লোকেশন */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <FormSection icon={<Phone size={16} className="text-[#f85606]" />} title="মোবাইল" required>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="০১XXXXXXXXX"
                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
                required
              />
            </FormSection>
            
            <FormSection icon={<MapPin size={16} className="text-[#f85606]" />} title="জেলা">
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition text-sm"
              >
                {BANGLADESH_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormSection>
          </div>

          {/* ডকুমেন্ট সার্ভিস */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useDocumentService}
                onChange={(e) => setUseDocumentService(e.target.checked)}
                className="w-5 h-5 text-[#f85606] rounded accent-[#f85606] mt-0.5"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <FileCheck size={18} className="text-[#f85606]" />
                  <span className="font-semibold text-gray-800">ডকুমেন্ট সার্ভিস</span>
                  <span className="bg-[#f85606] text-white text-[10px] px-2 py-0.5 rounded-full">পণ্যের ২%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  আমার দুনিয়া কর্তৃপক্ষ আপনার পণ্যের ডকুমেন্ট প্রোভাইড করবে।
                </p>
              </div>
            </label>
          </div>

          {/* ফিচার্ড */}
          <div 
            className={`rounded-2xl shadow-lg p-4 md:p-5 cursor-pointer transition border-2 ${
              isFeatured 
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-[#f85606]' 
                : 'bg-white border-gray-100'
            }`}
            onClick={() => !isFeatured && setShowFeaturedModal(true)}
          >
            <label className="flex items-start gap-3 cursor-pointer">
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
                className="w-5 h-5 text-[#f85606] rounded accent-[#f85606] mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Sparkles size={18} className="text-[#f85606]" />
                  <span className="font-bold text-gray-800">ফিচার্ড লিস্টিং</span>
                  <span className="bg-[#f85606] text-white text-[10px] px-2 py-0.5 rounded-full">১০০ টাকা</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">আপনার পোস্ট ৭ দিন হোমপেজের টপে থাকবে</p>
                {isFeatured && (
                  <p className="text-xs text-green-600 mt-2">✓ ফিচার্ড লিস্টিং সক্রিয়!</p>
                )}
              </div>
            </label>
          </div>

          {/* শর্তাবলী */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 md:p-5">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
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
            disabled={isSubmitting || isUploading}
            className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition disabled:opacity-50 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                পোস্ট হচ্ছে...
              </span>
            ) : isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                ছবি আপলোড হচ্ছে...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Crown size={18} />
                {useDocumentService ? "ডকুমেন্ট সার্ভিস সহ পোস্ট করুন" : "ফ্রি পোস্ট করুন"}
              </span>
            )}
          </button>
        </form>

        {/* পেমেন্ট মডাল */}
        <PaymentModal
          isOpen={showFeaturedModal}
          onClose={() => setShowFeaturedModal(false)}
          onSuccess={handleFeaturedSuccess}
          title="ফিচার্ড লিস্টিং"
          amount={100}
          description="আপনার পোস্ট ৭ দিন হোমপেজের টপে থাকবে"
        />
      </div>
    </div>
  );
}