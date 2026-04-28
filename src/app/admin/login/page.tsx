"use client";
import { useState, useEffect } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("amarduniyabd@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // যদি আগে থেকেই লগইন করা থাকে তবে কুকি ক্লিয়ার করে ফ্রেশ লগইন সুযোগ দেওয়া
    // এটি রিডাইরেক্ট লুপ ভাঙতে সাহায্য করবে
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError("");

    // নিরাপত্তা টাইমার (যদি সুপাবেস ১০ সেকেন্ডেও রেসপন্স না দেয়)
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("সার্ভার থেকে রেসপন্স আসছে না। ইন্টারনাল নেটওয়ার্ক বা Supabase Key চেক করুন।");
      }
    }, 10000);

    try {
      console.log("প্রচেষ্টা শুরু: ", email);

      // ১. ডাটাবেস থেকে অ্যাডমিন প্রোফাইল খোঁজা
      const { data: admin, error: dbError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', email.trim())
        .eq('password', password) // ডাটাবেসে পাসওয়ার্ড Plain Text থাকতে হবে
        .single();

      clearTimeout(timer);

      if (dbError) {
        console.error("Supabase Error:", dbError);
        // যদি RLS পলিসি ব্লক করে তবে এই এরর আসবে
        if (dbError.code === "PGRST116") throw new Error("ভুল ইমেইল বা পাসওয়ার্ড!");
        throw new Error(dbError.message || "ডাটাবেস কানেকশন এরর!");
      }

      if (!admin) {
        throw new Error("অ্যাডমিন তথ্য পাওয়া যায়নি!");
      }

      // ২. সেশন ডাটা সেট করা
      localStorage.setItem("adminLoggedIn", "true");
      // কুকি সেট করার সময় আধুনিক সিকিউরিটি প্রোটোকল ব্যবহার
      document.cookie = `adminLoggedIn=true; path=/; max-age=86400; SameSite=Lax`;

      console.log("লগইন সফল! ড্যাশবোর্ডে পাঠানো হচ্ছে...");

      // ৩. সরাসরি হার্ড রিডাইরেক্ট
      window.location.replace("/admin");
      
    } catch (err: any) {
      clearTimeout(timer);
      console.error("Login Process Error:", err);
      setError(err.message || "লগইন করতে সমস্যা হয়েছে!");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* ব্র্যান্ডিং */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-600/20 rotate-3">
            <Shield size={42} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-6 tracking-tight">Admin Login</h1>
          <p className="text-slate-400 mt-2">আমার দুনিয়া লিমিটেড অ্যাডমিন প্যানেল</p>
        </div>

        {/* লগইন ফর্ম কার্ড */}
        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* ইমেইল */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" 
                  placeholder="admin@example.com"
                  required 
                />
              </div>
            </div>

            {/* পাসওয়ার্ড */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative group">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" 
                  placeholder="••••••••"
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* এরর মেসেজ */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* সাবমিট বাটন */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>ভেরিফাই হচ্ছে...</span>
                </>
              ) : (
                <span>অ্যাক্সেস করুন</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}