import { store } from "@/app/store";
import { setConnected } from "@/features/connect/websocketSlice";
import { setCurrentUserPresence } from "@/features/connect/presenceSlice";
import { buildWebSocketUrl } from "./wsConnectionUrl";
import { WsHeartbeatManager } from "./wsHeartbeat";
import { routeWsIncomingEvent } from "./wsEventRouter";

export function initWebSocket(listeners: Set<(p: any) => void>, heartbeat: WsHeartbeatManager): WebSocket | null {
  if (typeof window === "undefined") return null;
  const token = store.getState().auth.token || "";
  if (!token && !store.getState().auth.isAuthenticated) return null;
  try {
    const ws = new WebSocket(buildWebSocketUrl(token));
    ws.onopen = () => { store.dispatch(setConnected(true)); store.dispatch(setCurrentUserPresence("online")); heartbeat.start(() => ws); };
    ws.onmessage = (e) => { try { routeWsIncomingEvent(JSON.parse(e.data), listeners); } catch {} };
    ws.onclose = () => { store.dispatch(setConnected(false)); heartbeat.stop(); };
    return ws;
  } catch { return null; }
}
