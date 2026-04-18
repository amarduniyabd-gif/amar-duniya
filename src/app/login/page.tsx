"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Loader2, Shield, CheckCircle, Sparkles,
  Smartphone, Clock, X, Eye, Users, Award, TrendingUp
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

  // Skip হ্যান্ডলার
  const handleSkip = () => {
    localStorage.setItem("isGuest", "true");
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirect);
    } else {
      router.push("/");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    setTimeout(() => {
      setSuccess(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.removeItem("isGuest");
      localStorage.setItem("userEmail", "user@gmail.com");
      localStorage.setItem("loginMethod", "google");
      
      const redirectTo = localStorage.getItem("redirectAfterLogin");
      
      setTimeout(() => {
        if (redirectTo) {
          localStorage.removeItem("redirectAfterLogin");
          router.push(redirectTo);
        } else {
          router.push("/");
        }
      }, 1000);
    }, 1500);
  };

  // Facebook Login
  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    
    setTimeout(() => {
      setSuccess(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.removeItem("isGuest");
      localStorage.setItem("userFacebook", "facebook_user");
      localStorage.setItem("loginMethod", "facebook");
      
      const redirectTo = localStorage.getItem("redirectAfterLogin");
      
      setTimeout(() => {
        if (redirectTo) {
          localStorage.removeItem("redirectAfterLogin");
          router.push(redirectTo);
        } else {
          router.push("/");
        }
      }, 1000);
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Loader2 size={40} className="text-[#f85606] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50 relative overflow-hidden">
      
      {/* Background Patterns - বিলিয়ন ডলার ইফেক্ট */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#f85606]/10 to-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#f85606]/5 to-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Skip Button - টপ রাইট */}
      <button
        onClick={() => setShowSkipConfirm(true)}
        className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-lg border border-gray-200/50 text-gray-600 text-sm font-medium hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
      >
        <span>এড়িয়ে যান</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          
          {/* হেডার with লোগো */}
          <div className="text-center mb-8">
            {/* লোগো */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500" />
                <div className="relative bg-white rounded-3xl p-4 shadow-2xl border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-white">আ</span>
                    </div>
                    <div className="text-left">
                      <h1 className="text-2xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-[#f85606] via-orange-500 to-amber-600 bg-clip-text text-transparent">
                          আমার দুনিয়া
                        </span>
                      </h1>
                      <p className="text-[10px] font-semibold tracking-wider text-gray-400">
                        স্বপ্নের ঠিকানা
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent mt-4">
              স্বাগতম!
            </h2>
            <p className="text-gray-500 mt-2 flex items-center justify-center gap-2">
              <Sparkles size={14} className="text-[#f85606]" />
              আপনার অ্যাকাউন্টে প্রবেশ করুন
              <Sparkles size={14} className="text-[#f85606]" />
            </p>
          </div>

          {/* রিডাইরেক্ট ইনফো */}
          {redirectPath && (
            <div className="mb-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Smartphone size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">চলুন কাজ শেষ করি!</p>
                <p className="text-xs text-blue-600">লগইন করে আপনার কাজ চালিয়ে যান</p>
              </div>
            </div>
          )}

          {/* মেইন কার্ড */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/50">
            
            {/* ওয়েলকাম ইমোজি */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f85606] to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl rotate-6 hover:rotate-0 transition-all duration-300">
                <span className="text-4xl">👋</span>
              </div>
            </div>

            {/* সাকসেস মেসেজ */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700">লগইন সফল!</p>
                  <p className="text-xs text-green-600">রিডাইরেক্ট করা হচ্ছে...</p>
                </div>
              </div>
            )}

            {/* সোশ্যাল লগইন বাটন */}
            <div className="space-y-4">
              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading || facebookLoading}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:border-[#f85606] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                {googleLoading ? (
                  <Loader2 size={22} className="animate-spin text-[#f85606]" />
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google দিয়ে লগইন</span>
                  </>
                )}
              </button>

              {/* Facebook Login */}
              <button
                onClick={handleFacebookLogin}
                disabled={googleLoading || facebookLoading}
                className="w-full bg-gradient-to-r from-[#1877f2] to-[#166fe5] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                {facebookLoading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z"/>
                    </svg>
                    <span>Facebook দিয়ে লগইন</span>
                  </>
                )}
              </button>
            </div>

            {/* ডিভাইডার */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-400 text-xs font-medium">অথবা</span>
              </div>
            </div>

            {/* OTP অপশন - কামিং সুন */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                  <Smartphone size={24} className="text-[#f85606]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    ফোন নম্বর দিয়ে লগইন
                    <span className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      শীঘ্রই আসছে
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    OTP ভেরিফিকেশন খুব শীঘ্রই
                  </p>
                </div>
              </div>
            </div>

            {/* রেজিস্টার লিংক */}
            <div className="mt-6 text-center p-4 bg-gray-50/80 rounded-2xl">
              <p className="text-sm text-gray-600">
                অ্যাকাউন্ট নেই?{" "}
                <Link href="/register" className="text-[#f85606] font-bold hover:underline">
                  বিনামূল্যে রেজিস্টার করুন
                </Link>
              </p>
            </div>

          </div>

          {/* ফিচার হাইলাইটস */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="text-center group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Shield size={18} className="text-[#f85606]" />
              </div>
              <p className="text-[10px] font-semibold text-gray-600">নিরাপদ</p>
            </div>
            <div className="text-center group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <Award size={18} className="text-[#f85606]" />
              </div>
              <p className="text-[10px] font-semibold text-gray-600">ভেরিফাইড</p>
            </div>
            <div className="text-center group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                <TrendingUp size={18} className="text-[#f85606]" />
              </div>
              <p className="text-[10px] font-semibold text-gray-600">দ্রুততম</p>
            </div>
          </div>

          {/* টার্মস */}
          <p className="text-center text-[10px] text-gray-400 mt-6">
            লগইন করে আপনি আমাদের{" "}
            <Link href="/terms" className="text-[#f85606]">শর্তাবলী</Link> ও{" "}
            <Link href="/privacy" className="text-[#f85606]">গোপনীয়তা নীতি</Link> মেনে নিচ্ছেন
          </p>

        </div>
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">এড়িয়ে যাবেন?</h3>
              <button 
                onClick={() => setShowSkipConfirm(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-[#f85606] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">গেস্ট হিসেবে ব্রাউজ করুন</p>
                  <p className="text-xs text-gray-600 mt-1">
                    আপনি সব পণ্য দেখতে পারবেন, কিন্তু পোস্ট করতে বা চ্যাট করতে লগইন করতে হবে।
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                হ্যাঁ, এড়িয়ে যান
              </button>
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                লগইন করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}