"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bell, Lock, EyeOff, Shield, Save, CheckCircle, X, AlertCircle,
  User, Mail, Phone, MapPin, Globe, Moon, Sun, Smartphone, CreditCard,
  FileText, Trash2, LogOut, ChevronRight, Eye, EyeOff as EyeOffIcon,
  Key, Fingerprint, ShieldCheck, History, Download, Upload, Database
} from "lucide-react";

export default function UserSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'notification' | 'security' | 'privacy' | 'payment' | 'data'>('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============ প্রোফাইল সেটিংস ============
  const [profile, setProfile] = useState({
    fullName: "রহিম উদ্দিন",
    email: "rahim@gmail.com",
    phone: "01712345678",
    district: "ঢাকা",
    address: "মিরপুর, ঢাকা",
    bio: "প্রফেশনাল বিক্রেতা | ৫ বছর অভিজ্ঞতা",
    language: "bn",
    theme: "light",
  });

  // ============ নোটিফিকেশন সেটিংস ============
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewMessage: true,
    emailNewBid: true,
    emailPaymentSuccess: true,
    emailNewsletter: false,
    pushNewMessage: true,
    pushBidUpdate: true,
    pushPostApproved: true,
    smsPaymentSuccess: false,
    smsBidOutbid: true,
  });

  // ============ সিকিউরিটি সেটিংস ============
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    trustedDevices: [] as string[],
  });

  // ============ পাসওয়ার্ড ডাটা ============
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // ============ প্রাইভেসি সেটিংস ============
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, registered, private
    showPhone: true,
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    blockList: [] as string[],
  });

  // ============ পেমেন্ট মেথড ============
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'bkash', number: '01712345678', isDefault: true },
    { id: 2, type: 'nagad', number: '01712345678', isDefault: false },
  ]);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে সেটিংস লোড
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    
    const savedNotifications = localStorage.getItem("userNotifications");
    if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
  }, []);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ============ সেভ হ্যান্ডলার ============
  const handleSaveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    showSuccessMessage("✅ প্রোফাইল তথ্য সংরক্ষণ করা হয়েছে!");
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("userNotifications", JSON.stringify(notificationSettings));
    showSuccessMessage("✅ নোটিফিকেশন সেটিংস সংরক্ষণ করা হয়েছে!");
  };

  const handleSavePrivacy = () => {
    localStorage.setItem("userPrivacy", JSON.stringify(privacySettings));
    showSuccessMessage("✅ প্রাইভেসি সেটিংস সংরক্ষণ করা হয়েছে!");
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    setPasswordError("");
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showSuccessMessage("✅ পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
  };

  const handleDeleteAccount = () => {
    if (confirm("আপনি কি নিশ্চিত আপনি আপনার অ্যাকাউন্ট ডিলিট করতে চান?")) {
      localStorage.clear();
      router.push("/login");
    }
  };

  const handleExportData = () => {
    const userData = {
      profile,
      notificationSettings,
      privacySettings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amar-duniya-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showSuccessMessage("✅ আপনার ডাটা এক্সপোর্ট করা হয়েছে!");
  };

  const bangladeshDistricts = ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            সেটিংস
          </h1>
        </div>

        {/* সাকসেস মেসেজ */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 animate-in slide-in-from-top">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* সাইডবার ট্যাব */}
          <div className="md:w-64 bg-white rounded-2xl shadow-lg p-3 h-fit">
            {[
              { id: 'profile', label: 'প্রোফাইল', icon: <User size={18} /> },
              { id: 'notification', label: 'নোটিফিকেশন', icon: <Bell size={18} /> },
              { id: 'security', label: 'নিরাপত্তা', icon: <Shield size={18} /> },
              { id: 'privacy', label: 'প্রাইভেসি', icon: <EyeOff size={18} /> },
              { id: 'payment', label: 'পেমেন্ট মেথড', icon: <CreditCard size={18} /> },
              { id: 'data', label: 'ডাটা ও স্টোরেজ', icon: <Database size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
                <ChevronRight size={14} className={`ml-auto ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>

          {/* মেইন কন্টেন্ট */}
          <div className="flex-1">
            
            {/* ============ প্রোফাইল ট্যাব ============ */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User size={20} className="text-[#f85606]" /> প্রোফাইল তথ্য
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">পূর্ণ নাম</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">জেলা</label>
                      <select value={profile.district} onChange={(e) => setProfile({...profile, district: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606]">
                        {bangladeshDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                      <textarea value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} rows={2} className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বায়ো</label>
                    <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ভাষা</label>
                      <select value={profile.language} onChange={(e) => setProfile({...profile, language: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl">
                        <option value="bn">বাংলা</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">থিম</label>
                      <div className="flex gap-2">
                        <button onClick={() => setProfile({...profile, theme: 'light'})} className={`flex-1 p-3 border rounded-xl flex items-center justify-center gap-2 ${profile.theme === 'light' ? 'border-[#f85606] bg-orange-50' : 'border-gray-200'}`}>
                          <Sun size={16} /> লাইট
                        </button>
                        <button onClick={() => setProfile({...profile, theme: 'dark'})} className={`flex-1 p-3 border rounded-xl flex items-center justify-center gap-2 ${profile.theme === 'dark' ? 'border-[#f85606] bg-orange-50' : 'border-gray-200'}`}>
                          <Moon size={16} /> ডার্ক
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={handleSaveProfile} className="mt-6 w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Save size={18} /> সংরক্ষণ করুন
                </button>
              </div>
            )}

            {/* ============ নোটিফিকেশন ট্যাব ============ */}
            {activeTab === 'notification' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Bell size={20} className="text-[#f85606]" /> নোটিফিকেশন সেটিংস
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">ইমেইল নোটিফিকেশন</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'emailNewMessage', label: 'নতুন মেসেজ' },
                        { key: 'emailNewBid', label: 'নতুন বিড' },
                        { key: 'emailPaymentSuccess', label: 'পেমেন্ট সফল' },
                        { key: 'emailNewsletter', label: 'নিউজলেটার ও অফার' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-sm">{item.label}</span>
                          <input type="checkbox" checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean} onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})} className="w-4 h-4" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">পুশ নোটিফিকেশন</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'pushNewMessage', label: 'নতুন মেসেজ' },
                        { key: 'pushBidUpdate', label: 'বিড আপডেট' },
                        { key: 'pushPostApproved', label: 'পোস্ট অ্যাপ্রুভ' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-sm">{item.label}</span>
                          <input type="checkbox" checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean} onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})} className="w-4 h-4" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">SMS নোটিফিকেশন</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'smsPaymentSuccess', label: 'পেমেন্ট সফল' },
                        { key: 'smsBidOutbid', label: 'বিড আউটবিড' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-sm">{item.label}</span>
                          <input type="checkbox" checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean} onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})} className="w-4 h-4" />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleSaveNotifications} className="mt-6 w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Save size={18} /> সংরক্ষণ করুন
                </button>
              </div>
            )}

            {/* ============ নিরাপত্তা ট্যাব ============ */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-[#f85606]" /> নিরাপত্তা সেটিংস
                </h2>
                
                <div className="space-y-4">
                  <button onClick={() => setShowPasswordModal(true)} className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <Key size={18} className="text-[#f85606]" />
                      <span className="font-medium">পাসওয়ার্ড পরিবর্তন করুন</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Fingerprint size={18} className="text-[#f85606]" />
                      <div>
                        <span className="font-medium">টু-ফ্যাক্টর অথেনটিকেশন</span>
                        <p className="text-xs text-gray-400">অতিরিক্ত নিরাপত্তার জন্য</p>
                      </div>
                    </div>
                    <input type="checkbox" checked={securitySettings.twoFactorEnabled} onChange={(e) => setSecuritySettings({...securitySettings, twoFactorEnabled: e.target.checked})} className="w-4 h-4" />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-[#f85606]" />
                      <div>
                        <span className="font-medium">লগইন অ্যালার্ট</span>
                        <p className="text-xs text-gray-400">নতুন ডিভাইস থেকে লগইন হলে নোটিফিকেশন</p>
                      </div>
                    </div>
                    <input type="checkbox" checked={securitySettings.loginAlerts} onChange={(e) => setSecuritySettings({...securitySettings, loginAlerts: e.target.checked})} className="w-4 h-4" />
                  </div>

                  <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <Smartphone size={18} className="text-[#f85606]" />
                      <span className="font-medium">ট্রাস্টেড ডিভাইস</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <History size={18} className="text-[#f85606]" />
                      <span className="font-medium">লগইন হিস্ট্রি</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ============ প্রাইভেসি ট্যাব ============ */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <EyeOff size={20} className="text-[#f85606]" /> প্রাইভেসি সেটিংস
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">প্রোফাইল ভিজিবিলিটি</label>
                    <select value={privacySettings.profileVisibility} onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl">
                      <option value="public">সবার জন্য উন্মুক্ত</option>
                      <option value="registered">শুধু রেজিস্টার্ড ইউজার</option>
                      <option value="private">শুধু আমি</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'showPhone', label: 'ফোন নম্বর দেখান' },
                      { key: 'showEmail', label: 'ইমেইল দেখান' },
                      { key: 'showLocation', label: 'লোকেশন দেখান' },
                      { key: 'allowMessages', label: 'মেসেজ গ্রহণ করুন' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm">{item.label}</span>
                        <input type="checkbox" checked={privacySettings[item.key as keyof typeof privacySettings] as boolean} onChange={(e) => setPrivacySettings({...privacySettings, [item.key]: e.target.checked})} className="w-4 h-4" />
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={handleSavePrivacy} className="mt-6 w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                  <Save size={18} /> সংরক্ষণ করুন
                </button>
              </div>
            )}

            {/* ============ পেমেন্ট মেথড ট্যাব ============ */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#f85606]" /> পেমেন্ট মেথড
                </h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          method.type === 'bkash' ? 'bg-pink-500' : 'bg-orange-500'
                        }`}>
                          {method.type === 'bkash' ? 'বি' : 'ন'}
                        </div>
                        <div>
                          <p className="font-medium">{method.type === 'bkash' ? 'bKash' : 'Nagad'}</p>
                          <p className="text-xs text-gray-400">{method.number}</p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">ডিফল্ট</span>
                      )}
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:border-[#f85606] hover:text-[#f85606] transition">
                  + নতুন পেমেন্ট মেথড যোগ করুন
                </button>
              </div>
            )}

            {/* ============ ডাটা ট্যাব ============ */}
            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Database size={20} className="text-[#f85606]" /> ডাটা ও স্টোরেজ
                </h2>
                
                <div className="space-y-4">
                  <button onClick={handleExportData} className="w-full p-4 bg-blue-50 rounded-xl flex items-center justify-between hover:bg-blue-100 transition">
                    <div className="flex items-center gap-3">
                      <Download size={18} className="text-blue-600" />
                      <div>
                        <span className="font-medium text-blue-700">আপনার ডাটা এক্সপোর্ট করুন</span>
                        <p className="text-xs text-blue-500">JSON ফরম্যাটে ডাউনলোড</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-blue-600" />
                  </button>

                  <button className="w-full p-4 bg-green-50 rounded-xl flex items-center justify-between hover:bg-green-100 transition">
                    <div className="flex items-center gap-3">
                      <Upload size={18} className="text-green-600" />
                      <div>
                        <span className="font-medium text-green-700">ডাটা ইম্পোর্ট করুন</span>
                        <p className="text-xs text-green-500">পূর্বে এক্সপোর্ট করা ডাটা</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-green-600" />
                  </button>

                  <button onClick={() => setShowDeleteConfirm(true)} className="w-full p-4 bg-red-50 rounded-xl flex items-center justify-between hover:bg-red-100 transition">
                    <div className="flex items-center gap-3">
                      <Trash2 size={18} className="text-red-600" />
                      <div>
                        <span className="font-medium text-red-700">অ্যাকাউন্ট ডিলিট করুন</span>
                        <p className="text-xs text-red-500">স্থায়ীভাবে সব ডাটা মুছে ফেলুন</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* পাসওয়ার্ড মডাল */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">পাসওয়ার্ড পরিবর্তন</h3>
              <button onClick={() => setShowPasswordModal(false)}><X size={20} /></button>
            </div>
            
            {passwordError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600">{passwordError}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showCurrentPassword ? "text" : "password"} placeholder="বর্তমান পাসওয়ার্ড" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full pl-10 pr-10 p-3 border rounded-xl" />
                <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showCurrentPassword ? <EyeOffIcon size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showNewPassword ? "text" : "password"} placeholder="নতুন পাসওয়ার্ড" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full pl-10 pr-10 p-3 border rounded-xl" />
                <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showNewPassword ? <EyeOffIcon size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showConfirmPassword ? "text" : "password"} placeholder="পাসওয়ার্ড নিশ্চিত করুন" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full pl-10 pr-10 p-3 border rounded-xl" />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showConfirmPassword ? <EyeOffIcon size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button onClick={handlePasswordChange} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold">পরিবর্তন করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* ডিলিট কনফার্মেশন */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">অ্যাকাউন্ট ডিলিট করবেন?</h3>
              <p className="text-sm text-gray-500 mb-6">আপনার সব ডাটা স্থায়ীভাবে মুছে যাবে। এই কাজটি আনডু করা যাবে না।</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">বাতিল</button>
                <button onClick={handleDeleteAccount} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold">ডিলিট করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}