"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, Mail, Lock, Eye, EyeOff, Loader2, 
  Fingerprint, Key, AlertCircle, CheckCircle, 
  ArrowLeft, Smartphone, Clock, LogIn, UserCheck
} from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<'login' | '2fa' | 'forgot'>('login');
  const [otp, setOtp] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // ক্লায়েন্ট সাইডে মাউন্ট হওয়ার পরই localStorage অ্যাক্সেস করুন
  useEffect(() => {
    setMounted(true);
    
    const last = localStorage.getItem("adminLastLogin");
    if (last) setLastLogin(last);
    
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    const logs = JSON.parse(localStorage.getItem("adminLoginLogs") || "[]");
    setLoginLogs(logs);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email === "admin@amarduniya.com" && password === "admin123") {
      setLoginAttempts(0);
      
      const twoFactorEnabled = false;
      if (twoFactorEnabled) {
        setStep('2fa');
        alert("ডেমো OTP: 123456");
        setLoading(false);
        return;
      }
      
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", rememberMe ? email : "");
      localStorage.setItem("adminLastLogin", new Date().toLocaleString());
      
      const loginLog = {
        email,
        time: new Date().toISOString(),
        ip: "127.0.0.1",
        userAgent: navigator.userAgent
      };
      const logs = JSON.parse(localStorage.getItem("adminLoginLogs") || "[]");
      logs.unshift(loginLog);
      localStorage.setItem("adminLoginLogs", JSON.stringify(logs.slice(0, 50)));
      
      router.push("/admin");
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      if (newAttempts >= 5) {
        setError("অনেক বেশি ভুল চেষ্টা। ১৫ মিনিট পর চেষ্টা করুন।");
        setTimeout(() => setLoginAttempts(0), 15 * 60 * 1000);
      } else {
        setError(`ভুল ইমেইল বা পাসওয়ার্ড (${newAttempts}/5 চেষ্টা বাকি)`);
      }
    }
    setLoading(false);
  };

  const handle2FAVerify = () => {
    setLoading(true);
    if (otp === "123456") {
      localStorage.setItem("adminLoggedIn", "true");
      router.push("/admin");
    } else {
      setError("ভুল OTP কোড");
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      setError("ইমেইল ঠিকানা দিন");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResetSent(true);
      setLoading(false);
      alert(`পাসওয়ার্ড রিসেট লিংক ${forgotEmail} এ পাঠানো হয়েছে!`);
    }, 1500);
  };

  const handleResendOTP = () => {
    alert("নতুন OTP পাঠানো হয়েছে: 123456");
  };

  // সার্ভার সাইডে কিছু দেখাবেন না (hydration mismatch এড়াতে)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 size={40} className="text-[#f85606] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* লোগো */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition"></div>
            <Shield size={40} className="text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            অ্যাডমিন প্যানেল
          </h1>
          <p className="text-gray-400 text-sm mt-1">আপনার অ্যাকাউন্টে নিরাপদে লগইন করুন</p>
        </div>

        {/* লাস্ট লগইন তথ্য */}
        {lastLogin && step === 'login' && (
          <div className="mb-4 bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <Clock size={12} /> শেষ লগইন: {lastLogin}
            </p>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          
          {/* লগইন ফর্ম */}
          {step === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ইমেইল ঠিকানা</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition" placeholder="admin@amarduniya.com" required />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pl-10 pr-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606] transition" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#f85606] focus:ring-[#f85606]" />
                  <span className="text-sm text-gray-400">আমাকে মনে রাখুন</span>
                </label>
                <button type="button" onClick={() => setStep('forgot')} className="text-sm text-[#f85606] hover:text-orange-400 transition">
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {loginAttempts >= 3 && loginAttempts < 5 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-yellow-500" />
                  <p className="text-sm text-yellow-400">সতর্কতা: {5 - loginAttempts} টি চেষ্টা বাকি। ভুল হলে অ্যাকাউন্ট লক হবে।</p>
                </div>
              )}

              <button type="submit" disabled={loading || loginAttempts >= 5} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </button>

              <div className="text-center text-xs text-gray-500 pt-2">
                <p>🔒 নিরাপত্তার জন্য 5 বার ভুল চেষ্টায় অ্যাকাউন্ট লক হবে</p>
              </div>
            </form>
          )}

          {/* 2FA ভেরিফিকেশন */}
          {step === '2fa' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#f85606]/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Fingerprint size={32} className="text-[#f85606]" />
                </div>
                <h2 className="text-xl font-bold text-white">টু-ফ্যাক্টর অথেনটিকেশন</h2>
                <p className="text-sm text-gray-400 mt-1">আপনার ইমেইলে 6 ডিজিটের কোড পাঠানো হয়েছে</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">অথেনটিকেশন কোড</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full p-3 text-center text-2xl tracking-widest bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606]" placeholder="000000" />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button onClick={handle2FAVerify} disabled={loading || otp.length !== 6} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {loading ? "ভেরিফাই করা হচ্ছে..." : "ভেরিফাই করুন"}
              </button>

              <div className="text-center">
                <button onClick={handleResendOTP} className="text-sm text-[#f85606] hover:text-orange-400 transition">কোড পুনরায় পাঠান</button>
                <button onClick={() => setStep('login')} className="text-sm text-gray-400 hover:text-white transition ml-4">পেছনে যান</button>
              </div>
            </div>
          )}

          {/* ফরগট পাসওয়ার্ড */}
          {step === 'forgot' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#f85606]/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key size={32} className="text-[#f85606]" />
                </div>
                <h2 className="text-xl font-bold text-white">পাসওয়ার্ড রিসেট</h2>
                <p className="text-sm text-gray-400 mt-1">আপনার ইমেইলে রিসেট লিংক পাঠানো হবে</p>
              </div>

              {!resetSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">রেজিস্টার্ড ইমেইল</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full p-3 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f85606]" placeholder="admin@amarduniya.com" />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleForgotPassword} disabled={loading} className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
                    {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-green-400">রিসেট লিংক পাঠানো হয়েছে!</p>
                    <p className="text-xs text-gray-400 mt-1">আপনার ইমেইল চেক করুন</p>
                  </div>
                  <button onClick={() => { setStep('login'); setResetSent(false); setForgotEmail(""); }} className="text-[#f85606] hover:text-orange-400 transition">
                    লগইন পৃষ্ঠায় ফিরে যান
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* লগইন লগ */}
        {loginLogs.length > 0 && step === 'login' && (
          <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1"><UserCheck size={12} /> সাম্প্রতিক লগইন</p>
            <div className="space-y-1">
              {loginLogs.slice(0, 3).map((log: any, idx: number) => (
                <div key={idx} className="flex justify-between text-[10px] text-gray-500">
                  <span>{new Date(log.time).toLocaleDateString()}</span>
                  <span>{new Date(log.time).toLocaleTimeString()}</span>
                  <span>{log.ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* সিকিউরিটি টিপস */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 নিরাপদ লগইনের জন্য শক্তিশালী পাসওয়ার্ড ব্যবহার করুন</p>
          <p className="mt-1">📞 সমস্যায়? support@amarduniya.com এ যোগাযোগ করুন</p>
        </div>

      </div>
    </div>
  );
}