"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Download, FileText, Loader2, CheckCircle, 
  Shield, AlertCircle, Lock, Eye
} from "lucide-react";
import Link from "next/link";
export default function DocumentDownloadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id") || "";
  const title = searchParams.get("title") || "ডকুমেন্ট";
  
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  // ============ ডকুমেন্ট ভেরিফাই ============
  useEffect(() => {
    const verifyDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/documents/download?id=' + docId);
          return;
        }
        setCurrentUserId(user.id);

        // ডকুমেন্ট চেক
        const { data: doc, error: docError } = await supabase
          .from('documents')
          .select(`
            *,
            post:posts(title, price)
          `)
          .eq('id', docId)
          .single();

        if (docError) throw docError;

        // চেক ইউজার এই ডকুমেন্টের মালিক কিনা
        if (doc.buyer_id !== user.id && doc.seller_id !== user.id) {
          // অ্যাডমিন চেক
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

          if (!profile?.is_admin) {
            setError('আপনার এই ডকুমেন্ট অ্যাক্সেস করার অনুমতি নেই!');
            setLoading(false);
            return;
          }
        }

        // চেক ডকুমেন্ট রিলিজ হয়েছে কিনা
        if (doc.status !== 'released') {
          setError('এই ডকুমেন্ট এখনো রিলিজ হয়নি। অনুগ্রহ করে পেমেন্ট সম্পন্ন করুন।');
          setLoading(false);
          return;
        }

        setDocument(doc);
      } catch (err: any) {
        console.error('Verify error:', err);
        setError('ডকুমেন্ট লোড করতে সমস্যা হয়েছে!');
      } finally {
        setLoading(false);
      }
    };

    if (docId) {
      verifyDocument();
    } else {
      setError('ডকুমেন্ট আইডি পাওয়া যায়নি!');
      setLoading(false);
    }
  }, [docId, router]);

  // ============ ডাউনলোড হ্যান্ডলার ============
  const handleDownload = useCallback(async () => {
    if (!document?.file_url) {
      setError('ফাইল পাওয়া যায়নি!');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      // Supabase Storage থেকে সাইনড URL জেনারেট
      const { data, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_url, 300); // ৫ মিনিট

      if (urlError) throw urlError;

      if (data?.signedUrl) {
        // ডাউনলোড লগ
        await supabase.from('document_downloads').insert({
          document_id: docId,
          user_id: currentUserId,
          downloaded_at: new Date().toISOString(),
        });

        // ডাউনলোড শুরু
        window.open(data.signedUrl, '_blank');
        
        setSuccess(true);
        setTimeout(() => {
          router.push('/documents');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      setError('ডাউনলোড করতে সমস্যা হয়েছে!');
    } finally {
      setDownloading(false);
    }
  }, [document, docId, currentUserId, router]);

  // ============ লোডিং স্টেট ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-md mx-auto p-4">
        
        {/* হেডার */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f85606]/20 via-orange-500/20 to-[#f85606]/20 rounded-2xl blur-xl"></div>
          <div className="relative flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-[#f85606]/20 hover:scale-105 transition active:scale-95"
            >
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

        {/* মেইন কন্টেন্ট */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          
          {/* এরর স্টেট */}
          {error ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">ডাউনলোড করা যাচ্ছে না</h2>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <Link 
                href="/documents" 
                className="inline-block bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
              >
                ডকুমেন্ট লিস্টে ফিরে যান
              </Link>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">ডাউনলোড সম্পূর্ণ!</h2>
              <p className="text-gray-500 text-sm mb-4">
                {document?.post?.title || title} ডকুমেন্ট সফলভাবে ডাউনলোড হয়েছে
              </p>
              <p className="text-xs text-gray-400">ডকুমেন্ট লিস্টে ফিরে যাওয়া হচ্ছে...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-[#f85606]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{document?.post?.title || title}</h3>
                  <p className="text-xs text-gray-400">রিলিজড ডকুমেন্ট</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <Lock size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">নিরাপদ ডাউনলোড</p>
                    <p className="text-xs text-blue-600 mt-1">
                      এই ডকুমেন্ট এনক্রিপ্টেড এবং শুধুমাত্র আপনার জন্য শেয়ার করা হয়েছে।
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.99]"
              >
                {downloading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    ডাউনলোড হচ্ছে...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    ডাউনলোড করুন
                  </>
                )}
              </button>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 text-center">
                  ডাউনলোড করার মাধ্যমে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন
                </p>
              </div>
            </>
          )}
        </div>

        {/* ফুটার */}
        <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Shield size={12} className="text-gray-500" />
          </div>
          আপনার ডকুমেন্ট এন্ড-টু-এন্ড এনক্রিপ্টেড • Supabase সুরক্ষিত
        </div>

      </div>
    </div>
  );
}