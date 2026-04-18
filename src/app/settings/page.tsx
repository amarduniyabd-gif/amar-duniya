"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Menu, X, Save, DollarSign, Percent, Clock, Shield, 
  CreditCard, Bell, Globe, Save as SaveIcon, Star, FileText, Gavel,
  Mail, Phone, MapPin, Users, Package, TrendingUp, Award,
  Smartphone, Laptop, Shirt, Car, Home, Settings as SettingsIcon,
  Zap, AlertCircle, CheckCircle, XCircle, RefreshCw, Eye,
  Lock, UserCheck, Database, Cloud, Wifi, Moon, Sun,
  Heart, Gem, Crown, Sparkles, Tag, Calendar, Ban, Trash2,
  Plus, Minus, Edit2, ChevronDown, ChevronUp, Copy, ExternalLink
} from "lucide-react";

// ============ টাইপ ডেফিনিশন ============
type PaymentSettings = {
  // পাত্র-পাত্রী
  matrimonyProfileUnlock: number;
  matrimonyPremium: number;
  matrimonyBoost: number;
  
  // পোস্ট
  featuredPost7Days: number;
  featuredPost15Days: number;
  featuredPost30Days: number;
  urgentPost: number;
  
  // নিলাম
  auctionCommission: number; // শতাংশে
  
  // ডকুমেন্ট
  documentServiceFee: number;
  
  // সাধারণ
  currency: string;
  taxRate: number;
};

type GeneralSettings = {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  autoApprovePosts: boolean;
  maxPostsPerUser: number;
  maxImagesPerPost: number;
};

type NotificationSettings = {
  emailOnNewUser: boolean;
  emailOnNewPost: boolean;
  emailOnNewBid: boolean;
  emailOnPayment: boolean;
  emailOnReport: boolean;
  pushOnNewMessage: boolean;
  pushOnBidUpdate: boolean;
  smsOnPayment: boolean;
};

type SecuritySettings = {
  maxLoginAttempts: number;
  sessionTimeout: number; // মিনিটে
  twoFactorRequired: boolean;
  ipWhitelist: string[];
  bannedWords: string[];
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
};

// ============ মেইন কম্পোনেন্ট ============
export default function AdminSettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'notification' | 'security' | 'performance' | 'social'>('general');
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // ============ পেমেন্ট সেটিংস ============
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    matrimonyProfileUnlock: 500,
    matrimonyPremium: 1000,
    matrimonyBoost: 200,
    featuredPost7Days: 100,
    featuredPost15Days: 180,
    featuredPost30Days: 300,
    urgentPost: 50,
    auctionCommission: 2,
    documentServiceFee: 1500,
    currency: "BDT",
    taxRate: 0,
  });

  // ============ সাধারণ সেটিংস ============
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: "আমার দুনিয়া",
    siteDescription: "বাংলাদেশের সর্ববৃহৎ মার্কেটপ্লেস - পণ্য কিনুন ও বিক্রি করুন",
    siteKeywords: "মার্কেটপ্লেস, অনলাইন শপিং, পণ্য কেনাকাটা, বাংলাদেশ",
    siteEmail: "support@amarduniya.com",
    sitePhone: "017XXXXXXXX",
    siteAddress: "ঢাকা, বাংলাদেশ",
    facebookUrl: "https://facebook.com/amarduniya",
    youtubeUrl: "",
    instagramUrl: "",
    whatsappNumber: "017XXXXXXXX",
    maintenanceMode: false,
    registrationEnabled: true,
    autoApprovePosts: false,
    maxPostsPerUser: 50,
    maxImagesPerPost: 6,
  });

  // ============ নোটিফিকেশন সেটিংস ============
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailOnNewUser: true,
    emailOnNewPost: true,
    emailOnNewBid: true,
    emailOnPayment: true,
    emailOnReport: true,
    pushOnNewMessage: true,
    pushOnBidUpdate: true,
    smsOnPayment: false,
  });

  // ============ সিকিউরিটি সেটিংস ============
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    twoFactorRequired: false,
    ipWhitelist: [],
    bannedWords: ["গালি", "অশ্লীল"],
    requireEmailVerification: true,
    requirePhoneVerification: false,
  });

  // ============ নতুন IP/শব্দ যোগের জন্য ============
  const [newIp, setNewIp] = useState("");
  const [newBannedWord, setNewBannedWord] = useState("");

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
    
    // লোকাল স্টোরেজ থেকে সেটিংস লোড
    const savedPayment = localStorage.getItem("adminPaymentSettings");
    if (savedPayment) setPaymentSettings(JSON.parse(savedPayment));
    
    const savedGeneral = localStorage.getItem("adminGeneralSettings");
    if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral));
  }, [router]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ============ সেভ হ্যান্ডলার ============
  const handleSaveAll = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem("adminPaymentSettings", JSON.stringify(paymentSettings));
      localStorage.setItem("adminGeneralSettings", JSON.stringify(generalSettings));
      localStorage.setItem("adminNotificationSettings", JSON.stringify(notificationSettings));
      localStorage.setItem("adminSecuritySettings", JSON.stringify(securitySettings));
      
      setSuccessMessage("✅ সব সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!");
      setIsSaving(false);
    }, 500);
  };

  const handleResetToDefault = () => {
    if (confirm("সব সেটিংস ডিফল্টে রিসেট করবেন?")) {
      setPaymentSettings({
        matrimonyProfileUnlock: 500,
        matrimonyPremium: 1000,
        matrimonyBoost: 200,
        featuredPost7Days: 100,
        featuredPost15Days: 180,
        featuredPost30Days: 300,
        urgentPost: 50,
        auctionCommission: 2,
        documentServiceFee: 1500,
        currency: "BDT",
        taxRate: 0,
      });
      setSuccessMessage("✅ পেমেন্ট সেটিংস ডিফল্টে রিসেট করা হয়েছে!");
    }
  };

  const handleAddIp = () => {
    if (newIp && !securitySettings.ipWhitelist.includes(newIp)) {
      setSecuritySettings({
        ...securitySettings,
        ipWhitelist: [...securitySettings.ipWhitelist, newIp]
      });
      setNewIp("");
    }
  };

  const handleRemoveIp = (ip: string) => {
    setSecuritySettings({
      ...securitySettings,
      ipWhitelist: securitySettings.ipWhitelist.filter(i => i !== ip)
    });
  };

  const handleAddBannedWord = () => {
    if (newBannedWord && !securitySettings.bannedWords.includes(newBannedWord)) {
      setSecuritySettings({
        ...securitySettings,
        bannedWords: [...securitySettings.bannedWords, newBannedWord]
      });
      setNewBannedWord("");
    }
  };

  const handleRemoveBannedWord = (word: string) => {
    setSecuritySettings({
      ...securitySettings,
      bannedWords: securitySettings.bannedWords.filter(w => w !== word)
    });
  };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-3 rounded-xl shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="fixed inset-y-0 left-0 z-40 w-72 hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar />
      </div>

      <div className="md:ml-72">
        {/* হেডার */}
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon size={20} className="text-[#f85606]" />
            অ্যাডমিন সেটিংস
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={handleResetToDefault} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-200 transition">
              <RefreshCw size={16} /> ডিফল্ট
            </button>
            <button onClick={handleSaveAll} disabled={isSaving} className="px-4 py-2 bg-[#f85606] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition disabled:opacity-50">
              <Save size={16} /> {isSaving ? "সেভ হচ্ছে..." : "সব সেভ করুন"}
            </button>
          </div>
        </div>

        {/* সাকসেস মেসেজ */}
        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
            <CheckCircle size={16} className="inline mr-2" />{successMessage}
          </div>
        )}

        <div className="p-6">
          {/* ট্যাব */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'general', label: 'সাধারণ', icon: <Globe size={16} /> },
              { id: 'payment', label: 'পেমেন্ট', icon: <DollarSign size={16} /> },
              { id: 'notification', label: 'নোটিফিকেশন', icon: <Bell size={16} /> },
              { id: 'security', label: 'নিরাপত্তা', icon: <Shield size={16} /> },
              { id: 'performance', label: 'পারফরম্যান্স', icon: <Zap size={16} /> },
              { id: 'social', label: 'সোশ্যাল', icon: <Users size={16} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-[#f85606] text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ============ সাধারণ সেটিংস ============ */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Globe size={20} className="text-[#f85606]" /> সাধারণ সেটিংস
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সাইটের নাম</label>
                  <input type="text" value={generalSettings.siteName} onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সাইটের ইমেইল</label>
                  <input type="email" value={generalSettings.siteEmail} onChange={(e) => setGeneralSettings({...generalSettings, siteEmail: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সাইটের ফোন</label>
                  <input type="tel" value={generalSettings.sitePhone} onChange={(e) => setGeneralSettings({...generalSettings, sitePhone: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                  <input type="text" value={generalSettings.siteAddress} onChange={(e) => setGeneralSettings({...generalSettings, siteAddress: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">সাইটের বিবরণ</label>
                  <textarea value={generalSettings.siteDescription} onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})} rows={2} className="w-full p-3 border rounded-xl" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">কিওয়ার্ড (কমা দিয়ে আলাদা)</label>
                  <input type="text" value={generalSettings.siteKeywords} onChange={(e) => setGeneralSettings({...generalSettings, siteKeywords: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mt-4">সিস্টেম কন্ট্রোল</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={generalSettings.maintenanceMode} onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})} className="w-4 h-4" />
                  <div><span className="font-medium">মেইনটেনেন্স মোড</span><p className="text-xs text-gray-400">সাইট বন্ধ রাখুন</p></div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={generalSettings.registrationEnabled} onChange={(e) => setGeneralSettings({...generalSettings, registrationEnabled: e.target.checked})} className="w-4 h-4" />
                  <div><span className="font-medium">রেজিস্ট্রেশন চালু</span><p className="text-xs text-gray-400">নতুন ইউজার রেজিস্টার করতে পারবে</p></div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={generalSettings.autoApprovePosts} onChange={(e) => setGeneralSettings({...generalSettings, autoApprovePosts: e.target.checked})} className="w-4 h-4" />
                  <div><span className="font-medium">অটো অ্যাপ্রুভ পোস্ট</span><p className="text-xs text-gray-400">পোস্ট অটোমেটিক অ্যাপ্রুভ হবে</p></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সর্বোচ্চ পোস্ট/ইউজার</label>
                  <input type="number" value={generalSettings.maxPostsPerUser} onChange={(e) => setGeneralSettings({...generalSettings, maxPostsPerUser: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সর্বোচ্চ ছবি/পোস্ট</label>
                  <input type="number" value={generalSettings.maxImagesPerPost} onChange={(e) => setGeneralSettings({...generalSettings, maxImagesPerPost: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* ============ পেমেন্ট সেটিংস ============ */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <DollarSign size={20} className="text-[#f85606]" /> পেমেন্ট সেটিংস
              </h2>

              {/* পাত্র-পাত্রী */}
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Heart size={18} className="text-pink-600" /> পাত্র-পাত্রী পেমেন্ট
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">প্রোফাইল আনলক ফি (৳)</label>
                    <div className="flex items-center">
                      <button onClick={() => setPaymentSettings({...paymentSettings, matrimonyProfileUnlock: Math.max(0, paymentSettings.matrimonyProfileUnlock - 50)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.matrimonyProfileUnlock} onChange={(e) => setPaymentSettings({...paymentSettings, matrimonyProfileUnlock: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, matrimonyProfileUnlock: paymentSettings.matrimonyProfileUnlock + 50})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">প্রিমিয়াম ফি (৳)</label>
                    <div className="flex items-center">
                      <button onClick={() => setPaymentSettings({...paymentSettings, matrimonyPremium: Math.max(0, paymentSettings.matrimonyPremium - 100)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.matrimonyPremium} onChange={(e) => setPaymentSettings({...paymentSettings, matrimonyPremium: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, matrimonyPremium: paymentSettings.matrimonyPremium + 100})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">প্রোফাইল বুস্ট ফি (৳)</label>
                    <div className="flex items-center">
                      <button onClick={() => setPaymentSettings({...paymentSettings, matrimonyBoost: Math.max(0, paymentSettings.matrimonyBoost - 25)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.matrimonyBoost} onChange={(e) => setPaymentSettings({...paymentSettings, matrimonyBoost: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, matrimonyBoost: paymentSettings.matrimonyBoost + 25})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ফিচার্ড পোস্ট */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <Crown size={18} className="text-blue-600" /> ফিচার্ড পোস্ট পেমেন্ট
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">৭ দিন (৳)</label>
                    <div className="flex items-center">
                      <button onClick={() => setPaymentSettings({...paymentSettings, featuredPost7Days: Math.max(0, paymentSettings.featuredPost7Days - 25)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.featuredPost7Days} onChange={(e) => setPaymentSettings({...paymentSettings, featuredPost7Days: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, featuredPost7Days: paymentSettings.featuredPost7Days + 25})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">১৫ দিন (৳)</label>
                    <div className="flex items-center">
                      <button onClick={() => setPaymentSettings({...paymentSettings, featuredPost15Days: Math.max(0, paymentSettings.featuredPost15Days - 25)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.featuredPost15Days} onChange={(e) => setPaymentSettings({...paymentSettings, featuredPost15Days: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, featuredPost15Days: paymentSettings.featuredPost15Days + 25})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">৩০ দিন (৳)</label>
                    <div className="flex items-center">
                      <button onClick={() => setPaymentSettings({...paymentSettings, featuredPost30Days: Math.max(0, paymentSettings.featuredPost30Days - 50)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.featuredPost30Days} onChange={(e) => setPaymentSettings({...paymentSettings, featuredPost30Days: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, featuredPost30Days: paymentSettings.featuredPost30Days + 50})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">জরুরি পোস্ট ফি (৳)</label>
                  <div className="flex items-center max-w-[200px]">
                    <button onClick={() => setPaymentSettings({...paymentSettings, urgentPost: Math.max(0, paymentSettings.urgentPost - 10)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                    <input type="number" value={paymentSettings.urgentPost} onChange={(e) => setPaymentSettings({...paymentSettings, urgentPost: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                    <button onClick={() => setPaymentSettings({...paymentSettings, urgentPost: paymentSettings.urgentPost + 10})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                  </div>
                </div>
              </div>

              {/* নিলাম ও ডকুমেন্ট */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Gavel size={18} className="text-purple-600" /> নিলাম কমিশন
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">কমিশন (%)</label>
                    <div className="flex items-center max-w-[200px]">
                      <button onClick={() => setPaymentSettings({...paymentSettings, auctionCommission: Math.max(0, paymentSettings.auctionCommission - 0.5)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" step="0.5" value={paymentSettings.auctionCommission} onChange={(e) => setPaymentSettings({...paymentSettings, auctionCommission: parseFloat(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, auctionCommission: paymentSettings.auctionCommission + 0.5})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <FileText size={18} className="text-green-600" /> ডকুমেন্ট ফি
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ডকুমেন্ট সার্ভিস ফি (৳)</label>
                    <div className="flex items-center max-w-[200px]">
                      <button onClick={() => setPaymentSettings({...paymentSettings, documentServiceFee: Math.max(0, paymentSettings.documentServiceFee - 100)})} className="p-3 bg-gray-100 rounded-l-xl"><Minus size={16} /></button>
                      <input type="number" value={paymentSettings.documentServiceFee} onChange={(e) => setPaymentSettings({...paymentSettings, documentServiceFee: parseInt(e.target.value)})} className="w-full p-3 border-y text-center" />
                      <button onClick={() => setPaymentSettings({...paymentSettings, documentServiceFee: paymentSettings.documentServiceFee + 100})} className="p-3 bg-gray-100 rounded-r-xl"><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ট্যাক্স ও কারেন্সি */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">কারেন্সি</label>
                  <select value={paymentSettings.currency} onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})} className="w-full p-3 border rounded-xl">
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ট্যাক্স (%)</label>
                  <input type="number" value={paymentSettings.taxRate} onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* ============ নোটিফিকেশন সেটিংস ============ */}
          {activeTab === 'notification' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Bell size={20} className="text-[#f85606]" /> নোটিফিকেশন সেটিংস
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">নতুন ইউজার রেজিস্ট্রেশন</span><p className="text-xs text-gray-400">ইমেইল নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.emailOnNewUser} onChange={(e) => setNotificationSettings({...notificationSettings, emailOnNewUser: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">নতুন পোস্ট জমা</span><p className="text-xs text-gray-400">ইমেইল নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.emailOnNewPost} onChange={(e) => setNotificationSettings({...notificationSettings, emailOnNewPost: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">নতুন বিড</span><p className="text-xs text-gray-400">ইমেইল নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.emailOnNewBid} onChange={(e) => setNotificationSettings({...notificationSettings, emailOnNewBid: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">পেমেন্ট সফল</span><p className="text-xs text-gray-400">ইমেইল নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.emailOnPayment} onChange={(e) => setNotificationSettings({...notificationSettings, emailOnPayment: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">রিপোর্ট জমা</span><p className="text-xs text-gray-400">ইমেইল নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.emailOnReport} onChange={(e) => setNotificationSettings({...notificationSettings, emailOnReport: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">নতুন মেসেজ</span><p className="text-xs text-gray-400">পুশ নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.pushOnNewMessage} onChange={(e) => setNotificationSettings({...notificationSettings, pushOnNewMessage: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">বিড আপডেট</span><p className="text-xs text-gray-400">পুশ নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.pushOnBidUpdate} onChange={(e) => setNotificationSettings({...notificationSettings, pushOnBidUpdate: e.target.checked})} className="w-4 h-4" />
                </label>
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div><span className="font-medium">পেমেন্ট সফল</span><p className="text-xs text-gray-400">SMS নোটিফিকেশন</p></div>
                  <input type="checkbox" checked={notificationSettings.smsOnPayment} onChange={(e) => setNotificationSettings({...notificationSettings, smsOnPayment: e.target.checked})} className="w-4 h-4" />
                </label>
              </div>
            </div>
          )}

          {/* ============ সিকিউরিটি সেটিংস ============ */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Shield size={20} className="text-[#f85606]" /> নিরাপত্তা সেটিংস
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সর্বোচ্চ লগইন অ্যাটেম্পট</label>
                  <input type="number" value={securitySettings.maxLoginAttempts} onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সেশন টাইমআউট (মিনিট)</label>
                  <input type="number" value={securitySettings.sessionTimeout} onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={securitySettings.twoFactorRequired} onChange={(e) => setSecuritySettings({...securitySettings, twoFactorRequired: e.target.checked})} className="w-4 h-4" />
                  <div><span className="font-medium">টু-ফ্যাক্টর অথেনটিকেশন বাধ্যতামূলক</span><p className="text-xs text-gray-400">সকল ইউজারের জন্য 2FA চালু করুন</p></div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={securitySettings.requireEmailVerification} onChange={(e) => setSecuritySettings({...securitySettings, requireEmailVerification: e.target.checked})} className="w-4 h-4" />
                  <div><span className="font-medium">ইমেইল ভেরিফিকেশন বাধ্যতামূলক</span></div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={securitySettings.requirePhoneVerification} onChange={(e) => setSecuritySettings({...securitySettings, requirePhoneVerification: e.target.checked})} className="w-4 h-4" />
                  <div><span className="font-medium">ফোন ভেরিফিকেশন বাধ্যতামূলক</span></div>
                </label>
              </div>

              {/* IP হোয়াইটলিস্ট */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP হোয়াইটলিস্ট</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="192.168.1.1" className="flex-1 p-3 border rounded-xl" />
                  <button onClick={handleAddIp} className="bg-[#f85606] text-white px-4 py-3 rounded-xl">যোগ করুন</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {securitySettings.ipWhitelist.map(ip => (
                    <span key={ip} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {ip} <button onClick={() => handleRemoveIp(ip)}><X size={14} className="text-red-500" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ব্যান শব্দ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ব্যান করা শব্দ</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newBannedWord} onChange={(e) => setNewBannedWord(e.target.value)} placeholder="শব্দ লিখুন" className="flex-1 p-3 border rounded-xl" />
                  <button onClick={handleAddBannedWord} className="bg-[#f85606] text-white px-4 py-3 rounded-xl">যোগ করুন</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {securitySettings.bannedWords.map(word => (
                    <span key={word} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {word} <button onClick={() => handleRemoveBannedWord(word)}><X size={14} className="text-red-500" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ পারফরম্যান্স সেটিংস ============ */}
          {activeTab === 'performance' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Zap size={20} className="text-[#f85606]" /> পারফরম্যান্স সেটিংস
              </h2>
              
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-700">🚀 সুপারসনিক স্পিড অপটিমাইজেশন সক্রিয় আছে!</p>
                <p className="text-xs text-blue-600 mt-1">Turbopack • Cache Components • PPR • Image Optimization</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium">ক্যাশ স্ট্যাটাস</p>
                  <p className="text-2xl font-bold text-green-600">সক্রিয়</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium">CDN স্ট্যাটাস</p>
                  <p className="text-2xl font-bold text-green-600">Vercel Edge</p>
                </div>
              </div>

              <button className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                <RefreshCw size={18} /> ক্যাশ ক্লিয়ার করুন
              </button>
            </div>
          )}

          {/* ============ সোশ্যাল সেটিংস ============ */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <Users size={20} className="text-[#f85606]" /> সোশ্যাল মিডিয়া লিংক
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                  <input type="url" value={generalSettings.facebookUrl} onChange={(e) => setGeneralSettings({...generalSettings, facebookUrl: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input type="url" value={generalSettings.youtubeUrl} onChange={(e) => setGeneralSettings({...generalSettings, youtubeUrl: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                  <input type="url" value={generalSettings.instagramUrl} onChange={(e) => setGeneralSettings({...generalSettings, instagramUrl: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp নম্বর</label>
                  <input type="tel" value={generalSettings.whatsappNumber} onChange={(e) => setGeneralSettings({...generalSettings, whatsappNumber: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {/* সেভ বাটন */}
          <div className="mt-6 flex gap-3">
            <button onClick={handleSaveAll} disabled={isSaving} className="flex-1 bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition disabled:opacity-50">
              <Save size={18} /> {isSaving ? "সেভ হচ্ছে..." : "সব সেটিংস সংরক্ষণ করুন"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}