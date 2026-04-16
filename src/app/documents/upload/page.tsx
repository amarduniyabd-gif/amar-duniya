"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Upload, FileText, Lock, CheckCircle, 
  AlertCircle, Shield, Crown, X, FileUp, Eye
} from "lucide-react";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [postId, setPostId] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!postId) {
      alert("পোস্ট আইডি দিন");
      return;
    }
    if (files.length === 0) {
      alert("কমপক্ষে একটি ডকুমেন্ট আপলোড করুন");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setTimeout(() => router.push("/my-account"), 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* বিলিয়ন ডলার হেডার */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/20 via-orange-500/20 to-[#f85606]/20 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/50 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft size={20} className="text-[#f85606]" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] bg-clip-text text-transparent">
                ডকুমেন্ট আপলোড
              </h1>
              <p className="text-xs text-gray-400 mt-1">আপনার পণ্যের ডকুমেন্ট নিরাপদে জমা দিন</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/10 to-orange-500/10 rounded-2xl flex items-center justify-center">
              <Shield size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* তথ্য কার্ড */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl p-5 backdrop-blur-sm border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Lock size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">নিরাপদ ডকুমেন্ট স্টোরেজ</p>
                <p className="text-xs text-blue-600 mt-1">
                  আপনার ডকুমেন্ট এনক্রিপ্ট করে সংরক্ষণ করা হবে। ক্রেতা পণ্য পাওয়ার পরই দেখতে পাবে।
                </p>
              </div>
            </div>
          </div>

          {/* পোস্ট আইডি */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-white/50">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-[#f85606]" />
              পোস্ট আইডি <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              placeholder="যেমন: POST_12345"
              className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] focus:border-transparent transition-all"
            />
          </div>

          {/* ডকুমেন্ট আপলোড এলাকা */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-white/50">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Upload size={16} className="text-[#f85606]" />
              ডকুমেন্ট আপলোড করুন
              <span className="text-xs text-gray-400">(PDF, JPG, PNG - সর্বোচ্চ 5MB)</span>
            </label>
            
            <label className="w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-[#f85606] hover:bg-orange-50 transition-all group">
              <FileUp size={48} className="text-gray-400 group-hover:text-[#f85606] transition" />
              <span className="text-sm text-gray-500 mt-3 group-hover:text-[#f85606]">ক্লিক করে ডকুমেন্ট আপলোড করুন</span>
              <span className="text-xs text-gray-400 mt-1">বিক্রয় রশিদ, ওয়ারেন্টি, বিল ইত্যাদি</span>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
            </label>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-600">আপলোড করা ফাইল:</p>
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#f85606]" />
                      <span className="text-xs text-gray-600">{file.name}</span>
                      <span className="text-[10px] text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button onClick={() => removeFile(idx)} className="text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* নিরাপত্তা নোটিশ */}
          <div className="bg-amber-50/80 rounded-2xl p-4 backdrop-blur-sm border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800">গুরুত্বপূর্ণ তথ্য</p>
                <p className="text-xs text-amber-700 mt-1">
                  ডকুমেন্ট সঠিক না হলে বা ভুয়া ডকুমেন্ট দিলে আপনার অ্যাকাউন্ট স্থায়ীভাবে ব্লক করা হবে।
                </p>
              </div>
            </div>
          </div>

          {/* সাবমিট বাটন */}
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02]"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                আপলোড হচ্ছে...
              </>
            ) : uploaded ? (
              <>
                <CheckCircle size={20} />
                আপলোড সম্পূর্ণ!
              </>
            ) : (
              <>
                <Crown size={20} />
                ডকুমেন্ট জমা দিন
              </>
            )}
          </button>

        </div>

        {/* ফুটার */}
        <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Shield size={12} className="text-gray-500" />
          </div>
          আপনার ডকুমেন্ট এনক্রিপ্ট করে রাখা হবে
        </div>
      </div>
    </div>
  );
}