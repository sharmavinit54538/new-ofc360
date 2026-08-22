import type { HolidayItem } from "@/stores/attendanceStore";

export function matchHoliday(
  h: HolidayItem,
  query: string,
  type: string,
  branch: string
): boolean {
  const matchSearch =
    h.title.toLowerCase().includes(query.toLowerCase()) ||
    h.date.includes(query);
  const matchType = type === "ALL" || h.type === type;
  const matchBranch =
    branch === "ALL" ||
    h.branchLocation === branch ||
    h.branchLocation === "All Branches";
  return matchSearch && matchType && matchBranch;
}
