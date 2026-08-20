export type PresenceStatus =
  | "online"
  | "idle"
  | "dnd"
  | "offline"
  | "in-meeting"
  | "in-call"
  | "away"
  | "busy"
  | (string & {});

export interface ConnectUser {
  id: string;
  userId?: string;
  user_id?: string;
  employeeId?: string;
  employee_id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatar?: string;
  role?: string;
  department?: string;
  presence?: PresenceStatus;
  status?: string;
  lastSeen?: string;
  customStatus?: string;
  phone?: string;
  [key: string]: any;
}

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds?: string[];
  users?: string[];
  userNames?: string[];
  [key: string]: any;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  [key: string]: any;
}

export interface ConnectMessage {
  id: string;
  conversationId?: string;
  conversation_id?: string;
  channelId?: string;
  channel_id?: string;
  channelName?: string;
  channel_name?: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  recipientId?: string;
  content: string;
  createdAt?: string;
  timestamp?: string | number;
  status?: MessageStatus;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  replyToId?: string;
  isEdited?: boolean;
  isPinned?: boolean;
  isAiGenerated?: boolean;
  isVoiceMessage?: boolean;
  isMention?: boolean;
  [key: string]: any;
}