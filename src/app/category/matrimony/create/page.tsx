"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Camera, Trash2, User, MapPin, Briefcase, 
  Heart, Shield, Sparkles, Upload, FileText,
  Baby, HeartCrack, Phone, Mail, Crown, Award
} from "lucide-react";

// WebP কম্প্রেশন
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
        const maxSize = 400;
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

export default function CreateMatrimonyProfilePage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "male", religion: "",
    village: "", district: "",
    profession: "", education: "", expectedIncome: "",
    height: "", weight: "", bloodGroup: "", complexion: "",
    maritalStatus: "unmarried", hasChildren: false, childrenCount: "",
    remarryWilling: "yes", phone: "", email: "", about: "", familyStatus: "",
    hobbies: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 3) {
        alert('সর্বোচ্চ ৩টি ছবি আপলোড করতে পারবেন');
        return;
      }
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageToWebP(file);
        setImages(prev => [...prev, compressed]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // ক্লিয়ার এরর
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ ভ্যালিডেশন ফাংশন (মোবাইল অপশনাল)
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.age || parseInt(formData.age) < 18) newErrors.age = "বয়স কমপক্ষে ১৮ বছর হতে হবে";
    if (!formData.district.trim()) newErrors.district = "জেলা আবশ্যক";
    if (!formData.profession.trim()) newErrors.profession = "পেশা আবশ্যক";
    
    // ✅ ইমেইল ভ্যালিডেশন (অপশনাল, কিন্তু দিলে সঠিক হতে হবে)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "সঠিক ইমেইল দিন";
    }
    
    // ✅ মোবাইল ভ্যালিডেশন (অপশনাল, কিন্তু দিলে সঠিক হতে হবে)
    if (formData.phone.trim() && !/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)";
    }
    
    // ✅ সন্তান থাকলে সংখ্যা আবশ্যক
    if (formData.hasChildren && !formData.childrenCount) {
      newErrors.childrenCount = "সন্তানের সংখ্যা দিন";
    }
    
    // ✅ ছবি আবশ্যক
    if (images.length === 0) {
      newErrors.images = "কমপক্ষে একটি ছবি আপলোড করুন";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("❌ অনুগ্রহ করে সব আবশ্যক তথ্য পূরণ করুন!");
      return;
    }
    
    setIsSubmitting(true);
    
    // ডেমো সাবমিট
    setTimeout(() => {
      setIsSubmitting(false);
      alert("✅ আপনার প্রোফাইল সফলভাবে জমা দেওয়া হয়েছে!");
      router.push("/category/matrimony");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">নতুন প্রোফাইল তৈরি করুন</h1>
              <p className="text-sm opacity-90">আপনার তথ্য গোপন রাখা হবে</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ছবি */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Camera size={18} className="text-[#f85606]" />
              প্রোফাইল ছবি <span className="text-red-500">*</span> 
              <span className="text-xs text-gray-400 ml-1">(সর্বোচ্চ ৩টি, WebP)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt={`প্রোফাইল ${idx + 1}`} />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f85606] transition">
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500">আপলোড</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
          </div>

          {/* প্রাথমিক তথ্য */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#f85606]" /> প্রাথমিক তথ্য
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" name="name" placeholder="পূর্ণ নাম *" value={formData.name} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input type="number" name="age" placeholder="বয়স *" value={formData.age} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.age ? 'border-red-500' : ''}`} />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
              <select name="gender" value={formData.gender} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
              </select>
              <input type="text" name="religion" placeholder="ধর্ম" value={formData.religion} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          {/* ঠিকানা */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#f85606]" /> ঠিকানা
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="village" placeholder="গ্রাম/থানা" value={formData.village} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <div>
                <input type="text" name="district" placeholder="জেলা *" value={formData.district} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.district ? 'border-red-500' : ''}`} />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>
            </div>
          </div>

          {/* পেশা */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-[#f85606]" /> পেশাগত তথ্য
            </h2>
            <div className="space-y-3">
              <div>
                <input type="text" name="profession" placeholder="পেশা *" value={formData.profession} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.profession ? 'border-red-500' : ''}`} />
                {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession}</p>}
              </div>
              <input type="text" name="education" placeholder="শিক্ষাগত যোগ্যতা" value={formData.education} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="expectedIncome" placeholder="আশানুরূপ আয় (মাসিক)" value={formData.expectedIncome} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          {/* ব্যক্তিগত তথ্য */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={18} className="text-[#f85606]" /> ব্যক্তিগত তথ্য
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="height" placeholder="উচ্চতা (৫'৪'')" value={formData.height} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="weight" placeholder="ওজন" value={formData.weight} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="bloodGroup" placeholder="ব্লাড গ্রুপ" value={formData.bloodGroup} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="complexion" placeholder="গায়ের রং" value={formData.complexion} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="familyStatus" placeholder="পারিবারিক অবস্থা" value={formData.familyStatus} onChange={handleChange} className="col-span-2 p-3 bg-gray-50 border rounded-xl" />
              <textarea name="hobbies" placeholder="আগ্রহ (কমা দিয়ে আলাদা করুন)" value={formData.hobbies} onChange={handleChange} className="col-span-2 p-3 bg-gray-50 border rounded-xl" rows={2} />
            </div>
          </div>

          {/* বিবাহ সংক্রান্ত */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HeartCrack size={18} className="text-[#f85606]" /> বিবাহ সংক্রান্ত তথ্য
            </h2>
            <div className="space-y-3">
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-3 bg-white border rounded-xl">
                <option value="unmarried">অবিবাহিত</option>
                <option value="divorced">ডিভোর্সড</option>
                <option value="widowed">বিধবা/বিধুর</option>
              </select>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="hasChildren" checked={formData.hasChildren} onChange={handleChange} className="w-4 h-4" /> 
                <span>সন্তান আছে</span>
              </label>
              {formData.hasChildren && (
                <div>
                  <input type="number" name="childrenCount" placeholder="কয়টি সন্তান? *" value={formData.childrenCount} onChange={handleChange} className={`w-full p-3 bg-white border rounded-xl ${errors.childrenCount ? 'border-red-500' : ''}`} />
                  {errors.childrenCount && <p className="text-red-500 text-xs mt-1">{errors.childrenCount}</p>}
                </div>
              )}
              <select name="remarryWilling" value={formData.remarryWilling} onChange={handleChange} className="w-full p-3 bg-white border rounded-xl">
                <option value="yes">পুনরায় বিয়ে করতে চান</option>
                <option value="no">পুনরায় বিয়ে করতে চান না</option>
                <option value="undecided">ভবিষ্যতে ভাবছি</option>
              </select>
            </div>
          </div>

          {/* যোগাযোগ - ✅ মোবাইল অপশনাল */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone size={18} className="text-[#f85606]" /> যোগাযোগ 
              <span className="text-xs font-normal text-gray-400 ml-2">(অপশনাল)</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="মোবাইল নম্বর (অপশনাল)" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.phone ? 'border-red-500' : ''}`} 
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="ইমেইল (অপশনাল)" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.email ? 'border-red-500' : ''}`} 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* নিজের সম্পর্কে */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={18} className="text-[#f85606]" /> নিজের সম্পর্কে
            </label>
            <textarea name="about" value={formData.about} onChange={handleChange} rows={4} className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="নিজের সম্পর্কে একটু বলুন..." />
          </div>

          {/* গোপনীয়তা */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">গোপনীয়তা সুরক্ষিত</p>
                <p className="text-xs text-blue-700">আপনার তথ্য সম্পূর্ণ গোপন রাখা হবে। ছবি ও ব্যক্তিগত তথ্য দেখতে ৫০০ টাকা পেমেন্ট করতে হবে।</p>
              </div>
            </div>
          </div>

          {/* ✅ আবশ্যক চিহ্নিত নোট */}
          <p className="text-xs text-gray-400 text-center">
            <span className="text-red-500">*</span> চিহ্নিত ফিল্ডগুলো আবশ্যক
          </p>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                সাবমিট হচ্ছে...
              </>
            ) : (
              <>
                <Crown size={18} /> প্রোফাইল জমা দিন
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}