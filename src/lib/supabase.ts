import { createBrowserClient } from '@supabase/ssr';

// ============ Supabase ক্লায়েন্ট ============
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient should only be called on client side');
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  return supabaseInstance;
};

// ক্লায়েন্ট এক্সপোর্ট (সরাসরি ব্যবহারের জন্য)
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null;

// ============ টেবিলের নাম ============
export const TABLES = {
  // ইউজার ও প্রোফাইল
  PROFILES: 'profiles',
  USERS: 'users',
  
  // পোস্ট ও ক্যাটাগরি
  POSTS: 'posts',
  POST_IMAGES: 'post_images',
  CATEGORIES: 'categories',
  
  // নিলাম
  AUCTIONS: 'auctions',
  AUCTION_IMAGES: 'auction_images',
  BIDS: 'bids',
  
  // পাত্র-পাত্রী
  MATRIMONY_PROFILES: 'matrimony_profiles',
  MATRIMONY_IMAGES: 'matrimony_images',
  MATRIMONY_PAYMENTS: 'matrimony_payments',
  SAVED_MATRIMONY: 'saved_matrimony',
  
  // চ্যাট
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  
  // পেমেন্ট ও ডকুমেন্ট
  PAYMENTS: 'payments',
  DOCUMENTS: 'documents',
  
  // অফার ও স্লাইডার
  OFFER_BANNERS: 'offer_banners',
  SLIDERS: 'sliders',
  
  // অন্যান্য
  SAVED_POSTS: 'saved_posts',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  VISITORS: 'visitors',
  ADMIN_LOGS: 'admin_logs',
  CONTACT_MESSAGES: 'contact_messages',
} as const;

// ============ টাইপ ডেফিনিশন ============

export type DocumentRequest = {
  id: string;
  post_id: string;
  seller_id: string;
  buyer_id: string | null;
  file_url: string | null;
  status: 'pending' | 'paid' | 'released';
  fee: number;
  created_at: string;
  released_at: string | null;
  payment_id: string | null;
};

export type FeaturedListing = {
  id: string;
  post_id: string;
  seller_id: string;
  amount: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  post_id: string | null;
  auction_id: string | null;
  amount: number;
  type: 'featured' | 'document' | 'bid_security' | 'matrimony' | 'offer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'bkash' | 'nagad' | 'rocket' | 'card' | 'wallet';
  transaction_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  location: string | null;
  bio: string | null;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string | null;
};

export type Post = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  condition: 'new' | 'old' | null;
  brand: string | null;
  warranty: string | null;
  delivery: 'pickup' | 'delivery' | 'amar_duniya_delivery' | null;
  location: string | null;
  seller_id: string;
  category_id: string | null;
  sub_category_id: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  is_featured: boolean;
  is_urgent: boolean;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string | null;
};

export type Auction = {
  id: string;
  title: string;
  description: string | null;
  start_price: number;
  current_price: number | null;
  min_bid_increment: number;
  start_time: string;
  end_time: string;
  seller_id: string;
  category_id: string | null;
  status: 'pending' | 'active' | 'ended' | 'cancelled';
  views: number;
  winner_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export type Bid = {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  is_auto_bid: boolean;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type Conversation = {
  id: string;
  post_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string | null;
  data: any;
  is_read: boolean;
  created_at: string;
};

// ============ হেল্পার ফাংশন ============

export const isSupabaseConnected = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

export const getPublicUrl = (bucket: string, path: string): string => {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};