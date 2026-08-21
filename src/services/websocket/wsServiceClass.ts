import { store } from "@/app/store";
import { setConnected } from "@/features/connect/websocketSlice";
import { setCurrentUserPresence } from "@/features/connect/presenceSlice";
import { WsHeartbeatManager } from "./wsHeartbeat";
import { initWebSocket } from "./wsLifecycle";

export class ConnectWebSocketService {
  public ws: WebSocket | null = null;
  public signalListeners = new Set<(payload: any) => void>();
  private heartbeat = new WsHeartbeatManager();

  public updateToken(token: string) { if (token && store.getState().auth.isAuthenticated) { this.disconnect(false); this.connect(); } }
  public connect() { if (!this.ws || this.ws.readyState !== WebSocket.OPEN) this.ws = initWebSocket(this.signalListeners, this.heartbeat); }
  public disconnect(isLogout = true) { this.heartbeat.stop(); if (this.ws) { try { this.ws.close(); } catch {} this.ws = null; } store.dispatch(setConnected(false)); if (isLogout) store.dispatch(setCurrentUserPresence("offline")); }
  public send(event: string, data: any) { if (this.ws && this.ws.readyState === WebSocket.OPEN) { this.ws.send(JSON.stringify({ event, data, timestamp: new Date().toISOString() })); return true; } return false; }
  public sendTyping(targetId: string, isTyping: boolean) { this.send(isTyping ? "typing:start" : "typing:stop", { targetId, user: store.getState().auth.user?.name || "User" }); }
  public onSignal(cb: (p: any) => void) { this.signalListeners.add(cb); return () => this.signalListeners.delete(cb); }
}
