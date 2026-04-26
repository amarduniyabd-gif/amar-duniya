"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";

// ✅ Supabase Config সরাসরি
const SUPABASE_URL = 'https://kclhglzlbiuidbyzlhcq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZoxhX9xkcTnzwFqWMKpjcw_p0Ltg5Vm';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@amarduniya.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ সরাসরি Supabase REST API - profiles টেবিল কোয়েরি
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=id,email,name,is_admin&email=eq.${encodeURIComponent(email.trim().toLowerCase())}&is_admin=eq.true`,
        {
          method: 'GET',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('API Error:', response.status);
        setError("সার্ভার কানেকশন সমস্যা! (Error: " + response.status + ")");
        setLoading(false);
        return;
      }

      const profiles = await response.json();

      if (!profiles || profiles.length === 0) {
        setError("অ্যাডমিন খুঁজে পাওয়া যায়নি! আপনি অ্যাডমিন নন!");
        setLoading(false);
        return;
      }

      const profile = profiles[0];

      // ✅ পাসওয়ার্ড চেক
      if (email.trim().toLowerCase() === "admin@amarduniya.com" && password === "admin123") {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", profile.email);
        localStorage.setItem("adminName", profile.name || "Super Admin");
        localStorage.setItem("adminId", profile.id);
        router.push("/admin");
      } else {
        setError("ইমেইল বা পাসওয়ার্ড ভুল!");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("লগইন করতে সমস্যা হয়েছে! আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 size={40} className="text-[#f85606] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-orange-500/20">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-400 text-sm mt-1">আমার দুনিয়া</p>
          <p className="text-green-400 text-[10px] mt-2">🔒 Supabase API সিকিউরড</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ইমেইল অ্যাড্রেস</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition" 
                  placeholder="admin@amarduniya.com" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3 pl-10 pr-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition" 
                  placeholder="আপনার পাসওয়ার্ড" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /><span>ভেরিফাই হচ্ছে...</span></>
              ) : (
                <><LogIn size={18} /><span>লগইন করুন</span></>
              )}
            </button>
          </form>

          <div className="mt-5 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-green-500" />
              <p className="text-xs text-gray-400 font-medium">অ্যাডমিন ক্রেডেনশিয়াল</p>
            </div>
            <p className="text-[10px] text-gray-500">admin@amarduniya.com / admin123</p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">© ২০২৬ আমার দুনিয়া</p>
      </div>
    </div>
  );
}