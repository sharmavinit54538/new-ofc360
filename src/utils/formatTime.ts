/**
 * Formats a timestamp into a clean, human-readable local time string.
 * Converts UTC ISO timestamps (e.g. 2026-08-18T09:15:34.009900+00:00) into
 * localized user time (e.g. "09:15 AM", "Yesterday, 08:30 PM", "18 Aug, 09:15 AM").
 */
export function formatMessageTime(rawTimestamp?: string | number | Date | null): string {
  if (!rawTimestamp) return "";

  const date = parseDate(rawTimestamp);
  if (!date || isNaN(date.getTime())) {
    // If it's already a short time string like "09:15 AM", return it as is
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

  if (isToday) {
    return timeStr;
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: isSameYear ? undefined : "numeric",
  });

  return `${dateStr}, ${timeStr}`;
}

/**
 * Formats a timestamp for conversation list preview snippets:
 * - Today: "09:15 AM"
 * - Yesterday: "Yesterday"
 * - Past 7 days: "Mon", "Tue", etc.
 * - Older: "18 Aug" (or "18 Aug 2025" for previous years)
 */
export function formatConversationTime(rawTimestamp?: string | number | Date | null): string {
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
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
  const isSameYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: isSameYear ? undefined : "numeric",
  });
}

function parseDate(input: string | number | Date): Date | null {
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  if (typeof input === "string") {
    // Handle ISO formats with or without timezone
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
