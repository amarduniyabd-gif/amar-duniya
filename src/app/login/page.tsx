"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isLoggedIn", "true");
      router.push("/my-account");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#f85606]">
            লগইন
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-5">
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ইমেইল</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="আপনার ইমেইল লিখুন"
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">পাসওয়ার্ড</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#f85606]">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="পাসওয়ার্ড লিখুন"
                className="flex-1 bg-transparent outline-none"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 text-[#f85606] rounded" />
              <span className="text-sm text-gray-600">মনে রাখুন</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-[#f85606] hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">অথবা</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-[#1877F2] text-white py-2 rounded-xl flex items-center justify-center gap-2">
              📘 Facebook
            </button>
            <button className="flex-1 bg-[#DB4437] text-white py-2 rounded-xl flex items-center justify-center gap-2">
              🔴 Google
            </button>
          </div>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/register" className="text-[#f85606] font-semibold hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>

      </div>
    </div>
  );
}