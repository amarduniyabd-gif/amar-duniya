"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ImageUp, Tag, DollarSign, Calendar, Clock, 
  X, Trash2, Gavel, Shield, AlertCircle, Upload, 
  ChevronRight, Sparkles
} from "lucide-react";

export default function CreateAuctionPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    startPrice: "",
    minIncrement: "",
    duration: "24",
    description: "",
    condition: "new",
    brand: "",
    location: "",
    warranty: "",
  });

  // WebP কম্প্রেশন ফাংশন
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 6) {
        alert('সর্বোচ্চ ৬টি ছবি আপলোড করতে পারবেন');
        return;
      }
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setImageErrors([`${file.name} ছবি নয়`]);
          continue;
        }
        const compressed = await compressImageToWebP(file);
        setImages(prev => [...prev, compressed]);
      }
      setImageErrors([]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/auction");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার - ব্যাক বাটন ঠিক করা */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.push("/auction")} 
            className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            নতুন নিলাম শুরু করুন
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ছবি আপলোড */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Upload size={18} className="text-[#f85606]" />
              পণ্যের ছবি
              <span className="text-xs text-gray-400 font-normal">(সর্বোচ্চ ৬টি)</span>
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm group">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f85606] hover:bg-orange-50 transition-all">
                  <ImageUp size={28} className="text-gray-400 group-hover:text-[#f85606]" />
                  <span className="text-[10px] text-gray-500">আপলোড</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            {imageErrors.length > 0 && <p className="text-red-500 text-xs mt-1">{imageErrors[0]}</p>}
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
              placeholder="যেমন: iPhone 15 Pro Max"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
              required
            />
          </div>

          {/* ব্র্যান্ড ও কন্ডিশন */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">ব্র্যান্ড</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Apple, Samsung..." className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">পণ্যের অবস্থা</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl">
                <option value="new">✨ নতুন</option>
                <option value="old">📦 পুরাতন</option>
              </select>
            </div>
          </div>

          {/* স্টার্টিং প্রাইস ও মিন ইনক্রিমেন্ট */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={18} className="text-[#f85606]" />
                স্টার্টিং প্রাইস (৳)
              </label>
              <input type="number" name="startPrice" value={formData.startPrice} onChange={handleChange} placeholder="০" className="w-full p-3 bg-gray-50 border rounded-xl" required />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Gavel size={18} className="text-[#f85606]" />
                মিনিমাম ইনক্রিমেন্ট (৳)
              </label>
              <input type="number" name="minIncrement" value={formData.minIncrement} onChange={handleChange} placeholder="১০০০" className="w-full p-3 bg-gray-50 border rounded-xl" required />
            </div>
          </div>

          {/* ওয়ারেন্টি ও লোকেশন */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">ওয়ারেন্টি</label>
              <select name="warranty" value={formData.warranty} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl">
                <option value="">নেই</option>
                <option value="1">১ মাস</option>
                <option value="3">৩ মাস</option>
                <option value="6">৬ মাস</option>
                <option value="12">১ বছর</option>
                <option value="24">২ বছর</option>
              </select>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">অঞ্চল</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="ঢাকা, চট্টগ্রাম..." className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          {/* ডিউরেশন */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock size={18} className="text-[#f85606]" />
              নিলামের সময়কাল
            </label>
            <select name="duration" value={formData.duration} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl">
              <option value="1">১ ঘন্টা</option>
              <option value="6">৬ ঘন্টা</option>
              <option value="12">১২ ঘন্টা</option>
              <option value="24">২৪ ঘন্টা</option>
              <option value="48">৪৮ ঘন্টা</option>
              <option value="72">৭২ ঘন্টা</option>
            </select>
          </div>

          {/* বিবরণ */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">পণ্যের বিবরণ</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="পণ্যের বিস্তারিত বিবরণ দিন..." />
          </div>

          {/* শর্তাবলী */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">নিলামের শর্তাবলী</p>
                <p className="text-xs text-amber-700 mt-1">✓ বিড ফ্রি • জিতলে ২% কমিশন • সুপার ফাস্ট</p>
              </div>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <Sparkles size={18} />
            {isSubmitting ? "নিলাম তৈরি হচ্ছে..." : "নিলাম শুরু করুন"}
          </button>

        </form>
      </div>
    </div>
  );
}