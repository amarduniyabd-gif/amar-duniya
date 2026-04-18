"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Shield, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect) setRedirectPath(redirect);
  }, []);

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
      }, 800);
    }, 1200);
  };

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
      }, 800);
    }, 1200);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={32} className="text-[#f85606] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* সিম্পল হেডার */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f85606] to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">আমার দুনিয়া</span>
        </Link>
        <button 
          onClick={handleSkip}
          className="text-sm font-medium text-gray-500 hover:text-[#f85606] transition"
        >
          এড়িয়ে যান
        </button>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          
          {/* হেডিং */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">স্বাগতম</h1>
            <p className="text-gray-500 text-sm">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          {/* রিডাইরেক্ট মেসেজ */}
          {redirectPath && (
            <div className="mb-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700">🔐 লগইন করে আপনার কাজ চালিয়ে যান</p>
            </div>
          )}

          {/* সাকসেস মেসেজ */}
          {success && (
            <div className="mb-5 bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm text-green-700">লগইন সফল! রিডাইরেক্ট করা হচ্ছে...</p>
            </div>
          )}

          {/* লগইন বাটন */}
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || facebookLoading}
              className="w-full bg-white border border-gray-200 text-gray-800 py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 hover:border-[#f85606] hover:shadow-sm transition-all duration-200"
            >
              {googleLoading ? (
                <Loader2 size={20} className="animate-spin text-[#f85606]" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google দিয়ে চালিয়ে যান</span>
                </>
              )}
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookLogin}
              disabled={googleLoading || facebookLoading}
              className="w-full bg-[#1877f2] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-[#166fe5] transition-all duration-200"
            >
              {facebookLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z"/>
                  </svg>
                  <span>Facebook দিয়ে চালিয়ে যান</span>
                </>
              )}
            </button>
          </div>

          {/* টার্মস */}
          <p className="text-center text-xs text-gray-400 mt-8">
            চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের{" "}
            <Link href="/terms" className="text-[#f85606] hover:underline">শর্তাবলী</Link> ও{" "}
            <Link href="/privacy" className="text-[#f85606] hover:underline">গোপনীয়তা নীতি</Link> মেনে নিচ্ছেন
          </p>

        </div>
      </div>

    </div>
  );
}