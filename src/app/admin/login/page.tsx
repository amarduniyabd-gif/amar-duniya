"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";

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
    
    // ✅ আগে থেকেই লগইন করা থাকলে token চেক করে redirect
    const accessToken = localStorage.getItem("access_token");
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    
    if (adminLoggedIn === "true" && accessToken) {
      router.push("/admin");
    }
  }, [router]);

  // ✅ রিয়েল Supabase Auth - REST API দিয়ে
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setError("Supabase কনফিগারেশন নেই!");
        setLoading(false);
        return;
      }

      // ✅ সরাসরি Supabase Auth REST API
      const response = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.access_token) {
        // ✅ সফল! Supabase auth.users এ ভেরিফাই হয়েছে!
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("access_token", data.access_token);
        
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        
        router.push("/admin");
      } else if (response.status === 400) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল! (Supabase Auth ভেরিফাই ফেইল)");
      } else {
        console.error("Auth error:", data);
        setError(`লগইন ব্যর্থ! (${data.error_description || data.msg || 'Supabase Auth Error'})`);
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
        
        {/* লোগো */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-400 text-sm mt-1">আমার দুনিয়া</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
          
          {/* ✅ রিয়েল Supabase Auth ফর্ম */}
          <form onSubmit={handleLogin} className="space-y-4">
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

            {/* এরর মেসেজ */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* সাবমিট বাটন */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> লগইন হচ্ছে...</>
              ) : (
                <><LogIn size={18} /> লগইন করুন</>
              )}
            </button>
          </form>

          {/* ইনফো */}
          <div className="mt-4 p-3 bg-gray-900/30 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              🔒 Supabase Auth সিকিউরড | admin@amarduniya.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}