"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, FileText, CheckCircle, Clock, 
  Download, Eye, Crown, Shield, CreditCard, Loader2, AlertCircle
} from "lucide-react";
import Link from "next/link";
type Document = {
  id: string;
  post_id: string;
  post_title: string;
  status: 'pending' | 'paid' | 'released';
  fee: number;
  created_at: string;
  file_url?: string;
  payment_id?: string;
};

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  // ============ ডকুমেন্ট লোড ============
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/documents');
          return;
        }
        setCurrentUserId(user.id);

        // ডকুমেন্ট লোড (বিক্রেতা হিসেবে)
        const { data: sellerDocs, error: sellerError } = await supabase
          .from('documents')
          .select(`
            id,
            post_id,
            fee,
            status,
            file_url,
            payment_id,
            created_at,
            post:posts(title)
          `)
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        // ডকুমেন্ট লোড (ক্রেতা হিসেবে)
        const { data: buyerDocs, error: buyerError } = await supabase
          .from('documents')
          .select(`
            id,
            post_id,
            fee,
            status,
            file_url,
            payment_id,
            created_at,
            post:posts(title)
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (sellerError) throw sellerError;
        if (buyerError) throw buyerError;

        const allDocs = [...(sellerDocs || []), ...(buyerDocs || [])];
        
        // ডুপ্লিকেট রিমুভ
        const uniqueDocs = allDocs.filter((doc, index, self) => 
          index === self.findIndex(d => d.id === doc.id)
        );

        const formattedDocs: Document[] = uniqueDocs.map((doc: any) => ({
          id: doc.id,
          post_id: doc.post_id,
          post_title: doc.post?.title || 'পণ্য',
          status: doc.status || 'pending',
          fee: doc.fee || 0,
          created_at: doc.created_at,
          file_url: doc.file_url,
          payment_id: doc.payment_id,
        }));

        setDocuments(formattedDocs);
        
        // লোকাল স্টোরেজে সেভ
        localStorage.setItem('documents', JSON.stringify(formattedDocs));
      } catch (err: any) {
        console.error('Load error:', err);
        setError('ডকুমেন্ট লোড করতে সমস্যা হয়েছে!');
        
        // লোকাল ফলব্যাক
        const saved = localStorage.getItem('documents');
        if (saved) setDocuments(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [router]);

  // ============ টাইম এগো ============
  const timeAgo = (date: string): string => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} দিন আগে`;
    const hours = Math.floor(diff / 3600000);
    if (hours > 0) return `${hours} ঘন্টা আগে`;
    return 'এইমাত্র';
  };

  // ============ ডাউনলোড হ্যান্ডলার ============
  const handleDownload = useCallback(async (doc: Document) => {
    if (!doc.file_url) {
      alert('ফাইল পাওয়া যায়নি!');
      return;
    }

    try {
      // Supabase Storage থেকে ডাউনলোড
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_url, 60); // ৬০ সেকেন্ড

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err) {
      alert('ডাউনলোড করতে সমস্যা হয়েছে!');
    }
  }, []);

  // ============ পেমেন্ট হ্যান্ডলার ============
  const handlePayment = useCallback((doc: Document) => {
    router.push(`/documents/payment?id=${doc.id}&amount=${doc.fee}&title=${encodeURIComponent(doc.post_title)}`);
  }, [router]);

  // ============ স্ট্যাটাস ব্যাজ ============
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'released':
        return (
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            <CheckCircle size={10} /> রিলিজড
          </span>
        );
      case 'paid':
        return (
          <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
            <CheckCircle size={10} /> পেইড
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">
            <Clock size={10} /> পেন্ডিং
          </span>
        );
    }
  };

  // ============ লোডিং স্টেট ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#f85606]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-8">
      <div className="max-w-2xl mx-auto p-4">
        
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
                আমার ডকুমেন্ট {documents.length > 0 && `(${documents.length})`}
              </h1>
              <p className="text-xs text-gray-500 mt-1">নিরাপদে সংরক্ষিত ডকুমেন্ট</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        {/* এরর */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
            <AlertCircle size={18} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* ডকুমেন্ট লিস্ট */}
        {documents.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-md border border-[#f85606]/10">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">কোনো ডকুমেন্ট নেই</h2>
            <p className="text-gray-500 text-sm mb-4">
              আপনি এখনো কোনো ডকুমেন্ট সার্ভিস ব্যবহার করেননি
            </p>
            <Link 
              href="/post-ad" 
              className="inline-block bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition"
            >
              নতুন পোস্ট তৈরি করুন
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      doc.status === 'released' 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                        : doc.status === 'paid'
                        ? 'bg-gradient-to-br from-blue-100 to-indigo-100'
                        : 'bg-gradient-to-br from-orange-100 to-amber-100'
                    }`}>
                      <FileText size={18} className={
                        doc.status === 'released' 
                          ? 'text-green-600' 
                          : doc.status === 'paid'
                          ? 'text-blue-600'
                          : 'text-[#f85606]'
                      } />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{doc.post_title}</h3>
                      <p className="text-xs text-gray-400">{timeAgo(doc.created_at)}</p>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">ডকুমেন্ট ফি</p>
                    <p className="text-sm font-bold text-[#f85606]">{doc.fee} ৳</p>
                  </div>
                  
                  {doc.status === 'released' ? (
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition active:scale-95"
                    >
                      <Download size={14} /> ডাউনলোড
                    </button>
                  ) : doc.status === 'paid' ? (
                    <button 
                      disabled
                      className="bg-gray-300 text-gray-500 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-not-allowed"
                    >
                      <Clock size={14} /> রিলিজের অপেক্ষায়
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePayment(doc)}
                      className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition active:scale-95"
                    >
                      <CreditCard size={14} /> পেমেন্ট করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ফুটার */}
        <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Shield size={12} className="text-gray-500" />
          </div>
          আপনার ডকুমেন্ট এনক্রিপ্ট করে রাখা হয়েছে • Supabase সুরক্ষিত
        </div>

      </div>
    </div>
  );
}