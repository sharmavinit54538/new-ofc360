import { sanitizeMessage } from "./sanitizeMessage";

export function extractStringMessages(data: Record<string, unknown>): string | null {
  if (typeof data.error_description === "string" && data.error_description.trim()) return sanitizeMessage(data.error_description);
  if (Array.isArray(data.message) && data.message.length > 0) return data.message.join(". ");
  if (typeof data.message === "string" && data.message.trim()) return sanitizeMessage(data.message);
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) return data.non_field_errors.join(". ");
  if (typeof data.error === "string" && data.error.trim()) return sanitizeMessage(data.error);
  return null;
}
