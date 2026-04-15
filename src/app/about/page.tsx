"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Target, Shield, Award, Globe, Heart, Eye } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#f85606]">আমাদের সম্পর্কে</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          
          <div className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-6 text-center">
            <div className="text-6xl mb-3">🌍</div>
            <h2 className="text-2xl font-bold">আমার দুনিয়া</h2>
            <p className="text-sm opacity-90 mt-1">আপনার বিশ্বস্ত অনলাইন মার্কেটপ্লেস</p>
          </div>

          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Target size={24} className="text-[#f85606]" />
              <h3 className="text-lg font-bold text-gray-800">আমাদের মিশন</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              "সবার জন্য উন্মুক্ত, নিরাপদ ও সহজ অনলাইন কেনাকাটার প্ল্যাটফর্ম তৈরি করা, যেখানে বিক্রেতা ও ক্রেতা উভয়েই লাভবান হন।"
            </p>
          </div>

          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <Eye size={24} className="text-[#f85606]" />
              <h3 className="text-lg font-bold text-gray-800">আমাদের ভিশন</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              "বাংলাদেশের ডিজিটাল অর্থনীতিতে নেতৃত্ব দেওয়া এবং গ্রাম-শহরের সকল নাগরিককে অনলাইন মার্কেটপ্লেসের সাথে সংযুক্ত করা।"
            </p>
          </div>

          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Shield size={20} className="text-[#f85606]" /> আমাদের মূল্যবোধ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl"><Shield size={24} className="mx-auto text-[#f85606] mb-2" /><p className="text-sm font-semibold">নিরাপত্তা</p></div>
              <div className="text-center p-3 bg-gray-50 rounded-xl"><Heart size={24} className="mx-auto text-[#f85606] mb-2" /><p className="text-sm font-semibold">সততা</p></div>
              <div className="text-center p-3 bg-gray-50 rounded-xl"><Users size={24} className="mx-auto text-[#f85606] mb-2" /><p className="text-sm font-semibold">গ্রাহক সেবা</p></div>
              <div className="text-center p-3 bg-gray-50 rounded-xl"><Award size={24} className="mx-auto text-[#f85606] mb-2" /><p className="text-sm font-semibold">গুণগত মান</p></div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#f85606]/10 to-orange-500/10">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">আমাদের সাফল্য</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-bold text-[#f85606]">10K+</p><p className="text-xs text-gray-500">সক্রিয় ইউজার</p></div>
              <div><p className="text-2xl font-bold text-[#f85606]">50K+</p><p className="text-xs text-gray-500">পণ্য</p></div>
              <div><p className="text-2xl font-bold text-[#f85606]">4.8⭐</p><p className="text-xs text-gray-500">ইউজার রেটিং</p></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}