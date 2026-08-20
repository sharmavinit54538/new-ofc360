import type { ConnectConversation, ConnectChannel, ConnectMessage, ConnectMeeting, ConnectSharedFile, ConnectNotification, PresenceStatus, ActiveCall, MailArtifactDraft } from "@/types/connect";
import type { ConnectNavState } from "./connectNavTypes";

export interface ConnectCollectionsState {
  conversations: ConnectConversation[]; channels: ConnectChannel[];
  messages: Record<string, ConnectMessage[]>; meetings: ConnectMeeting[];
  sharedFiles: ConnectSharedFile[]; notifications: ConnectNotification[];
  currentUserPresence: PresenceStatus; userPresenceMap: Record<string, PresenceStatus>;
  activeCall: ActiveCall | null; incomingCall: ActiveCall | null;
  currentMeetingRoom: ConnectMeeting | null; isMeetingInSession: boolean;
  isNewChatOpen: boolean; isNewChannelOpen: boolean; isNewMeetingOpen: boolean;
  isSearchOpen: boolean; mailArtifact: MailArtifactDraft | null; isMailArtifactOpen: boolean;
}
export type FullConnectState = ConnectNavState & ConnectCollectionsState;