import { setStoredData } from "@/utils/storage";
import { STORAGE_KEYS } from "./connectStorage";
import { connectAudioManager } from "@/services/connectAudioManager";

export const createMsgActions = (set: any, get: any) => ({
  sendMessage: (payload: any) => {
    const msgId = "MSG-" + Date.now();
    const newMsg = { id: msgId, ...payload, createdAt: new Date().toISOString(), status: "sent" };
    const targetId = payload.conversationId || payload.channelId;
    const current = get().messages[targetId] || [];
    const updated = { ...get().messages, [targetId]: [...current, newMsg] };
    set({ messages: updated });
    setStoredData(STORAGE_KEYS.MESSAGES, updated);
    connectAudioManager.playMessage();
    return newMsg;
  },
  toggleReaction: (msgId: string, emoji: string, userId: string) => {
    // reaction toggle logic
  },
});