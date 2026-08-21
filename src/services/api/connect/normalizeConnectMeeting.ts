import { ConnectMeeting } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";

export function normalizeConnectMeeting(raw: any): ConnectMeeting {
  if (!raw) return { id: "mtg_unknown", title: "Meeting", hostId: "usr_unknown", host: { id: "usr_unknown", name: "Host", email: "" }, status: "scheduled", scheduledStart: new Date().toISOString(), isRecorded: false, participants: [] };
  return {
    id: String(raw.id || raw._id || `mtg_${Math.random().toString(36).slice(2)}`),
    title: raw.title || "Meeting", description: raw.description || undefined, hostId: String(raw.hostId || raw.host_id || "usr_unknown"),
    host: normalizeConnectUser(raw.host), status: raw.status || "scheduled", scheduledStart: raw.scheduledStart || raw.scheduled_start || new Date().toISOString(),
    scheduledEnd: raw.scheduledEnd || raw.scheduled_end || undefined, actualStart: raw.actualStart || undefined,
    actualEnd: raw.actualEnd || undefined, isRecorded: Boolean(raw.isRecorded ?? false),
    recordingUrl: raw.recordingUrl || undefined, passcode: raw.passcode || undefined,
    participants: Array.isArray(raw.participants) ? raw.participants.map(normalizeConnectUser) : [],
  };
}
