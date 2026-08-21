import { persistSettings } from "./soundActions";

export const createSoundNotificationMethods = (set: any, get: any) => ({
  setMessagesEnabled: (e: boolean) => { set({ isMessagesEnabled: e }); persistSettings(get()); },
  setMentionsEnabled: (e: boolean) => { set({ isMentionsEnabled: e }); persistSettings(get()); },
  setGroupMessagesEnabled: (e: boolean) => { set({ isGroupMessagesEnabled: e }); persistSettings(get()); },
  setChannelMessagesEnabled: (e: boolean) => { set({ isChannelMessagesEnabled: e }); persistSettings(get()); },
  setMeetingSoundsEnabled: (e: boolean) => { set({ isMeetingSoundsEnabled: e }); persistSettings(get()); },
  setParticipantJoinLeaveEnabled: (e: boolean) => { set({ isParticipantJoinLeaveEnabled: e }); persistSettings(get()); },
});
