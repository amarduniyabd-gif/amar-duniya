"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Phone, Lock, Loader2, 
  Mail, Shield, CheckCircle, Globe
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'email'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 11) {
      setError('সঠিক ফোন নম্বর দিন');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep('otp');
        if (data.devOtp) {
          alert(`ডেভেলপমেন্ট OTP: ${data.devOtp}`);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('OTP পাঠাতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setError('সঠিক OTP দিন');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userPhone", phone);
        
        const redirectTo = localStorage.getItem("redirectAfterLogin");
        if (redirectTo) {
          localStorage.removeItem("redirectAfterLogin");
          setTimeout(() => router.push(redirectTo), 1000);
        } else {
          setTimeout(() => router.push("/"), 1000);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('OTP ভেরিফাই করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", "user@gmail.com");
      setTimeout(() => router.push("/"), 1000);
    }, 1500);
  };

  const handleFacebookLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userFacebook", "facebook_user");
      setTimeout(() => router.push("/"), 1000);
    }, 1500);
  };

  const handleEmailLogin = () => {
    if (!email || !email.includes('@')) {
      setError('সঠিক ইমেইল দিন');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      setTimeout(() => router.push("/"), 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-[#f85606]/20 hover:scale-105 transition">
            <ArrowLeft size={20} className="text-[#f85606]" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
              লগইন করুন
            </h1>
            <p className="text-xs text-gray-500 mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
            <Shield size={24} className="text-[#f85606]" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-[#f85606]/20">
          
          {step === 'phone' && (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto text-4xl">
                  📱
                </div>
                <h2 className="text-xl font-bold mt-3">ফোন নম্বর দিন</h2>
                <p className="text-gray-500 text-sm mt-1">OTP পাঠানো হবে আপনার ফোনে</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১XXXXXXXXX"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "পাঠানো হচ্ছে..." : "OTP পাঠান"}
                </button>
              </div>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto text-4xl">
                  🔐
                </div>
                <h2 className="text-xl font-bold mt-3">OTP ভেরিফাই করুন</h2>
                <p className="text-gray-500 text-sm mt-1">{phone} নম্বরে OTP পাঠানো হয়েছে</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="৬ ডিজিটের OTP"
                    maxLength={6}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "ভেরিফাই করা হচ্ছে..." : "ভেরিফাই করুন"}
                </button>
                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-gray-500 text-sm py-2"
                >
                  ভিন্ন নম্বর ব্যবহার করুন
                </button>
              </div>
            </>
          )}

          {step === 'email' && (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto text-4xl">
                  ✉️
                </div>
                <h2 className="text-xl font-bold mt-3">ইমেইল লগইন</h2>
                <p className="text-gray-500 text-sm mt-1">আপনার ইমেইল ঠিকানা দিন</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleEmailLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </button>
              </div>
            </>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <p className="text-sm text-green-600">✅ লগইন সফল! পুনঃনির্দেশিত হচ্ছে...</p>
            </div>
          )}

          {/* সোশ্যাল লগইন বিভাগ */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500">অথবা</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google দিয়ে লগইন করুন
              </button>

              <button
                onClick={handleFacebookLogin}
                disabled={loading}
                className="w-full bg-[#1877f2] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-[#166fe5] transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z"/>
                </svg>
                Facebook দিয়ে লগইন করুন
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-200 transition"
              >
                <Mail size={20} />
                ইমেইল দিয়ে লগইন করুন
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            লগইন করে আপনি আমাদের <Link href="/terms" className="text-[#f85606]">শর্তাবলী</Link> মেনে নিচ্ছেন
          </div>

          {/* অ্যাকাউন্ট নেই? */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/register" className="text-[#f85606] font-semibold hover:underline">
                রেজিস্টার করুন
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}