import type { ShiftTemplate, HolidayItem } from "./shiftHolidayTypes";

export const DEFAULT_SHIFTS: ShiftTemplate[] = [
  { id: "SFT-01", name: "General Morning Shift", startTime: "09:00", endTime: "18:00", gracePeriodMins: 15, halfDayHours: 4.5, fullDayHours: 8.0, breakDurationMins: 45, department: "All Departments" },
  { id: "SFT-02", name: "Evening Shift", startTime: "14:00", endTime: "23:00", gracePeriodMins: 15, halfDayHours: 4.5, fullDayHours: 8.0, breakDurationMins: 45, department: "Support & Operations" },
];

export const DEFAULT_HOLIDAYS: HolidayItem[] = [
  { id: "HOL-01", name: "Republic Day", date: "2026-01-26", dayOfWeek: "Monday", type: "National", mandatory: true },
  { id: "HOL-02", name: "Independence Day", date: "2026-08-15", dayOfWeek: "Saturday", type: "National", mandatory: true },
];