"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Camera, Trash2, User, MapPin, Briefcase, 
  Heart, Shield, Sparkles, Upload, FileText,
  Baby, HeartCrack, Phone, Mail, Crown, Award,
  EyeOff, Info, CheckCircle, AlertTriangle, Clock, Users
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

// বাংলাদেশের জেলা
const bangladeshDistricts = [
  "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ",
  "গাজীপুর", "নারায়ণগঞ্জ", "কুমিল্লা", "বগুড়া", "যশোর", "কুষ্টিয়া"
];

export default function CreateMatrimonyProfilePage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);
  const [profileType, setProfileType] = useState<'free' | 'premium'>('free');
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "male", religion: "ইসলাম",
    village: "", district: "",
    profession: "", education: "", expectedIncome: "",
    height: "", weight: "", bloodGroup: "", complexion: "",
    maritalStatus: "unmarried", hasChildren: false, childrenCount: "",
    remarryWilling: "yes", phone: "", email: "", about: "", familyStatus: "",
    hobbies: "",
    // 🆕 নতুন ফিল্ড
    fatherName: "", motherName: "", siblings: "",
    prayerTime: "", smoking: "no", occupationType: "job",
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ভ্যালিডেশন
    if (!formData.name || !formData.age) {
      alert("নাম এবং বয়স আবশ্যক!");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
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
              <p className="text-sm opacity-90 flex items-center gap-1">
                <Shield size={12} /> আপনার তথ্য গোপন রাখা হবে
              </p>
            </div>
          </div>
        </div>

        {/* 🆕 প্রোফাইল টাইপ সিলেকশন */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Crown size={18} className="text-[#f85606]" /> প্রোফাইল টাইপ
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProfileType('free')}
              className={`p-4 rounded-xl border-2 transition-all ${
                profileType === 'free' 
                  ? 'border-[#f85606] bg-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">🆓</div>
              <p className="font-semibold">ফ্রি</p>
              <p className="text-xs text-gray-500">বেসিক ফিচার</p>
            </button>
            <button
              type="button"
              onClick={() => setProfileType('premium')}
              className={`p-4 rounded-xl border-2 transition-all ${
                profileType === 'premium' 
                  ? 'border-[#f85606] bg-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">👑</div>
              <p className="font-semibold">প্রিমিয়াম</p>
              <p className="text-xs text-gray-500">১০০০ টাকা/মাস</p>
            </button>
          </div>
          {profileType === 'premium' && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl text-xs text-amber-700">
              <CheckCircle size={12} className="inline mr-1" /> টপ প্রায়োরিটি • বেশি ভিউ • ভেরিফাইড ব্যাজ
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ছবি */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Camera size={18} className="text-[#f85606]" />
              প্রোফাইল ছবি <span className="text-xs text-gray-400">(সর্বোচ্চ ৩টি, WebP)</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f85606]">
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500">আপলোড</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            {images.length === 0 && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> অন্তত একটি ছবি আবশ্যক
              </p>
            )}
          </div>

          {/* প্রাথমিক তথ্য */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#f85606]" /> প্রাথমিক তথ্য
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="name" placeholder="পূর্ণ নাম *" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" required />
              <input type="number" name="age" placeholder="বয়স *" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" required />
              <select name="gender" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
                <option value="male">পুরুষ</option>
                <option value="female">মহিলা</option>
              </select>
              <input type="text" name="religion" value={formData.religion} placeholder="ধর্ম" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          {/* 🆕 পরিবারের তথ্য */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#f85606]" /> পরিবারের তথ্য (ঐচ্ছিক)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="fatherName" placeholder="পিতার নাম" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="motherName" placeholder="মাতার নাম" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="siblings" placeholder="ভাই-বোন কতজন" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          {/* ঠিকানা */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#f85606]" /> ঠিকানা
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="village" placeholder="গ্রাম/থানা" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <select name="district" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
                <option value="">জেলা সিলেক্ট করুন</option>
                {bangladeshDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* পেশা */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-[#f85606]" /> পেশাগত তথ্য
            </h2>
            <div className="space-y-3">
              <select name="occupationType" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl">
                <option value="job">চাকরিজীবী</option>
                <option value="business">ব্যবসায়ী</option>
                <option value="student">শিক্ষার্থী</option>
                <option value="other">অন্যান্য</option>
              </select>
              <input type="text" name="profession" placeholder="পেশা" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="education" placeholder="শিক্ষাগত যোগ্যতা" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="expectedIncome" placeholder="আশানুরূপ আয় (মাসিক)" onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl" />
            </div>
          </div>

          {/* ব্যক্তিগত তথ্য */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={18} className="text-[#f85606]" /> ব্যক্তিগত তথ্য
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="height" placeholder="উচ্চতা (৫'৪'')" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="weight" placeholder="ওজন (কেজি)" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="bloodGroup" placeholder="ব্লাড গ্রুপ" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <input type="text" name="complexion" placeholder="গায়ের রং" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl" />
              <select name="prayerTime" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
                <option value="">নামাজ পড়েন?</option>
                <option value="regular">নিয়মিত</option>
                <option value="sometimes">মাঝে মাঝে</option>
                <option value="no">না</option>
              </select>
              <select name="smoking" onChange={handleChange} className="p-3 bg-gray-50 border rounded-xl">
                <option value="no">ধূমপান করি না</option>
                <option value="yes">ধূমপান করি</option>
                <option value="sometimes">মাঝে মাঝে</option>
              </select>
              <input type="text" name="familyStatus" placeholder="পারিবারিক অবস্থা" onChange={handleChange} className="col-span-2 p-3 bg-gray-50 border rounded-xl" />
              <textarea name="hobbies" placeholder="আগ্রহ (কমা দিয়ে আলাদা করুন)" onChange={handleChange} className="col-span-2 p-3 bg-gray-50 border rounded-xl" rows={2} />
            </div>
          </div>

          {/* বিবাহ সংক্রান্ত */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-lg p-5">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HeartCrack size={18} className="text-[#f85606]" /> বিবাহ সংক্রান্ত তথ্য
            </h2>
            <div className="space-y-3">
              <select name="maritalStatus" onChange={handleChange} className="w-full p-3 bg-white border rounded-xl">
                <option value="unmarried">অবিবাহিত</option>
                <option value="divorced">ডিভোর্সড</option>
                <option value="widowed">বিধবা/বিধুর</option>
              </select>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="hasChildren" onChange={handleChange} className="w-4 h-4" /> 
                <span>সন্তান আছে</span>
              </label>
              {formData.hasChildren && (
                <input type="number" name="childrenCount" placeholder="কয়টি সন্তান?" onChange={handleChange} className="w-full p-3 bg-white border rounded-xl" />
              )}
              <select name="remarryWilling" onChange={handleChange} className="w-full p-3 bg-white border rounded-xl">
                <option value="yes">পুনরায় বিয়ে করতে চান</option>
                <option value="no">পুনরায় বিয়ে করতে চান না</option>
                <option value="undecided">ভবিষ্যতে ভাবছি</option>
              </select>
            </div>
          </div>

          {/* যোগাযোগ - 🆕 মোবাইল নাম্বার ঐচ্ছিক */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Phone size={18} className="text-[#f85606]" /> যোগাযোগ
              </h2>
              <button 
                type="button" 
                onClick={() => setShowPhoneInfo(!showPhoneInfo)}
                className="text-gray-400 hover:text-[#f85606] transition"
              >
                <Info size={16} />
              </button>
            </div>
            
            {showPhoneInfo && (
              <div className="mb-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
                <p className="flex items-center gap-1">
                  <EyeOff size={12} /> আপনার ফোন নাম্বার শুধু পেমেন্ট করা ইউজাররাই দেখতে পারবে।
                </p>
                <p className="flex items-center gap-1 mt-1">
                  <Clock size={12} /> নাম্বার না দিলে ইমেইলের মাধ্যমে যোগাযোগ করতে হবে।
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  মোবাইল নম্বর <span className="text-gray-400">(ঐচ্ছিক)</span>
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="০১XXXXXXXXX" 
                  className="w-full p-3 bg-gray-50 border rounded-xl" 
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  ✓ না দিলেও প্রোফাইল তৈরি হবে
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  ইমেইল <span className="text-gray-400">(ঐচ্ছিক)</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com" 
                  className="w-full p-3 bg-gray-50 border rounded-xl" 
                />
              </div>
            </div>
            
            {!formData.phone && !formData.email && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> ফোন বা ইমেইল যেকোনো একটি দেওয়ার পরামর্শ দেওয়া হচ্ছে
              </p>
            )}
          </div>

          {/* নিজের সম্পর্কে */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={18} className="text-[#f85606]" /> নিজের সম্পর্কে
            </label>
            <textarea 
              name="about" 
              value={formData.about}
              onChange={handleChange} 
              rows={4} 
              className="w-full p-3 bg-gray-50 border rounded-xl" 
              placeholder="নিজের সম্পর্কে একটু বলুন... আপনার ব্যক্তিত্ব, পছন্দ-অপছন্দ, জীবনযাপন ইত্যাদি"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {formData.about.length} / 500 অক্ষর
            </p>
          </div>

          {/* গোপনীয়তা */}
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">গোপনীয়তা সুরক্ষিত</p>
                <p className="text-xs text-blue-700">
                  আপনার তথ্য সম্পূর্ণ গোপন রাখা হবে। ছবি ও ব্যক্তিগত তথ্য দেখতে ৫০০ টাকা পেমেন্ট করতে হবে।
                </p>
              </div>
            </div>
          </div>

          {/* 🆕 প্রিভিউ ব্যানার */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <Sparkles size={12} /> প্রোফাইল জমা দেওয়ার পর অ্যাডমিন অ্যাপ্রুভ করলে পাবলিশ হবে
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || images.length === 0} 
            className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>⏳ সাবমিট হচ্ছে...</>
            ) : (
              <>
                {profileType === 'premium' ? <Crown size={18} /> : <Award size={18} />}
                {profileType === 'premium' ? 'প্রিমিয়াম প্রোফাইল জমা দিন' : 'ফ্রি প্রোফাইল জমা দিন'}
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}