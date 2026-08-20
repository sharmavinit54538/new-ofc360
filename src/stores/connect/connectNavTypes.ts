import type { ConnectMessage } from "@/types/connect";

export interface ConnectNavState {
  activeTab: "chat" | "channels" | "calls" | "meetings" | "files" | "contacts";
  activeConversationId: string | null;
  activeChannelId: string | null;
  activeMeetingId: string | null;
  activeThreadMessage: ConnectMessage | null;
}