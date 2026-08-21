import { ConnectConversation } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";
import { normalizeConnectMessage } from "./normalizeConnectMessage";
import { isCurrentUser } from "./connectApiMerged";

export function normalizeConnectConversation(raw: any, currentUser?: any): ConnectConversation {
  if (!raw) return { id: "conv_unknown", participants: [], isGroup: false, unreadCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const id = String(raw.id || raw._id || raw.conversationId || raw.conversation_id || `conv_${Math.random().toString(36).slice(2)}`);
  const participants = Array.isArray(raw.participants) ? raw.participants.map(normalizeConnectUser) : [];
  let otherParticipant = raw.participant ? normalizeConnectUser(raw.participant) : undefined;
  if (currentUser) {
    if (raw.sender && raw.receiver) otherParticipant = isCurrentUser(raw.sender, currentUser) ? normalizeConnectUser(raw.receiver) : normalizeConnectUser(raw.sender);
    else if (participants.length > 0) otherParticipant = participants.find((p) => !isCurrentUser(p, currentUser)) || participants[0];
  }
  if (!otherParticipant && participants.length > 0) otherParticipant = participants[0];
  const lastMessage = raw.lastMessage || raw.last_message ? normalizeConnectMessage(raw.lastMessage || raw.last_message) : undefined;
  return {
    id, name: raw.name || otherParticipant?.name, avatar: raw.avatar || otherParticipant?.avatar, participants, participant: otherParticipant,
    isGroup: Boolean(raw.isGroup ?? raw.is_group ?? participants.length > 2), unreadCount: Number(raw.unreadCount ?? raw.unread_count ?? 0),
    lastMessage, pinned: Boolean(raw.pinned ?? raw.isPinned ?? raw.is_pinned ?? false), muted: Boolean(raw.muted ?? raw.isMuted ?? raw.is_muted ?? false),
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(), updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString(),
  };
}
