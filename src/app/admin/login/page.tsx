"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";

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
    if (localStorage.getItem("adminLoggedIn") === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ সরাসরি সুপাবেস ক্লায়েন্ট ইম্পোর্ট
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://nryqoyqdwxqdydifatzb.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yeXFveXFkd3hxZHlkaWZhdHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTQyNzEsImV4cCI6MjA5Mjc3MDI3MX0.TLl1cJDhipmG4NczcG6kZUVEB7KAtbi6Rwis6lXH5GA'
      );

      // ✅ ডাটাবেজ থেকে ইউজার চেক
      const { data: admin, error: dbError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', email.trim())
        .eq('password', password) // সরাসরি চেক
        .single();

      if (dbError || !admin) {
        throw new Error("ভুল ইমেইল বা পাসওয়ার্ড!");
      }

      // ✅ সেশন সেভ
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", admin.email);
      localStorage.setItem("adminName", admin.name || "Super Admin");
      
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "লগইন করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  }, [email, password, router]);

  if (!mounted) return <div className="min-h-screen bg-gray-900" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-orange-500/20">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">অ্যাডমিন প্যানেল</h1>
          <p className="text-green-400 text-xs mt-2">✅ Supabase Secured Connection</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">ইমেইল</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full p-3 pl-10 pr-10 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition" 
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
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/25 transition disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}