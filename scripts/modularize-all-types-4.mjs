import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrictFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 5. CONNECT TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/connect/userMessageTypes.ts'), `
export type PresenceStatus = "online" | "idle" | "dnd" | "offline" | "in-meeting" | "in-call";
export interface ConnectUser { id: string; name: string; email: string; avatarUrl?: string; role?: string; department?: string; presence: PresenceStatus; lastSeen?: string; customStatus?: string; phone?: string; }
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";
export interface MessageReaction { emoji: string; count: number; userIds: string[]; userNames?: string[]; }
export interface MessageAttachment { id: string; name: string; url: string; size: number; mimeType: string; thumbnailUrl?: string; }
export interface ConnectMessage { id: string; conversationId: string; senderId: string; senderName?: string; senderAvatar?: string; recipientId?: string; content: string; createdAt: string; status: MessageStatus; reactions?: MessageReaction[]; attachments?: MessageAttachment[]; replyToId?: string; isEdited?: boolean; isPinned?: boolean; isAiGenerated?: boolean; }
`);

writeStrictFile(path.join(root, 'src/types/connect/conversationChannelTypes.ts'), `
import type { ConnectUser } from "./userMessageTypes";
import type { ConnectMessage } from "./userMessageTypes";

export interface ConnectConversation { id: string; type: "direct" | "group"; participants: ConnectUser[]; lastMessage?: ConnectMessage; unreadCount: number; isMuted?: boolean; isPinned?: boolean; createdAt: string; updatedAt: string; title?: string; }
export interface ChannelMember { userId: string; role: "owner" | "admin" | "member"; joinedAt: string; user?: ConnectUser; }
export interface ConnectChannel { id: string; name: string; description?: string; isPrivate: boolean; topic?: string; createdBy: string; createdAt: string; memberCount: number; unreadCount?: number; lastMessage?: ConnectMessage; members?: ChannelMember[]; }
`);

writeStrictFile(path.join(root, 'src/types/connect/callMeetingTypes.ts'), `
import type { ConnectUser } from "./userMessageTypes";

export type CallType = "audio" | "video" | "screen-share";
export type CallStatus = "initiating" | "ringing" | "connecting" | "connected" | "ended" | "missed" | "declined" | "failed";
export interface ActiveCall { id: string; channelName: string; caller: ConnectUser; callee: ConnectUser; type: CallType; status: CallStatus; startedAt?: number; connectedAt?: number; endedAt?: number; isMuted?: boolean; isVideoOff?: boolean; isScreenSharing?: boolean; }
export interface CallHistoryItem { id: string; callerId: string; calleeId: string; callerName: string; calleeName: string; callerAvatar?: string; calleeAvatar?: string; type: CallType; status: CallStatus; durationSeconds: number; startedAt: string; endedAt: string; wasRecorded?: boolean; recordingUrl?: string; }
export interface IceServerConfig { urls: string | string[]; username?: string; credential?: string; }
export interface IceServersResponse { iceServers: IceServerConfig[]; turnUsername?: string; turnCredential?: string; }
export interface CallSignalPayload { type: "offer" | "answer" | "candidate" | "reject" | "end" | "ring" | "busy" | "switch_type"; callId: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit; fromUserId: string; toUserId: string; newType?: CallType; reason?: string; timestamp?: number; }
`);

writeStrictFile(path.join(root, 'src/types/connect/meetingMiscTypes.ts'), `
import type { ConnectUser } from "./userMessageTypes";

export type MeetingStatus = "scheduled" | "live" | "ended" | "cancelled";
export interface ConnectMeeting { id: string; title: string; hostId: string; hostName: string; startTime: string; endTime?: string; status: MeetingStatus; participants: ConnectUser[]; activeParticipantCount: number; maxParticipants?: number; isRecording?: boolean; recordingUrl?: string; passCode?: string; }
export interface ConnectSharedFile { id: string; name: string; url: string; sizeBytes: number; mimeType: string; uploadedBy: string; uploaderName: string; uploadedAt: string; channelId?: string; conversationId?: string; }
export interface ConnectNotification { id: string; userId: string; title: string; body: string; type: "message" | "mention" | "call" | "channel_invite" | "meeting_invite"; entityId?: string; isRead: boolean; createdAt: string; actionUrl?: string; }
export interface MailArtifactDraft { recipientEmail: string; recipientName?: string; subject: string; bodyHtml: string; bodyPlain: string; attachments?: { name: string; url: string; size: number }[]; }
export interface ConnectSoundSettings { masterSoundEnabled: boolean; ringtoneVolume: number; notificationVolume: number; messageVolume: number; chimeVolume: number; preferredRingtone: "classic_corporate" | "gentle_pulse" | "modern_synth" | "minimal_bell"; isMutedAll: boolean; notifyOnDirectMessage: boolean; notifyOnChannelMention: boolean; notifyOnCallIncoming: boolean; }
`);

writeStrictFile(path.join(root, 'src/types/connect/apiPayloadTypes.ts'), `
import type { ConnectUser } from "./userMessageTypes";
import type { ConnectConversation } from "./conversationChannelTypes";
import type { CallType } from "./callMeetingTypes";

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
export interface GetChannelMessagesParams { channelId: string; before?: string; limit?: number; }
export interface SendChannelMessageRequest { channelId: string; content: string; attachments?: any[]; replyToId?: string; }
export interface AddChannelMembersRequest { channelId: string; memberIds: string[]; }
export interface InitiateCallRequest { calleeId: string; type: CallType; }
export interface UpdateCallStatusRequest { callId: string; status: string; durationSeconds?: number; }
export interface CreateMeetingRequest { title: string; scheduledStartTime?: string; passCode?: string; }
export interface JoinMeetingRequest { meetingId: string; passCode?: string; }
export interface SendMeetingMessageRequest { meetingId: string; content: string; }
export interface UploadFileRequest { file: File; channelId?: string; conversationId?: string; }
export interface UpdatePresenceRequest { status: string; customStatus?: string; }
export interface BatchPresenceRequest { userIds: string[]; }
export interface BatchPresenceResponse { presences: Record<string, { presence: string; lastSeen?: string; customStatus?: string }>; }
export interface AITransformRequest { text: string; mode: "summarize" | "professional" | "concise" | "action_items" | "translate"; targetLanguage?: string; }
export interface AITransformResponse { transformedText: string; mode: string; keyPoints?: string[]; }
export interface MailDispatchRequest { recipientEmail: string; recipientName: string; subject: string; bodyHtml: string; bodyPlain: string; triggerEvent: string; employeeId?: string; }
export interface MailDispatchResponse { success: boolean; messageId: string; dispatchedAt: string; recipient: string; }
export type WebSocketEventType = "presence_update" | "message_received" | "reaction_toggled" | "call_signal" | "call_incoming" | "call_accepted" | "call_rejected" | "call_ended" | "channel_updated" | "user_typing" | "user_stopped_typing" | "meeting_event" | "notification";
export interface WebSocketEvent<T = any> { type: WebSocketEventType; payload: T; timestamp: number; senderId?: string; }
`);

writeStrictFile(path.join(root, 'src/types/connect.ts'), `
export type { PresenceStatus, ConnectUser, MessageStatus, MessageReaction, MessageAttachment, ConnectMessage } from "./connect/userMessageTypes";
export type { ConnectConversation, ChannelMember, ConnectChannel } from "./connect/conversationChannelTypes";
export type { CallType, CallStatus, ActiveCall, CallHistoryItem, IceServerConfig, IceServersResponse, CallSignalPayload } from "./connect/callMeetingTypes";
export type { MeetingStatus, ConnectMeeting, ConnectSharedFile, ConnectNotification, MailArtifactDraft, ConnectSoundSettings } from "./connect/meetingMiscTypes";
export type { GetColleaguesParams, ColleaguesResponse, GlobalSearchParams, GlobalSearchResponse, CreateConversationRequest, GetConversationMessagesParams, SendMessageRequest, ToggleReactionRequest, CreateChannelRequest, UpdateChannelRequest, GetChannelMessagesParams, SendChannelMessageRequest, AddChannelMembersRequest, InitiateCallRequest, UpdateCallStatusRequest, CreateMeetingRequest, JoinMeetingRequest, SendMeetingMessageRequest, UploadFileRequest, UpdatePresenceRequest, BatchPresenceRequest, BatchPresenceResponse, AITransformRequest, AITransformResponse, MailDispatchRequest, MailDispatchResponse, WebSocketEventType, WebSocketEvent } from "./connect/apiPayloadTypes";
`);

console.log('Modularized connect.ts');
