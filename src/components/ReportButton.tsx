"use client";
import { useState, useCallback, useEffect } from "react";
import { Flag, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface ReportButtonProps {
  postId?: string;
  auctionId?: string;
  matrimonyId?: string;
  postTitle?: string;
  variant?: 'icon' | 'text' | 'full';
  className?: string;
  onSuccess?: () => void;
}

const reportReasons = [
  { id: "fake", label: "ফেইক/প্রতারক পোস্ট", icon: "😞" },
  { id: "adult", label: "অশ্লীল কন্টেন্ট", icon: "🔞" },
  { id: "illegal", label: "ইলিগাল প্রোডাক্ট", icon: "⚖️" },
  { id: "copyright", label: "কপিরাইট লঙ্ঘন", icon: "©️" },
  { id: "spam", label: "স্প্যাম বা বারবার পোস্ট", icon: "📧" },
  { id: "harassment", label: "হয়রানি বা হুমকি", icon: "⚠️" },
  { id: "wrong_category", label: "ভুল ক্যাটাগরিতে পোস্ট", icon: "📂" },
  { id: "sold_out", label: "ইতিমধ্যে বিক্রি হয়ে গেছে", icon: "✅" },
  { id: "other", label: "অন্যান্য", icon: "📝" },
];

export default function ReportButton({ 
  postId, 
  auctionId, 
  matrimonyId,
  postTitle = "পোস্ট", 
  variant = 'full',
  className = "",
  onSuccess,
}: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ইউজার আইডি লোড করুন
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchUser();
  }, []);

  // রিপোর্ট সাবমিট ফাংশন
  const handleSubmit = useCallback(async () => {
    if (!selectedReason) return;
    
    // চেক কোনো টার্গেট আছে কিনা
    if (!postId && !auctionId && !matrimonyId) {
      setError("রিপোর্ট করার জন্য কোনো টার্গেট পাওয়া যায়নি!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // রিপোর্ট ডাটা
      const reportData: any = {
        reporter_id: currentUserId,
        reason: selectedReason === 'other' ? `other: ${otherText}` : selectedReason,
        status: 'pending',
        post_title: postTitle,
      };

      if (postId) reportData.post_id = postId;
      if (auctionId) reportData.auction_id = auctionId;
      if (matrimonyId) reportData.matrimony_id = matrimonyId;

      // Supabase এ সেভ
      const { error: insertError } = await supabase
        .from('reports')
        .insert([reportData]);  // [ ] এরে আকারে পাঠাতে হবে

      if (insertError) throw insertError;

      // লোকাল স্টোরেজেও সেভ (ফলব্যাক)
      const reports = JSON.parse(localStorage.getItem('reports') || '[]');
      reports.push({
        ...reportData,
        id: `LOCAL_${Date.now()}`,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('reports', JSON.stringify(reports));

      // সাকসেস
      setSubmitted(true);
      onSuccess?.();

      // ২ সেকেন্ড পর মডাল বন্ধ
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setSelectedReason(null);
        setOtherText("");
        setError(null);
      }, 2000);

    } catch (err: any) {
      console.error('Report error:', err);
      setError(err.message || 'রিপোর্ট করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedReason, otherText, postId, auctionId, matrimonyId, postTitle, currentUserId, onSuccess]);

  // মডাল ক্লোজ
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setShowModal(false);
      setSelectedReason(null);
      setOtherText("");
      setError(null);
    }
  }, [isSubmitting]);

  // ভ্যারিয়েন্ট স্টাইল
  const getButtonStyle = () => {
    switch (variant) {
      case 'icon':
        return "p-2 rounded-full hover:bg-red-50 transition";
      case 'text':
        return "flex items-center gap-1 text-gray-400 hover:text-red-500 transition text-xs";
      case 'full':
      default:
        return `flex items-center gap-1 text-gray-400 hover:text-red-500 transition text-xs ${className}`;
    }
  };

  return (
    <>
      {/* রিপোর্ট বাটন */}
      <button
        onClick={() => setShowModal(true)}
        className={getButtonStyle()}
        title="রিপোর্ট করুন"
      >
        <Flag size={variant === 'icon' ? 16 : 12} />
        {variant !== 'icon' && "রিপোর্ট করুন"}
      </button>

      {/* রিপোর্ট মডাল */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* হেডার */}
            <div className="sticky top-0 bg-gradient-to-r from-[#f85606] to-orange-500 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Flag size={18} /> রিপোর্ট করুন
              </h3>
              <button 
                onClick={handleClose} 
                disabled={isSubmitting}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* কন্টেন্ট */}
            <div className="p-5 overflow-y-auto">
              
              {/* সাকসেস স্টেট */}
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">রিপোর্ট পাঠানো হয়েছে!</h3>
                  <p className="text-gray-500 text-sm">
                    আপনার রিপোর্ট আমাদের টিম রিভিউ করবে। ধন্যবাদ!
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    "<span className="font-semibold text-[#f85606]">{postTitle}</span>" পোস্টটি রিপোর্ট করার কারণ নির্বাচন করুন।
                  </p>
                  
                  {/* এরর */}
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* রিজন লিস্ট */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {reportReasons.map((reason) => (
                      <button
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        disabled={isSubmitting}
                        className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
                          selectedReason === reason.id
                            ? "bg-[#f85606]/10 border border-[#f85606]"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        <span className="text-xl">{reason.icon}</span>
                        <span className="text-sm flex-1">{reason.label}</span>
                        {selectedReason === reason.id && (
                          <CheckCircle size={16} className="text-[#f85606]" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* অন্যান্য টেক্সট */}
                  {selectedReason === "other" && (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        বিস্তারিত জানান (ঐচ্ছিক)
                      </label>
                      <textarea
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        placeholder="আপনার রিপোর্টের কারণ বিস্তারিত লিখুন..."
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f85606] transition resize-none"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  
                  {/* সাবমিট বাটন */}
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedReason || isSubmitting}
                    className="w-full bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold mt-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        সাবমিট হচ্ছে...
                      </>
                    ) : (
                      <>
                        <Flag size={16} />
                        রিপোর্ট সাবমিট করুন
                      </>
                    )}
                  </button>

                  {/* ফুটার নোট */}
                  <p className="text-[10px] text-gray-400 text-center mt-4">
                    আপনার রিপোর্ট গোপন রাখা হবে। ভুল রিপোর্ট করলে অ্যাকাউন্ট সাসপেন্ড হতে পারে।
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}