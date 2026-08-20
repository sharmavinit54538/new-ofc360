import type { ConnectUser } from "./userMessageTypes";

export interface GetColleaguesParams { query?: string; department?: string; presence?: string; page?: number; limit?: number; }
export interface ColleaguesResponse { colleagues: ConnectUser[]; total: number; page: number; limit: number; }
export interface GlobalSearchParams { query: string; types?: ("users" | "messages" | "channels" | "files")[]; limit?: number; }
export interface GlobalSearchResponse { users: ConnectUser[]; messages: any[]; channels: any[]; files: any[]; }
export interface CreateConversationRequest { participantIds: string[]; type?: "direct" | "group"; title?: string; }
export interface GetConversationMessagesParams { conversationId: string; before?: string; limit?: number; }
export interface SendMessageRequest { conversationId: string; content: string; replyToId?: string; recipientId?: string; attachments?: any[]; }
export interface ToggleReactionRequest { messageId: string; emoji: string; }
export interface CreateChannelRequest { name: string; description?: string; isPrivate: boolean; memberIds?: string[]; }
export interface UpdateChannelRequest { channelId: string; name?: string; description?: string; topic?: string; }
