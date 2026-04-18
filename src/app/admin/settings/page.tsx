"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, X, Save, DollarSign, Percent, Clock, Shield, 
  CreditCard, Bell, Globe, Save as SaveIcon, Star, FileText, Gavel,
  Mail, Phone, MapPin, Users, Package, TrendingUp, Award,
  Smartphone, Laptop, Shirt, Car, Home, Settings as SettingsIcon,
  Zap, AlertCircle, CheckCircle, XCircle, RefreshCw, Eye,
  Lock, UserCheck, Database, Cloud, Wifi, Moon, Sun } from "lucide-react";

type AdminSettings = {
  siteName: string;
  siteLogo: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  siteDescription: string;
  siteKeywords: string;
  siteCurrency: string;
  siteTimezone: string;
  featuredPrice: number;
  featuredDays: number;
  documentCommission: number;
  documentMinFee: number;
  bidFee: number;
  auctionCommission: number;
  auctionMinBid: number;
  emailNotification: boolean;
  smsNotification: boolean;
  pushNotification: boolean;
  adminEmail: string;
  adminPhone: string;
  paymentGateway: 'sslcommerz' | 'stripe' | 'bkash';
  sslStoreId: string;
  sslStorePassword: string;
  sslMode: 'sandbox' | 'live';
  stripePublishableKey: string;
  stripeSecretKey: string;
  bkashUsername: string;
  bkashPassword: string;
  twoFactorRequired: boolean;
  emailVerification: boolean;
  adminApproval: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  cacheDuration: number;
  itemsPerPage: number;
  enableCDN: boolean;
  enableAnalytics: boolean;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
};

export default function AdminSettings() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [backupStatus, setBackupStatus] = useState<{ lastBackup: string; size: string } | null>(null);

  const [settings, setSettings] = useState<AdminSettings>({
    siteName: "আমার দুনিয়া",
    siteLogo: "",
    siteEmail: "info@amarduniya.com",
    sitePhone: "০১৭XXXXXXXX",
    siteAddress: "কুষ্টিয়া, বাংলাদেশ",
    siteDescription: "বাংলাদেশের সর্ববৃহৎ মার্কেটপ্লেস",
    siteKeywords: "মার্কেটপ্লেস, অনলাইন শপিং, কেনাকাটা",
    siteCurrency: "BDT",
    siteTimezone: "Asia/Dhaka",
    featuredPrice: 100,
    featuredDays: 7,
    documentCommission: 2,
    documentMinFee: 50,
    bidFee: 2,
    auctionCommission: 2,
    auctionMinBid: 1000,
    emailNotification: true,
    smsNotification: false,
    pushNotification: true,
    adminEmail: "admin@amarduniya.com",
    adminPhone: "০১৯XXXXXXXX",
    paymentGateway: "sslcommerz",
    sslStoreId: "",
    sslStorePassword: "",
    sslMode: "sandbox",
    stripePublishableKey: "",
    stripeSecretKey: "",
    bkashUsername: "",
    bkashPassword: "",
    twoFactorRequired: false,
    emailVerification: true,
    adminApproval: false,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    cacheDuration: 300,
    itemsPerPage: 20,
    enableCDN: true,
    enableAnalytics: true,
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    whatsapp: "",
  });

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") router.push("/admin/login");
    else setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleBackup = () => {
    const backup = { date: new Date().toISOString(), settings: settings, version: "1.0.0" };
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amarduniya-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus({ lastBackup: new Date().toLocaleString(), size: `${(dataStr.length / 1024).toFixed(1)} KB` });
  };

  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const restored = JSON.parse(event.target?.result as string);
            if (restored.settings) {
              setSettings(restored.settings);
              alert("সেটিংস রিস্টোর করা হয়েছে!");
            }
          } catch (error) {
            alert("ইনভ্যালিড ব্যাকআপ ফাইল!");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleTestEmail = () => {
    if (testEmail) {
      alert(`টেস্ট ইমেইল পাঠানো হয়েছে: ${testEmail}`);
      setTestEmail("");
      setShowTestModal(false);
    }
  };

  const tabs = [
    { id: "general", label: "সাধারণ", icon: <Globe size={16} /> },
    { id: "pricing", label: "মূল্য নির্ধারণ", icon: <DollarSign size={16} /> },
    { id: "payment", label: "পেমেন্ট", icon: <CreditCard size={16} /> },
    { id: "notification", label: "নোটিফিকেশন", icon: <Bell size={16} /> },
    { id: "security", label: "নিরাপত্তা", icon: <Shield size={16} /> },
    { id: "performance", label: "পারফরম্যান্স", icon: <Zap size={16} /> },
    { id: "social", label: "সোশ্যাল", icon: <Users size={16} /> },
  ];

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* মোবাইল টগল বাটন */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-[#f85606] text-white p-2 rounded-lg shadow-lg">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ডেস্কটপ সাইডবার */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 hidden md:block">
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* মোবাইল সাইডবার ওভারলে */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* মোবাইল সাইডবার */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onLogout={handleLogout} />
      </div>

      {/* মেন কন্টেন্ট */}
      <div className="md:ml-64">
        <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">সেটিংস</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBackup} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><SaveIcon size={14} /> ব্যাকআপ</button>
            <button onClick={handleRestore} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1"><RefreshCw size={14} /> রিস্টোর</button>
            <button onClick={handleSave} disabled={saving} className="bg-[#f85606] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">{saving ? <RefreshCw size={16} className="animate-spin" /> : <SaveIcon size={16} />}{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</button>
          </div>
        </div>
        {saved && <div className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">✅ সেটিংস সংরক্ষণ করা হয়েছে!</div>}

        <div className="p-6">
          {/* ট্যাব মেনু */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id ? "bg-[#f85606] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}>{tab.icon}{tab.label}</button>))}</div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            
            {/* সাধারণ সেটিংস */}
            {activeTab === "general" && (<div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">সাইটের নাম</label><input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">সাইটের ইমেইল</label><input type="email" name="siteEmail" value={settings.siteEmail} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">ফোন নম্বর</label><input type="tel" name="sitePhone" value={settings.sitePhone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">ঠিকানা</label><input type="text" name="siteAddress" value={settings.siteAddress} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" /></div></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">সাইটের বিবরণ</label><textarea name="siteDescription" value={settings.siteDescription} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-200 rounded-xl" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">মুদ্রা</label><select name="siteCurrency" value={settings.siteCurrency} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl"><option value="BDT">BDT (৳)</option><option value="USD">USD ($)</option></select></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">টাইমজোন</label><select name="siteTimezone" value={settings.siteTimezone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl"><option value="Asia/Dhaka">Asia/Dhaka</option><option value="Asia/Kolkata">Asia/Kolkata</option></select></div></div></div>)}
            
            {/* মূল্য নির্ধারণ */}
            {activeTab === "pricing" && (<div className="space-y-4"><div className="bg-orange-50 rounded-xl p-4"><div className="flex items-center gap-3 mb-3"><Star size={20} className="text-orange-600" /><h3 className="font-semibold">ফিচার্ড লিস্টিং</h3></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-gray-600 mb-1">মূল্য (৳)</label><input type="number" name="featuredPrice" value={settings.featuredPrice} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div><div><label className="block text-sm text-gray-600 mb-1">মেয়াদ (দিন)</label><input type="number" name="featuredDays" value={settings.featuredDays} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div></div></div><div className="bg-blue-50 rounded-xl p-4"><div className="flex items-center gap-3 mb-3"><FileText size={20} className="text-blue-600" /><h3 className="font-semibold">ডকুমেন্ট সার্ভিস</h3></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-gray-600 mb-1">কমিশন (%)</label><input type="number" name="documentCommission" value={settings.documentCommission} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div><div><label className="block text-sm text-gray-600 mb-1">ন্যূনতম চার্জ (৳)</label><input type="number" name="documentMinFee" value={settings.documentMinFee} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div></div></div><div className="bg-purple-50 rounded-xl p-4"><div className="flex items-center gap-3 mb-3"><Gavel size={20} className="text-purple-600" /><h3 className="font-semibold">নিলাম</h3></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-gray-600 mb-1">বিড ফি (৳)</label><input type="number" name="bidFee" value={settings.bidFee} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div><div><label className="block text-sm text-gray-600 mb-1">জিতলে কমিশন (%)</label><input type="number" name="auctionCommission" value={settings.auctionCommission} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div><div><label className="block text-sm text-gray-600 mb-1">ন্যূনতম বিড (৳)</label><input type="number" name="auctionMinBid" value={settings.auctionMinBid} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div></div></div></div>)}
            
            {/* পেমেন্ট সেটিংস */}
            {activeTab === "payment" && (<div className="space-y-4"><div className="bg-gray-50 rounded-xl p-4"><h3 className="font-semibold mb-3">পেমেন্ট গেটওয়ে</h3><div className="flex gap-4 mb-4"><label className="flex items-center gap-2"><input type="radio" name="paymentGateway" value="sslcommerz" checked={settings.paymentGateway === "sslcommerz"} onChange={handleChange} className="w-4 h-4" /><span>SSLCommerz</span></label><label className="flex items-center gap-2"><input type="radio" name="paymentGateway" value="stripe" checked={settings.paymentGateway === "stripe"} onChange={handleChange} className="w-4 h-4" /><span>Stripe</span></label><label className="flex items-center gap-2"><input type="radio" name="paymentGateway" value="bkash" checked={settings.paymentGateway === "bkash"} onChange={handleChange} className="w-4 h-4" /><span>bKash</span></label></div>{settings.paymentGateway === "sslcommerz" && (<div className="space-y-3"><input type="text" name="sslStoreId" value={settings.sslStoreId} onChange={handleChange} placeholder="স্টোর আইডি" className="w-full p-2 border rounded-lg" /><input type="password" name="sslStorePassword" value={settings.sslStorePassword} onChange={handleChange} placeholder="স্টোর পাসওয়ার্ড" className="w-full p-2 border rounded-lg" /><select name="sslMode" value={settings.sslMode} onChange={handleChange} className="w-full p-2 border rounded-lg"><option value="sandbox">স্যান্ডবক্স (টেস্ট)</option><option value="live">লাইভ</option></select></div>)}</div></div>)}
            
            {/* নোটিফিকেশন সেটিংস */}
            {activeTab === "notification" && (<div className="space-y-4"><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">ইমেইল নোটিফিকেশন</span><p className="text-xs text-gray-400">নতুন পোস্ট, পেমেন্ট ইমেইলে পাবেন</p></div><div className="relative"><input type="checkbox" name="emailNotification" checked={settings.emailNotification} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">এসএমএস নোটিফিকেশন</span><p className="text-xs text-gray-400">OTP ও গুরুত্বপূর্ণ আপডেট এসএমএস পাবেন</p></div><div className="relative"><input type="checkbox" name="smsNotification" checked={settings.smsNotification} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">পুশ নোটিফিকেশন</span><p className="text-xs text-gray-400">ব্রাউজারে পুশ নোটিফিকেশন পাবেন</p></div><div className="relative"><input type="checkbox" name="pushNotification" checked={settings.pushNotification} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">অ্যাডমিন ইমেইল</label><input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">অ্যাডমিন ফোন</label><input type="tel" name="adminPhone" value={settings.adminPhone} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div></div><button onClick={() => setShowTestModal(true)} className="text-sm text-[#f85606] flex items-center gap-1"><Mail size={14} /> টেস্ট ইমেইল পাঠান</button></div>)}
            
            {/* নিরাপত্তা সেটিংস */}
            {activeTab === "security" && (<div className="space-y-4"><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">টু-ফ্যাক্টর অথেনটিকেশন</span><p className="text-xs text-gray-400">অ্যাডমিন লগইনে 2FA প্রয়োজন</p></div><div className="relative"><input type="checkbox" name="twoFactorRequired" checked={settings.twoFactorRequired} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">ইমেইল ভেরিফিকেশন</span><p className="text-xs text-gray-400">ইউজার রেজিস্ট্রেশনে ইমেইল ভেরিফাই প্রয়োজন</p></div><div className="relative"><input type="checkbox" name="emailVerification" checked={settings.emailVerification} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">অ্যাডমিন অ্যাপ্রুভাল</span><p className="text-xs text-gray-400">নতুন সেলার অ্যাপ্রুভ করতে হবে</p></div><div className="relative"><input type="checkbox" name="adminApproval" checked={settings.adminApproval} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">সর্বোচ্চ লগইন প্রচেষ্টা</label><input type="number" name="maxLoginAttempts" value={settings.maxLoginAttempts} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">সেশন টাইমআউট (মিনিট)</label><input type="number" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div></div></div>)}
            
            {/* পারফরম্যান্স সেটিংস */}
            {activeTab === "performance" && (<div className="space-y-4"><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">সিডিএন সক্রিয় করুন</span><p className="text-xs text-gray-400">কন্টেন্ট ডেলিভারি নেটওয়ার্ক ব্যবহার করুন</p></div><div className="relative"><input type="checkbox" name="enableCDN" checked={settings.enableCDN} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="bg-gray-50 rounded-xl p-4"><label className="flex items-center justify-between cursor-pointer"><div><span className="font-medium">অ্যানালিটিক্স সক্রিয় করুন</span><p className="text-xs text-gray-400">ভিজিটর ট্র্যাকিং ও রিপোর্ট</p></div><div className="relative"><input type="checkbox" name="enableAnalytics" checked={settings.enableAnalytics} onChange={handleChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></div></label></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">ক্যাশ ডিউরেশন (সেকেন্ড)</label><input type="number" name="cacheDuration" value={settings.cacheDuration} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">প্রতি পৃষ্ঠায় আইটেম</label><input type="number" name="itemsPerPage" value={settings.itemsPerPage} onChange={handleChange} className="w-full p-3 border rounded-xl" /></div></div></div>)}
            
            {/* সোশ্যাল সেটিংস */}
            {activeTab === "social" && (<div className="space-y-4"><div className="grid grid-cols-1 gap-4"><div><label className="block text-sm font-semibold text-gray-700 mb-2">ফেসবুক</label><input type="url" name="facebook" value={settings.facebook} onChange={handleChange} placeholder="https://facebook.com/yourpage" className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">ইনস্টাগ্রাম</label><input type="url" name="instagram" value={settings.instagram} onChange={handleChange} placeholder="https://instagram.com/yourpage" className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">টুইটার</label><input type="url" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="https://twitter.com/yourpage" className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">ইউটিউব</label><input type="url" name="youtube" value={settings.youtube} onChange={handleChange} placeholder="https://youtube.com/yourchannel" className="w-full p-3 border rounded-xl" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">হোয়াটসঅ্যাপ</label><input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleChange} placeholder="+8801XXXXXXXXX" className="w-full p-3 border rounded-xl" /></div></div></div>)}

          </div>
        </div>
      </div>

      {/* টেস্ট ইমেইল মডাল */}
      {showTestModal && (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl max-w-md w-full p-5"><h3 className="text-lg font-bold mb-4">টেস্ট ইমেইল পাঠান</h3><input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="ইমেইল ঠিকানা" className="w-full p-3 border rounded-xl mb-4" /><div className="flex gap-2"><button onClick={handleTestEmail} className="flex-1 bg-[#f85606] text-white py-2 rounded-lg">পাঠান</button><button onClick={() => setShowTestModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">বাতিল</button></div></div></div>)}

    </div>
  );
}