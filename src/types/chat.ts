export type ChatUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  status: 'active' | 'blocked';
  unreadCount?: number;
};

export type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  isAdmin: boolean;
};

export type Conversation = {
  userId: number;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  status: 'active' | 'blocked';
  postId?: number;
  postTitle?: string;
};