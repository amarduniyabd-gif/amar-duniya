"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Camera, Trash2, User, MapPin, Briefcase, 
  Heart, Shield, Upload, FileText, Baby, HeartCrack, 
  Phone, Mail, Crown, Loader2, CheckCircle
} from "lucide-react";
// বাংলাদেশের জেলা
const bangladeshDistricts = [
  "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ",
  "কুষ্টিয়া", "যশোর", "কুমিল্লা", "নোয়াখালী", "বগুড়া", "পাবনা", "টাঙ্গাইল", "গাজীপুর",
  "নারায়ণগঞ্জ", "ফরিদপুর", "মাদারীপুর", "কক্সবাজার", "রাঙ্গামাটি", "বান্দরবান"
];

// WebP কম্প্রেশন (থাম্বনেইল + ফুল)
const compressImageWithThumbnail = async (file: File): Promise<{ thumbnail: File; full: File; preview: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        // থাম্বনেইল (৪০০px, ৫০KB)
        const thumbCanvas = document.createElement('canvas');
        let thumbWidth = originalWidth, thumbHeight = originalHeight;
        const maxSize = 400;
        if (thumbWidth > maxSize) { thumbHeight = (thumbHeight * maxSize) / thumbWidth; thumbWidth = maxSize; }
        if (thumbHeight > maxSize) { thumbWidth = (thumbWidth * maxSize) / thumbHeight; thumbHeight = maxSize; }
        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx?.drawImage(img, 0, 0, thumbWidth, thumbHeight);
        
        let thumbQuality = 0.7;
        let thumbDataUrl = thumbCanvas.toDataURL('image/webp', thumbQuality);
        while (thumbDataUrl.length > 50000 && thumbQuality > 0.25) {
          thumbQuality -= 0.05;
          thumbDataUrl = thumbCanvas.toDataURL('image/webp', thumbQuality);
        }
        
        // ফুল সাইজ (৮৫% কোয়ালিটি)
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = originalWidth;
        fullCanvas.height = originalHeight;
        const fullCtx = fullCanvas.getContext('2d');
        fullCtx?.drawImage(img, 0, 0);
        const fullDataUrl = fullCanvas.toDataURL('image/webp', 0.85);
        
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
          });
        }).catch(reject);
      };
      img.onerror = () => reject(new Error('Image load failed'));
    };
    reader.onerror = () => reject(new Error('File read failed'));
  });
};

export default function CreateMatrimonyProfilePage() {
  const router = useRouter();
  const [images, setImages] = useState<{ thumbnail: File; full: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "male", religion: "",
    village: "", district: "",
    profession: "", education: "", expectedIncome: "",
    height: "", weight: "", bloodGroup: "", complexion: "",
    maritalStatus: "unmarried", hasChildren: false, childrenCount: "",
    remarryWilling: "yes", phone: "", email: "", about: "", familyStatus: "",
    hobbies: "",
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (images.length + files.length > 3) {
      alert('সর্বোচ্চ ৩টি ছবি আপলোড করতে পারবেন');
      return;
    }
    
    setIsUploading(true);
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressed = await compressImageWithThumbnail(file);
        setImages(prev => [...prev, compressed]);
      } catch {
        alert('ছবি আপলোড ব্যর্থ!');
      }
    }
    setIsUploading(false);
    e.target.value = '';
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.age || parseInt(formData.age) < 18) newErrors.age = "বয়স কমপক্ষে ১৮ বছর";
    if (!formData.district.trim()) newErrors.district = "জেলা আবশ্যক";
    if (!formData.profession.trim()) newErrors.profession = "পেশা আবশ্যক";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "সঠিক ইমেইল দিন";
    if (formData.phone.trim() && !/^01[0-9]{9}$/.test(formData.phone)) newErrors.phone = "সঠিক মোবাইল নম্বর দিন";
    if (formData.hasChildren && !formData.childrenCount) newErrors.childrenCount = "সন্তানের সংখ্যা দিন";
    if (images.length === 0) newErrors.images = "কমপক্ষে একটি ছবি আপলোড করুন";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images.length]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) { alert("❌ অনুগ্রহ করে সব আবশ্যক তথ্য পূরণ করুন!"); return; }
    
    setIsSubmitting(true);
    
    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("প্রোফাইল তৈরি করতে লগইন করুন!");
        router.push('/login');
        return;
      }
      
      // ১. প্রোফাইল তৈরি
      const { data: profile, error: profileError } = await supabase
        .from('matrimony_profiles')
        .insert({
          user_id: user.id,
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          religion: formData.religion,
          village: formData.village,
          district: formData.district,
          profession: formData.profession,
          education: formData.education,
          expected_income: formData.expectedIncome,
          height: formData.height,
          weight: formData.weight,
          blood_group: formData.bloodGroup,
          complexion: formData.complexion,
          marital_status: formData.maritalStatus,
          has_children: formData.hasChildren,
          children_count: formData.hasChildren ? parseInt(formData.childrenCount) : null,
          remarry_willing: formData.remarryWilling,
          phone: formData.phone || null,
          email: formData.email || null,
          about: formData.about,
          family_status: formData.familyStatus,
          hobbies: formData.hobbies ? formData.hobbies.split(',').map(h => h.trim()) : [],
          status: 'pending',
        })
        .select()
        .single();
      
      if (profileError) throw profileError;
      
      // ২. ছবি আপলোড
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const thumbPath = `thumbnails/${profile.id}/${Date.now()}_${i}_thumb.webp`;
          const fullPath = `full/${profile.id}/${Date.now()}_${i}_full.webp`;
          
          await supabase.storage.from('matrimony-photos').upload(thumbPath, img.thumbnail);
          await supabase.storage.from('matrimony-photos').upload(fullPath, img.full);
          
          const { data: thumbUrl } = supabase.storage.from('matrimony-photos').getPublicUrl(thumbPath);
          const { data: fullUrl } = supabase.storage.from('matrimony-photos').getPublicUrl(fullPath);
          
          await supabase.from('matrimony_images').insert({
            profile_id: profile.id,
            thumbnail_url: thumbUrl.publicUrl,
            full_url: fullUrl.publicUrl,
            is_blurred: true,
            order_index: i,
          });
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/category/matrimony");
      }, 2000);
      
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('প্রোফাইল জমা দিতে সমস্যা হয়েছে!');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, images, validateForm, router]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">প্রোফাইল জমা হয়েছে!</h2>
          <p className="text-gray-500 mb-4">আপনার প্রোফাইল রিভিউ এর জন্য অপেক্ষমান আছে।</p>
          <Loader2 size={24} className="animate-spin text-[#f85606] mx-auto" />
        </div>
      </div>
    );
  }

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
              <span className="text-xs text-gray-400 ml-1">(সর্বোচ্চ ৩টি)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img src={img.preview} className="w-full h-full object-cover" alt={`প্রোফাইল ${idx + 1}`} />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition ${isUploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 cursor-pointer hover:border-[#f85606]'}`}>
                  {isUploading ? (
                    <Loader2 size={28} className="text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-400" />
                      <span className="text-[10px] text-gray-500">আপলোড</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
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
                <select name="district" value={formData.district} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.district ? 'border-red-500' : ''}`}>
                  <option value="">জেলা সিলেক্ট করুন *</option>
                  {bangladeshDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
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
              <input type="text" name="height" placeholder="উচ্চতা" value={formData.height} onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
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

          {/* যোগাযোগ */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone size={18} className="text-[#f85606]" /> যোগাযোগ 
              <span className="text-xs font-normal text-gray-400 ml-2">(অপশনাল)</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="tel" name="phone" placeholder="মোবাইল নম্বর" value={formData.phone} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.phone ? 'border-red-500' : ''}`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input type="email" name="email" placeholder="ইমেইল" value={formData.email} onChange={handleChange} className={`w-full p-3 bg-gray-50 border rounded-xl ${errors.email ? 'border-red-500' : ''}`} />
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

          <p className="text-xs text-gray-400 text-center">
            <span className="text-red-500">*</span> চিহ্নিত ফিল্ডগুলো আবশ্যক
          </p>

          <button 
            type="submit" 
            disabled={isSubmitting || isUploading} 
            className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                সাবমিট হচ্ছে...
              </>
            ) : isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                ছবি আপলোড হচ্ছে...
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