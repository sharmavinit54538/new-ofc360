import { ConnectChannel } from "@/types/connect";
import { normalizeChannelMember } from "./normalizeChannelMember";
import { normalizeConnectMessage } from "./normalizeConnectMessage";
export * from "./normalizeChannelMember";

export function normalizeConnectChannel(raw: any): ConnectChannel {
  if (!raw) return { id: "chn_unknown", name: "general", memberCount: 0, isPrivate: false, createdAt: new Date().toISOString() };
  const id = String(raw.id || raw._id || raw.channelId || raw.channel_id || `chn_${Math.random().toString(36).slice(2)}`);
  const members = Array.isArray(raw.members) ? raw.members.map(normalizeChannelMember) : undefined;
  const memberCount = Number(raw.memberCount ?? raw.member_count ?? members?.length ?? 0);
  const lastMessage = raw.lastMessage || raw.last_message ? normalizeConnectMessage(raw.lastMessage || raw.last_message) : undefined;
  return {
    id, name: raw.name || "general", description: raw.description || undefined, isPrivate: Boolean(raw.isPrivate ?? raw.is_private ?? false),
    memberCount, members, topic: raw.topic || undefined, unreadCount: Number(raw.unreadCount ?? raw.unread_count ?? 0),
    isMuted: Boolean(raw.isMuted ?? false), isStarred: Boolean(raw.isStarred ?? false), isArchived: Boolean(raw.isArchived ?? false), lastMessage,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(), createdBy: raw.createdBy || raw.created_by || undefined,
  };
}
