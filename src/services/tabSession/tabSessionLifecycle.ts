import { getCleanStoredTabs, saveStoredTabs } from "./tabSessionStorage";
import { postChannelMessage } from "./tabSessionChannel";

export function handleTabUnregister(tabId: string, userId: string, isExplicitLogout: boolean, channel: BroadcastChannel | null) {
  let tabs = getCleanStoredTabs();
  if (isExplicitLogout) {
    tabs = tabs.filter((t) => t.userId !== userId);
    saveStoredTabs(tabs);
    postChannelMessage(channel, { type: "EXPLICIT_LOGOUT", userId });
    return { remainingTabsCount: 0 };
  }
  tabs = tabs.filter((t) => t.tabId !== tabId);
  saveStoredTabs(tabs);
  const userTabs = tabs.filter((t) => t.userId === userId);
  postChannelMessage(channel, { type: "TAB_CLOSED", tabId, userId, remainingTabsCount: userTabs.length });
  return { remainingTabsCount: userTabs.length };
}
