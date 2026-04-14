"use client";
import { useState } from "react";
import { Flag, X } from "lucide-react";

interface ReportButtonProps {
  postId: string;
  postTitle: string;
}

const reportReasons = [
  { id: "fake", label: "ফেইক/প্রতারক পোস্ট", icon: "😞" },
  { id: "adult", label: "অশ্লীল কন্টেন্ট", icon: "🔞" },
  { id: "illegal", label: "ইলিগাল প্রোডাক্ট", icon: "⚖️" },
  { id: "copyright", label: "কপিরাইট লঙ্ঘন", icon: "©️" },
  { id: "spam", label: "স্প্যাম বা বারবার পোস্ট", icon: "📧" },
  { id: "other", label: "অন্যান্য", icon: "📝" },
];

export default function ReportButton({ postId, postTitle }: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    // এখানে Supabase এ রিপোর্ট সেভ করার লজিক আসবে
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setSelectedReason(null);
      setOtherText("");
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition text-xs"
      >
        <Flag size={12} />
        রিপোর্ট করুন
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">রিপোর্ট কেন?</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                "<span className="font-semibold">{postTitle}</span>" পোস্টটি রিপোর্ট করার কারণ নির্বাচন করুন।
              </p>
              
              <div className="space-y-2">
                {reportReasons.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
                      selectedReason === reason.id
                        ? "bg-[#f85606]/10 border border-[#f85606]"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{reason.icon}</span>
                    <span className="text-sm">{reason.label}</span>
                    {selectedReason === reason.id && (
                      <span className="ml-auto text-[#f85606]">✓</span>
                    )}
                  </button>
                ))}
              </div>
              
              {selectedReason === "other" && (
                <textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="বিস্তারিত জানান (ঐচ্ছিক)"
                  className="w-full p-3 border border-gray-200 rounded-xl mt-3 focus:outline-none focus:ring-2 focus:ring-[#f85606]"
                  rows={3}
                />
              )}
              
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="w-full bg-[#f85606] text-white py-3 rounded-xl font-semibold mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "সাবমিট হচ্ছে..." : submitted ? "✓ রিপোর্ট পাঠানো হয়েছে" : "রিপোর্ট সাবমিট করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}