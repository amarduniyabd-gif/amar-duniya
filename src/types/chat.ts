// ============ Supabase কম্প্যাটিবল টাইপ ============

export type ChatUser = {
  id: string; // UUID from Supabase
  name: string;
  email?: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  status: 'active' | 'blocked';
  unreadCount?: number;
};

export type Message = {
  id: string; // UUID from Supabase
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  is_read: boolean;
  read_at?: string | null;
  sender?: ChatUser;
  receiver?: ChatUser;
};

export type Conversation = {
  id: string; // UUID from Supabase
  post_id?: string | null;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  
  // Joined fields
  buyer?: ChatUser;
  seller?: ChatUser;
  post?: {
    id: string;
    title: string;
    price: number;
    status: string;
  };
  last_message?: {
    text: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
};

// ============ UI কম্প্যাটিবল টাইপ (লেগাসি সাপোর্ট) ============

export type ConversationUI = {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  status: 'active' | 'blocked';
  postId?: string;
  postTitle?: string;
  conversationId: string;
};

// ============ কনভার্টার ফাংশন ============

export function convertToConversationUI(
  conv: Conversation, 
  currentUserId: string
): ConversationUI {
  const isBuyer = conv.buyer_id === currentUserId;
  const otherUser = isBuyer ? conv.seller : conv.buyer;
  
  return {
    userId: otherUser?.id || '',
    userName: otherUser?.name || 'ইউজার',
    userAvatar: otherUser?.avatar || '👤',
    lastMessage: conv.last_message?.text || 'কোনো মেসেজ নেই',
    lastMessageTime: formatMessageTime(conv.last_message_at || conv.created_at),
    unreadCount: conv.unread_count || 0,
    isOnline: otherUser?.isOnline || false,
    status: otherUser?.status || 'active',
    postId: conv.post_id || undefined,
    postTitle: conv.post?.title,
    conversationId: conv.id,
  };
}

export function convertToMessageUI(message: Message, currentUserId: string) {
  return {
    id: message.id,
    text: message.text,
    isSender: message.sender_id === currentUserId,
    time: formatMessageTime(message.created_at),
    status: message.is_read ? 'read' : message.read_at ? 'delivered' : 'sent',
    senderId: message.sender_id,
    receiverId: message.receiver_id,
  };
}

// ============ হেল্পার ফাংশন ============

export function formatMessageTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'এইমাত্র';
  if (minutes < 60) return `${minutes} মিনিট আগে`;
  if (hours < 24) return `${hours} ঘন্টা আগে`;
  if (days < 7) return `${days} দিন আগে`;
  
  return d.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatLastSeen(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'এইমাত্র সক্রিয়';
  if (minutes < 60) return `${minutes} মিনিট আগে সক্রিয়`;
  if (hours < 24) return `${hours} ঘন্টা আগে সক্রিয়`;
  if (days < 7) return `${days} দিন আগে সক্রিয়`;
  
  return d.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
  }) + ' এ সক্রিয়';
}

// ============ মেসেজ স্ট্যাটাস টাইপ ============

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type MessageUI = {
  id: string;
  text: string;
  isSender: boolean;
  time: string;
  status: MessageStatus;
  senderId: string;
  receiverId: string;
  tempId?: string; // Optimistic UI এর জন্য
};

// ============ টাইপিং ইভেন্ট ============

export type TypingEvent = {
  conversation_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
};

// ============ চ্যাট স্টেট ============

export type ChatState = {
  conversations: ConversationUI[];
  activeConversation: ConversationUI | null;
  messages: MessageUI[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  typingUsers: Record<string, { userId: string; userName: string }>;
};