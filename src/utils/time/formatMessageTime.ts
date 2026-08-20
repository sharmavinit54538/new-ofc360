import { parseDate } from "./parseDate";
import { isSameDay } from "./isSameDay";

export function formatMessageTime(rawTimestamp?: string | number | Date | null): string {
  if (!rawTimestamp) return "";
  const date = parseDate(rawTimestamp);
  if (!date || isNaN(date.getTime())) {
    if (typeof rawTimestamp === "string" && rawTimestamp.length < 15 && !rawTimestamp.includes("T")) {
      return rawTimestamp;
    }
    return "";
  }
  const now = new Date();
  const isToday = isSameDay(date, now);
  const isYesterday = isSameDay(date, new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const isSameYear = date.getFullYear() === now.getFullYear();
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  if (isToday) return timeStr;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  const dateStr = date.toLocaleDateString([], { day: "numeric", month: "short", year: isSameYear ? undefined : "numeric" });
  return `${dateStr}, ${timeStr}`;
}
