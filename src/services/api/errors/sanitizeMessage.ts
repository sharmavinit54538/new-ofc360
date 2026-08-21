import { DEFAULT_ERROR_MESSAGES } from "./defaultErrorMessages";

export function sanitizeMessage(msg: string): string {
  if (!msg) return "";
  const clean = msg.replace(/<[^>]*>?/gm, "").trim();
  if (clean.includes("Traceback (most recent call last)") || clean.includes("at Object.") || clean.includes("Internal Server Error")) {
    return DEFAULT_ERROR_MESSAGES[500];
  }
  return clean;
}
