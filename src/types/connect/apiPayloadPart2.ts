import type { CallType } from "./callMeetingTypes";

export interface GetChannelMessagesParams { channelId: string; before?: string; limit?: number; }
export interface SendChannelMessageRequest { channelId: string; content: string; attachments?: any[]; replyToId?: string; }
export interface AddChannelMembersRequest { channelId: string; memberIds: string[]; }
export interface InitiateCallRequest { calleeId: string; type: CallType; }
export interface UpdateCallStatusRequest { callId: string; status: string; duration?: number; durationSeconds?: number; }
export interface CreateMeetingRequest { title: string; scheduledStartTime?: string; passCode?: string; }
export interface JoinMeetingRequest { meetingId: string; passCode?: string; }
export interface SendMeetingMessageRequest { meetingId: string; content: string; }
export interface UploadFileRequest { file: File; channelId?: string; conversationId?: string; }
export interface UpdatePresenceRequest { status: string; customStatus?: string; }
