"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Eye, Lock, CreditCard, User, MapPin, 
  Briefcase, Phone, Shield, CheckCircle, AlertCircle, 
  X, Heart, Star, Calendar, Mail, EyeOff, Sparkles,
  HeartCrack, Baby, Repeat, Diamond, Crown, Award,
  TrendingUp, Users, MessageCircle, PlusCircle, Share2, Flag,
  Fingerprint, Key, ShieldCheck, Wallet, Zap, Gem,
  Info, Download, Camera, AlertTriangle, Bell, Bookmark,
  Sparkle, PartyPopper, Rocket, Gift
} from 'lucide-react';

// বাংলাদেশের সমস্ত ৬৪টি জেলার তালিকা
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
  // 🆕 নতুন ফিল্ড
  fatherName?: string;
  motherName?: string;
  siblings?: string;
  prayerTime?: string;
  smoking?: string;
  occupationType?: string;
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
    fatherName: "আব্দুর রহিম", motherName: "ফাতেমা বেগম", siblings: "৩",
    prayerTime: "regular", smoking: "no", occupationType: "job",
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
    fatherName: "আব্দুল মান্নান", motherName: "রহিমা বেগম", siblings: "৪",
    prayerTime: "sometimes", smoking: "no", occupationType: "business",
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
    fatherName: "আলমগীর হোসেন", motherName: "নাজমা বেগম", siblings: "২",
    prayerTime: "regular", smoking: "no", occupationType: "student",
  },
  {
    id: 4, name: "শাহিনুর রহমান", age: 26, village: "মিরপুর", district: "ঢাকা",
    profession: "ব্যাংকার", education: "এমবিএ", height: "৫'৬\"", weight: "৫৮ কেজি",
    religion: "ইসলাম", phone: "০১৬XXXXXXXX", email: "shahinur@gmail.com", isMale: true, hasPhoto: true,
    photoBlurred: true, isVerified: true, isPremium: true, expectedIncome: "৭০,০০০ - ৯০,০০০",
    familyStatus: "মধ্যবিত্ত", about: "ব্যাংকে চাকরি করি। সাদামাটা জীবনযাপন পছন্দ করি।",
    createdAt: "২০২৪-০৩-১০", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "AB+", complexion: "ফর্সা", hobbies: ["ক্রিকেট", "ভ্রমণ"], views: 567, interests: 23,
    fatherName: "রফিকুল ইসলাম", motherName: "শাহিদা বেগম", siblings: "৩",
    prayerTime: "regular", smoking: "no", occupationType: "job",
  },
  {
    id: 5, name: "নাজমা বেগম", age: 25, village: "রাজশাহী সদর", district: "রাজশাহী",
    profession: "সরকারি চাকরি", education: "স্নাতকোত্তর", height: "৫'৩\"", weight: "৫২ কেজি",
    religion: "ইসলাম", phone: "০১৭XXXXXXXX", email: "nazma@gmail.com", isMale: false, hasPhoto: true,
    photoBlurred: true, isVerified: false, isPremium: false, expectedIncome: "৪০,০০০ - ৫০,০০০",
    familyStatus: "মধ্যবিত্ত", about: "সরকারি চাকরি করি। ভালো মানুষ খুঁজছি।",
    createdAt: "২০২৪-০৩-১৫", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "O-", complexion: "মাঝারি", hobbies: ["রান্না", "সেলাই"], views: 432, interests: 18,
    fatherName: "আব্দুল মজিদ", motherName: "রাশিদা বেগম", siblings: "৫",
    prayerTime: "sometimes", smoking: "no", occupationType: "job",
  },
  {
    id: 6, name: "হাসান মিয়া", age: 30, village: "সিলেট সদর", district: "সিলেট",
    profession: "ইঞ্জিনিয়ার", education: "বিএসসি (সিভিল)", height: "৫'৯\"", weight: "৭০ কেজি",
    religion: "ইসলাম", phone: "০১৮XXXXXXXX", email: "hasan@gmail.com", isMale: true, hasPhoto: true,
    photoBlurred: true, isVerified: true, isPremium: false, expectedIncome: "৮০,০০০ - ১,০০,০০০",
    familyStatus: "উচ্চ মধ্যবিত্ত", about: "বিদেশে কাজ করি। বাংলাদেশে স্থায়ী হতে চাই।",
    createdAt: "২০২৪-০৩-২০", maritalStatus: "unmarried", hasChildren: false, remarryWilling: "yes",
    bloodGroup: "B-", complexion: "শ্যামলা", hobbies: ["ভ্রমণ", "ছবি তোলা"], views: 678, interests: 45,
    fatherName: "জামাল উদ্দিন", motherName: "আমেনা বেগম", siblings: "৪",
    prayerTime: "regular", smoking: "sometimes", occupationType: "job",
  },
];

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

// কনগ্রাচুলেশন মডাল
function CongratulationsModal({ onClose, profileName }: { onClose: () => void; profileName: string }) {
  useEffect(() => {
    const timer = setTimeout(() => { onClose(); }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-orange-200 text-center">
        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
              <PartyPopper size={40} className="text-white" />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">অভিনন্দন! 🎉</h2>
          <p className="text-gray-600 mt-2">আপনি সফলভাবে <span className="font-bold text-[#f85606]">৫০০ টাকা</span> পেমেন্ট করেছেন!</p>
          <div className="my-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-800">✨ এখন আপনি সম্পূর্ণ প্রোফাইল দেখতে পারবেন:</p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1 text-left">
              <li className="flex items-center gap-2">✅ নাম, ছবি, ফোন, ঠিকানা</li>
              <li className="flex items-center gap-2">✅ ব্যক্তির সাথে সরাসরি চ্যাট</li>
              <li className="flex items-center gap-2">✅ প্রোফাইল শেয়ার</li>
            </ul>
          </div>
          <div className="bg-yellow-50 rounded-xl p-2 mb-4"><p className="text-xs text-yellow-700">🔒 ছবি ডাউনলোড বা স্ক্রিনশট নেওয়া যাবে না।</p></div>
          <button onClick={onClose} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold">প্রোফাইল দেখুন</button>
        </div>
      </div>
    </div>
  );
}

// পেমেন্টের আগে তথ্য মডাল
function InfoModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center"><Info size={18} className="text-white" /></div><h2 className="text-xl font-bold text-gray-800">গুরুত্বপূর্ণ তথ্য</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-sm text-gray-600 mb-4">আপনি <span className="font-bold text-[#f85606]">৫০০ টাকা</span> পেমেন্ট করে এই প্রোফাইলটি দেখতে যাচ্ছেন।</p>
        <div className="space-y-3 mb-4">
          <div className="bg-green-50 rounded-xl p-3"><div className="flex items-start gap-2"><CheckCircle size={16} className="text-green-600 mt-0.5" /><div><p className="text-sm font-semibold text-green-800">✅ যা করতে পারবেন:</p><ul className="text-xs text-green-700 mt-1 space-y-1"><li>• প্রোফাইলের নাম, ছবি, ফোন, ঠিকানা দেখতে পারবেন</li><li>• ব্যক্তির সাথে সরাসরি চ্যাট করতে পারবেন</li><li>• প্রোফাইল লিংক শেয়ার করতে পারবেন</li></ul></div></div></div>
          <div className="bg-red-50 rounded-xl p-3"><div className="flex items-start gap-2"><AlertTriangle size={16} className="text-red-600 mt-0.5" /><div><p className="text-sm font-semibold text-red-800">❌ যা করতে পারবেন না:</p><ul className="text-xs text-red-700 mt-1 space-y-1"><li>• ছবি ডাউনলোড করতে পারবেন না</li><li>• ছবি রাইট-ক্লিক করতে পারবেন না</li><li>• প্রোফাইলের ছবি স্ক্রিনশট করে শেয়ার করা নিষিদ্ধ</li></ul></div></div></div>
          <div className="bg-yellow-50 rounded-xl p-3"><div className="flex items-start gap-2"><AlertTriangle size={16} className="text-yellow-600 mt-0.5" /><div><p className="text-sm font-semibold text-yellow-800">⚠️ সতর্কতা:</p><p className="text-xs text-yellow-700 mt-1">স্ক্রিনশট নিলে আপনার একাউন্ট ব্লক হতে পারে।</p></div></div></div>
        </div>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold">আমি বুঝতে পেরেছি</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
        </div>
      </div>
    </div>
  );
}

// পেমেন্ট মডাল
function PaymentModal({ onClose, onSuccess, profileName, price, profileId }: { onClose: () => void; onSuccess: () => void; profileName: string; price: number; profileId: number }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); onSuccess(); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f85606] to-orange-500 flex items-center justify-center"><Lock size={18} className="text-white" /></div><h2 className="text-xl font-bold text-gray-800">প্রোফাইল আনলক করুন</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-4">
          <div className="text-center"><p className="text-sm text-gray-600 mb-1">সর্বনিম্ন চার্জ</p><p className="text-3xl font-bold text-[#f85606]">{price} টাকা</p><p className="text-xs text-gray-500 mt-1">একবার পেমেন্ট করলে সম্পূর্ণ প্রোফাইল দেখতে পাবেন</p></div>
        </div>
        <div className="space-y-3">
          <button onClick={() => setPaymentMethod("bkash")} className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${paymentMethod === "bkash" ? "border-[#f85606] bg-orange-50 ring-2 ring-[#f85606]/20" : "border-gray-200"}`}>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">বি</div><span className="font-medium">bKash</span><span className="text-xs text-green-600 ml-2">(নিরাপদ)</span></div>
            {paymentMethod === "bkash" && <CheckCircle size={18} className="text-[#f85606]" />}
          </button>
          <button onClick={() => setPaymentMethod("nagad")} className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${paymentMethod === "nagad" ? "border-[#f85606] bg-orange-50 ring-2 ring-[#f85606]/20" : "border-gray-200"}`}>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">ন</div><span className="font-medium">নগদ</span><span className="text-xs text-green-600 ml-2">(নিরাপদ)</span></div>
            {paymentMethod === "nagad" && <CheckCircle size={18} className="text-[#f85606]" />}
          </button>
          <button onClick={() => setPaymentMethod("rocket")} className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${paymentMethod === "rocket" ? "border-[#f85606] bg-orange-50 ring-2 ring-[#f85606]/20" : "border-gray-200"}`}>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">র</div><span className="font-medium">রকেট</span><span className="text-xs text-green-600 ml-2">(নিরাপদ)</span></div>
            {paymentMethod === "rocket" && <CheckCircle size={18} className="text-[#f85606]" />}
          </button>
        </div>
        <button onClick={handlePayment} disabled={isProcessing} className="w-full mt-5 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
          <CreditCard size={18} /> {isProcessing ? "প্রসেসিং..." : `${price} টাকা পেমেন্ট করুন`}
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-3">🔒 SSL কমার্স দ্বারা সুরক্ষিত | তথ্য গোপন রাখা হবে</p>
      </div>
    </div>
  );
}

// প্রোফাইল কার্ড - ৭০% ব্লার সহ
function ProfileCard({ profile, onViewDetails }: { profile: Profile; onViewDetails: (id: number) => void }) {
  const router = useRouter();
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const marital = getMaritalStatusText(profile.maritalStatus);
  const remarry = getRemarryWillingText(profile.remarryWilling);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const checkIfPaid = () => {
    if (typeof window !== 'undefined') {
      const paidProfiles = JSON.parse(localStorage.getItem('paidMatrimonyProfiles') || '[]');
      return paidProfiles.includes(profile.id);
    }
    return false;
  };

  const checkIfSaved = () => {
    if (typeof window !== 'undefined') {
      const savedProfiles = JSON.parse(localStorage.getItem('savedMatrimonyProfiles') || '[]');
      return savedProfiles.includes(profile.id);
    }
    return false;
  };

  const isPaid = checkIfPaid();
  const isAlreadySaved = checkIfSaved();

  useEffect(() => {
    if (isPaid) {
      setShowFullInfo(true);
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isPaid]);

  const handleViewDetails = () => { if (!isPaid && !showFullInfo) setShowInfoModal(true); };
  const handleConfirmPayment = () => { setShowInfoModal(false); setShowPaymentModal(true); };
  const handlePaymentSuccess = () => {
    setShowFullInfo(true);
    setShowCongratsModal(true);
    const paidProfiles = JSON.parse(localStorage.getItem('paidMatrimonyProfiles') || '[]');
    if (!paidProfiles.includes(profile.id)) {
      paidProfiles.push(profile.id);
      localStorage.setItem('paidMatrimonyProfiles', JSON.stringify(paidProfiles));
    }
  };

  const handleChat = () => { if (isPaid || showFullInfo) router.push(`/chat/${profile.id}?type=matrimony&name=${encodeURIComponent(profile.name)}`); };
  const handleLike = () => { setIsLiked(!isLiked); };
  const handleSave = () => {
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
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/category/matrimony?id=${profile.id}`;
    const title = profile.name;
    const text = `${profile.name} - পাত্র/পাত্রী প্রোফাইল | বয়স: ${profile.age} বছর | পেশা: ${profile.profession}`;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch (err) {}
    }
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try { await navigator.clipboard.writeText(url); alert("✅ প্রোফাইল লিংক কপি হয়েছে!"); return; } catch (err) {}
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) alert("✅ প্রোফাইল লিংক কপি হয়েছে!");
      else alert("🔗 লিংকটি কপি করুন: " + url);
    } catch (err) { alert("🔗 লিংকটি কপি করুন: " + url); }
  };

  const handleContextMenu = (e: React.MouseEvent) => { e.preventDefault(); return false; };
  const handleDragStart = (e: React.DragEvent) => { e.preventDefault(); return false; };

  if (!mounted) return null;

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group transform hover:-translate-y-1 ${animate ? 'animate-pulse ring-2 ring-[#f85606] ring-offset-2' : ''}`}>
        <div className="relative h-52 bg-gradient-to-br from-orange-100 to-orange-200">
          {(isPaid || showFullInfo) ? (
            <div className="w-full h-full flex items-center justify-center relative" onContextMenu={handleContextMenu} onDragStart={handleDragStart}>
              <div className="text-8xl">{profile.isMale ? "👨‍🦱" : "👩‍🦰"}</div>
              <div className="absolute bottom-2 left-2 text-[8px] text-white/50 bg-black/30 px-1 rounded">© আমার দুনিয়া</div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-white/10 text-2xl font-bold rotate-[-25deg]">আমার দুনিয়া</div></div>
              {profile.isPremium && <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md"><Gem size={10} /> প্রিমিয়াম</div>}
              {profile.isVerified && <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md"><CheckCircle size={10} /> ভেরিফাইড</div>}
            </div>
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center"><div className="text-8xl opacity-20 blur-sm">{profile.isMale ? "👨‍🦱" : "👩‍🦰"}</div></div>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-3 shadow-xl border border-white/40"><Lock size={32} className="text-white drop-shadow-lg" /></div>
                <div className="text-center mb-3"><p className="text-white font-bold text-lg drop-shadow-lg">প্রোফাইল আনলক করুন</p><p className="text-white/90 text-sm mt-1">নাম, ছবি, ফোন, ঠিকানা দেখুন</p></div>
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-3 shadow-lg">মাত্র ৫০০ টাকা</div>
                <button onClick={handleViewDetails} className="bg-white text-[#f85606] px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl"><Eye size={16} /> আনলক করুন</button>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white/70 text-[10px]"><span className="flex items-center gap-1">👁️ {profile.views} ভিউ</span><span className="flex items-center gap-1">❤️ {profile.interests} আগ্রহ</span></div>
              </div>
              {profile.isPremium && <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10"><Gem size={10} /> প্রিমিয়াম</div>}
              {profile.isVerified && <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10"><CheckCircle size={10} /> ভেরিফাইড</div>}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div><h3 className="font-bold text-xl text-gray-800">{(isPaid || showFullInfo) ? profile.name : "***"}</h3><div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><span>{profile.age} বছর</span><span>•</span><span>{profile.religion}</span></div></div>
            <div className="flex gap-1">
              <button onClick={handleLike} className="p-1.5 rounded-full hover:bg-gray-100 transition"><Heart size={16} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} /></button>
              <button onClick={handleShare} className="p-1.5 rounded-full hover:bg-gray-100 transition"><Share2 size={16} className="text-gray-400" /></button>
              {(isPaid || showFullInfo) && <button onClick={handleSave} className="p-1.5 rounded-full hover:bg-gray-100 transition"><Bookmark size={16} className={isAlreadySaved ? "text-[#f85606] fill-[#f85606]" : "text-gray-400"} /></button>}
            </div>
          </div>
          {(isPaid || showFullInfo) ? (
            <>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${marital.color}`}><span>{marital.icon}</span> {marital.text}</span>
                {profile.hasChildren && <span className="inline-flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full"><Baby size={10} /> {profile.childrenCount} টি সন্তান</span>}
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${remarry.color}`}><span>{remarry.icon}</span> {remarry.text}</span>
              </div>
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><MapPin size={14} className="text-[#f85606]" /><span>{profile.village}, {profile.district}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Briefcase size={14} className="text-[#f85606]" /><span>{profile.profession}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Star size={14} className="text-[#f85606]" /><span>{profile.education}</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Diamond size={14} className="text-[#f85606]" /><span>আয়: {profile.expectedIncome}/মাস</span></div>
                {profile.bloodGroup && <div className="flex items-center gap-2 text-gray-600"><Heart size={14} className="text-[#f85606]" /><span>ব্লাড গ্রুপ: {profile.bloodGroup}</span></div>}
              </div>
              {profile.hobbies && profile.hobbies.length > 0 && (<div className="mt-3"><p className="text-xs text-gray-500 mb-2">🎯 আগ্রহ:</p><div className="flex flex-wrap gap-1.5">{profile.hobbies.map((hobby, idx) => (<span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{hobby}</span>))}</div></div>)}
              
              {/* 🆕 পরিবার ও ব্যক্তিগত তথ্য */}
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1"><Users size={12} className="text-blue-600" /> পরিবার ও ব্যক্তিগত তথ্য</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {profile.fatherName && <div><span className="text-gray-400">পিতা:</span><p className="font-medium text-gray-700">{profile.fatherName}</p></div>}
                  {profile.motherName && <div><span className="text-gray-400">মাতা:</span><p className="font-medium text-gray-700">{profile.motherName}</p></div>}
                  {profile.siblings && <div><span className="text-gray-400">ভাই-বোন:</span><p className="font-medium text-gray-700">{profile.siblings} জন</p></div>}
                  {profile.prayerTime && <div><span className="text-gray-400">নামাজ:</span><p className="font-medium text-gray-700">{profile.prayerTime === 'regular' ? 'নিয়মিত' : profile.prayerTime === 'sometimes' ? 'মাঝে মাঝে' : 'না'}</p></div>}
                  {profile.smoking && <div><span className="text-gray-400">ধূমপান:</span><p className="font-medium text-gray-700">{profile.smoking === 'no' ? 'না' : profile.smoking === 'yes' ? 'হ্যাঁ' : 'মাঝে মাঝে'}</p></div>}
                  {profile.occupationType && <div><span className="text-gray-400">পেশার ধরন:</span><p className="font-medium text-gray-700">{profile.occupationType === 'job' ? 'চাকরিজীবী' : profile.occupationType === 'business' ? 'ব্যবসায়ী' : profile.occupationType === 'student' ? 'শিক্ষার্থী' : 'অন্যান্য'}</p></div>}
                </div>
              </div>
              
              {profile.about && (<div className="mt-3 p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-600 italic">"{profile.about}"</p></div>)}
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400"><span className="flex items-center gap-1">👁️ {profile.views}</span><span>•</span><span className="flex items-center gap-1">❤️ {profile.interests}</span></div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setShowPhone(!showPhone)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition"><Phone size={14} /> {showPhone ? profile.phone : "ফোন দেখুন"}</button>
                <button onClick={handleChat} className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"><MessageCircle size={14} /> মেসেজ</button>
              </div>
            </>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center"><p className="text-sm text-gray-500">🔒 সম্পূর্ণ প্রোফাইল দেখতে</p><p className="text-xs text-gray-400 mt-1">নাম, ছবি, ফোন, ঠিকানা সহ সব তথ্য</p><p className="text-xs text-[#f85606] mt-2">মাত্র ৫০০ টাকায় আনলক করুন</p></div>
          )}
        </div>
      </div>
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} onConfirm={handleConfirmPayment} />}
      {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} profileName={profile.name} price={500} profileId={profile.id} />}
      {showCongratsModal && <CongratulationsModal onClose={() => setShowCongratsModal(false)} profileName={profile.name} />}
    </>
  );
}

export default function MatrimonyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"male" | "female">("male");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filteredProfiles = dummyProfiles.filter(profile => {
    if (activeTab === "male" && profile.isMale === false) return false;
    if (activeTab === "female" && profile.isMale === true) return false;
    if (searchTerm && !profile.name.includes(searchTerm) && !profile.village.includes(searchTerm) && !profile.district.includes(searchTerm)) return false;
    if (filterDistrict && profile.district !== filterDistrict) return false;
    return true;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="relative bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/30"><Crown size={16} /><span className="text-sm font-semibold">প্রিমিয়াম ম্যাট্রিমনি</span><Fingerprint size={14} /></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">পাত্র-পাত্রী <span className="underline decoration-white/30">চায়</span></h1>
          <p className="text-base md:text-lg opacity-90 mb-6">গুরুত্বপূর্ণ সম্পর্কের সন্ধানে • ১০০% প্রাইভেট ও সিকিউর</p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm"><ShieldCheck size={16} /> গোপনীয়তা সুরক্ষিত</div>
            <div className="flex items-center gap-2 text-sm"><Key size={16} /> ডাটা এনক্রিপ্টেড</div>
            <div className="flex items-center gap-2 text-sm"><Wallet size={16} /> নিরাপদ পেমেন্ট</div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl">
              <input type="text" placeholder="নাম, গ্রাম বা জেলা দিয়ে খুঁজুন..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-400" />
              <button className="bg-[#f85606] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e04e00] transition"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("male")} className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${activeTab === "male" ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:shadow-md"}`}>👨 পুরুষ ({dummyProfiles.filter(p => p.isMale).length})</button>
            <button onClick={() => setActiveTab("female")} className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${activeTab === "female" ? "bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:shadow-md"}`}>👩 মহিলা ({dummyProfiles.filter(p => !p.isMale).length})</button>
          </div>
          <div className="flex items-center gap-3">
            <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} className="p-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f85606]">
              <option value="">সব জেলা</option>
              {bangladeshDistricts.map(district => (<option key={district} value={district}>{district}</option>))}
            </select>
            <Link href="/category/matrimony/create"><button className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition"><PlusCircle size={16} /> প্রোফাইল যোগ করুন</button></Link>
          </div>
        </div>
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (<ProfileCard key={profile.id} profile={profile} onViewDetails={(id) => console.log(id)} />))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm"><div className="text-6xl mb-4">😔</div><h2 className="text-xl font-bold text-gray-800 mb-2">কোনো প্রোফাইল পাওয়া যায়নি</h2><p className="text-gray-500">অন্য ফিল্টার দিয়ে চেষ্টা করুন</p></div>
        )}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"><div className="flex items-start gap-3"><ShieldCheck size={20} className="text-blue-600 mt-0.5" /><div><p className="text-sm font-semibold text-gray-800">গোপনীয়তা সুরক্ষিত</p><p className="text-xs text-gray-600">আপনার তথ্য এন্ড-টু-এন্ড এনক্রিপ্টেড</p></div></div></div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"><div className="flex items-start gap-3"><CheckCircle size={20} className="text-green-600 mt-0.5" /><div><p className="text-sm font-semibold text-gray-800">ভেরিফাইড প্রোফাইল</p><p className="text-xs text-gray-600">আমাদের টিম দ্বারা ভেরিফাইড</p></div></div></div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100"><div className="flex items-start gap-3"><Wallet size={20} className="text-purple-600 mt-0.5" /><div><p className="text-sm font-semibold text-gray-800">নিরাপদ পেমেন্ট</p><p className="text-xs text-gray-600">SSL কমার্স দ্বারা সুরক্ষিত</p></div></div></div>
        </div>
      </div>
    </div>
  );
}