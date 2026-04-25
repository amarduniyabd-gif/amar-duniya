"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, FileText, Lock, CheckCircle, Crown, 
  Shield, CreditCard, AlertCircle, Loader2,
  Smartphone, Building, Wallet
} from "lucide-react";
export default function DocumentPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id") || "";
  const amount = parseInt(searchParams.get("amount") || "0");
  const title = searchParams.get("title") || "";
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [document, setDocument] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  const paymentMethods = [
    { id: 'bkash', name: 'বিকাশ', icon: <Smartphone size={20} />, color: 'from-pink-500 to-pink-600' },
    { id: 'nagad', name: 'নগদ', icon: <Smartphone size={20} />, color: 'from-purple-500 to-purple-600' },
    { id: 'rocket', name: 'রকেট', icon: <Building size={20} />, color: 'from-blue-500 to-blue-600' },
    { id: 'card', name: 'ক্রেডিট/ডেবিট কার্ড', icon: <CreditCard size={20} />, color: 'from-green-500 to-green-600' },
    { id: 'wallet', name: 'আমার দুনিয়া ওয়ালেট', icon: <Wallet size={20} />, color: 'from-[#f85606] to-orange-500' },
  ];

  // ============ ডকুমেন্ট লোড ============
  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/documents/payment?id=' + docId);
          return;
        }
        setCurrentUserId(user.id);

        if (!docId) {
          setError('ডকুমেন্ট আইডি পাওয়া যায়নি!');
          setLoading(false);
          return;
        }

        const { data: doc, error: docError } = await supabase
          .from('documents')
          .select(`
            *,
            post:posts(title, price)
          `)
          .eq('id', docId)
          .single();

        if (docError) throw docError;

        // চেক ইউজার এই ডকুমেন্টের ক্রেতা কিনা
        if (doc.buyer_id !== user.id) {
          setError('আপনার এই ডকুমেন্ট পেমেন্ট করার অনুমতি নেই!');
          setLoading(false);
          return;
        }

        // চেক ডকুমেন্ট ইতিমধ্যে পেইড বা রিলিজড কিনা
        if (doc.status === 'released') {
          setError('এই ডকুমেন্ট ইতিমধ্যে রিলিজ করা হয়েছে!');
          setLoading(false);
          return;
        }

        if (doc.status === 'paid') {
          setError('এই ডকুমেন্টের পেমেন্ট ইতিমধ্যে সম্পন্ন হয়েছে!');
          setLoading(false);
          return;
        }

        setDocument(doc);
      } catch (err: any) {
        console.error('Load error:', err);
        setError('ডকুমেন্ট লোড করতে সমস্যা হয়েছে!');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [docId, router]);

  // ============ পেমেন্ট হ্যান্ডলার ============
  const handlePayment = useCallback(async () => {
    if (!selectedMethod) {
      setError('পেমেন্ট মেথড সিলেক্ট করুন');
      return;
    }

    if (!currentUserId || !document) {
      setError('ইউজার বা ডকুমেন্ট তথ্য পাওয়া যায়নি!');
      return;
    }
    
    setProcessing(true);
    setError("");

    try {
      // ১. পেমেন্ট রেকর্ড তৈরি
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: currentUserId,
          post_id: document.post_id,
          amount: document.fee,
          type: 'document',
          payment_method: selectedMethod,
          status: 'completed',
          transaction_id: `DOC-${Date.now()}`,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // ২. ডকুমেন্ট স্ট্যাটাস আপডেট
      const { error: docError } = await supabase
        .from('documents')
        .update({
          status: 'paid',
          payment_id: payment.id,
        })
        .eq('id', docId);

      if (docError) throw docError;

      // ৩. নোটিফিকেশন পাঠান
      await supabase.from('notifications').insert({
        user_id: document.seller_id,
        title: 'ডকুমেন্ট পেমেন্ট সম্পন্ন',
        message: `"${document.post?.title || 'পণ্য'}" এর ডকুমেন্টের পেমেন্ট সম্পন্ন হয়েছে।`,
        type: 'document',
        data: { document_id: docId, payment_id: payment.id },
      });

      // ৪. সাকসেস
      setSuccess(true);
      
      // ৫. লোকাল স্টোরেজ আপডেট (ফলব্যাক)
      const docRequests = JSON.parse(localStorage.getItem('documentRequests') || '[]');
      const updated = docRequests.map((doc: any) => 
        doc.id === docId ? { ...doc, status: 'paid' } : doc
      );
      localStorage.setItem('documentRequests', JSON.stringify(updated));
      
      setTimeout(() => {
        router.push('/documents');
      }, 2000);
      
    } catch (err: any) {
      console.error('Payment error:', err);
      setError('পেমেন্ট করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      setProcessing(false);
    }
  }, [selectedMethod, currentUserId, document, docId, router]);

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
                ডকুমেন্ট পেমেন্ট
              </h1>
              <p className="text-xs text-gray-500 mt-1">নিরাপদ পেমেন্ট গেটওয়ে</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <CreditCard size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        {/* এরর স্টেট */}
        {error && !document && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">পেমেন্ট করা যাচ্ছে না</h2>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button 
              onClick={() => router.push('/documents')}
              className="bg-gradient-to-r from-[#f85606] to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              ডকুমেন্ট লিস্টে ফিরে যান
            </button>
          </div>
        )}

        {/* সাকসেস স্টেট */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">পেমেন্ট সফল!</h2>
            <p className="text-gray-500 text-sm mb-1">ডকুমেন্ট রিলিজের জন্য প্রস্তুত হচ্ছে</p>
            <p className="text-xs text-gray-400">ডকুমেন্ট লিস্টে নিয়ে যাওয়া হচ্ছে...</p>
          </div>
        )}

        {/* পেমেন্ট ফর্ম */}
        {!error && document && !success && (
          <div className="space-y-5">
            
            {/* পণ্যের তথ্য */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-[#f85606]" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{document.post?.title || title}</h2>
                  <p className="text-xs text-gray-400">আইডি: {docId.slice(0, 8)}...</p>
                </div>
              </div>
            </div>

            {/* পেমেন্ট তথ্য */}
            <div className="bg-gradient-to-r from-[#f85606]/5 to-orange-500/5 rounded-2xl p-5 border border-[#f85606]/20">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-[#f85606]" />
                <span className="font-semibold text-gray-800">পেমেন্ট তথ্য</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-800">মোট দিতে হবে</span>
                <span className="text-xl font-black text-[#f85606]">৳{document.fee || amount}</span>
              </div>
            </div>

            {/* পেমেন্ট মেথড */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">পেমেন্ট মেথড সিলেক্ট করুন</p>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      selectedMethod === method.id
                        ? 'border-[#f85606] bg-orange-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-[#f85606]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center text-white`}>
                        {method.icon}
                      </div>
                      <span className="font-medium text-gray-700">{method.name}</span>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle size={18} className="text-[#f85606]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* এরর */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-500 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* পেমেন্ট বাটন */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              {processing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  প্রসেসিং...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  {document.fee || amount} টাকা পেমেন্ট করুন
                </>
              )}
            </button>

            {/* নিরাপত্তা নোটিশ */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">নিরাপদ পেমেন্ট</p>
                  <p className="text-xs text-blue-700 mt-1">
                    পেমেন্ট SSL এনক্রিপ্টেড। আপনার তথ্য নিরাপদে রাখা হবে।
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}