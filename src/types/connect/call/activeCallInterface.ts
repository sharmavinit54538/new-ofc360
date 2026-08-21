import type { ConnectUser } from "../userMessageTypes";
import type { CallType, CallStatus } from "./callStatusEnums";

export interface ActiveCall {
  id: string;
  channelName?: string;
  caller?: ConnectUser;
  callee?: ConnectUser;
  targetUser?: ConnectUser;
  type?: CallType;
  status?: CallStatus;
  startedAt?: number;
  connectedAt?: number;
  endedAt?: number;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isScreenSharing?: boolean;
  [key: string]: any;
}
