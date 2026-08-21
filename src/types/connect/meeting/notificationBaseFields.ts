export interface NotificationBaseFields {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  body?: string;
  type?: "message" | "mention" | "channel" | "call" | "channel_invite" | "meeting_invite" | string;
  entityId?: string;
  read?: boolean;
  isRead?: boolean;
}
