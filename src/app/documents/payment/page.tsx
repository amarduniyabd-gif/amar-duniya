"use client";
import { useState } from "react";
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
  
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'bkash', name: 'বিকাশ', icon: <Smartphone size={20} />, color: 'from-pink-500 to-pink-600' },
    { id: 'nagad', name: 'নগদ', icon: <Smartphone size={20} />, color: 'from-purple-500 to-purple-600' },
    { id: 'rocket', name: 'রকেট', icon: <Building size={20} />, color: 'from-blue-500 to-blue-600' },
    { id: 'card', name: 'ক্রেডিট/ডেবিট কার্ড', icon: <CreditCard size={20} />, color: 'from-green-500 to-green-600' },
    { id: 'wallet', name: 'আমার দুনিয়া ওয়ালেট', icon: <Wallet size={20} />, color: 'from-[#f85606] to-orange-500' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('পেমেন্ট মেথড সিলেক্ট করুন');
      return;
    }
    
    setProcessing(true);
    setError("");
    
    // পেমেন্ট সিমুলেশন
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // ডকুমেন্ট রিলিজড স্ট্যাটাস আপডেট
      const docRequests = JSON.parse(localStorage.getItem('documentRequests') || '[]');
      const updated = docRequests.map((doc: any) => 
        doc.id === docId ? { ...doc, status: 'released' } : doc
      );
      localStorage.setItem('documentRequests', JSON.stringify(updated));
      
      setTimeout(() => {
        router.push('/my-account?tab=documents');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-md mx-auto p-4">
        
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
                ডকুমেন্ট পেমেন্ট
              </h1>
              <p className="text-xs text-gray-500 mt-1">নিরাপদ পেমেন্ট</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#f85606]/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <CreditCard size={24} className="text-[#f85606]" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* পণ্যের তথ্য */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                <FileText size={18} className="text-[#f85606]" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{title || 'ডকুমেন্ট পেমেন্ট'}</h2>
                <p className="text-xs text-gray-500">আইডি: {docId}</p>
              </div>
            </div>
          </div>

          {/* পেমেন্ট তথ্য */}
          <div className="bg-gradient-to-r from-[#f85606]/5 via-orange-500/5 to-[#f85606]/5 rounded-2xl p-5 border border-[#f85606]/20">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-[#f85606]" />
              <span className="font-semibold text-gray-800">পেমেন্ট তথ্য</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-gray-800">মোট দিতে হবে</span>
              <span className="text-xl font-black text-[#f85606]">৳{amount.toLocaleString()}</span>
            </div>
          </div>

          {/* পেমেন্ট মেথড সিলেক্ট */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-[#f85606]/20">
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-500 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
              <CheckCircle size={18} className="text-green-500 mt-0.5" />
              <p className="text-sm text-green-600">✅ পেমেন্ট সফল! ডকুমেন্ট রিলিজ হয়েছে।</p>
            </div>
          )}

          {/* পেমেন্ট বাটন */}
          <button
            onClick={handlePayment}
            disabled={processing || success}
            className="w-full bg-gradient-to-r from-[#f85606] via-orange-500 to-[#f85606] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02]"
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                প্রসেসিং...
              </>
            ) : success ? (
              <>
                <CheckCircle size={20} />
                পেমেন্ট সফল!
              </>
            ) : (
              <>
                <Lock size={20} />
                {amount} টাকা পেমেন্ট করুন
              </>
            )}
          </button>

          {/* নিরাপত্তা নোটিশ */}
          <div className="bg-blue-50/80 rounded-2xl p-4 backdrop-blur-sm border border-blue-100">
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
      </div>
    </div>
  );
}