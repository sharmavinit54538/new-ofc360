import type { ConnectUser, ConnectMessage } from "./userMessageTypes";

export interface ConnectConversation {
  id: string;
  type?: "direct" | "group" | string;
  participants?: ConnectUser[];
  participant?: ConnectUser;
  lastMessage?: ConnectMessage;
  unreadCount?: number;
  isMuted?: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
  [key: string]: any;
}

export interface ChannelMember {
  userId: string;
  role: "owner" | "admin" | "member" | string;
  joinedAt: string;
  user?: ConnectUser;
  [key: string]: any;
}

export interface ConnectChannel {
  id: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  topic?: string;
  createdBy?: string;
  createdAt?: string;
  memberCount?: number;
  unreadCount?: number;
  lastMessage?: ConnectMessage;
  members?: ChannelMember[];
  [key: string]: any;
}