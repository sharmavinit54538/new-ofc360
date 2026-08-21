export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds?: string[];
  users?: string[];
  userNames?: string[];
  [key: string]: any;
}
