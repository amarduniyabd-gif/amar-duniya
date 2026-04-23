"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, MapPin, Send, Loader2, 
  CheckCircle, AlertCircle, Clock, Globe, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabaseClient();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ভ্যালিডেশন
    if (!formData.name.trim()) {
      setError("নাম আবশ্যক");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("সঠিক ইমেইল দিন");
      return;
    }
    if (!formData.message.trim()) {
      setError("বার্তা লিখুন");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // ✅ Supabase API কানেকশন
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'সাধারণ জিজ্ঞাসা',
          message: formData.message,
          created_at: new Date().toISOString(),
          status: 'pending',
        });

      if (insertError) throw insertError;

      // সাকসেস
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // ৫ সেকেন্ড পর সাকসেস মেসেজ হাইড
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setError("বার্তা পাঠাতে সমস্যা হয়েছে! আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.back()} 
            className="bg-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            যোগাযোগ
          </h1>
        </div>

        {/* সাকসেস মেসেজ */}
        {submitSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="font-medium text-green-800">বার্তা পাঠানো হয়েছে!</p>
              <p className="text-sm text-green-600">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-6">
          
          {/* কন্টাক্ট ইনফো */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-[#f85606] to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                যোগাযোগের তথ্য
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">ফোন</p>
                    <p className="font-medium">+880 1712-345678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">ইমেইল</p>
                    <p className="font-medium">support@amarduniya.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">ঠিকানা</p>
                    <p className="font-medium">ধানমন্ডি, ঢাকা-১২০৫</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">সময়</p>
                    <p className="font-medium">শনি-বৃহঃ ৯AM - ৬PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-xs opacity-80">ওয়েবসাইট</p>
                    <p className="font-medium">www.amarduniya.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* সোশ্যাল মিডিয়া */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">সোশ্যাল মিডিয়া</h3>
              <div className="flex gap-3">
                <a href="#" target="_blank" className="bg-[#1877F2] text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95">
                  <span className="text-xl">📘</span>
                </a>
                <a href="#" target="_blank" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95">
                  <span className="text-xl">📷</span>
                </a>
                <a href="#" target="_blank" className="bg-black text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95">
                  <span className="text-xl">🐦</span>
                </a>
                <a href="#" target="_blank" className="bg-[#25D366] text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95">
                  <span className="text-xl">💬</span>
                </a>
              </div>
            </div>

            {/* হেল্প লিংক */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">সহায়তা</h3>
              <div className="space-y-2">
                <Link href="/faq" className="block text-sm text-gray-600 hover:text-[#f85606] transition">
                  📖 প্রায়শই জিজ্ঞাসিত প্রশ্ন
                </Link>
                <Link href="/terms" className="block text-sm text-gray-600 hover:text-[#f85606] transition">
                  📋 শর্তাবলী
                </Link>
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-[#f85606] transition">
                  🔒 প্রাইভেসি পলিসি
                </Link>
              </div>
            </div>
          </div>

          {/* কন্টাক্ট ফর্ম */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Send size={20} className="text-[#f85606]" />
                বার্তা পাঠান
              </h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">আপনার নাম *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="যেমন: রহিম উদ্দিন" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">ইমেইল *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="your@email.com" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">বিষয়</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="যেমন: পণ্য সম্পর্কে জানতে চাই" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">বার্তা *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows={5} 
                    placeholder="আপনার বার্তা লিখুন..." 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      বার্তা পাঠান
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  * চিহ্নিত ফিল্ডগুলো আবশ্যক
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}