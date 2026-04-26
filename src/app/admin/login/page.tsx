"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kclhglzlbiuidbyzlhcq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZoxhX9xkcTnzwFqWMKpjcw_p0Ltg5Vm";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@amarduniya.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {}, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔐 1. AUTH LOGIN
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError || !data.user) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল!");
        setLoading(false);
        return;
      }

      // 🔍 2. PROFILE CHECK
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, is_verified, name")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        setError("প্রোফাইল পাওয়া যায়নি!");
        setLoading(false);
        return;
      }

      // 🚨 3. SECURITY CHECK
      if (!profile.is_admin || !profile.is_verified) {
        setError("আপনি অ্যাডমিন নন!");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // 🍪 4. SAFE COOKIE
      document.cookie = `adminLoggedIn=true; path=/; max-age=86400`;

      localStorage.setItem("adminName", profile.name || "Admin");

      // 🚀 redirect
      router.push("/admin");

    } catch (err) {
      console.error(err);
      setError("লগইন করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-white text-xl mt-3">Admin Panel</h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-gray-800 p-6 rounded-xl space-y-4"
        >
          <input
            type="email"
            className="w-full p-3 bg-gray-900 text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            type="password"
            className="w-full p-3 bg-gray-900 text-white rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-orange-500 py-3 text-white rounded"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}