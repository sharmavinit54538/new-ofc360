export interface BatchPresenceRequest { userIds: string[]; }
export interface BatchPresenceResponse { presences: Record<string, { presence: string; lastSeen?: string; customStatus?: string }>; }
export interface AITransformRequest { text: string; mode: "summarize" | "professional" | "concise" | "action_items" | "translate"; targetLanguage?: string; }
export interface AITransformResponse { transformedText: string; mode: string; keyPoints?: string[]; }
export interface MailDispatchRequest { recipientEmail: string; recipientName: string; subject: string; bodyHtml: string; bodyPlain: string; triggerEvent: string; employeeId?: string; }
export interface MailDispatchResponse { success: boolean; messageId: string; dispatchedAt: string; recipient: string; }
export type WebSocketEventType = "presence_update" | "message_received" | "reaction_toggled" | "call_signal" | "call_incoming" | "call_accepted" | "call_rejected" | "call_ended" | "channel_updated" | "user_typing" | "user_stopped_typing" | "meeting_event" | "notification";
export interface WebSocketEvent<T = any> { type: WebSocketEventType; payload: T; timestamp: number; senderId?: string; }
