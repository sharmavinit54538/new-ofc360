import { store } from "@/app/store";
import { setLastEvent } from "@/features/connect/websocketSlice";
import { handleWsMessageEvent } from "./handlers/wsMessageHandler";
import { handleWsPresenceEvent } from "./handlers/wsPresenceHandler";
import { handleWsCallEvent } from "./handlers/wsCallHandler";

export function routeWsIncomingEvent(eventObj: any, signalListeners: Set<(p: any) => void>) {
  const eventType = String(eventObj.event || eventObj.type || "");
  const data = eventObj.data || eventObj.payload || eventObj;
  const currentUserId = String(store.getState().auth.user?.id || "");
  store.dispatch(setLastEvent({ event: eventType, data, timestamp: new Date().toISOString() }));
  if (eventType.startsWith("message")) handleWsMessageEvent(eventType, data, currentUserId);
  else if (eventType.includes("presence") || eventType.includes("ONLINE") || eventType.includes("OFFLINE")) handleWsPresenceEvent(eventType, data);
  else if (eventType.startsWith("call") || eventType === "webrtc:signal") handleWsCallEvent(eventType, data, signalListeners);
}
