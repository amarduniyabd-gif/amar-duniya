"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Scale, AlertCircle, Users, CreditCard } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#f85606]">শর্তাবলী</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100"><FileText size={24} className="text-[#f85606]" /><h2 className="text-lg font-bold">সাধারণ শর্তাবলী</h2></div>
          <p className="text-sm text-gray-600 leading-relaxed">আমার দুনিয়া ব্যবহার করে আপনি নিচের শর্তাবলীতে সম্মতি জানাচ্ছেন।</p>

          <div><div className="flex items-center gap-3 mb-3"><Scale size={20} className="text-[#f85606]" /><h3 className="font-semibold">অ্যাকাউন্ট ব্যবহার</h3></div><p className="text-sm text-gray-600 leading-relaxed">আপনার অ্যাকাউন্ট তথ্য সঠিক ও আপ-টু-ডেট রাখা আপনার দায়িত্ব। অন্যকে আপনার অ্যাকাউন্ট ব্যবহার করতে দেবেন না।</p></div>

          <div><div className="flex items-center gap-3 mb-3"><AlertCircle size={20} className="text-[#f85606]" /><h3 className="font-semibold">নিষিদ্ধ কার্যকলাপ</h3></div><ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4"><li>অবৈধ পণ্য বিক্রি</li><li>প্রতারকামূলক কার্যকলাপ</li><li>অশ্লীল কন্টেন্ট পোস্ট</li><li>অন্যের কপিরাইট লঙ্ঘন</li></ul></div>

          <div><div className="flex items-center gap-3 mb-3"><Users size={20} className="text-[#f85606]" /><h3 className="font-semibold">বিক্রেতার দায়িত্ব</h3></div><p className="text-sm text-gray-600 leading-relaxed">বিক্রেতা পণ্যের গুণগত মান, ডেলিভারি ও বর্ণনার জন্য দায়ী। আমাদের প্ল্যাটফর্ম শুধু সংযোগ স্থাপন করে।</p></div>

          <div><div className="flex items-center gap-3 mb-3"><CreditCard size={20} className="text-[#f85606]" /><h3 className="font-semibold">পেমেন্ট ও কমিশন</h3></div><p className="text-sm text-gray-600 leading-relaxed">নিলামে জিতলে পণ্যমূল্যের ২% কমিশন প্রযোজ্য। ডকুমেন্ট সার্ভিস নিলে অতিরিক্ত ২% চার্জ।</p></div>

          <div className="bg-amber-50 rounded-xl p-4"><p className="text-sm text-amber-800">⚠️ ফ্রি পোস্ট দিলে আমার দুনিয়া কর্তৃপক্ষ কোনো দায় বহন করবে না।</p></div>

          <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-xs text-gray-500">সর্বশেষ আপডেট: জানুয়ারি ২০২৪</p></div>

        </div>
      </div>
    </div>
  );
}