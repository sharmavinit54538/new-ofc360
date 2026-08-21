import type { ConnectMessage } from "../userMessageTypes";
import type { ChannelMember } from "./channelMemberType";

export interface ConnectChannel {
  id: string;
  name: string;
  description?: string;
  isPrivate?: boolean;
  topic?: string;
  createdBy?: string;
  createdAt?: string;
  memberCount?: number;
  unreadCount?: number;
  lastMessage?: ConnectMessage;
  members?: ChannelMember[];
  [key: string]: any;
}
