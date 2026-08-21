export class WsHeartbeatManager {
  private timer: any = null;

  public start(getWs: () => WebSocket | null, intervalMs = 25000) {
    this.stop();
    this.timer = setInterval(() => {
      const ws = getWs();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping", timestamp: new Date().toISOString() }));
      }
    }, intervalMs);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
