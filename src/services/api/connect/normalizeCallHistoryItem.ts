import { CallHistoryItem } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";

export function normalizeCallHistoryItem(raw: any): CallHistoryItem {
  if (!raw) return { id: "call_unknown", caller: { id: "u1", name: "User", email: "" }, callee: { id: "u2", name: "User", email: "" }, type: "audio", direction: "outgoing", status: "completed", startedAt: new Date().toISOString(), duration: 0 };
  return {
    id: String(raw.id || raw._id || `call_${Math.random().toString(36).slice(2)}`),
    caller: normalizeConnectUser(raw.caller), callee: normalizeConnectUser(raw.callee),
    type: raw.type || "audio", direction: raw.direction || "outgoing", status: raw.status || "completed",
    startedAt: raw.startedAt || raw.started_at || new Date().toISOString(), endedAt: raw.endedAt || raw.ended_at || undefined,
    duration: Number(raw.duration ?? 0), recordingUrl: raw.recordingUrl || raw.recording_url || undefined,
  };
}
