export interface ConnectNotification {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  body?: string;
  type?: "message" | "mention" | "channel" | "call" | "channel_invite" | "meeting_invite" | string;
  entityId?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
  link?: string;
  actionUrl?: string;
  sender?: any;
  channelId?: string;
  channelName?: string;
  conversationId?: string;
  content?: string;
  [key: string]: any;
}
