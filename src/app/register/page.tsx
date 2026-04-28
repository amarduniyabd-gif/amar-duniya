"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, 
  Loader2, CheckCircle, AlertCircle, Shield 
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "নাম আবশ্যক";
    if (!formData.phone.trim()) newErrors.phone = "ফোন নম্বর আবশ্যক";
    else if (!/^01[0-9]{9}$/.test(formData.phone)) newErrors.phone = "সঠিক মোবাইল নম্বর দিন";
    
    if (!formData.email.trim()) newErrors.email = "ইমেইল আবশ্যক";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "সঠিক ইমেইল দিন";
    
    if (!formData.password) newErrors.password = "পাসওয়ার্ড আবশ্যক";
    else if (formData.password.length < 6) newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "পাসওয়ার্ড মিলছে না";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");

    try {
      const supabaseClient = supabase();
      
      // ১. ইউজার রেজিস্টার
      const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
          setError("এই ইমেইলটি ইতিমধ্যে রেজিস্টার করা আছে!");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        // ২. প্রোফাইল তৈরি
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          });

        if (profileError) {
          console.error("Profile error:", profileError);
          setError(profileError.message || "প্রোফাইল তৈরি করতে সমস্যা হয়েছে!");
          setLoading(false);
          return;
        }

        // সাকসেস স্টেট
        setSuccess(true);
        
        // লোকাল স্টোরেজে সেভ (অপশনাল)
        localStorage.setItem("registeredEmail", formData.email);
        
        // ২ সেকেন্ড পর লগইন পেজে রিডাইরেক্ট
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("রেজিস্ট্রেশন করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, router]);

  // সাকসেস স্ক্রিন
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">রেজিস্ট্রেশন সফল!</h2>
            <p className="text-gray-500 mb-4">
              আপনার অ্যাকাউন্ট তৈরি হয়েছে। লগইন পেজে নিয়ে যাওয়া হচ্ছে...
            </p>
            <Loader2 size={24} className="animate-spin text-[#f85606] mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => router.back()} 
          className="mb-4 p-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">রেজিস্টার করুন</h1>
            <p className="text-gray-500 text-sm mt-1">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* নাম */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="আপনার পূর্ণ নাম"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition ${
                    errors.name ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                  }`}
                  required
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            {/* ফোন */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="০১XXXXXXXXX"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition ${
                    errors.phone ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                  }`}
                  required
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            {/* ইমেইল */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition ${
                    errors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            {/* পাসওয়ার্ড */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition ${
                    errors.password ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                  }`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            {/* কনফার্ম পাসওয়ার্ড */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition ${
                    errors.confirmPassword ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            
            {/* টার্মস */}
            <div className="text-xs text-gray-500 text-center">
              রেজিস্টার করার মাধ্যমে আপনি আমাদের{" "}
              <Link href="/terms" className="text-[#f85606] hover:underline">শর্তাবলী</Link>
              {" "}এবং{" "}
              <Link href="/privacy" className="text-[#f85606] hover:underline">প্রাইভেসি পলিসি</Link>
              {" "}মেনে নিচ্ছেন।
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  রেজিস্টার হচ্ছে...
                </>
              ) : (
                "রেজিস্টার করুন"
              )}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-[#f85606] font-semibold hover:underline">
              লগইন করুন
            </Link>
          </p>
          
          {/* ডেমো তথ্য */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              ডেমো: test@email.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}