"use client";
import { useState } from 'react';
import { X, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  amount: number;
  description: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, title, amount, description }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
      alert(`পেমেন্ট সফল! ${title} সম্পন্ন হয়েছে।`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">মোট চার্জ</p>
            <p className="text-3xl font-bold text-[#f85606]">{amount} টাকা</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={() => setPaymentMethod("bkash")} className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${paymentMethod === "bkash" ? "border-[#f85606] bg-orange-50 ring-2 ring-[#f85606]/20" : "border-gray-200"}`}>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">বি</div><span className="font-medium">bKash</span></div>
            {paymentMethod === "bkash" && <CheckCircle size={18} className="text-[#f85606]" />}
          </button>
          <button onClick={() => setPaymentMethod("nagad")} className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${paymentMethod === "nagad" ? "border-[#f85606] bg-orange-50 ring-2 ring-[#f85606]/20" : "border-gray-200"}`}>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">ন</div><span className="font-medium">নগদ</span></div>
            {paymentMethod === "nagad" && <CheckCircle size={18} className="text-[#f85606]" />}
          </button>
          <button onClick={() => setPaymentMethod("rocket")} className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${paymentMethod === "rocket" ? "border-[#f85606] bg-orange-50 ring-2 ring-[#f85606]/20" : "border-gray-200"}`}>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">র</div><span className="font-medium">রকেট</span></div>
            {paymentMethod === "rocket" && <CheckCircle size={18} className="text-[#f85606]" />}
          </button>
        </div>

        <button onClick={handlePayment} disabled={isProcessing} className="w-full mt-5 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
          <CreditCard size={18} /> {isProcessing ? "প্রসেসিং..." : `${amount} টাকা পেমেন্ট করুন`}
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-3">🔒 SSL কমার্স দ্বারা সুরক্ষিত | নিরাপদ পেমেন্ট</p>
      </div>
    </div>
  );
}