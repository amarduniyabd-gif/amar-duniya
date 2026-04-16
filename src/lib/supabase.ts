// Supabase কানেক্ট না করলে ডেমো ডাটা ব্যবহারের জন্য
// TODO: পরে আসল Supabase credentials দিয়ে replace করবেন

export const supabase = null;

// টেবিলের নাম
export const TABLES = {
  POSTS: 'posts',
  USERS: 'users',
  DOCUMENTS: 'documents',
  FEATURED_LISTINGS: 'featured_listings',
  PAYMENTS: 'payments',
};

// টাইপ ডেফিনেশন
export type DocumentRequest = {
  id: string;
  post_id: number;
  seller_id: string;
  buyer_id: string;
  document_url: string;
  status: 'pending' | 'released';
  fee: number;
  created_at: string;
  released_at?: string;
};

export type FeaturedListing = {
  id: string;
  post_id: number;
  seller_id: string;
  fee: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  amount: number;
  type: 'document_service' | 'featured_listing' | 'matrimony';
  reference_id: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'bkash' | 'nagad' | 'rocket';
  created_at: string;
};