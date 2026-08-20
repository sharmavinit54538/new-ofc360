import type { ShiftTiming, AttendanceCalculatedStatus } from "./types";
import { calculateDurationMinutes, computeNetWorkHours } from "./durationCalculations";
import { evaluateArrivalStatus } from "./evaluateArrivalDeparture";

export function determineAttendanceStatus(params: {
  checkInTimeStr?: string; checkOutTimeStr?: string; shift: ShiftTiming;
  breakDurationMinutes?: number; isOnLeave?: boolean; isHoliday?: boolean;
  isWeeklyOff?: boolean; isRegularized?: boolean;
}): AttendanceCalculatedStatus {
  const { checkInTimeStr: inT, checkOutTimeStr: outT, shift, breakDurationMinutes = 0 } = params;
  if (params.isRegularized) return "Regularized";
  if (params.isOnLeave) return "On Leave";
  if (params.isHoliday) return "Holiday";
  if (params.isWeeklyOff) return "Week Off";
  if (!inT && !outT) return "Missing Punch";
  if (inT && !outT) return evaluateArrivalStatus(inT, shift.startTime, shift.gracePeriodMins).isLate ? "Late" : "On Time";
  if (inT && outT) {
    const { netHoursDecimal } = computeNetWorkHours(calculateDurationMinutes(inT, outT), breakDurationMinutes);
    if (netHoursDecimal < (shift.halfDayHours ?? 4.5)) return "Half Day";
    if (netHoursDecimal > (shift.fullDayHours ?? 8.0) + 0.5) return "Overtime";
    return evaluateArrivalStatus(inT, shift.startTime, shift.gracePeriodMins).isLate ? "Late" : "On Time";
  }
  return "On Time";
}
