"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client"; // ✅ সরাসরি ইমপোর্ট

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const registered = searchParams.get("registered") === "true";
  
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(registered);

  // ✅ সেশন চেক - ইতিমধ্যে লগইন থাকলে রিডাইরেক্ট
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectTo);
      }
    };
    checkSession();
  }, [router, redirectTo]);

  // সাকসেস মেসেজ অটো হাইড
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ✅ অলরেডি লগইন চেক করার ফাংশন
  const checkAlreadyLoggedIn = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push(redirectTo);
      return true;
    }
    return false;
  }, [router, redirectTo]);

  // Google Login
  const handleGoogleLogin = useCallback(async () => {
    // ✅ আগে চেক করুন ইতিমধ্যে লগইন কি না
    const isLoggedIn = await checkAlreadyLoggedIn();
    if (isLoggedIn) return;
    
    setGoogleLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      if (error) throw error;
      
      // ✅ লগইন সফল হলে রিডাইরেক্ট হবে, এখানে আর কিছু করার দরকার নেই
      
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google লগইন করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
      setGoogleLoading(false);
    }
  }, [redirectTo, checkAlreadyLoggedIn]);

  // Facebook Login
  const handleFacebookLogin = useCallback(async () => {
    // ✅ আগে চেক করুন ইতিমধ্যে লগইন কি না
    const isLoggedIn = await checkAlreadyLoggedIn();
    if (isLoggedIn) return;
    
    setFacebookLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) throw error;
      
    } catch (err: any) {
      console.error('Facebook login error:', err);
      setError(err.message || 'Facebook লগইন করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
      setFacebookLoading(false);
    }
  }, [redirectTo, checkAlreadyLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <button 
          onClick={() => router.back()} 
          className="mb-4 p-2.5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#f85606] to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">আমার দুনিয়া</h1>
            <p className="text-gray-500 text-sm mt-2">লগইন করে সব ফিচার ব্যবহার করুন</p>
            {redirectTo !== "/" && (
              <p className="text-xs text-orange-500 mt-1">
                লগইন完成后 {redirectTo === "/add-post" ? "পোস্ট এড" : "পছন্দের"} পেজে যাবে
              </p>
            )}
          </div>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-sm text-green-700">রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || facebookLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-xl font-medium flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mb-4"
          >
            {googleLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Google লগইন হচ্ছে..." : "Google দিয়ে লগইন করুন"}
          </button>

          {/* Facebook Login Button */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={googleLoading || facebookLoading}
            className="w-full bg-[#1877F2] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:bg-[#166fe5] transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
          >
            {facebookLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            {facebookLoading ? "Facebook লগইন হচ্ছে..." : "Facebook দিয়ে লগইন করুন"}
          </button>

          {/* ✅ টেস্ট লগইন (ডেভেলপমেন্টের জন্য) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">🔧 ডেভেলপমেন্ট টেস্ট</p>
              <button
                type="button"
                onClick={async () => {
                  // টেস্ট ইমেইল লগইন (আপনার ইমেইল দিন)
                  const { error } = await supabase.auth.signInWithPassword({
                    email: "test@example.com",
                    password: "password123",
                  });
                  if (error) setError(error.message);
                  else router.push(redirectTo);
                }}
                className="w-full text-xs text-blue-500 hover:text-blue-600"
              >
                টেস্ট অ্যাকাউন্ট দিয়ে লগইন
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            লগইন করার মাধ্যমে আপনি আমাদের{" "}
            <Link href="/terms" className="text-[#f85606] hover:underline">শর্তাবলী</Link>
            {" "}এবং{" "}
            <Link href="/privacy" className="text-[#f85606] hover:underline">প্রাইভেসি পলিসি</Link>
            {" "}মেনে নিচ্ছেন
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Supabase Auth দ্বারা সুরক্ষিত • সম্পূর্ণ ফ্রি
        </p>
      </div>
    </div>
  );
}