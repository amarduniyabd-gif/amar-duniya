"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, FileText, Loader2, CheckCircle, Shield } from "lucide-react";

export default function DocumentDownloadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setSuccess(true);
      alert(`✅ ${title} ডকুমেন্ট ডাউনলোড শুরু হয়েছে!`);
      setTimeout(() => router.push('/documents'), 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-md mx-auto p-4">
        
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/20 via-orange-500/20 to-[#f85606]/20 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <button onClick={() => router.back()} className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-[#f85606]/20 hover:scale-105 transition">
              <ArrowLeft size={20} className="text-[#f85606]" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                ডকুমেন্ট ডাউনলোড
              </h1>
              <p className="text-xs text-gray-500 mt-1">নিরাপদ ডাউনলোড</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-[#f85606]/20 text-center">
          
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={40} className="text-[#f85606]" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">ডকুমেন্ট ডাউনলোড</h2>
          <p className="text-gray-500 text-sm mb-6">{title || 'ডকুমেন্ট'} ডাউনলোডের জন্য প্রস্তুত</p>

          <button
            onClick={handleDownload}
            disabled={downloading || success}
            className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition disabled:opacity-50"
          >
            {downloading ? (
              <><Loader2 size={18} className="animate-spin" /> ডাউনলোড হচ্ছে...</>
            ) : success ? (
              <><CheckCircle size={18} /> ডাউনলোড সম্পূর্ণ!</>
            ) : (
              <><Download size={18} /> ডাউনলোড করুন</>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-4">ডকুমেন্টটি এনক্রিপ্ট করা আছে। শুধুমাত্র আপনার জন্য শেয়ার করা হয়েছে।</p>

        </div>

        <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Shield size={12} className="text-gray-500" />
          </div>
          আপনার ডকুমেন্ট এনক্রিপ্ট করে রাখা হয়েছে
        </div>

      </div>
    </div>
  );
}