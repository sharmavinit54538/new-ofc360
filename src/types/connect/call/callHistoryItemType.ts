import type { CallType, CallStatus } from "./callStatusTypes";

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
