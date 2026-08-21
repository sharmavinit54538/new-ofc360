import { ChannelMember } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";

export function normalizeChannelMember(raw: any): ChannelMember {
  if (!raw) return { user: { id: "usr_unknown", name: "User", email: "" }, role: "member", joinedAt: new Date().toISOString() };
  return {
    user: raw.user ? normalizeConnectUser(raw.user) : normalizeConnectUser(raw),
    role: raw.role || "member", joinedAt: raw.joinedAt || raw.joined_at || new Date().toISOString(),
    isMuted: Boolean(raw.isMuted ?? raw.is_muted ?? false),
  };
}
