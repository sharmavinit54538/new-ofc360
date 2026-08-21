import type { ConnectUser, ConnectMessage } from "../userMessageTypes";

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
