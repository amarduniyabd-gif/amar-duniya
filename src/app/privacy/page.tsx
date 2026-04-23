"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Lock, Eye, Database, FileText } from "lucide-react";
import { memo } from "react";

// মেমোইজড সেকশন কম্পোনেন্ট
const PolicySection = memo(({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
));
PolicySection.displayName = 'PolicySection';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        {/* হেডার - GPU Accelerated */}
        <div className="flex items-center gap-3 mb-6 transform-gpu">
          <button 
            onClick={() => router.back()} 
            className="bg-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            প্রাইভেসি পলিসি
          </h1>
        </div>

        {/* কন্টেন্ট */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-gray-100">
          
          {/* প্রতিশ্রুতি */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-[#f85606]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">আমাদের প্রতিশ্রুতি</h2>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            আমরা আপনার ব্যক্তিগত তথ্যের গোপনীয়তাকে গুরুত্ব দেই। এই পলিসিতে আমরা বর্ণনা করেছি কিভাবে আমরা আপনার তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষিত করি।
          </p>

          {/* তথ্য সংগ্রহ */}
          <PolicySection 
            icon={<Database size={20} className="text-[#f85606]" />} 
            title="আমরা কী তথ্য সংগ্রহ করি"
          >
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
              <li>নাম, ইমেইল, ফোন নম্বর</li>
              <li>ঠিকানা ও লোকেশন</li>
              <li>লেনদেনের তথ্য</li>
              <li>পোস্ট ও নিলামের তথ্য</li>
              <li>ডিভাইস ও ব্রাউজার তথ্য</li>
            </ul>
          </PolicySection>

          {/* তথ্য ব্যবহার */}
          <PolicySection 
            icon={<FileText size={20} className="text-[#f85606]" />} 
            title="আমরা কীভাবে তথ্য ব্যবহার করি"
          >
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 ml-4">
              <li>অ্যাকাউন্ট তৈরি ও পরিচালনা</li>
              <li>পণ্য ও নিলাম প্রদর্শন</li>
              <li>গ্রাহক সেবা প্রদান</li>
              <li>নিরাপত্তা নিশ্চিত করা</li>
              <li>আইনগত বাধ্যবাধকতা পালন</li>
            </ul>
          </PolicySection>

          {/* তথ্য সুরক্ষা */}
          <PolicySection 
            icon={<Lock size={20} className="text-[#f85606]" />} 
            title="তথ্য সুরক্ষা"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              আমরা আপনার তথ্য সুরক্ষিত রাখতে আধুনিক এনক্রিপশন প্রযুক্তি ব্যবহার করি। আমাদের প্ল্যাটফর্ম নিরাপদ ও বিশ্বস্ত। 
              SSL/TLS এনক্রিপশনের মাধ্যমে সব ডাটা ট্রান্সফার করা হয়।
            </p>
          </PolicySection>

          {/* আপনার অধিকার */}
          <PolicySection 
            icon={<Eye size={20} className="text-[#f85606]" />} 
            title="আপনার অধিকার"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              আপনি যেকোনো সময় আপনার তথ্য দেখতে, পরিবর্তন করতে বা ডিলিট করতে পারেন। 
              এছাড়াও আপনি আপনার ডাটার একটি কপি চাইতে পারেন।
            </p>
          </PolicySection>

          {/* কুকি পলিসি */}
          <PolicySection 
            icon={<Shield size={20} className="text-[#f85606]" />} 
            title="কুকি পলিসি"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি। আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকি বন্ধ করতে পারেন।
            </p>
          </PolicySection>

          {/* ফুটার */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center border border-gray-200">
            <p className="text-xs text-gray-500">
              📅 সর্বশেষ আপডেট: ২৩ এপ্রিল, ২০২৬
            </p>
            <p className="text-xs text-gray-400 mt-1">
              প্রশ্ন থাকলে: privacy@amarduniya.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}