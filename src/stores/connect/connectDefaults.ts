import type { FullConnectState } from "./connectDataTypes";
import { getStoredData } from "@/utils/storage";
import { STORAGE_KEYS } from "./connectStorage";

export const getInitialConnectState = (): FullConnectState => ({
  activeTab: "chat", activeConversationId: null, activeChannelId: null,
  activeMeetingId: null, activeThreadMessage: null,
  conversations: getStoredData(STORAGE_KEYS.CONVERSATIONS, []),
  channels: getStoredData(STORAGE_KEYS.CHANNELS, []),
  messages: getStoredData(STORAGE_KEYS.MESSAGES, {}),
  meetings: getStoredData(STORAGE_KEYS.MEETINGS, []),
  sharedFiles: getStoredData(STORAGE_KEYS.FILES, []),
  notifications: getStoredData(STORAGE_KEYS.NOTIFICATIONS, []),
  currentUserPresence: getStoredData(STORAGE_KEYS.USER_PRESENCE, "online"),
  userPresenceMap: {}, activeCall: null, incomingCall: null,
  currentMeetingRoom: null, isMeetingInSession: false,
  isNewChatOpen: false, isNewChannelOpen: false, isNewMeetingOpen: false,
  isSearchOpen: false, mailArtifact: null, isMailArtifactOpen: false,
});