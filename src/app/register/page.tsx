"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      return;
    }
    
    if (!formData.agreeTerms) {
      setError("শর্তাবলীতে সম্মতি দিন");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            রেজিস্টার
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">পূর্ণ নাম</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <User size={18} className="text-gray-400" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="আপনার নাম লিখুন" className="flex-1 bg-transparent outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <Mail size={18} className="text-gray-400" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="আপনার ইমেইল লিখুন" className="flex-1 bg-transparent outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">মোবাইল নম্বর</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <Phone size={18} className="text-gray-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="০১XXXXXXXXX" className="flex-1 bg-transparent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">অঞ্চল</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <MapPin size={18} className="text-gray-400" />
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="ঢাকা, চট্টগ্রাম..." className="flex-1 bg-transparent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">পাসওয়ার্ড</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <Lock size={18} className="text-gray-400" />
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="পাসওয়ার্ড লিখুন" className="flex-1 bg-transparent outline-none" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <Lock size={18} className="text-gray-400" />
              <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="আবার পাসওয়ার্ড লিখুন" className="flex-1 bg-transparent outline-none" required />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="w-4 h-4 text-[#f85606] rounded" required />
            <span className="text-sm text-gray-600">
              আমি <Link href="/terms" className="text-[#f85606]">শর্তাবলী</Link> পড়েছি এবং সম্মতি জানাচ্ছি
            </span>
          </label>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50">
            {isLoading ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-[#f85606] font-semibold hover:underline">
            লগইন করুন
          </Link>
        </p>

      </div>
    </div>
  );
}