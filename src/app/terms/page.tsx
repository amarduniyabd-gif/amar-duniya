"use client";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, Scale, AlertCircle, Users, CreditCard, 
  Shield, Ban, CheckCircle, ExternalLink
} from "lucide-react";
import { memo } from "react";

// মেমোইজড সেকশন কম্পোনেন্ট
const TermsSection = memo(({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
));
TermsSection.displayName = 'TermsSection';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
      <div className="max-w-3xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.back()} 
            className="bg-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#f85606] to-orange-500 bg-clip-text text-transparent">
            শর্তাবলী
          </h1>
        </div>

        {/* কন্টেন্ট */}
        <div className="space-y-4">
          
          {/* সাধারণ শর্তাবলী */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 rounded-xl flex items-center justify-center">
                <FileText size={22} className="text-[#f85606]" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">সাধারণ শর্তাবলী</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              আমার দুনিয়া ব্যবহার করে আপনি নিচের শর্তাবলীতে সম্মতি জানাচ্ছেন। 
              এই শর্তাবলী আমাদের প্ল্যাটফর্মের সুষ্ঠু ব্যবহার নিশ্চিত করে।
            </p>
          </div>

          {/* গ্রিড সেকশন */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* অ্যাকাউন্ট ব্যবহার */}
            <TermsSection icon={<Scale size={18} className="text-[#f85606]" />} title="অ্যাকাউন্ট ব্যবহার">
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>সঠিক তথ্য প্রদান করতে হবে</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>অ্যাকাউন্ট শেয়ার করা যাবে না</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>একজন ব্যক্তি একটিই অ্যাকাউন্ট রাখতে পারবেন</span>
                </li>
              </ul>
            </TermsSection>

            {/* নিষিদ্ধ কার্যকলাপ */}
            <TermsSection icon={<Ban size={18} className="text-[#f85606]" />} title="নিষিদ্ধ কার্যকলাপ">
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>অবৈধ পণ্য বিক্রি</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>প্রতারকামূলক কার্যকলাপ</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>অশ্লীল কন্টেন্ট পোস্ট</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span>অন্যের কপিরাইট লঙ্ঘন</span>
                </li>
              </ul>
            </TermsSection>

            {/* বিক্রেতার দায়িত্ব */}
            <TermsSection icon={<Users size={18} className="text-[#f85606]" />} title="বিক্রেতার দায়িত্ব">
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f85606] rounded-full mt-1.5 flex-shrink-0" />
                  <span>পণ্যের গুণগত মান নিশ্চিত করা</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f85606] rounded-full mt-1.5 flex-shrink-0" />
                  <span>সঠিক বর্ণনা প্রদান</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f85606] rounded-full mt-1.5 flex-shrink-0" />
                  <span>সময়মতো ডেলিভারি</span>
                </li>
              </ul>
            </TermsSection>

            {/* পেমেন্ট ও কমিশন */}
            <TermsSection icon={<CreditCard size={18} className="text-[#f85606]" />} title="পেমেন্ট ও কমিশন">
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f85606] rounded-full mt-1.5 flex-shrink-0" />
                  <span>নিলামে জিতলে ২% কমিশন</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f85606] rounded-full mt-1.5 flex-shrink-0" />
                  <span>ডকুমেন্ট সার্ভিস ২% চার্জ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-[#f85606] rounded-full mt-1.5 flex-shrink-0" />
                  <span>ফিচার্ড লিস্টিং ১০০ টাকা</span>
                </li>
              </ul>
            </TermsSection>
          </div>

          {/* ক্রেতার দায়িত্ব */}
          <TermsSection icon={<Shield size={18} className="text-[#f85606]" />} title="ক্রেতার দায়িত্ব">
            <ul className="text-sm text-gray-600 space-y-1.5 columns-1 md:columns-2">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>পণ্য দেখে কেনাকাটা করা</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>সময়মতো পেমেন্ট করা</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>আগাম টাকা না পাঠানো</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>সন্দেহজনক পোস্ট রিপোর্ট করা</span>
              </li>
            </ul>
          </TermsSection>

          {/* ফ্রি পোস্টের দায়িত্ব অস্বীকার */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">⚠️ ফ্রি পোস্টের দায়িত্ব অস্বীকার</h3>
                <p className="text-sm text-amber-700">
                  ফ্রি পোস্ট দিলে আমার দুনিয়া কর্তৃপক্ষ কোনো দায় বহন করবে না। 
                  ফ্রি পোস্টের ক্ষেত্রে ক্রেতা-বিক্রেতার মধ্যে সরাসরি লেনদেন সম্পন্ন হবে।
                </p>
              </div>
            </div>
          </div>

          {/* গোপনীয়তা ও নিরাপত্তা */}
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">গোপনীয়তা ও নিরাপত্তা</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              আপনার ব্যক্তিগত তথ্য আমাদের{" "}
              <button onClick={() => router.push('/privacy')} className="text-[#f85606] hover:underline inline-flex items-center gap-1">
                প্রাইভেসি পলিসি <ExternalLink size={12} />
              </button>
              {" "}অনুসারে সুরক্ষিত থাকবে। আমরা তৃতীয় পক্ষের সাথে আপনার তথ্য শেয়ার করি না।
            </p>
          </div>

          {/* ফুটার */}
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-500">
              📅 সর্বশেষ আপডেট: ২৩ এপ্রিল, ২০২৬
            </p>
            <p className="text-xs text-gray-400 mt-1">
              প্রশ্ন থাকলে: support@amarduniya.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}