export type PresenceStatus = "online" | "away" | "busy" | "dnd" | "offline";

export interface ConnectUser {
  id: string;
  userId?: string;
  user_id?: string;
  employee_id?: string;
  employeeId?: string;
  name: string;
  email: string;
  role?: string;
  designation?: string;
  department?: string;
  avatar?: string;
  photoUrl?: string;
  presence?: PresenceStatus;
  customStatusText?: string;
  lastActive?: string;
}

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Remote URL or local blob URL
  isLocal?: boolean;
  category?: "documents" | "images" | "videos" | "spreadsheets" | "other";
}

export interface ConnectMessage {
  id: string;
  conversationId: string; // or channelId or meetingId
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string; // ISO string or formatted string
  status: MessageStatus;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  replyToMessageId?: string;
  replyCount?: number;
  isVoiceMessage?: boolean;
  voiceDuration?: number; // seconds
  isPinned?: boolean;
  isEdited?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectConversation {
  id: string;
  participant: ConnectUser;
  lastMessage?: ConnectMessage;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  updatedAt: string;
  createdAt?: string;
}

export interface ConnectChannel {
  id: string;
  name: string;
  description?: string;
  topic?: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  members: ConnectUser[];
  unreadCount?: number;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface ChannelMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  joinedAt?: string;
}

export type CallType = "audio" | "video";
export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended" | "failed" | "rejected" | "missed" | "busy";

export interface ActiveCall {
  id: string;
  type: CallType;
  targetUser: ConnectUser;
  isIncoming?: boolean;
  status: CallStatus;
  startTime?: number; // timestamp
  duration: number; // in seconds
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isSpeakerOn?: boolean;
}

export interface CallHistoryItem {
  id: string;
  caller: ConnectUser;
  callee: ConnectUser;
  type: CallType;
  status: "completed" | "missed" | "rejected" | "busy" | "failed";
  direction?: "incoming" | "outgoing";
  duration: number; // in seconds
  startedAt: string;
  endedAt?: string;
}

export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface IceServersResponse {
  iceServers: IceServerConfig[];
}

export interface CallSignalPayload {
  callId: string;
  targetUserId: string;
  signal: {
    type: "offer" | "answer" | "ice-candidate";
    sdp?: string;
    candidate?: RTCIceCandidateInit;
  };
}

export type MeetingStatus = "scheduled" | "waiting" | "in_meeting" | "ended";

export interface ConnectMeeting {
  id: string;
  title: string;
  description?: string;
  hostId: string;
  hostName: string;
  startTime: string;
  durationMinutes?: number;
  participants: ConnectUser[];
  isPrivate: boolean;
  allowScreenShare: boolean;
  allowMicrophone: boolean;
  allowCamera: boolean;
  status: MeetingStatus;
  passcode?: string;
  createdAt?: string;
}

export interface ConnectSharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: "documents" | "images" | "videos" | "spreadsheets" | "other";
  url: string;
  sharedBy: ConnectUser;
  sharedAt: string;
  channelId?: string;
  conversationId?: string;
  downloadUrl?: string;
}

export interface ConnectNotification {
  id: string;
  type: "message" | "mention" | "call" | "meeting" | "file" | "channel";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
  sender?: ConnectUser;
  channelId?: string;
  channelName?: string;
  conversationId?: string;
  content?: string;
  targetName?: string;
  targetType?: "channel" | "dm" | "meeting";
}

export interface MailArtifactDraft {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachments?: MessageAttachment[];
}

export interface ConnectSoundSettings {
  isMasterEnabled: boolean;
  isIncomingCallsEnabled: boolean;
  isOutgoingCallsEnabled: boolean;
  isMessagesEnabled: boolean;
  isMentionsEnabled: boolean;
  isGroupMessagesEnabled: boolean;
  isChannelMessagesEnabled: boolean;
  isMeetingSoundsEnabled: boolean;
  isParticipantJoinLeaveEnabled: boolean;
  masterVolume: number; // 0 to 100
  isMutedAll: boolean;
  isAudioUnlocked?: boolean;
  isSettingsOpen?: boolean;
}

// ==========================================
// DTOs & Request/Response Types
// ==========================================

export interface GetColleaguesParams {
  search?: string;
  department?: string;
  presence?: PresenceStatus | "all";
  page?: number;
  limit?: number;
}

export interface ColleaguesResponse {
  colleagues: ConnectUser[];
  total: number;
  page?: number;
  totalPages?: number;
}

export interface GlobalSearchParams {
  q: string;
  type?: "all" | "people" | "channels" | "messages" | "files";
}

export interface GlobalSearchResponse {
  people: ConnectUser[];
  channels: ConnectChannel[];
  messages: Array<ConnectMessage & { contextTitle?: string }>;
  files: ConnectSharedFile[];
}

export interface CreateConversationRequest {
  targetUserId: string;
}

export interface GetConversationMessagesParams {
  conversationId: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachments?: MessageAttachment[];
  replyToMessageId?: string;
  isVoiceMessage?: boolean;
  voiceDuration?: number;
}

export interface ToggleReactionRequest {
  messageId: string;
  emoji: string;
}

export interface CreateChannelRequest {
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds: string[];
}

export interface UpdateChannelRequest {
  channelId: string;
  name?: string;
  description?: string;
  topic?: string;
}

export interface GetChannelMessagesParams {
  channelId: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export interface SendChannelMessageRequest {
  channelId: string;
  content: string;
  attachments?: MessageAttachment[];
  replyToMessageId?: string;
  isVoiceMessage?: boolean;
  voiceDuration?: number;
}

export interface AddChannelMembersRequest {
  channelId: string;
  memberIds: string[];
}

export interface InitiateCallRequest {
  targetUserId?: string;
  calleeId?: string;
  type: CallType;
}

export interface UpdateCallStatusRequest {
  callId: string;
  status: "connected" | "rejected" | "ended" | "missed" | "busy";
  duration?: number;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  startTime?: string;
  durationMinutes?: number;
  invitedUserIds?: string[];
  allowScreenShare?: boolean;
  allowMicrophone?: boolean;
  allowCamera?: boolean;
  isPrivate?: boolean;
  passcode?: string;
}

export interface JoinMeetingRequest {
  meetingId: string;
  passcode?: string;
}

export interface SendMeetingMessageRequest {
  meetingId: string;
  content: string;
  attachments?: MessageAttachment[];
}

export interface UploadFileRequest {
  file: File;
  conversationId?: string;
  channelId?: string;
}

export interface UpdatePresenceRequest {
  status: PresenceStatus;
  customStatusText?: string;
}

export interface BatchPresenceRequest {
  userIds: string[];
}

export interface BatchPresenceResponse {
  presences: Record<string, { status: PresenceStatus; customStatusText?: string; lastActive?: string }>;
}

export interface AITransformRequest {
  text: string;
  action: "professional" | "generate_reply" | "tone" | "shorten" | "expand" | "summarize";
  tone?: "friendly" | "diplomatic" | "urgent";
  recipientName?: string;
  context?: string;
}

export interface AITransformResponse {
  transformedText: string;
  originalText: string;
  action: string;
}

export interface MailDispatchRequest {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachmentIds?: string[];
}

export interface MailDispatchResponse {
  success: boolean;
  messageId?: string;
  dispatchedAt?: string;
}

// ==========================================
// WebSocket Real-time Event Types
// ==========================================

export type WebSocketEventType =
  | "message:new"
  | "message:update"
  | "message:delete"
  | "reaction:toggle"
  | "typing:start"
  | "typing:stop"
  | "presence:change"
  | "presence:update"
  | "presence_update"
  | "user:presence"
  | "status:change"
  | "user:online"
  | "USER_ONLINE"
  | "user:offline"
  | "USER_OFFLINE"
  | "batch:presence"
  | "presence:batch"
  | "call:incoming"
  | "call:accepted"
  | "call:rejected"
  | "call:ended"
  | "webrtc:signal"
  | "meeting:participant_joined"
  | "meeting:participant_left"
  | "meeting:screen_share"
  | (string & {});

export interface WebSocketEvent<T = any> {
  event: WebSocketEventType;
  data: T;
  timestamp: string;
}
