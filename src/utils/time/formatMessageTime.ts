import { parseDate } from "./parseDate";
import { isSameDay } from "./isSameDay";

export function formatMessageTime(raw?: string | number | Date | null): string {
  if (!raw) return "";
  const d = parseDate(raw);
  if (!d || isNaN(d.getTime())) return typeof raw === "string" && raw.length < 15 && !raw.includes("T") ? raw : "";
  const now = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  if (isSameDay(d, now)) return timeStr;
  if (isSameDay(d, new Date(now.getTime() - 86400000))) return `Yesterday, ${timeStr}`;
  const isSameYear = d.getFullYear() === now.getFullYear();
  const dateStr = d.toLocaleDateString([], { day: "numeric", month: "short", year: isSameYear ? undefined : "numeric" });
  return `${dateStr}, ${timeStr}`;
}
