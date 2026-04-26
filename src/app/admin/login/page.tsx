"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin2@amarduniya.com");
  const [password, setPassword] = useState("AmarDuniya@2026");
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
      // ✅ Dynamic import - শুধু ক্লায়েন্ট সাইডে লোড হবে
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://kclhglzlbiuidbyzlhcq.supabase.co',
        'sb_publishable_ZoxhX9xkcTnzwFqWMKpjcw_p0Ltg5Vm'
      );

      // Auth login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল!");
        setLoading(false);
        return;
      }

      // Profile check
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, name, is_admin")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        setError("প্রোফাইল পাওয়া যায়নি!");
        setLoading(false);
        return;
      }

      if (!profile.is_admin) {
        setError("আপনি অ্যাডমিন নন!");
        setLoading(false);
        return;
      }

      // সফল লগইন
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", profile.email);
      localStorage.setItem("adminName", profile.name || "Admin");
      router.push("/admin");

    } catch (err) {
      console.error(err);
      setError("লগইন করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-900" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-white text-xl mt-3">অ্যাডমিন প্যানেল</h1>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-xl space-y-4">
          <input
            type="email"
            className="w-full p-3 bg-gray-900 text-white rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="w-full p-3 bg-gray-900 text-white rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button disabled={loading} className="w-full bg-orange-500 py-3 text-white rounded flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={18} /> লগইন হচ্ছে...</> : "লগইন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}