"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("amarduniyabd@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && localStorage.getItem("adminLoggedIn") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("লগইন চেষ্টা করা হচ্ছে..."); 
    
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      // সুপাবেস কুয়েরি
      const { data: admin, error: dbError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', email.trim())
        .eq('password', password)
        .single();

      if (dbError || !admin) {
        throw new Error("ভুল ইমেইল বা পাসওয়ার্ড!");
      }

      // সেশন ডাটা সেভ
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", (admin as any).email);
      localStorage.setItem("adminName", (admin as any).name || "Super Admin");
      
      console.log("সফল লগইন! প্রবেশ করা হচ্ছে...");
      window.location.href = "/admin";
      
    } catch (err: any) {
      console.error("Login catch error:", err.message);
      setError(err.message || "লগইন করতে সমস্যা হয়েছে!");
      setLoading(false);
    }
  }, [email, password, loading]);

  if (!mounted) return <div className="min-h-screen bg-gray-900" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-orange-500/20">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-400 text-sm mt-2">আমার দুনিয়া লিমিটেড • সিকিউর এক্সেস</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">এডমিন ইমেইল</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition-all" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">সিক্রেট পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3 pl-10 pr-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition-all" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
              {loading ? "ভেরিফাই হচ্ছে..." : "অ্যাক্সেস করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}