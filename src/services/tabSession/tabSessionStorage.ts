import { ACTIVE_TABS_STORAGE_KEY, TAB_EXPIRY_THRESHOLD_MS, TabRecord } from "./tabSessionTypes";

export function getCleanStoredTabs(): TabRecord[] {
  try {
    const raw = localStorage.getItem(ACTIVE_TABS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: TabRecord[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    return parsed.filter((t) => t && t.tabId && now - t.lastHeartbeat < TAB_EXPIRY_THRESHOLD_MS);
  } catch { return []; }
}

export function saveStoredTabs(tabs: TabRecord[]) {
  try { localStorage.setItem(ACTIVE_TABS_STORAGE_KEY, JSON.stringify(tabs)); } catch {}
}

export function recordTabPresence(tabId: string, userId: string) {
  const tabs = getCleanStoredTabs();
  const now = Date.now();
  const idx = tabs.findIndex((t) => t.tabId === tabId);
  if (idx > -1) tabs[idx] = { tabId, userId, lastHeartbeat: now };
  else tabs.push({ tabId, userId, lastHeartbeat: now });
  saveStoredTabs(tabs);
}
