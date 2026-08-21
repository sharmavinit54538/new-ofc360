import type { CallType } from "./callStatusTypes";

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
