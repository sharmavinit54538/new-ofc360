import type { ShiftTiming, AttendanceCalculatedStatus } from "./types";
import { calculateDurationMinutes, computeNetWorkHours } from "./durationCalculations";
import { evaluateArrivalStatus } from "./evaluateArrivalDeparture";

export function determineAttendanceStatus(p: {
  checkInTimeStr?: string; checkOutTimeStr?: string; shift: ShiftTiming;
  breakDurationMinutes?: number; isOnLeave?: boolean; isHoliday?: boolean;
  isWeeklyOff?: boolean; isRegularized?: boolean;
}): AttendanceCalculatedStatus {
  if (p.isRegularized) return "Regularized";
  if (p.isOnLeave) return "On Leave";
  if (p.isHoliday) return "Holiday";
  if (p.isWeeklyOff) return "Week Off";
  if (!p.checkInTimeStr && !p.checkOutTimeStr) return "Missing Punch";
  if (p.checkInTimeStr && !p.checkOutTimeStr) return evaluateArrivalStatus(p.checkInTimeStr, p.shift.startTime, p.shift.gracePeriodMins).isLate ? "Late" : "On Time";
  const { netHoursDecimal } = computeNetWorkHours(calculateDurationMinutes(p.checkInTimeStr!, p.checkOutTimeStr!), p.breakDurationMinutes || 0);
  if (netHoursDecimal < (p.shift.halfDayHours ?? 4.5)) return "Half Day";
  if (netHoursDecimal > (p.shift.fullDayHours ?? 8.0) + 0.5) return "Overtime";
  return evaluateArrivalStatus(p.checkInTimeStr!, p.shift.startTime, p.shift.gracePeriodMins).isLate ? "Late" : "On Time";
}
