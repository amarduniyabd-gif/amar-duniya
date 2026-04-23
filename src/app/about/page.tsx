"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Users, Target, Shield, Award, Globe, Heart, Eye, 
  TrendingUp, CheckCircle, Star, Sparkles, MessageCircle
} from "lucide-react";
import { memo } from "react";

// মেমোইজড স্ট্যাট কার্ড
const StatCard = memo(({ value, label }: { value: string; label: string }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-200">
    <p className="text-3xl font-black bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
      {value}
    </p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
));
StatCard.displayName = 'StatCard';

// মেমোইজড ভ্যালু কার্ড
const ValueCard = memo(({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
    <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-sm font-semibold text-gray-700">{label}</p>
  </div>
));
ValueCard.displayName = 'ValueCard';

export default function AboutPage() {
  const router = useRouter();

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
            আমাদের সম্পর্কে
          </h1>
        </div>

        {/* মেইন কন্টেন্ট */}
        <div className="space-y-5">
          
          {/* হিরো সেকশন */}
          <div className="bg-gradient-to-br from-[#f85606] to-orange-600 rounded-3xl shadow-xl overflow-hidden">
            <div className="relative p-8 text-center text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="text-7xl mb-4">🌍</div>
                <h2 className="text-3xl font-black mb-2">আমার দুনিয়া</h2>
                <p className="text-white/90 text-sm max-w-md mx-auto">
                  আপনার বিশ্বস্ত অনলাইন মার্কেটপ্লেস - যেখানে ক্রেতা ও বিক্রেতার মিলন ঘটে
                </p>
              </div>
            </div>
          </div>

          {/* মিশন ও ভিশন */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* মিশন */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl flex items-center justify-center">
                  <Target size={22} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">আমাদের মিশন</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "সবার জন্য উন্মুক্ত, নিরাপদ ও সহজ অনলাইন কেনাকাটার প্ল্যাটফর্ম তৈরি করা, 
                যেখানে বিক্রেতা ও ক্রেতা উভয়েই লাভবান হন।"
              </p>
            </div>

            {/* ভিশন */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center">
                  <Eye size={22} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">আমাদের ভিশন</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "বাংলাদেশের ডিজিটাল অর্থনীতিতে নেতৃত্ব দেওয়া এবং গ্রাম-শহরের সকল নাগরিককে 
                অনলাইন মার্কেটপ্লেসের সাথে সংযুক্ত করা।"
              </p>
            </div>
          </div>

          {/* মূল্যবোধ */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 rounded-xl flex items-center justify-center">
                <Shield size={22} className="text-[#f85606]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">আমাদের মূল্যবোধ</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ValueCard icon={<Shield size={24} className="text-[#f85606]" />} label="নিরাপত্তা" />
              <ValueCard icon={<Heart size={24} className="text-[#f85606]" />} label="সততা" />
              <ValueCard icon={<Users size={24} className="text-[#f85606]" />} label="গ্রাহক সেবা" />
              <ValueCard icon={<Award size={24} className="text-[#f85606]" />} label="গুণগত মান" />
            </div>
          </div>

          {/* বৈশিষ্ট্য */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center">
                <Sparkles size={22} className="text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">কেন আমরা সেরা</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "১০০% নিরাপদ লেনদেন",
                "দ্রুত ডেলিভারি সিস্টেম",
                "২৪/৭ কাস্টমার সাপোর্ট",
                "ভেরিফাইড বিক্রেতা",
                "সহজ রিটার্ন পলিসি",
                "ডকুমেন্ট সার্ভিস",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* সাফল্য */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp size={22} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">আমাদের সাফল্য</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <StatCard value="১০,০০০+" label="সক্রিয় ইউজার" />
              <StatCard value="৫০,০০০+" label="পণ্য তালিকাভুক্ত" />
              <StatCard value="৪.৮ ⭐" label="ইউজার রেটিং" />
            </div>
          </div>

          {/* টিম */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe size={22} className="text-[#f85606]" />
              <h3 className="text-lg font-bold text-gray-800">আমাদের প্রতিশ্রুতি</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
              আমরা একটি তরুণ ও উদ্যমী দল যারা বাংলাদেশের ই-কমার্স খাতকে নতুন উচ্চতায় নিয়ে যেতে বদ্ধপরিকর। 
              আমাদের লক্ষ্য একটি স্বচ্ছ, নিরাপদ ও ব্যবহারবান্ধব প্ল্যাটফর্ম তৈরি করা।
            </p>
          </div>

          {/* কন্টাক্ট লিংক */}
          <div className="text-center pt-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <MessageCircle size={18} />
              আমাদের সাথে যোগাযোগ করুন
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}