import type { ConnectUser } from "./userMessageTypes";

export type MeetingStatus = "scheduled" | "live" | "ended" | "cancelled" | "in_meeting" | string;

export interface ConnectMeeting {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  startTime: string;
  endTime?: string;
  status: MeetingStatus;
  participants: ConnectUser[];
  activeParticipantCount: number;
  maxParticipants?: number;
  isRecording?: boolean;
  recordingUrl?: string;
  passCode?: string;
  [key: string]: any;
}

export interface ConnectSharedFile {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  uploadedBy: string;
  uploaderName: string;
  uploadedAt: string;
  channelId?: string;
  conversationId?: string;
  [key: string]: any;
}

export interface ConnectNotification {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  body?: string;
  type?: "message" | "mention" | "channel" | "call" | "channel_invite" | "meeting_invite" | string;
  entityId?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
  link?: string;
  actionUrl?: string;
  sender?: any;
  channelId?: string;
  channelName?: string;
  conversationId?: string;
  content?: string;
  [key: string]: any;
}

export interface MailArtifactDraft {
  recipientEmail?: string;
  to?: string;
  recipientName?: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  attachments?: { name: string; url: string; size: number }[];
  [key: string]: any;
}

export interface ConnectSoundSettings {
  masterSoundEnabled: boolean;
  ringtoneVolume: number;
  notificationVolume: number;
  messageVolume: number;
  chimeVolume: number;
  preferredRingtone: "classic_corporate" | "gentle_pulse" | "modern_synth" | "minimal_bell";
  isMutedAll: boolean;
  notifyOnDirectMessage: boolean;
  notifyOnChannelMention: boolean;
  notifyOnCallIncoming: boolean;
  [key: string]: any;
}