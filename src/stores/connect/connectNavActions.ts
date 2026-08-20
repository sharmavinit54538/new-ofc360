export const createNavActions = (set: any) => ({
  setActiveTab: (activeTab: any) => set({ activeTab }),
  setActiveConversationId: (activeConversationId: any) => set({ activeConversationId, activeChannelId: null }),
  setActiveChannelId: (activeChannelId: any) => set({ activeChannelId, activeConversationId: null }),
  setActiveMeetingId: (activeMeetingId: any) => set({ activeMeetingId }),
  setActiveThreadMessage: (activeThreadMessage: any) => set({ activeThreadMessage }),
  setIsNewChatOpen: (isNewChatOpen: boolean) => set({ isNewChatOpen }),
  setIsNewChannelOpen: (isNewChannelOpen: boolean) => set({ isNewChannelOpen }),
  setIsNewMeetingOpen: (isNewMeetingOpen: boolean) => set({ isNewMeetingOpen }),
  setIsSearchOpen: (isSearchOpen: boolean) => set({ isSearchOpen }),
  setMailArtifact: (mailArtifact: any) => set({ mailArtifact, isMailArtifactOpen: !!mailArtifact }),
  setIsMailArtifactOpen: (isMailArtifactOpen: boolean) => set({ isMailArtifactOpen }),
});