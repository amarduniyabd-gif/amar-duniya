"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, Lock, CreditCard, MapPin, Briefcase, Phone, ShieldCheck, CheckCircle,
  X, Heart, Star, MessageCircle, PlusCircle, Share2, Bookmark,
  Key, Wallet, Crown, Fingerprint, Baby, Diamond, Gem
} from 'lucide-react';

// ============ কনস্ট্যান্ট ============
const bangladeshDistricts = [
  "ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সীগঞ্জ", 
  "ফরিদপুর", "মাদারীপুর", "শরীয়তপুর", "রাজবাড়ী", "গোপালগঞ্জ",
  "চট্টগ্রাম", "কুমিল্লা", "ফেনী", "ব্রাহ্মণবাড়িয়া", "রাঙ্গামাটি", "নোয়াখালী", 
  "লক্ষ্মীপুর", "চাঁদপুর", "কক্সবাজার", "খাগড়াছড়ি", "বান্দরবান",
  "রাজশাহী", "নাটোর", "নওগাঁ", "চাঁপাইনবাবগঞ্জ", "পাবনা", "সিরাজগঞ্জ", "বগুড়া", "জয়পুরহাট",
  "খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "মাগুরা", "নড়াইল", "ঝিনাইদহ", 
  "কুষ্টিয়া", "চুয়াডাঙ্গা", "মেহেরপুর",
  "বরিশাল", "পিরোজপুর", "ঝালকাঠি", "বরগুনা", "পটুয়াখালী", "ভোলা",
  "সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ",
  "রংপুর", "দিনাজপুর", "কুড়িগ্রাম", "গাইবান্ধা", "লালমনিরহাট", "নীলফামারী", 
  "পঞ্চগড়", "ঠাকুরগাঁও",
  "ময়মনসিংহ", "জামালপুর", "শেরপুর", "নেত্রকোণা"
];

type Profile = {
  id: number;
  name: string;
  age: number;
  village: string;
  district: string;
  profession: string;
  education: string;
  height: string;
  weight: string;
  religion: string;
  phone: string;
  email: string;
  isMale: boolean;
  hasPhoto: boolean;
  photoBlurred: boolean;
  isVerified: boolean;
  isPremium: boolean;
  expectedIncome: string;
  familyStatus: string;
  about: string;
  createdAt: string;
  maritalStatus: "unmarried" | "divorced" | "widowed";
  hasChildren: boolean;
  childrenCount?: number;
  remarryWilling: "yes" | "no" | "undecided";
  bloodGroup?: string;
  complexion?: string;
  hobbies?: string[];
  views: number;
  interests: number;
};

const dummyProfiles: Profile[] = [
  {
    id: 1, name: "রহিমা খাতুন", age: 24, village: "সোনারগাঁও", district: "নারায়ণগঞ্জ",
    profession: "সফটওয়্যার ইঞ্জিনিয়ার", education: "বিএসসি (সিএসই)", height: "৫'৪\"", weight: "৫০ কেজি",
    religion: "ইসলাম", phone: "০১৭XXXXXXXX", email: "rahima@gmail.com", isMale: false, hasPhoto: true,
    photoBlurred: true, isVerified: true, isPremium: true, expectedIncome: "৬০,০০০ - ৮০,০০০",
    familyStatus: "মধ্যবিত্ত", about: "সরল ও শিক্ষিত পরিবারের মেয়ে। নিজের পায়ে দাঁড়াতে চাই।",
    createdAt: "২০২৪-০১-১৫", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "O+", complexion: "ফর্সা", hobbies: ["বই পড়া", "ভ্রমণ", "রান্না"], views: 1240, interests: 56,
  },
  {
    id: 2, name: "আব্দুল করিম", age: 28, village: "গাজীপুর সদর", district: "গাজীপুর",
    profession: "ব্যবসায়ী", education: "এমবিএ", height: "৫'৮\"", weight: "৬৫ কেজি",
    religion: "ইসলাম", phone: "০১৮XXXXXXXX", email: "karim@gmail.com", isMale: true, hasPhoto: true,
    photoBlurred: true, isVerified: true, isPremium: false, expectedIncome: "১,০০,০০০ - ১,৫০,০০০",
    familyStatus: "উচ্চ মধ্যবিত্ত", about: "নিজের ব্যবসা আছে। সৎ ও দায়িত্বশীল জীবনসঙ্গী খুঁজছি।",
    createdAt: "২০২৪-০২-১০", maritalStatus: "divorced", hasChildren: true, childrenCount: 1,
    remarryWilling: "yes", bloodGroup: "B+", complexion: "মাঝারি", hobbies: ["ব্যবসা", "গাড়ি চালানো", "ক্রিকেট"],
    views: 890, interests: 34,
  },
  {
    id: 3, name: "ফাতেমা বেগম", age: 22, village: "কুমিল্লা সদর", district: "কুমিল্লা",
    profession: "চিকিৎসা শিক্ষার্থী", education: "এমবিবিএস (চলমান)", height: "৫'২\"", weight: "৪৮ কেজি",
    religion: "ইসলাম", phone: "০১৯XXXXXXXX", email: "fatema@gmail.com", isMale: false, hasPhoto: true,
    photoBlurred: true, isVerified: false, isPremium: false, expectedIncome: "অধ্যায়নরত",
    familyStatus: "মধ্যবিত্ত", about: "উচ্চাকাঙ্ক্ষী ডাক্তার। পড়াশোনা শেষে চাকরি করব।",
    createdAt: "২০২৪-০৩-০৫", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "A+", complexion: "শ্যামলা", hobbies: ["গান শোনা", "চলচ্চিত্র", "ঘুরতে ভালোবাসি"],
    views: 2100, interests: 89,
  },
  {
    id: 4, name: "শাহিনুর রহমান", age: 26, village: "মিরপুর", district: "ঢাকা",
    profession: "ব্যাংকার", education: "এমবিএ", height: "৫'৬\"", weight: "৫৮ কেজি",
    religion: "ইসলাম", phone: "০১৬XXXXXXXX", email: "shahinur@gmail.com", isMale: true, hasPhoto: true,
    photoBlurred: true, isVerified: true, isPremium: true, expectedIncome: "৭০,০০০ - ৯০,০০০",
    familyStatus: "মধ্যবিত্ত", about: "ব্যাংকে চাকরি করি। সাদামাটা জীবনযাপন পছন্দ করি।",
    createdAt: "২০২৪-০৩-১০", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "AB+", complexion: "ফর্সা", hobbies: ["ক্রিকেট", "ভ্রমণ"], views: 567, interests: 23,
  },
  {
    id: 5, name: "নাজমা বেগম", age: 25, village: "রাজশাহী সদর", district: "রাজশাহী",
    profession: "সরকারি চাকরি", education: "স্নাতকোত্তর", height: "৫'৩\"", weight: "৫২ কেজি",
    religion: "ইসলাম", phone: "০১৭XXXXXXXX", email: "nazma@gmail.com", isMale: false, hasPhoto: true,
    photoBlurred: true, isVerified: false, isPremium: false, expectedIncome: "৪০,০০০ - ৫০,০০০",
    familyStatus: "মধ্যবিত্ত", about: "সরকারি চাকরি করি। ভালো মানুষ খুঁজছি।",
    createdAt: "২০২৪-০৩-১৫", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "O-", complexion: "মাঝারি", hobbies: ["রান্না", "সেলাই"], views: 432, interests: 18,
  },
  {
    id: 6, name: "হাসান মিয়া", age: 30, village: "সিলেট সদর", district: "সিলেট",
    profession: "ইঞ্জিনিয়ার", education: "বিএসসি (সিভিল)", height: "৫'৯\"", weight: "৭০ কেজি",
    religion: "ইসলাম", phone: "০১৮XXXXXXXX", email: "hasan@gmail.com", isMale: true, hasPhoto: true,
    photoBlurred: true, isVerified: true, isPremium: false, expectedIncome: "৮০,০০০ - ১,০০,০০০",
    familyStatus: "উচ্চ মধ্যবিত্ত", about: "বিদেশে কাজ করি। বাংলাদেশে স্থায়ী হতে চাই।",
    createdAt: "২০২৪-০৩-২০", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "B-", complexion: "শ্যামলা", hobbies: ["ভ্রমণ", "ছবি তোলা"], views: 678, interests: 45,
  },
];

// ============ হেল্পার ফাংশন ============
const getMaritalStatusText = (status: string) => {
  switch(status) {
    case "unmarried": return { text: "অবিবাহিত", icon: "💚", color: "bg-green-100 text-green-700" };
    case "divorced": return { text: "ডিভোর্সড", icon: "💔", color: "bg-orange-100 text-orange-700" };
    case "widowed": return { text: "বিধবা/বিধুর", icon: "🕊️", color: "bg-purple-100 text-purple-700" };
    default: return { text: "অবিবাহিত", icon: "💚", color: "bg-green-100 text-green-700" };
  }
};

const getRemarryWillingText = (status: string) => {
  switch(status) {
    case "yes": return { text: "পুনরায় বিয়ে করতে চান", icon: "✅", color: "bg-green-100 text-green-700" };
    case "no": return { text: "পুনরায় বিয়ে করতে চান না", icon: "❌", color: "bg-red-100 text-red-700" };
    case "undecided": return { text: "ভবিষ্যতে ভাবছি", icon: "🤔", color: "bg-yellow-100 text-yellow-700" };
    default: return { text: "পুনরায় বিয়ে করতে চান", icon: "✅", color: "bg-green-100 text-green-700" };
  }
};

// ============ কনগ্রাচুলেশন মডাল (মেমোইজড) ============
const CongratulationsModal = memo(({ onClose, profileName }: { onClose: () => void; profileName: string }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-orange-200 text-center">
        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-4xl">🎉</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">অভিনন্দন!</h2>
          <p className="text-gray-600 mt-2">আপনি সফলভাবে <span className="font-bold text-[#f85606]">৫০০ টাকা</span> পেমেন্ট করেছেন!</p>
          <div className="my-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-800">✨ এখন আপনি সম্পূর্ণ প্রোফাইল দেখতে পারবেন:</p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1 text-left">
              <li className="flex items-center gap-2">✅ নাম, ছবি, ফোন, ঠিকানা</li>
              <li className="flex items-center gap-2">✅ ব্যক্তির সাথে সরাসরি চ্যাট</li>
              <li className="flex items-center gap-2">✅ প্রোফাইল শেয়ার</li>
            </ul>
          </div>
          <div className="bg-yellow-50 rounded-xl p-2 mb-4">
            <p className="text-xs text-yellow-700">🔒 ছবি ডাউনলোড বা স্ক্রিনশট নেওয়া যাবে না।</p>
          </div>
          <button onClick={onClose} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold">
            প্রোফাইল দেখুন
          </button>
        </div>
      </div>
    </div>
  );
});
CongratulationsModal.displayName = 'CongratulationsModal';

// ============ ইনফো মডাল ============
const InfoModal = memo(({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">গুরুত্বপূর্ণ তথ্য</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>
      <p className="text-sm text-gray-600 mb-4">আপনি <span className="font-bold text-[#f85606]">৫০০ টাকা</span> পেমেন্ট করে এই প্রোফাইলটি দেখতে যাচ্ছেন।</p>
      <div className="space-y-3 mb-4">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-sm font-semibold text-green-800">✅ যা করতে পারবেন:</p>
          <ul className="text-xs text-green-700 mt-1 space-y-1">
            <li>• প্রোফাইলের নাম, ছবি, ফোন, ঠিকানা দেখতে পারবেন</li>
            <li>• ব্যক্তির সাথে সরাসরি চ্যাট করতে পারবেন</li>
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-3">
          <p className="text-sm font-semibold text-red-800">❌ যা করতে পারবেন না:</p>
          <ul className="text-xs text-red-700 mt-1 space-y-1">
            <li>• ছবি ডাউনলোড করতে পারবেন না</li>
            <li>• ছবি স্ক্রিনশট করে শেয়ার করা নিষিদ্ধ</li>
          </ul>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onConfirm} className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold">আমি বুঝতে পেরেছি</button>
        <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
      </div>
    </div>
  </div>
));
InfoModal.displayName = 'InfoModal';

// ============ পেমেন্ট মডাল ============
const PaymentModal = memo(({ onClose, onSuccess, price }: { onClose: () => void; onSuccess: () => void; profileName: string; price: number; profileId: number }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  const handlePayment = useCallback(() => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
  }, [onSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">প্রোফাইল আনলক করুন</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-4 text-center">
          <p className="text-3xl font-bold text-[#f85606]">{price} টাকা</p>
          <p className="text-xs text-gray-500 mt-1">একবার পেমেন্ট করলে সম্পূর্ণ প্রোফাইল দেখতে পাবেন</p>
        </div>
        <div className="space-y-3">
          {['bkash', 'nagad', 'rocket'].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${
                paymentMethod === method ? "border-[#f85606] bg-orange-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  method === 'bkash' ? 'bg-pink-500' : method === 'nagad' ? 'bg-orange-500' : 'bg-blue-500'
                }`}>
                  {method === 'bkash' ? 'বি' : method === 'nagad' ? 'ন' : 'র'}
                </div>
                <span className="font-medium">{method === 'bkash' ? 'bKash' : method === 'nagad' ? 'নগদ' : 'রকেট'}</span>
              </div>
              {paymentMethod === method && <CheckCircle size={18} className="text-[#f85606]" />}
            </button>
          ))}
        </div>
        <button onClick={handlePayment} disabled={isProcessing} className="w-full mt-5 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
          {isProcessing ? "প্রসেসিং..." : `${price} টাকা পেমেন্ট করুন`}
        </button>
      </div>
    </div>
  );
});
PaymentModal.displayName = 'PaymentModal';

// ============ প্রোফাইল কার্ড (মেমোইজড) ============
const ProfileCard = memo(({ profile }: { profile: Profile; onViewDetails: (id: number) => void }) => {
  const router = useRouter();
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const marital = useMemo(() => getMaritalStatusText(profile.maritalStatus), [profile.maritalStatus]);
  const remarry = useMemo(() => getRemarryWillingText(profile.remarryWilling), [profile.remarryWilling]);

  // ক্লায়েন্ট সাইড চেক
  useEffect(() => {
    setMounted(true);
  }, []);

  // পেইড স্ট্যাটাস চেক (মেমোইজড)
  const isPaid = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const paidProfiles = JSON.parse(localStorage.getItem('paidMatrimonyProfiles') || '[]');
    return paidProfiles.includes(profile.id);
  }, [profile.id]);

  // সেভড স্ট্যাটাস চেক
  const isAlreadySaved = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const savedProfiles = JSON.parse(localStorage.getItem('savedMatrimonyProfiles') || '[]');
    return savedProfiles.includes(profile.id);
  }, [profile.id]);

  useEffect(() => {
    if (isPaid) {
      setShowFullInfo(true);
    }
    setIsSaved(isAlreadySaved);
  }, [isPaid, isAlreadySaved]);

  const handleViewDetails = useCallback(() => {
    if (!isPaid && !showFullInfo) {
      setShowInfoModal(true);
    }
  }, [isPaid, showFullInfo]);

  const handleConfirmPayment = useCallback(() => {
    setShowInfoModal(false);
    setShowPaymentModal(true);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setShowFullInfo(true);
    setShowCongratsModal(true);
    const paidProfiles = JSON.parse(localStorage.getItem('paidMatrimonyProfiles') || '[]');
    if (!paidProfiles.includes(profile.id)) {
      paidProfiles.push(profile.id);
      localStorage.setItem('paidMatrimonyProfiles', JSON.stringify(paidProfiles));
    }
  }, [profile.id]);

  const handleChat = useCallback(() => {
    if (isPaid || showFullInfo) {
      router.push(`/chat/${profile.id}?type=matrimony&name=${encodeURIComponent(profile.name)}`);
    }
  }, [isPaid, showFullInfo, router, profile.id, profile.name]);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    const savedProfiles = JSON.parse(localStorage.getItem('savedMatrimonyProfiles') || '[]');
    if (isAlreadySaved) {
      const newSaved = savedProfiles.filter((id: number) => id !== profile.id);
      localStorage.setItem('savedMatrimonyProfiles', JSON.stringify(newSaved));
      setIsSaved(false);
    } else {
      savedProfiles.push(profile.id);
      localStorage.setItem('savedMatrimonyProfiles', JSON.stringify(savedProfiles));
      setIsSaved(true);
    }
  }, [isAlreadySaved, profile.id]);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/category/matrimony?id=${profile.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.name,
          text: `${profile.name} - পাত্র/পাত্রী প্রোফাইল | বয়স: ${profile.age} বছর`,
          url: url,
        });
        return;
      } catch {}
    }
    
    try {
      await navigator.clipboard.writeText(url);
      alert("✅ প্রোফাইল লিংক কপি হয়েছে!");
    } catch {
      alert("🔗 লিংকটি কপি করুন: " + url);
    }
  }, [profile.id, profile.name, profile.age]);

  if (!mounted) return null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-1">
        <div className="relative h-52 bg-gradient-to-br from-orange-100 to-orange-200">
          {(isPaid || showFullInfo) ? (
            <div className="w-full h-full flex items-center justify-center relative" onContextMenu={(e) => e.preventDefault()}>
              <div className="text-8xl">{profile.isMale ? "👨‍🦱" : "👩‍🦰"}</div>
              <div className="absolute bottom-2 left-2 text-[8px] text-white/50 bg-black/30 px-1 rounded">© আমার দুনিয়া</div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm">
              <Lock size={28} className="text-white mb-2" />
              <button onClick={handleViewDetails} className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:scale-105 transition">
                <Eye size={16} /> প্রোফাইল দেখুন (৫০০ টাকা)
              </button>
            </div>
          )}
          {profile.isPremium && (isPaid || showFullInfo) && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Gem size={10} /> প্রিমিয়াম
            </div>
          )}
          {profile.isVerified && (isPaid || showFullInfo) && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle size={10} /> ভেরিফাইড
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-xl text-gray-800">{(isPaid || showFullInfo) ? profile.name : "***"}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <span>{profile.age} বছর</span><span>•</span><span>{profile.religion}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={handleLike} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                <Heart size={16} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} />
              </button>
              <button onClick={handleShare} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                <Share2 size={16} className="text-gray-400" />
              </button>
              {(isPaid || showFullInfo) && (
                <button onClick={handleSave} className="p-1.5 rounded-full hover:bg-gray-100 transition">
                  <Bookmark size={16} className={isSaved ? "text-[#f85606] fill-[#f85606]" : "text-gray-400"} />
                </button>
              )}
            </div>
          </div>
          
          {(isPaid || showFullInfo) ? (
            <>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${marital.color}`}>
                  <span>{marital.icon}</span> {marital.text}
                </span>
                {profile.hasChildren && (
                  <span className="inline-flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                    <Baby size={10} /> {profile.childrenCount} টি সন্তান
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${remarry.color}`}>
                  <span>{remarry.icon}</span> {remarry.text}
                </span>
              </div>
              
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><MapPin size={14} className="text-[#f85606]" /><span>{profile.village}, {profile.district}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Briefcase size={14} className="text-[#f85606]" /><span>{profile.profession}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Star size={14} className="text-[#f85606]" /><span>{profile.education}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Diamond size={14} className="text-[#f85606]" /><span>আয়: {profile.expectedIncome}/মাস</span></div>
              </div>
              
              {profile.about && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 italic">"{profile.about}"</p>
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span>👁️ {profile.views}</span><span>•</span><span>❤️ {profile.interests}</span>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button onClick={() => setShowPhone(!showPhone)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  <Phone size={14} /> {showPhone ? profile.phone : "ফোন দেখুন"}
                </button>
                <button onClick={handleChat} className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  <MessageCircle size={14} /> মেসেজ
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-sm text-gray-500">🔒 সম্পূর্ণ প্রোফাইল দেখতে</p>
              <p className="text-xs text-[#f85606] mt-2">মাত্র ৫০০ টাকায় আনলক করুন</p>
            </div>
          )}
        </div>
      </div>
      
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} onConfirm={handleConfirmPayment} />}
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          onSuccess={handlePaymentSuccess} 
          profileName={profile.name} 
          price={500} 
          profileId={profile.id} 
        />
      )}
      {showCongratsModal && <CongratulationsModal onClose={() => setShowCongratsModal(false)} profileName={profile.name} />}
    </>
  );
});
ProfileCard.displayName = 'ProfileCard';

// ============ মেইন পেজ ============
export default function MatrimonyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"male" | "female">("male");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProfiles = useMemo(() => {
    return dummyProfiles.filter(profile => {
      if (activeTab === "male" && !profile.isMale) return false;
      if (activeTab === "female" && profile.isMale) return false;
      if (searchTerm && !profile.name.includes(searchTerm) && !profile.village.includes(searchTerm) && !profile.district.includes(searchTerm)) return false;
      if (filterDistrict && profile.district !== filterDistrict) return false;
      return true;
    });
  }, [activeTab, searchTerm, filterDistrict]);

  const maleCount = useMemo(() => dummyProfiles.filter(p => p.isMale).length, []);
  const femaleCount = useMemo(() => dummyProfiles.filter(p => !p.isMale).length, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#f85606] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      {/* হিরো সেকশন */}
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <Crown size={16} /><span className="text-sm font-semibold">প্রিমিয়াম ম্যাট্রিমনি</span><Fingerprint size={14} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">পাত্র-পাত্রী চায়</h1>
          <p className="text-base md:text-lg opacity-90 mb-6">গুরুত্বপূর্ণ সম্পর্কের সন্ধানে • ১০০% প্রাইভেট ও সিকিউর</p>
          
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm"><ShieldCheck size={16} /> গোপনীয়তা সুরক্ষিত</div>
            <div className="flex items-center gap-2 text-sm"><Key size={16} /> ডাটা এনক্রিপ্টেড</div>
            <div className="flex items-center gap-2 text-sm"><Wallet size={16} /> নিরাপদ পেমেন্ট</div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl">
              <input 
                type="text" 
                placeholder="নাম, গ্রাম বা জেলা দিয়ে খুঁজুন..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-400" 
              />
              <button className="bg-[#f85606] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e04e00] transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto p-4">
        {/* ফিল্টার বার */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("male")} 
              className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                activeTab === "male" 
                  ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              👨 পুরুষ ({maleCount})
            </button>
            <button 
              onClick={() => setActiveTab("female")} 
              className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                activeTab === "female" 
                  ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              👩 মহিলা ({femaleCount})
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={filterDistrict} 
              onChange={(e) => setFilterDistrict(e.target.value)} 
              className="p-2 border border-gray-200 rounded-xl bg-white text-sm"
            >
              <option value="">সব জেলা</option>
              {bangladeshDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            
            <Link href="/category/matrimony/create">
              <button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition">
                <PlusCircle size={16} /> প্রোফাইল যোগ করুন
              </button>
            </Link>
          </div>
        </div>
        
        {/* প্রোফাইল গ্রিড */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} onViewDetails={() => {}} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো প্রোফাইল পাওয়া যায়নি</h2>
            <p className="text-gray-500">অন্য ফিল্টার দিয়ে চেষ্টা করুন</p>
          </div>
        )}
        
        {/* প্রাইভেসি ব্যানার */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">গোপনীয়তা সুরক্ষিত</p>
                <p className="text-xs text-gray-600">আপনার তথ্য এন্ড-টু-এন্ড এনক্রিপ্টেড</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">ভেরিফাইড প্রোফাইল</p>
                <p className="text-xs text-gray-600">আমাদের টিম দ্বারা ভেরিফাইড</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-start gap-3">
              <Wallet size={20} className="text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">নিরাপদ পেমেন্ট</p>
                <p className="text-xs text-gray-600">SSL কমার্স দ্বারা সুরক্ষিত</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}