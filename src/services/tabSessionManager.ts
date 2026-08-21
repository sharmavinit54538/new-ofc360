import { TAB_HEARTBEAT_INTERVAL_MS } from "./tabSession/tabSessionTypes";
import { getCleanStoredTabs, recordTabPresence } from "./tabSession/tabSessionStorage";
import { createSessionBroadcastChannel, postChannelMessage } from "./tabSession/tabSessionChannel";
import { handleTabUnregister } from "./tabSession/tabSessionLifecycle";

export class TabSessionManager {
  private tabId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  private heartbeatInterval: any = null;
  private channel = createSessionBroadcastChannel(() => this.stopHeartbeat());

  public getTabId() { return this.tabId; }
  public registerTab(userId: string) {
    if (typeof window === "undefined" || !userId) return;
    this.stopHeartbeat(); recordTabPresence(this.tabId, userId);
    this.heartbeatInterval = setInterval(() => recordTabPresence(this.tabId, userId), TAB_HEARTBEAT_INTERVAL_MS);
    postChannelMessage(this.channel, { type: "TAB_OPENED", tabId: this.tabId, userId });
  }
  public unregisterTab(userId: string, isExplicitLogout = false) {
    this.stopHeartbeat();
    if (typeof window === "undefined") return { remainingTabsCount: 0 };
    return handleTabUnregister(this.tabId, userId, isExplicitLogout, this.channel);
  }
  public getActiveTabsCount(userId: string) {
    if (typeof window === "undefined" || !userId) return 0;
    return getCleanStoredTabs().filter((t) => t.userId === userId).length;
  }
  private stopHeartbeat() { if (this.heartbeatInterval) { clearInterval(this.heartbeatInterval); this.heartbeatInterval = null; } }
}
export const tabSessionManager = new TabSessionManager();