import { ConnectSharedFile } from "@/types/connect";
import { normalizeConnectUser } from "./normalizeConnectUser";

export function normalizeConnectSharedFile(raw: any): ConnectSharedFile {
  if (!raw) return { id: "file_unknown", name: "file", url: "", size: 0, mimeType: "application/octet-stream", uploadedBy: { id: "usr_unknown", name: "User", email: "" }, uploadedAt: new Date().toISOString() };
  return {
    id: String(raw.id || raw._id || `file_${Math.random().toString(36).slice(2)}`),
    name: raw.name || raw.filename || "file", url: raw.url || raw.fileUrl || "", size: Number(raw.size ?? 0),
    mimeType: raw.mimeType || raw.mime_type || "application/octet-stream", uploadedBy: normalizeConnectUser(raw.uploadedBy),
    uploadedAt: raw.uploadedAt || raw.uploaded_at || new Date().toISOString(), conversationId: raw.conversationId || undefined,
  };
}
