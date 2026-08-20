export type PresenceStatus = "online" | "idle" | "dnd" | "offline" | "in-meeting" | "in-call";
export interface ConnectUser { id: string; name: string; email: string; avatarUrl?: string; role?: string; department?: string; presence: PresenceStatus; lastSeen?: string; customStatus?: string; phone?: string; }
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export interface MessageReaction { emoji: string; count: number; userIds: string[]; userNames?: string[]; }
export interface MessageAttachment { id: string; name: string; url: string; size: number; mimeType: string; thumbnailUrl?: string; }
export interface ConnectMessage { id: string; conversationId: string; senderId: string; senderName?: string; senderAvatar?: string; recipientId?: string; content: string; createdAt: string; status: MessageStatus; reactions?: MessageReaction[]; attachments?: MessageAttachment[]; replyToId?: string; isEdited?: boolean; isPinned?: boolean; isAiGenerated?: boolean; }