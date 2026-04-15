"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Lock, Eye, Database, FileText } from "lucide-react";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#f85606]">প্রাইভেসি পলিসি</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100"><Shield size={24} className="text-[#f85606]" /><h2 className="text-lg font-bold">আমাদের প্রতিশ্রুতি</h2></div>
          <p className="text-sm text-gray-600 leading-relaxed">আমরা আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে গুরুত্ব দেই। এই পলিসিতে আমরা বর্ণনা করেছি কিভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত করি।</p>

          <div><div className="flex items-center gap-3 mb-3"><Database size={20} className="text-[#f85606]" /><h3 className="font-semibold">আমরা কী তথ্য সংগ্রহ করি</h3></div><ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4"><li>নাম, ইমেইল, ফোন নম্বর</li><li>ঠিকানা</li><li>লেনদেনের তথ্য</li><li>পোস্ট ও নিলামের তথ্য</li></ul></div>

          <div><div className="flex items-center gap-3 mb-3"><Lock size={20} className="text-[#f85606]" /><h3 className="font-semibold">আমরা কীভাবে তথ্য ব্যবহার করি</h3></div><ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4"><li>অ্যাকাউন্ট তৈরি ও পরিচালনা</li><li>পণ্য ও নিলাম প্রদর্শন</li><li>গ্রাহক সেবা প্রদান</li><li>নিরাপত্তা নিশ্চিত করা</li></ul></div>

          <div><div className="flex items-center gap-3 mb-3"><Eye size={20} className="text-[#f85606]" /><h3 className="font-semibold">তথ্য সুরক্ষা</h3></div><p className="text-sm text-gray-600 leading-relaxed">আমরা আপনার তথ্য সুরক্ষিত রাখতে আধুনিক এনক্রিপশন প্রযুক্তি ব্যবহার করি। আমাদের প্ল্যাটফর্ম নিরাপদ ও বিশ্বস্ত।</p></div>

          <div><div className="flex items-center gap-3 mb-3"><FileText size={20} className="text-[#f85606]" /><h3 className="font-semibold">আপনার অধিকার</h3></div><p className="text-sm text-gray-600 leading-relaxed">আপনি যেকোনো সময় আপনার তথ্য দেখতে, পরিবর্তন করতে বা ডিলিট করতে পারেন।</p></div>

          <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-500">সর্বশেষ আপডেট: জানুয়ারি ২০২৪</p></div>

        </div>
      </div>
    </div>
  );
}