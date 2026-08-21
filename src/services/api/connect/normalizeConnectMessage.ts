import { ConnectMessage } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";

export function normalizeConnectMessage(raw: any, fallbackTargetId?: string): ConnectMessage {
  if (!raw) return { id: "msg_unknown", senderId: "usr_unknown", content: "", timestamp: new Date().toISOString(), status: "sent" };
  const id = String(raw.id || raw._id || raw.messageId || `msg_${Math.random().toString(36).slice(2)}`);
  const senderId = String(raw.senderId || raw.sender_id || raw.userId || "usr_unknown");
  const sender = raw.sender ? normalizeConnectUser(raw.sender) : undefined;
  return {
    id, senderId, sender, conversationId: raw.conversationId || raw.conversation_id || (!raw.channelId && fallbackTargetId ? fallbackTargetId : undefined),
    channelId: raw.channelId || raw.channel_id || (raw.channel_name || (fallbackTargetId?.startsWith("chn_") ? fallbackTargetId : undefined)),
    content: raw.content || raw.body || raw.text || "", type: raw.type || "text",
    attachments: Array.isArray(raw.attachments) ? raw.attachments : [], reactions: Array.isArray(raw.reactions) ? raw.reactions : [],
    replyToId: raw.replyToId || raw.reply_to_id || raw.replyTo?.id, replyTo: raw.replyTo ? normalizeConnectMessage(raw.replyTo) : undefined,
    isEdited: Boolean(raw.isEdited ?? false), isDeleted: Boolean(raw.isDeleted ?? false), isForwarded: Boolean(raw.isForwarded ?? false),
    isStarred: Boolean(raw.isStarred ?? false), timestamp: raw.timestamp || raw.created_at || new Date().toISOString(),
    status: raw.status || (raw.read ? "read" : raw.delivered ? "delivered" : "sent"),
  };
}
