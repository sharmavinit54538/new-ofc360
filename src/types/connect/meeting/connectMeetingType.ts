import type { ConnectUser } from "../userMessageTypes";
import type { MeetingStatus } from "./meetingStatusType";

export interface ConnectMeeting {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  startTime: string;
  endTime?: string;
  status: MeetingStatus;
  participants: ConnectUser[];
  activeParticipantCount: number;
  maxParticipants?: number;
  isRecording?: boolean;
  recordingUrl?: string;
  passCode?: string;
  [key: string]: any;
}
