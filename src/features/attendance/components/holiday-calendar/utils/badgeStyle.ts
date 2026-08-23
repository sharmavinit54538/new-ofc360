import type { HolidayItem } from "@/stores/attendanceStore";

export function getHolidayBadgeStyle(type: HolidayItem["type"]): string {
  switch (type) {
    case "National":
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    case "Public":
      return "bg-blue-500/15 text-blue-500 border-blue-500/30";
    case "Regional":
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    case "Optional Floating":
      return "bg-purple-500/15 text-purple-500 border-purple-500/30";
    default:
      return "bg-primary/15 text-primary border-primary/30";
  }
}
