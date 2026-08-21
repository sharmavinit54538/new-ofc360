import { store } from "@/app/store";
import { setUserPresence, setBatchUserPresences } from "@/features/connect/presenceSlice";
import { PresenceStatus } from "@/types/connect";

export function handleWsPresenceEvent(eventType: string, data: any) {
  if (eventType.includes("batch")) {
    const map: Record<string, PresenceStatus> = {};
    if (Array.isArray(data)) data.forEach((item: any) => { const uId = item.userId || item.id; if (uId) map[uId] = item.status || "offline"; });
    store.dispatch(setBatchUserPresences(map));
  } else {
    const targetUserId = String(data.userId || data.user_id || data.id || "");
    const status: PresenceStatus = eventType === "USER_ONLINE" || eventType === "user:online" ? "online" : eventType === "USER_OFFLINE" || eventType === "user:offline" ? "offline" : (data.status || "offline");
    if (targetUserId) store.dispatch(setUserPresence({ userId: targetUserId, status } as any));
  }
}
