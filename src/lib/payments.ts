import { getSupabaseClient } from './supabase/client';

export type PaymentType = 
  | 'featured' 
  | 'document' 
  | 'bid_security' 
  | 'matrimony_unlock' 
  | 'matrimony_premium' 
  | 'offer_featured';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'wallet';

export type PaymentRequest = {
  amount: number;
  type: PaymentType;
  referenceId: string;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  transactionId?: string;
};

export const PAYMENT_FEES = {
  FEATURED_LISTING: 100,
  DOCUMENT_SERVICE_PERCENT: 0.02,
  DOCUMENT_SERVICE_MIN: 50,
  MATRIMONY_UNLOCK: 500,
  MATRIMONY_PREMIUM: 1000,
  BID_SECURITY_PERCENT: 0.05,
  BID_SECURITY_MIN: 100,
};

export function calculateDocumentFee(price: number): number {
  const fee = price * PAYMENT_FEES.DOCUMENT_SERVICE_PERCENT;
  return Math.max(fee, PAYMENT_FEES.DOCUMENT_SERVICE_MIN);
}

export function calculateBidSecurity(amount: number): number {
  const security = amount * PAYMENT_FEES.BID_SECURITY_PERCENT;
  return Math.max(security, PAYMENT_FEES.BID_SECURITY_MIN);
}

function getClient(): any {
  return getSupabaseClient();
}

export async function initiatePayment(
  paymentData: PaymentRequest
): Promise<{ success: boolean; payment?: any; error?: string }> {
  const supabase = getClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'লগইন করা নেই!' };
    }

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
        status: 'completed',
      })
      .select()
      .single();

    if (error) throw error;

    if (payment) {
      await handlePaymentSuccess(payment);
    }

    return { success: true, payment };
  } catch (error: any) {
    console.error('Payment error:', error);
    return { success: false, error: error.message || 'পেমেন্ট করতে সমস্যা হয়েছে!' };
  }
}

async function handlePaymentSuccess(payment: any): Promise<void> {
  const supabase = getClient();

  try {
    switch (payment.type) {
      case 'featured':
        await supabase
          .from('posts')
          .update({ is_featured: true })
          .eq('id', payment.reference_id || payment.post_id);
        break;

      case 'document':
        await supabase
          .from('documents')
          .update({ status: 'paid', payment_id: payment.id })
          .eq('id', payment.reference_id || payment.post_id);
        break;

      case 'matrimony_unlock':
      case 'matrimony_premium':
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

export async function verifyPayment(
  transactionId: string
): Promise<{ success: boolean; payment?: any; error?: string }> {
  const supabase = getClient();

  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) throw error;
    return { success: true, payment };
  } catch (error: any) {
    return { success: false, error: error.message || 'পেমেন্ট ভেরিফাই করতে সমস্যা হয়েছে!' };
  }
}

export async function getUserPayments(
  userId?: string,
  limit: number = 50
): Promise<any[]> {
  const supabase = getClient();

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
    return (data || []) as any[];
  } catch (error) {
    console.error('Get payments error:', error);
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('payments') || '[]');
    }
    return [];
  }
}

export async function isAlreadyPaid(
  referenceId: string,
  type: PaymentType
): Promise<boolean> {
  const supabase = getClient();

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

export async function refundPayment(
  paymentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getClient();

  try {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('id', paymentId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'রিফান্ড করতে সমস্যা হয়েছে!' };
  }
}

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

export async function getPaymentStats(userId?: string): Promise<{
  totalSpent: number;
  totalPayments: number;
  lastPayment?: any;
}> {
  const payments = await getUserPayments(userId);
  const completed = payments.filter((p: any) => p.status === 'completed');
  
  return {
    totalSpent: completed.reduce((sum: number, p: any) => sum + p.amount, 0),
    totalPayments: completed.length,
    lastPayment: completed[0],
  };
}