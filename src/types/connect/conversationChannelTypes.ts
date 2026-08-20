import type { ConnectUser } from "./userMessageTypes";
import type { ConnectMessage } from "./userMessageTypes";

export interface ConnectConversation { id: string; type: "direct" | "group"; participants: ConnectUser[]; lastMessage?: ConnectMessage; unreadCount: number; isMuted?: boolean; isPinned?: boolean; createdAt: string; updatedAt: string; title?: string; }
export interface ChannelMember { userId: string; role: "owner" | "admin" | "member"; joinedAt: string; user?: ConnectUser; }
export interface ConnectChannel { id: string; name: string; description?: string; isPrivate: boolean; topic?: string; createdBy: string; createdAt: string; memberCount: number; unreadCount?: number; lastMessage?: ConnectMessage; members?: ChannelMember[]; }