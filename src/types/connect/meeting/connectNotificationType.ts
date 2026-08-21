import type { NotificationBaseFields } from "./notificationBaseFields";

export * from "./notificationBaseFields";

export interface ConnectNotification extends NotificationBaseFields {
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
