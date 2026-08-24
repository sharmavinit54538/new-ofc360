export type CallType = "audio" | "video" | "screen-share" | string;

export type CanonicalCallStatus =
  | "IDLE"
  | "OUTGOING_CALLING"
  | "OUTGOING_RINGING"
  | "INCOMING_RINGING"
  | "CONNECTING"
  | "CONNECTED"
  | "ENDING"
  | "ENDED"
  | "DECLINED"
  | "MISSED"
  | "FAILED";

export type CallStatus =
  | CanonicalCallStatus
  | "idle"
  | "calling"
  | "ringing"
  | "initiating"
  | "connecting"
  | "connected"
  | "ending"
  | "ended"
  | "declined"
  | "rejected"
  | "missed"
  | "failed"
  | string;
