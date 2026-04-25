"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Upload, FileText, Lock, CheckCircle, 
  AlertCircle, Shield, Crown, X, FileUp, Loader2
} from "lucide-react";
export default function DocumentUploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postIdFromUrl = searchParams.get("postId") || "";
  const postTitle = searchParams.get("postTitle") || "";
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [postId, setPostId] = useState(postIdFromUrl);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [postDetails, setPostDetails] = useState<any>(null);
  const [loading, setLoading] = useState(!!postIdFromUrl);

  const supabase = getSupabaseClient();

  // ============ পোস্ট ভেরিফাই ============
  useEffect(() => {
    const verifyPost = async () => {
      if (!postIdFromUrl) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/documents/upload');
          return;
        }
        setCurrentUserId(user.id);

        // পোস্ট চেক
        const { data: post, error: postError } = await supabase
          .from('posts')
          .select('id, title, seller_id, status')
          .eq('id', postIdFromUrl)
          .single();

        if (postError) throw postError;

        // চেক ইউজার এই পোস্টের মালিক কিনা
        if (post.seller_id !== user.id) {
          setError('আপনার এই পোস্টে ডকুমেন্ট আপলোড করার অনুমতি নেই!');
          setLoading(false);
          return;
        }

        setPostDetails(post);
      } catch (err) {
        console.error('Verify error:', err);
        setError('পোস্ট লোড করতে সমস্যা হয়েছে!');
      } finally {
        setLoading(false);
      }
    };

    verifyPost();
  }, [postIdFromUrl, router]);

  // ============ ফাইল আপলোড ============
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // ফাইল সাইজ চেক (৫MB)
      const oversized = newFiles.filter(f => f.size > 5 * 1024 * 1024);
      if (oversized.length > 0) {
        alert('ফাইল সাইজ ৫MB এর বেশি হতে পারবে না!');
        return;
      }
      
      // ফাইল টাইপ চেক
      const invalidType = newFiles.filter(f => 
        !['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(f.type)
      );
      if (invalidType.length > 0) {
        alert('শুধুমাত্র PDF, JPG, PNG ফাইল আপলোড করা যাবে!');
        return;
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ============ সাবমিট ============
  const handleSubmit = useCallback(async () => {
    const finalPostId = postIdFromUrl || postId;
    
    if (!finalPostId) {
      setError("পোস্ট আইডি আবশ্যক");
      return;
    }
    if (files.length === 0) {
      setError("কমপক্ষে একটি ডকুমেন্ট আপলোড করুন");
      return;
    }
    if (!currentUserId) {
      setError("লগইন করা নেই!");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // ১. ডকুমেন্ট রেকর্ড তৈরি
      const { data: document, error: docError } = await supabase
        .from('documents')
        .insert({
          post_id: finalPostId,
          seller_id: currentUserId,
          status: 'pending',
          fee: 0, // পরে আপডেট হবে
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (docError) throw docError;

      // ২. ফাইল আপলোড
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${document.id}-${i}-${Date.now()}.${fileExt}`;
        const filePath = `contracts/${currentUserId}/${finalPostId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // ফাইল URL আপডেট
        if (i === 0) {
          await supabase
            .from('documents')
            .update({ file_url: filePath })
            .eq('id', document.id);
        }
      }

      // ৩. লোকাল স্টোরেজে সেভ
      const docRequests = JSON.parse(localStorage.getItem('documentRequests') || '[]');
      docRequests.push({
        id: document.id,
        postId: finalPostId,
        postTitle: postDetails?.title || postTitle || 'পণ্য',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('documentRequests', JSON.stringify(docRequests));

      setUploaded(true);
      setTimeout(() => {
        router.push("/documents");
      }, 2000);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('ডকুমেন্ট আপলোড করতে সমস্যা হয়েছে!');
    } finally {
      setUploading(false);
    }
  }, [postIdFromUrl, postId, files, currentUserId, postDetails, postTitle, router]);

  // ============ লোডিং স্টেট ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-8">
      <div className="max-w-2xl mx-auto p-4">
        
        {/* হেডার */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/20 via-orange-500/20 to-[#f85606]/20 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/50 hover:scale-105 transition-all duration-300 active:scale-95"
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

        {/* সাকসেস স্টেট */}
        {uploaded ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">ডকুমেন্ট আপলোড সম্পূর্ণ!</h2>
            <p className="text-gray-500 mb-4">আপনার ডকুমেন্ট নিরাপদে সংরক্ষণ করা হয়েছে</p>
            <p className="text-xs text-gray-400">ডকুমেন্ট পেজে নিয়ে যাওয়া হচ্ছে...</p>
          </div>
        ) : (
          <div className="space-y-5">
            
            {/* এরর */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* পোস্ট তথ্য */}
            {postDetails && (
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl p-5 backdrop-blur-sm border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">{postDetails.title}</p>
                    <p className="text-xs text-blue-600 mt-1">পোস্ট আইডি: {postDetails.id}</p>
                  </div>
                </div>
              </div>
            )}

            {/* নিরাপত্তা তথ্য */}
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

            {/* পোস্ট আইডি (যদি URL থেকে না আসে) */}
            {!postIdFromUrl && (
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
            )}

            {/* আপলোড এলাকা */}
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
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-600">আপলোড করা ফাইল ({files.length}):</p>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-[#f85606]" />
                        <span className="text-xs text-gray-600 truncate max-w-[200px]">{file.name}</span>
                        <span className="text-[10px] text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* সতর্কতা */}
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
              className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <Crown size={20} />
                  ডকুমেন্ট জমা দিন
                </>
              )}
            </button>

          </div>
        )}

        {/* ফুটার */}
        <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Shield size={12} className="text-gray-500" />
          </div>
          আপনার ডকুমেন্ট Supabase স্টোরেজে এনক্রিপ্ট করে রাখা হবে
        </div>
      </div>
    </div>
  );
}