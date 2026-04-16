// পেমেন্ট ফাংশনস

export type PaymentRequest = {
  amount: number;
  type: 'document_service' | 'featured_listing' | 'matrimony';
  referenceId: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket';
  phoneNumber?: string;
};

// পেমেন্ট ইনিশিয়েট করার ফাংশন
export async function initiatePayment(paymentData: PaymentRequest): Promise<{ success: boolean; transactionId?: string; message: string }> {
  // TODO: আসল পেমেন্ট গেটওয়ে এখানে যোগ করতে হবে
  // বর্তমানে ডেমো রেসপন্স
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN_${Date.now()}`,
        message: `পেমেন্ট সফল! ${paymentData.amount} টাকা কেটেছে।`,
      });
    }, 1500);
  });
}

// পেমেন্ট ভেরিফাই করার ফাংশন
export async function verifyPayment(transactionId: string): Promise<{ success: boolean; message: string }> {
  // TODO: আসল পেমেন্ট গেটওয়ে এখানে যোগ করতে হবে
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'পেমেন্ট ভেরিফাইড!',
      });
    }, 500);
  });
}

// ডকুমেন্ট সার্ভিস ফি ক্যালকুলেশন
export function calculateDocumentFee(price: number): number {
  const fee = price * 0.02; // ২% চার্জ
  return Math.max(fee, 50); // সর্বনিম্ন ৫০ টাকা
}

// পেমেন্ট সেভ করার ফাংশন (localStorage এ)
export function savePaymentToLocalStorage(paymentData: {
  type: string;
  referenceId: string;
  amount: number;
  paymentMethod: string;
}) {
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  payments.push({
    ...paymentData,
    id: Date.now(),
    status: 'completed',
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('payments', JSON.stringify(payments));
}

// ইউজারের পেমেন্ট হিস্ট্রি দেখার ফাংশন
export function getUserPayments(): any[] {
  return JSON.parse(localStorage.getItem('payments') || '[]');
}

// নির্দিষ্ট রেফারেন্সের জন্য পেমেন্ট চেক করা
export function isAlreadyPaid(referenceId: string, type: string): boolean {
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  return payments.some((p: any) => p.referenceId === referenceId && p.type === type && p.status === 'completed');
}