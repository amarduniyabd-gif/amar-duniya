"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, CheckCircle, Clock, 
  Download, Eye, Crown, Shield, CreditCard
} from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState([
    { id: '1', postTitle: 'iPhone 15 Pro Max', status: 'released', fee: 1500, date: '২০২৬-০৪-১৪' },
    { id: '2', postTitle: 'Samsung Galaxy S23', status: 'pending', fee: 1900, date: '২০২৬-০৪-১৫' },
    { id: '3', postTitle: 'MacBook Pro M2', status: 'released', fee: 3600, date: '২০২৬-০৪-১৩' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/20 via-orange-500/20 to-[#f85606]/20 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-[#f85606]/20 hover:scale-105 transition"
            >
              <ArrowLeft size={20} className="text-[#f85606]" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                আমার ডকুমেন্ট
              </h1>
              <p className="text-xs text-gray-500 mt-1">নিরাপদে সংরক্ষিত ডকুমেন্ট</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        {/* ডকুমেন্ট লিস্ট */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-[#f85606]/10 hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-[#f85606]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{doc.postTitle}</h3>
                    <p className="text-xs text-gray-400">{doc.date}</p>
                  </div>
                </div>
                {doc.status === 'released' ? (
                  <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <CheckCircle size={10} /> রিলিজড
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    <Clock size={10} /> পেন্ডিং
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">ডকুমেন্ট ফি</p>
                  <p className="text-sm font-bold text-[#f85606]">{doc.fee} ৳</p>
                </div>
                {doc.status === 'released' ? (
                  <button 
                    onClick={() => router.push(`/documents/download?id=${doc.id}&title=${encodeURIComponent(doc.postTitle)}`)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 transition"
                  >
                    <Download size={14} /> ডাউনলোড
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push(`/documents/payment?id=${doc.id}&amount=${doc.fee}&title=${encodeURIComponent(doc.postTitle)}`)}
                    className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 transition"
                  >
                    <CreditCard size={14} /> পেমেন্ট করুন
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ফুটার */}
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