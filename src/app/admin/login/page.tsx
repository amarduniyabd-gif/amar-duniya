"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase Config
const SUPABASE_URL = 'https://kclhglzlbiuidbyzlhcq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZoxhX9xkcTnzwFqWMKpjcw_p0Ltg5Vm';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@amarduniya.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔐 1. Supabase Auth login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল!");
        return;
      }

      // 🔍 2. Admin check
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, name")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        setError("প্রোফাইল পাওয়া যায়নি!");
        return;
      }

      if (!profile.is_admin) {
        setError("আপনি অ্যাডমিন নন!");
        await supabase.auth.signOut();
        return;
      }

      // 🍪 3. Cookie set
      document.cookie = "adminLoggedIn=true; path=/";

      // 👉 optional
      localStorage.setItem("adminName", profile.name || "Admin");

      // 🚀 redirect
      window.location.href = "/admin";

    } catch (err) {
      console.error(err);
      setError("লগইন করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-2xl text-white mt-4">অ্যাডমিন প্যানেল</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 bg-gray-800 p-6 rounded-xl">

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900 rounded"
              placeholder="Password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 py-3 rounded text-white"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}