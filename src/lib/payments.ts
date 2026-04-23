import { getSupabaseClient } from './supabase/client';

// ============ টাইপ ডেফিনিশন ============

export type PaymentType = 
  | 'featured' 
  | 'document' 
  | 'bid_security' 
  | 'matrimony_unlock' 
  | 'matrimony_premium' 
  | 'offer_featured';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'wallet';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentRequest = {
  amount: number;
  type: PaymentType;
  referenceId: string; // post_id, profile_id, auction_id
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  transactionId?: string;
};

export type PaymentRecord = {
  id: string;
  user_id: string;
  amount: number;
  type: PaymentType;
  reference_id: string;
  payment_method: PaymentMethod;
  transaction_id?: string;
  status: PaymentStatus;
  created_at: string;
  updated_at?: string;
};

// ============ পেমেন্ট ফি ক্যালকুলেশন ============

export const PAYMENT_FEES = {
  FEATURED_LISTING: 100, // ১০০ টাকা
  DOCUMENT_SERVICE_PERCENT: 0.02, // ২%
  DOCUMENT_SERVICE_MIN: 50, // সর্বনিম্ন ৫০ টাকা
  MATRIMONY_UNLOCK: 500, // ৫০০ টাকা
  MATRIMONY_PREMIUM: 1000, // ১০০০ টাকা
  BID_SECURITY_PERCENT: 0.05, // ৫%
  BID_SECURITY_MIN: 100, // সর্বনিম্ন ১০০ টাকা
};

export function calculateDocumentFee(price: number): number {
  const fee = price * PAYMENT_FEES.DOCUMENT_SERVICE_PERCENT;
  return Math.max(fee, PAYMENT_FEES.DOCUMENT_SERVICE_MIN);
}

export function calculateBidSecurity(amount: number): number {
  const security = amount * PAYMENT_FEES.BID_SECURITY_PERCENT;
  return Math.max(security, PAYMENT_FEES.BID_SECURITY_MIN);
}

// ============ Supabase পেমেন্ট ফাংশন ============

/**
 * পেমেন্ট ইনিশিয়েট করা
 */
export async function initiatePayment(
  paymentData: PaymentRequest
): Promise<{ success: boolean; payment?: PaymentRecord; error?: string }> {
  const supabase = getSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'লগইন করা নেই!' };
    }

    // পেমেন্ট রেকর্ড তৈরি
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount: paymentData.amount,
        type: paymentData.type,
        post_id: paymentData.type === 'featured' || paymentData.type === 'document' ? paymentData.referenceId : null,
        auction_id: paymentData.type === 'bid_security' ? paymentData.referenceId : null,
        payment_method: paymentData.paymentMethod,
        transaction_id: paymentData.transactionId || `TXN_${Date.now()}`,
        status: 'completed', // ডেমোতে সরাসরি completed
      })
      .select()
      .single();

    if (error) throw error;

    // পেমেন্ট সফল হলে অতিরিক্ত কাজ
    if (payment) {
      await handlePaymentSuccess(payment);
    }

    return {
      success: true,
      payment: payment as PaymentRecord,
    };
  } catch (error: any) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error.message || 'পেমেন্ট করতে সমস্যা হয়েছে!',
    };
  }
}

/**
 * পেমেন্ট সফল হলে যা যা করতে হবে
 */
async function handlePaymentSuccess(payment: PaymentRecord): Promise<void> {
  const supabase = getSupabaseClient();

  try {
    switch (payment.type) {
      case 'featured':
        // পোস্ট ফিচার্ড করা
        await supabase
          .from('posts')
          .update({ is_featured: true })
          .eq('id', payment.reference_id);
        break;

      case 'document':
        // ডকুমেন্ট স্ট্যাটাস আপডেট
        await supabase
          .from('documents')
          .update({ status: 'paid', payment_id: payment.id })
          .eq('id', payment.reference_id);
        break;

      case 'matrimony_unlock':
      case 'matrimony_premium':
        // পাত্র-পাত্রী পেমেন্ট রেকর্ড
        await supabase
          .from('matrimony_payments')
          .insert({
            payer_id: payment.user_id,
            profile_id: payment.reference_id,
            amount: payment.amount,
            type: payment.type === 'matrimony_unlock' ? 'profile_unlock' : 'premium',
            payment_method: payment.payment_method,
            transaction_id: payment.transaction_id,
            status: 'completed',
          });
        break;
    }

    // নোটিফিকেশন পাঠান
    await supabase.from('notifications').insert({
      user_id: payment.user_id,
      title: 'পেমেন্ট সফল',
      message: `আপনার ${payment.amount} টাকা পেমেন্ট সফল হয়েছে।`,
      type: 'payment',
      data: { payment_id: payment.id, type: payment.type },
    });
  } catch (error) {
    console.error('Payment success handler error:', error);
  }
}

/**
 * পেমেন্ট ভেরিফাই করা
 */
export async function verifyPayment(
  transactionId: string
): Promise<{ success: boolean; payment?: PaymentRecord; error?: string }> {
  const supabase = getSupabaseClient();

  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) throw error;

    return {
      success: true,
      payment: payment as PaymentRecord,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'পেমেন্ট ভেরিফাই করতে সমস্যা হয়েছে!',
    };
  }
}

/**
 * ইউজারের পেমেন্ট হিস্ট্রি
 */
export async function getUserPayments(
  userId?: string,
  limit: number = 50
): Promise<PaymentRecord[]> {
  const supabase = getSupabaseClient();

  try {
    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as PaymentRecord[];
  } catch (error) {
    console.error('Get payments error:', error);
    
    // লোকাল ফলব্যাক
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('payments') || '[]');
    }
    return [];
  }
}

/**
 * নির্দিষ্ট রেফারেন্সের জন্য পেমেন্ট চেক করা
 */
export async function isAlreadyPaid(
  referenceId: string,
  type: PaymentType
): Promise<boolean> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('id')
      .eq('reference_id', referenceId)
      .eq('type', type)
      .eq('status', 'completed')
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error('Check payment error:', error);
    
    // লোকাল ফলব্যাক
    if (typeof window !== 'undefined') {
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      return payments.some((p: any) => 
        p.referenceId === referenceId && 
        p.type === type && 
        p.status === 'completed'
      );
    }
    return false;
  }
}

/**
 * পেমেন্ট রিফান্ড
 */
export async function refundPayment(
  paymentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('id', paymentId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'রিফান্ড করতে সমস্যা হয়েছে!',
    };
  }
}

// ============ লোকাল স্টোরেজ ফলব্যাক ============

export function savePaymentToLocalStorage(paymentData: {
  type: string;
  referenceId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}): void {
  if (typeof window === 'undefined') return;

  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  payments.push({
    ...paymentData,
    id: `LOCAL_${Date.now()}`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('payments', JSON.stringify(payments));
}

// ============ পেমেন্ট স্ট্যাটিস্টিক্স ============

export async function getPaymentStats(userId?: string): Promise<{
  totalSpent: number;
  totalPayments: number;
  lastPayment?: PaymentRecord;
}> {
  const payments = await getUserPayments(userId);
  
  const completed = payments.filter(p => p.status === 'completed');
  
  return {
    totalSpent: completed.reduce((sum, p) => sum + p.amount, 0),
    totalPayments: completed.length,
    lastPayment: completed[0],
  };
}