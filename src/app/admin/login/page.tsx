"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, Mail, Lock, Eye, EyeOff, Loader2, 
  AlertCircle, LogIn, Zap
} from "lucide-react";

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
    // আগে থেকেই লগইন করা থাকলে সরাসরি অ্যাডমিনে
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn === "true") {
      window.location.href = "/admin";
    }
  }, []);

  const goToAdmin = () => {
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminEmail", email || "admin@amarduniya.com");
    // ✅ router এর বদলে window.location ব্যবহার করো
    window.location.href = "/admin";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Dynamic import যাতে SSR এ সমস্যা না হয়
      const { getSupabaseClient } = await import('@/lib/supabase/client');
      const supabase = getSupabaseClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        setError("ইমেইল বা পাসওয়ার্ড ভুল! (কুইক লগইন ব্যবহার করুন)");
        setLoading(false);
        return;
      }

      if (data.user) {
        goToAdmin();
      } else {
        setError("লগইন ব্যর্থ! কুইক লগইন ব্যবহার করুন");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("লগইন করতে সমস্যা! নিচের সবুজ বাটন ব্যবহার করুন");
    } finally {
      setLoading(false);
    }
  };

  // ✅ কুইক অ্যাডমিন লগইন - সরাসরি ঢুকুন
  const quickAdminLogin = () => {
    goToAdmin();
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
          <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-400 text-sm mt-1">আমার দুনিয়া</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
          
          {/* ✅ কুইক লগইন সবার উপরে */}
          <button 
            type="button"
            onClick={quickAdminLogin}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg animate-pulse"
          >
            <Zap size={22} />
            ⚡ কুইক অ্যাডমিন লগইন (এখানে ক্লিক করুন)
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-800 px-3 text-gray-400">অথবা</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ইমেইল</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition" 
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
                  className="w-full p-3 pl-10 pr-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-900/30 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              admin@amarduniya.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}