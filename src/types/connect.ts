export type PresenceStatus = "online" | "away" | "busy" | "dnd" | "offline";

export interface ConnectUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  avatar?: string;
  presence?: PresenceStatus;
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
  url: string; // Object URL or remote URL
  isLocal?: boolean;
}

export interface ConnectMessage {
  id: string;
  conversationId: string; // or channelId
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
}

export interface ConnectConversation {
  id: string;
  participant: ConnectUser;
  lastMessage?: ConnectMessage;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  updatedAt: string;
}

export interface ConnectChannel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  members: ConnectUser[];
  unreadCount?: number;
  isPinned?: boolean;
  isArchived?: boolean;
}

export type CallType = "audio" | "video";
export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended" | "failed";

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
}

export interface MailArtifactDraft {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  attachments?: MessageAttachment[];
}
