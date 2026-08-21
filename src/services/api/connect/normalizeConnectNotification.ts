import { ConnectNotification } from "@/types/connect";
export * from "./normalizeConnectSharedFile";

export function normalizeConnectNotification(raw: any): ConnectNotification {
  if (!raw) return { id: "notif_unknown", type: "mention", title: "", message: "", isRead: false, createdAt: new Date().toISOString() };
  return {
    id: String(raw.id || raw._id || `notif_${Math.random().toString(36).slice(2)}`),
    type: raw.type || "mention", title: raw.title || "", message: raw.message || raw.body || "",
    isRead: Boolean(raw.isRead ?? raw.is_read ?? false), createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    link: raw.link || raw.url || undefined,
  };
}
