import type { ConnectUser } from "../userMessageTypes";

export interface ChannelMember {
  userId: string;
  role: "owner" | "admin" | "member" | string;
  joinedAt: string;
  user?: ConnectUser;
  [key: string]: any;
}
