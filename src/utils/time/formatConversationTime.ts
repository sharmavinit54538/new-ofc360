import { parseDate } from "./parseDate";
import { isSameDay } from "./isSameDay";

export function formatConversationTime(rawTimestamp?: string | number | Date | null): string {
  if (!rawTimestamp) return "";
  const date = parseDate(rawTimestamp);
  if (!date || isNaN(date.getTime())) {
    if (typeof rawTimestamp === "string" && rawTimestamp.length < 15 && !rawTimestamp.includes("T")) return rawTimestamp;
    return "";
  }
  const now = new Date();
  if (isSameDay(date, now)) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  if (isSameDay(date, new Date(now.getTime() - 24 * 60 * 60 * 1000))) return "Yesterday";
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
  const isSameYear = date.getFullYear() === now.getFullYear();
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { day: "numeric", month: "short", year: isSameYear ? undefined : "numeric" });
}
