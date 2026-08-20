/**
 * OFC360 Multi-Tab & Session Presence Coordinator
 * 
 * Tracks active browser tabs for the authenticated user to prevent prematurely
 * marking an employee offline when closing 1 of multiple active tabs.
 * Only marks offline when all active tabs close or when explicit logout occurs.
 */

const ACTIVE_TABS_STORAGE_KEY = "ofc360_active_session_tabs_v1";
const TAB_HEARTBEAT_INTERVAL_MS = 10000;
const TAB_EXPIRY_THRESHOLD_MS = 25000;

interface TabRecord {
  tabId: string;
  userId: string;
  lastHeartbeat: number;
}

class TabSessionManager {
  private tabId: string;
  private heartbeatInterval: any = null;
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.tabId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("ofc360_presence_tab_channel");
        this.channel.onmessage = (event) => {
          this.handleChannelMessage(event.data);
        };
      } catch {}
    }
  }

  public getTabId(): string {
    return this.tabId;
  }

  public registerTab(userId: string) {
    if (typeof window === "undefined" || !userId) return;

    this.stopHeartbeat();
    this.recordTabPresence(userId);

    this.heartbeatInterval = setInterval(() => {
      this.recordTabPresence(userId);
    }, TAB_HEARTBEAT_INTERVAL_MS);

    // Notify peer tabs
    try {
      this.channel?.postMessage({
        type: "TAB_OPENED",
        tabId: this.tabId,
        userId,
      });
    } catch {}
  }

  public unregisterTab(userId: string, isExplicitLogout: boolean = false): { remainingTabsCount: number } {
    this.stopHeartbeat();
    if (typeof window === "undefined") return { remainingTabsCount: 0 };

    let tabs = this.getCleanStoredTabs();

    if (isExplicitLogout) {
      // Clear all tabs for this user on explicit logout
      tabs = tabs.filter((t) => t.userId !== userId);
      this.saveStoredTabs(tabs);

      try {
        this.channel?.postMessage({
          type: "EXPLICIT_LOGOUT",
          userId,
        });
      } catch {}

      return { remainingTabsCount: 0 };
    }

    // Remove this specific tab
    tabs = tabs.filter((t) => t.tabId !== this.tabId);
    this.saveStoredTabs(tabs);

    const userTabs = tabs.filter((t) => t.userId === userId);

    try {
      this.channel?.postMessage({
        type: "TAB_CLOSED",
        tabId: this.tabId,
        userId,
        remainingTabsCount: userTabs.length,
      });
    } catch {}

    return { remainingTabsCount: userTabs.length };
  }

  public getActiveTabsCount(userId: string): number {
    if (typeof window === "undefined" || !userId) return 0;
    const tabs = this.getCleanStoredTabs();
    return tabs.filter((t) => t.userId === userId).length;
  }

  private recordTabPresence(userId: string) {
    let tabs = this.getCleanStoredTabs();
    const now = Date.now();

    const existingIdx = tabs.findIndex((t) => t.tabId === this.tabId);
    if (existingIdx > -1) {
      tabs[existingIdx] = { tabId: this.tabId, userId, lastHeartbeat: now };
    } else {
      tabs.push({ tabId: this.tabId, userId, lastHeartbeat: now });
    }

    this.saveStoredTabs(tabs);
  }

  private getCleanStoredTabs(): TabRecord[] {
    try {
      const raw = localStorage.getItem(ACTIVE_TABS_STORAGE_KEY);
      if (!raw) return [];
      const parsed: TabRecord[] = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const now = Date.now();
      // Filter out tabs whose heartbeat expired
      return parsed.filter((t) => t && t.tabId && now - t.lastHeartbeat < TAB_EXPIRY_THRESHOLD_MS);
    } catch {
      return [];
    }
  }

  private saveStoredTabs(tabs: TabRecord[]) {
    try {
      localStorage.setItem(ACTIVE_TABS_STORAGE_KEY, JSON.stringify(tabs));
    } catch {}
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleChannelMessage(data: any) {
    if (!data) return;
    if (data.type === "EXPLICIT_LOGOUT") {
      this.stopHeartbeat();
    }
  }
}

export const tabSessionManager = new TabSessionManager();
