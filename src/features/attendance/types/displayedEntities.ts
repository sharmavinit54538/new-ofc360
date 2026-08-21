import type { HolidayItem } from "@/stores/attendanceStore";

export interface DisplayedHoliday extends HolidayItem {
  branchLocation: string;
}

export interface DisplayedLeave {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
}
