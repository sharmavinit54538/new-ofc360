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
