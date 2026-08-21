export const ACTIVE_TABS_STORAGE_KEY = "ofc360_active_session_tabs_v1";
export const TAB_HEARTBEAT_INTERVAL_MS = 10000;
export const TAB_EXPIRY_THRESHOLD_MS = 25000;

export interface TabRecord {
  tabId: string;
  userId: string;
  lastHeartbeat: number;
}
