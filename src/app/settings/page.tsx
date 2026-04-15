"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Lock, Eye, EyeOff, Moon, Globe, Shield, Save, CheckCircle, X, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: "bn",
    twoFactor: false,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSaveSettings = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            সেটিংস
          </h1>
        </div>

        {/* সাকসেস মেসেজ */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 animate-in fade-in">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm text-green-700">সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* নোটিফিকেশন সেকশন */}
          <div className="p-5 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f85606]/10 to-orange-500/10 flex items-center justify-center">
                <Bell size={20} className="text-[#f85606]" />
              </div>
              <h2 className="font-bold text-gray-800 text-lg">নোটিফিকেশন</h2>
            </div>
            <div className="space-y-4 ml-14">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm font-medium text-gray-700">ইমেইল নোটিফিকেশন</span>
                  <p className="text-xs text-gray-400">নতুন অফার, বিড ও আপডেট ইমেইলে পাবেন</p>
                </div>
                <div className="relative">
                  <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm font-medium text-gray-700">পুশ নোটিফিকেশন</span>
                  <p className="text-xs text-gray-400">ব্রাউজারে পুশ নোটিফিকেশন পাবেন</p>
                </div>
                <div className="relative">
                  <input type="checkbox" name="pushNotifications" checked={settings.pushNotifications} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
              </label>
            </div>
          </div>

          {/* প্রাইভেসি ও নিরাপত্তা সেকশন */}
          <div className="p-5 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f85606]/10 to-orange-500/10 flex items-center justify-center">
                <Lock size={20} className="text-[#f85606]" />
              </div>
              <h2 className="font-bold text-gray-800 text-lg">প্রাইভেসি ও নিরাপত্তা</h2>
            </div>
            <div className="space-y-4 ml-14">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm font-medium text-gray-700">টু-ফ্যাক্টর অথেনটিকেশন</span>
                  <p className="text-xs text-gray-400">অতিরিক্ত নিরাপত্তার জন্য 2FA সক্রিয় করুন</p>
                </div>
                <div className="relative">
                  <input type="checkbox" name="twoFactor" checked={settings.twoFactor} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
              </label>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left text-sm text-[#f85606] flex items-center gap-2 hover:underline"
              >
                <EyeOff size={14} /> পাসওয়ার্ড পরিবর্তন করুন
              </button>
            </div>
          </div>

          {/* প্রেফারেন্স সেকশন */}
          <div className="p-5 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#f85606]/10 to-orange-500/10 flex items-center justify-center">
                <Globe size={20} className="text-[#f85606]" />
              </div>
              <h2 className="font-bold text-gray-800 text-lg">প্রেফারেন্স</h2>
            </div>
            <div className="space-y-4 ml-14">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm font-medium text-gray-700">ডার্ক মোড</span>
                  <p className="text-xs text-gray-400">ডার্ক থিম ব্যবহার করুন</p>
                </div>
                <div className="relative">
                  <input type="checkbox" name="darkMode" checked={settings.darkMode} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#f85606] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </div>
              </label>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">ভাষা</span>
                  <p className="text-xs text-gray-400">আপনার পছন্দের ভাষা নির্বাচন করুন</p>
                </div>
                <select name="language" value={settings.language} onChange={handleChange} className="p-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#f85606]">
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* সেভ বাটন */}
          <div className="p-5 bg-gray-50">
            <button 
              onClick={handleSaveSettings}
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Save size={18} className="group-hover:scale-110 transition" />
              সেটিংস সংরক্ষণ করুন
            </button>
          </div>

        </div>
      </div>

      {/* পাসওয়ার্ড পরিবর্তন মডাল */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
                পাসওয়ার্ড পরিবর্তন করুন
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বর্তমান পাসওয়ার্ড</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">নতুন পাসওয়ার্ড</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  placeholder="নতুন পাসওয়ার্ড লিখুন"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  placeholder="আবার পাসওয়ার্ড লিখুন"
                />
              </div>
              <button 
                onClick={handlePasswordChange}
                className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> পাসওয়ার্ড পরিবর্তন করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}