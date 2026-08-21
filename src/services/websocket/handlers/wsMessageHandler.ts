import { store } from "@/app/store";
import { connectApi } from "@/services/api/connectApi";
import { normalizeConnectMessage } from "@/services/api/connect/normalizeConnectMessage";
import { connectAudioManager } from "@/services/connectAudioManager";
import { ConnectMessage } from "@/types/connect";

export function handleWsMessageEvent(eventType: string, data: any, currentUserId: string) {
  if (eventType === "message:new") {
    const rawMsg = data.message || data;
    const message: ConnectMessage = normalizeConnectMessage(rawMsg);
    const targetId = message.conversationId || message.channelId;
    if (targetId) {
      store.dispatch(connectApi.util.updateQueryData("getConversationMessages" as any, { conversationId: targetId } as any, (draft: any) => { if (!draft.some((m: any) => m.id === message.id)) draft.push(message); }));
    }
    if (message.senderId !== currentUserId) connectAudioManager.playMessage();
  }
}
