"use client";
import { useState, useCallback, useEffect } from 'react';
import { 
  X, CreditCard, Shield, CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId?: string) => void;
  title: string;
  amount: number;
  description: string;
  type?: 'featured' | 'document' | 'matrimony_unlock' | 'matrimony_premium' | 'bid_security';
  referenceId?: string;
}

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: '📱', color: 'bg-pink-500', bgColor: 'from-pink-500 to-pink-600' },
  { id: 'nagad', name: 'নগদ', icon: '📱', color: 'bg-orange-500', bgColor: 'from-orange-500 to-orange-600' },
  { id: 'rocket', name: 'রকেট', icon: '🏦', color: 'bg-purple-500', bgColor: 'from-purple-500 to-purple-600' },
  { id: 'card', name: 'কার্ড', icon: '💳', color: 'bg-green-500', bgColor: 'from-green-500 to-green-600' },
];

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  title, 
  amount, 
  description,
  type = 'featured',
  referenceId,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // ✅ SSR সেফ supabase
  const [supabase, setSupabase] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    import('@/lib/supabase/client').then(({ getSupabaseClient }) => {
      setSupabase(getSupabaseClient());
    });
  }, []);

  // ============ পেমেন্ট সফল হ্যান্ডলার ============
  const handlePaymentSuccess = async (
    paymentId: string, 
    type: string, 
    referenceId: string | undefined, 
    userId: string | null
  ) => {
    if (!supabase) return;
    
    try {
      switch (type) {
        case 'featured':
          if (referenceId) {
            await supabase
              .from('posts')
              .update({ is_featured: true })
              .eq('id', referenceId);
          }
          break;

        case 'document':
          if (referenceId) {
            await supabase
              .from('documents')
              .update({ status: 'paid', payment_id: paymentId })
              .eq('id', referenceId);
          }
          break;

        case 'matrimony_unlock':
        case 'matrimony_premium':
          if (referenceId && userId) {
            await supabase
              .from('matrimony_payments')
              .insert({
                payer_id: userId,
                profile_id: referenceId,
                amount: amount,
                type: type === 'matrimony_unlock' ? 'profile_unlock' : 'premium',
                payment_method: paymentMethod,
                status: 'completed',
              });
          }
          break;
      }

      // নোটিফিকেশন
      if (userId) {
        await supabase.from('notifications').insert({
          user_id: userId,
          title: 'পেমেন্ট সফল',
          message: `আপনার ${amount} টাকা পেমেন্ট সফল হয়েছে।`,
          type: 'payment',
          data: { payment_id: paymentId, type },
        });
      }
    } catch (error) {
      console.error('Payment success handler error:', error);
    }
  };

  // ============ পেমেন্ট হ্যান্ডলার ============
  const handlePayment = useCallback(async () => {
    if (!supabase || !isClient) {
      setError('সিস্টেম লোড হচ্ছে, একটু অপেক্ষা করুন...');
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const paymentData: any = {
        user_id: userId,
        amount: amount,
        type: type,
        payment_method: paymentMethod,
        status: 'completed',
        transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      };

      if (type === 'featured' || type === 'document') {
        paymentData.post_id = referenceId;
      } else if (type === 'bid_security') {
        paymentData.auction_id = referenceId;
      }

      const { data: payment, error: insertError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (insertError) throw insertError;

      setPaymentId(payment?.id || null);

      if (payment) {
        await handlePaymentSuccess(payment.id, type, referenceId, userId);
      }

      // লোকাল স্টোরেজ
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      payments.push({
        ...paymentData,
        id: payment?.id || `LOCAL_${Date.now()}`,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('payments', JSON.stringify(payments));

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess(payment?.id);
        onClose();
        setSuccess(false);
        setError(null);
      }, 1500);

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'পেমেন্ট করতে সমস্যা হয়েছে!');
    } finally {
      setIsProcessing(false);
    }
  }, [supabase, isClient, amount, type, referenceId, paymentMethod, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        
        {/* হেডার */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={20} className="text-[#f85606]" />
            {title}
          </h2>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* সাকসেস স্টেট */}
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">পেমেন্ট সফল!</h3>
            <p className="text-gray-500 text-sm">{description} সম্পন্ন হয়েছে।</p>
            <p className="text-xs text-gray-400 mt-2">ট্রানজেকশন আইডি: {paymentId?.slice(0, 12)}...</p>
          </div>
        ) : (
          <>
            {/* পেমেন্ট তথ্য */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-4 border border-orange-100">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">মোট চার্জ</p>
                <p className="text-3xl font-black text-[#f85606]">{amount} ৳</p>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
            </div>

            {/* এরর */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* পেমেন্ট মেথড */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 mb-2">পেমেন্ট মেথড সিলেক্ট করুন</p>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  disabled={isProcessing}
                  className={`w-full flex items-center justify-between p-3 border rounded-xl transition ${
                    paymentMethod === method.id 
                      ? "border-[#f85606] bg-orange-50 shadow-sm" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${method.bgColor} rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {method.icon}
                    </div>
                    <span className="font-medium text-gray-700">{method.name}</span>
                  </div>
                  {paymentMethod === method.id && (
                    <CheckCircle size={18} className="text-[#f85606]" />
                  )}
                </button>
              ))}
            </div>

            {/* পেমেন্ট বাটন */}
            <button 
              onClick={handlePayment} 
              disabled={isProcessing || !isClient}
              className="w-full mt-5 bg-gradient-to-r from-[#f85606] to-orange-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition disabled:opacity-50 active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  প্রসেসিং...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  {amount} টাকা পেমেন্ট করুন
                </>
              )}
            </button>

            {/* সিকিউরিটি নোট */}
            <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-gray-400">
              <Shield size={10} className="text-green-500" />
              <span>SSL সুরক্ষিত • নিরাপদ পেমেন্ট</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}