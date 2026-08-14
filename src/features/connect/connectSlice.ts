import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectMessage, MailArtifactDraft } from "@/types/connect";

export type ConnectTab = "chat" | "channels" | "calls" | "meetings" | "files" | "contacts";

export interface ConnectUiState {
  activeTab: ConnectTab;
  activeConversationId: string | null;
  activeChannelId: string | null;
  activeMeetingId: string | null;
  activeThreadMessage: ConnectMessage | null;
  searchQuery: string;
  searchType: "all" | "people" | "channels" | "messages" | "files";
  selectedMessageId: string | null;
  replyToMessage: ConnectMessage | null;
  editingMessageId: string | null;

  // Modals & Drawers
  isNewChatOpen: boolean;
  isNewChannelOpen: boolean;
  isNewMeetingOpen: boolean;
  isSearchOpen: boolean;
  mailArtifact: MailArtifactDraft | null;
  isMailArtifactOpen: boolean;
}

const initialState: ConnectUiState = {
  activeTab: "chat",
  activeConversationId: null,
  activeChannelId: null,
  activeMeetingId: null,
  activeThreadMessage: null,
  searchQuery: "",
  searchType: "all",
  selectedMessageId: null,
  replyToMessage: null,
  editingMessageId: null,
  isNewChatOpen: false,
  isNewChannelOpen: false,
  isNewMeetingOpen: false,
  isSearchOpen: false,
  mailArtifact: null,
  isMailArtifactOpen: false,
};

export const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ConnectTab>) => {
      state.activeTab = action.payload;
    },
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    setActiveChannelId: (state, action: PayloadAction<string | null>) => {
      state.activeChannelId = action.payload;
    },
    setActiveMeetingId: (state, action: PayloadAction<string | null>) => {
      state.activeMeetingId = action.payload;
    },
    setActiveThreadMessage: (state, action: PayloadAction<ConnectMessage | null>) => {
      state.activeThreadMessage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchType: (state, action: PayloadAction<ConnectUiState["searchType"]>) => {
      state.searchType = action.payload;
    },
    setSelectedMessageId: (state, action: PayloadAction<string | null>) => {
      state.selectedMessageId = action.payload;
    },
    setReplyToMessage: (state, action: PayloadAction<ConnectMessage | null>) => {
      state.replyToMessage = action.payload;
    },
    setEditingMessageId: (state, action: PayloadAction<string | null>) => {
      state.editingMessageId = action.payload;
    },
    setIsNewChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isNewChatOpen = action.payload;
    },
    setIsNewChannelOpen: (state, action: PayloadAction<boolean>) => {
      state.isNewChannelOpen = action.payload;
    },
    setIsNewMeetingOpen: (state, action: PayloadAction<boolean>) => {
      state.isNewMeetingOpen = action.payload;
    },
    setIsSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    openMailArtifact: (state, action: PayloadAction<Partial<MailArtifactDraft> | undefined>) => {
      state.isMailArtifactOpen = true;
      state.mailArtifact = {
        to: action.payload?.to || "",
        cc: action.payload?.cc || "",
        bcc: action.payload?.bcc || "",
        subject: action.payload?.subject || "",
        body: action.payload?.body || "",
        attachments: action.payload?.attachments || [],
      };
    },
    closeMailArtifact: (state) => {
      state.isMailArtifactOpen = false;
    },
    updateMailArtifact: (state, action: PayloadAction<Partial<MailArtifactDraft>>) => {
      if (state.mailArtifact) {
        state.mailArtifact = { ...state.mailArtifact, ...action.payload };
      }
    },
    resetConnectUi: () => initialState,
  },
});

export const {
  setActiveTab,
  setActiveConversationId,
  setActiveChannelId,
  setActiveMeetingId,
  setActiveThreadMessage,
  setSearchQuery,
  setSearchType,
  setSelectedMessageId,
  setReplyToMessage,
  setEditingMessageId,
  setIsNewChatOpen,
  setIsNewChannelOpen,
  setIsNewMeetingOpen,
  setIsSearchOpen,
  openMailArtifact,
  closeMailArtifact,
  updateMailArtifact,
  resetConnectUi,
} = connectSlice.actions;

export default connectSlice.reducer;
