"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bell, Shield, EyeOff, Save, CheckCircle, X, AlertCircle,
  User, Mail, Phone, MapPin, CreditCard,
  FileText, LogOut, ChevronRight, Eye, Key, Database, Download, Upload, Lock
} from "lucide-react";

export default function UserSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'notification' | 'security' | 'privacy' | 'payment' | 'data'>('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // ============ পাসওয়ার্ড মডার্ন স্টেট ============
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // রিয়েল-টাইম এরর ও ভ্যালিডেশন
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============ ফরগট পাসওয়ার্ড মডাল ============
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPasswordData, setNewPasswordData] = useState({ password: "", confirm: "" });

  const [profile, setProfile] = useState({
    fullName: "রহিম উদ্দিন",
    email: "rahim@gmail.com",
    phone: "01712345678",
    district: "ঢাকা",
    address: "মিরপুর, ঢাকা",
    bio: "প্রফেশনাল বিক্রেতা | ৫ বছর অভিজ্ঞতা",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewMessage: true,
    emailNewBid: true,
    emailPaymentSuccess: true,
    pushNewMessage: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showPhone: true,
    showEmail: false,
    showLocation: true,
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'bkash', number: '01712345678', isDefault: true },
  ]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // ============ রিয়েল-টাইম পাসওয়ার্ড ভ্যালিডেশন ============
  useEffect(() => {
    const errors = { current: "", new: "", confirm: "" };
    
    if (passwordData.newPassword) {
      if (passwordData.newPassword.length < 6) {
        errors.new = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
      }
    }
    
    if (passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        errors.confirm = "পাসওয়ার্ড মিলছে না";
      }
    }

    setPasswordErrors(errors);
    setIsPasswordValid(
      passwordData.currentPassword.length > 0 &&
      passwordData.newPassword.length >= 6 &&
      passwordData.newPassword === passwordData.confirmPassword
    );
  }, [passwordData]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ============ মডার্ন পাসওয়ার্ড পরিবর্তন ============
  const handlePasswordChange = () => {
    if (!isPasswordValid) return;
    
    // লোকাল স্টোরেজে পাসওয়ার্ড সেভ (Supabase রেডি হলে এখানে API কল হবে)
    localStorage.setItem("userPassword", passwordData.newPassword);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showSuccessMessage("✅ পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
  };

  // ============ ফরগট পাসওয়ার্ড ফাংশন ============
  const handleSendResetEmail = () => {
    if (!forgotEmail) {
      alert("ইমেইল ঠিকানা দিন");
      return;
    }
    setForgotStep('otp');
    alert(`📧 ${forgotEmail} এ একটি OTP পাঠানো হয়েছে!\n🔐 ডেমো OTP: 123456`);
  };

  const handleVerifyOtp = () => {
    if (forgotOtp === "123456") {
      setForgotStep('newPassword');
    } else {
      alert("❌ ভুল OTP! সঠিক OTP: 123456");
    }
  };

  const handleSetNewPassword = () => {
    if (newPasswordData.password !== newPasswordData.confirm) {
      alert("পাসওয়ার্ড মিলছে না");
      return;
    }
    if (newPasswordData.password.length < 6) {
      alert("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }
    
    localStorage.setItem("userPassword", newPasswordData.password);
    setShowForgotPasswordModal(false);
    setForgotStep('email');
    setForgotEmail("");
    setForgotOtp("");
    setNewPasswordData({ password: "", confirm: "" });
    showSuccessMessage("✅ নতুন পাসওয়ার্ড সেট করা হয়েছে! এখন লগইন করুন।");
  };

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

  const handleExportData = () => {
    const userData = { profile, notificationSettings, privacySettings, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amar-duniya-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showSuccessMessage("✅ আপনার ডাটা এক্সপোর্ট করা হয়েছে!");
  };

  const handleLogoutAllDevices = () => {
    if (confirm("সব ডিভাইস থেকে লগআউট করবেন?")) {
      localStorage.clear();
      router.push("/login");
    }
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
              { id: 'payment', label: 'পেমেন্ট', icon: <CreditCard size={18} /> },
              { id: 'data', label: 'ডাটা', icon: <Database size={18} /> },
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
                      <input type="text" value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#f85606] outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                      <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#f85606] outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর</label>
                      <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#f85606] outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">জেলা</label>
                      <select value={profile.district} onChange={(e) => setProfile({...profile, district: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#f85606] outline-none transition">
                        {bangladeshDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                    <textarea value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} rows={2} className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#f85606] outline-none transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বায়ো</label>
                    <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows={3} className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#f85606] outline-none transition" />
                  </div>
                </div>

                <button onClick={handleSaveProfile} className="mt-6 w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition">
                  <Save size={18} /> সংরক্ষণ করুন
                </button>
              </div>
            )}

            {/* ============ নোটিফিকেশন ট্যাব ============ */}
            {activeTab === 'notification' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">নোটিফিকেশন সেটিংস</h2>
                <div className="space-y-3">
                  {[
                    { key: 'emailNewMessage', label: 'ইমেইল: নতুন মেসেজ' },
                    { key: 'emailNewBid', label: 'ইমেইল: নতুন বিড' },
                    { key: 'emailPaymentSuccess', label: 'ইমেইল: পেমেন্ট সফল' },
                    { key: 'pushNewMessage', label: 'পুশ: নতুন মেসেজ' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">{item.label}</span>
                      <input type="checkbox" checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean} onChange={(e) => setNotificationSettings({...notificationSettings, [item.key]: e.target.checked})} className="w-4 h-4" />
                    </label>
                  ))}
                </div>
                <button onClick={handleSaveNotifications} className="mt-6 w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                  <Save size={18} /> সংরক্ষণ করুন
                </button>
              </div>
            )}

            {/* ============ নিরাপত্তা ট্যাব (মডার্ন পাসওয়ার্ড) ============ */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-[#f85606]" /> নিরাপত্তা সেটিংস
                </h2>
                
                {/* মডার্ন পাসওয়ার্ড চেঞ্জ ফর্ম */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4">
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Lock size={16} className="text-[#f85606]" /> পাসওয়ার্ড পরিবর্তন
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">বর্তমান পাসওয়ার্ড</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          value={passwordData.currentPassword} 
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                          className={`w-full p-3 pr-10 border rounded-xl bg-white focus:outline-none transition ${
                            passwordErrors.current ? 'border-red-300' : 'border-gray-200 focus:border-[#f85606]'
                          }`}
                          placeholder="••••••••"
                        />
                        <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">নতুন পাসওয়ার্ড</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          value={passwordData.newPassword} 
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} 
                          className={`w-full p-3 pr-10 border rounded-xl bg-white focus:outline-none transition ${
                            passwordErrors.new ? 'border-red-300' : 'border-gray-200 focus:border-[#f85606]'
                          }`}
                          placeholder="কমপক্ষে ৬ অক্ষর"
                        />
                        <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.new && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {passwordErrors.new}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          value={passwordData.confirmPassword} 
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                          className={`w-full p-3 pr-10 border rounded-xl bg-white focus:outline-none transition ${
                            passwordErrors.confirm ? 'border-red-300' : 'border-gray-200 focus:border-[#f85606]'
                          }`}
                          placeholder="পুনরায় লিখুন"
                        />
                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.confirm && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {passwordErrors.confirm}
                        </p>
                      )}
                    </div>

                    {/* Password Strength Indicator */}
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 flex-1 rounded-full transition-all ${
                            passwordData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-xs text-gray-500">
                            {passwordData.newPassword.length >= 6 ? '✅ শক্তিশালী' : '⚠️ দুর্বল'}
                          </span>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handlePasswordChange} 
                      disabled={!isPasswordValid}
                      className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                        isPasswordValid 
                          ? 'bg-gradient-to-r from-[#f85606] to-orange-500 text-white hover:shadow-lg' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Key size={16} /> পাসওয়ার্ড আপডেট করুন
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* ফরগট পাসওয়ার্ড */}
                  <button onClick={() => setShowForgotPasswordModal(true)} className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-[#f85606]" />
                      <div className="text-left">
                        <span className="font-medium">পাসওয়ার্ড ভুলে গেছেন?</span>
                        <p className="text-xs text-gray-400">ইমেইলের মাধ্যমে রিসেট করুন</p>
                      </div>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  {/* সব ডিভাইস লগআউট */}
                  <button onClick={handleLogoutAllDevices} className="w-full p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <LogOut size={18} className="text-red-500" />
                      <span className="font-medium text-red-600">সব ডিভাইস থেকে লগআউট</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ============ প্রাইভেসি ট্যাব ============ */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">প্রাইভেসি সেটিংস</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">প্রোফাইল ভিজিবিলিটি</label>
                    <select value={privacySettings.profileVisibility} onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})} className="w-full p-3 border rounded-xl">
                      <option value="public">সবার জন্য উন্মুক্ত</option>
                      <option value="registered">শুধু রেজিস্টার্ড ইউজার</option>
                      <option value="private">শুধু আমি</option>
                    </select>
                  </div>
                  {[
                    { key: 'showPhone', label: 'ফোন নম্বর দেখান' },
                    { key: 'showEmail', label: 'ইমেইল দেখান' },
                    { key: 'showLocation', label: 'লোকেশন দেখান' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">{item.label}</span>
                      <input type="checkbox" checked={privacySettings[item.key as keyof typeof privacySettings] as boolean} onChange={(e) => setPrivacySettings({...privacySettings, [item.key]: e.target.checked})} className="w-4 h-4" />
                    </label>
                  ))}
                </div>
                <button onClick={handleSavePrivacy} className="mt-6 w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold">
                  <Save size={18} /> সংরক্ষণ করুন
                </button>
              </div>
            )}

            {/* ============ পেমেন্ট ট্যাব ============ */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">পেমেন্ট মেথড</h2>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${method.type === 'bkash' ? 'bg-pink-500' : 'bg-orange-500'}`}>
                        {method.type === 'bkash' ? 'বি' : 'ন'}
                      </div>
                      <div>
                        <p className="font-medium">{method.type === 'bkash' ? 'bKash' : 'Nagad'}</p>
                        <p className="text-xs text-gray-400">{method.number}</p>
                      </div>
                    </div>
                    {method.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">ডিফল্ট</span>}
                  </div>
                ))}
                <button className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-xl">+ নতুন পেমেন্ট মেথড</button>
              </div>
            )}

            {/* ============ ডাটা ট্যাব ============ */}
            {activeTab === 'data' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6">ডাটা ও স্টোরেজ</h2>
                <div className="space-y-3">
                  <button onClick={handleExportData} className="w-full p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download size={18} className="text-blue-600" />
                      <span className="font-medium text-blue-700">আপনার ডাটা এক্সপোর্ট করুন</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                  <button className="w-full p-4 bg-green-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Upload size={18} className="text-green-600" />
                      <span className="font-medium text-green-700">ডাটা ইম্পোর্ট করুন</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ============ ফরগট পাসওয়ার্ড মডাল ============ */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">পাসওয়ার্ড রিসেট</h3>
              <button onClick={() => { setShowForgotPasswordModal(false); setForgotStep('email'); }}><X size={20} /></button>
            </div>

            {forgotStep === 'email' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">আপনার ইমেইল ঠিকানা দিন। আমরা একটি OTP পাঠাবো।</p>
                <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your@email.com" className="w-full p-3 border rounded-xl" />
                <button onClick={handleSendResetEmail} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold">OTP পাঠান</button>
              </div>
            )}

            {forgotStep === 'otp' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{forgotEmail} এ পাঠানো ৬ ডিজিটের OTP দিন।</p>
                <input type="text" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="123456" maxLength={6} className="w-full p-3 border rounded-xl text-center text-2xl" />
                <button onClick={handleVerifyOtp} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold">ভেরিফাই করুন</button>
                <button onClick={() => setForgotStep('email')} className="w-full text-gray-500 text-sm">↩️ ইমেইল পরিবর্তন</button>
              </div>
            )}

            {forgotStep === 'newPassword' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">নতুন পাসওয়ার্ড সেট করুন।</p>
                <input type="password" value={newPasswordData.password} onChange={(e) => setNewPasswordData({...newPasswordData, password: e.target.value})} placeholder="নতুন পাসওয়ার্ড" className="w-full p-3 border rounded-xl" />
                <input type="password" value={newPasswordData.confirm} onChange={(e) => setNewPasswordData({...newPasswordData, confirm: e.target.value})} placeholder="পাসওয়ার্ড নিশ্চিত করুন" className="w-full p-3 border rounded-xl" />
                <button onClick={handleSetNewPassword} className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold">পাসওয়ার্ড সেট করুন</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}