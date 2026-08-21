import { ConnectUser, PresenceStatus } from "@/types/connect";

export function normalizeConnectUser(raw: any): ConnectUser {
  if (!raw) return { id: "usr_unknown", name: "User", email: "" };
  const id = String(raw.id || raw._id || raw.userId || raw.user_id || `usr_${Math.random().toString(36).slice(2)}`);
  let name = raw.name?.trim() || raw.full_name?.trim() || raw.fullName?.trim() || "";
  if (!name && (raw.first_name || raw.firstName)) name = `${raw.first_name || raw.firstName || ""} ${raw.last_name || raw.lastName || ""}`.trim();
  if (!name && raw.email?.includes("@")) name = raw.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  name = name || "Colleague";
  const email = raw.email || raw.emailAddress || "";
  const role = raw.role || raw.designation || raw.job_title || "Team Member";
  const department = raw.department || raw.dept || "General";
  const avatar = raw.avatar || raw.avatar_url || raw.photoUrl || undefined;
  let presence: PresenceStatus = "offline";
  const rawP = String(raw.presence || raw.presence_status || raw.online_status || "").toLowerCase().trim();
  if (["online", "away", "busy", "offline", "in-call", "meeting"].includes(rawP)) presence = rawP as PresenceStatus;
  else if (raw.is_online === true || raw.isOnline === true || raw.online === true) presence = "online";
  return { id, name, email, role, department, avatar, presence, customStatus: raw.customStatus || raw.custom_status || undefined, lastSeen: raw.lastSeen || raw.last_seen || undefined, isOnline: presence === "online" || presence === "in-call" || presence === "busy" };
}
