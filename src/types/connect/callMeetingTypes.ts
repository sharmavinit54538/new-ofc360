import type { ConnectUser } from "./userMessageTypes";

export type CallType = "audio" | "video" | "screen-share" | string;
export type CallStatus =
  | "initiating"
  | "ringing"
  | "connecting"
  | "connected"
  | "ended"
  | "missed"
  | "declined"
  | "failed"
  | string;

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

export interface CallHistoryItem {
  id: string;
  callerId: string;
  calleeId: string;
  callerName: string;
  calleeName: string;
  callerAvatar?: string;
  calleeAvatar?: string;
  type: CallType;
  status: CallStatus;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
  wasRecorded?: boolean;
  recordingUrl?: string;
  [key: string]: any;
}

export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface IceServersResponse {
  iceServers: IceServerConfig[];
  turnUsername?: string;
  turnCredential?: string;
}

export interface CallSignalPayload {
  type: "offer" | "answer" | "candidate" | "reject" | "end" | "ring" | "busy" | "switch_type" | string;
  callId: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  fromUserId: string;
  toUserId: string;
  newType?: CallType;
  reason?: string;
  timestamp?: number;
  [key: string]: any;
}