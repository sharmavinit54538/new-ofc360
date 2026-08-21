import type { MessageStatus, MessageReaction, MessageAttachment } from "./messageReactionTypes";
import type { MessageCoreFields } from "./messageCoreFields";

export * from "./messageCoreFields";

export interface ConnectMessage extends MessageCoreFields {
  createdAt?: string;
  timestamp?: string | number;
  status?: MessageStatus;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  [key: string]: any;
}
