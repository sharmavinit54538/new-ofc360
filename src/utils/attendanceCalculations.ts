/**
 * OFC360 Attendance & Shift Calculation Engine
 * Provides deterministic calculations for shift durations, grace periods,
 * overnight shifts, break deductions, net working hours, and attendance statuses.
 */

export interface ShiftTiming {
  startTime: string; // "09:00" or "21:00"
  endTime: string;   // "18:00" or "06:00"
  gracePeriodMins: number; // e.g. 15
  halfDayHours?: number; // e.g. 4.5
  fullDayHours?: number; // e.g. 8.0
  breakDurationMins?: number; // e.g. 45
}

export type AttendanceCalculatedStatus =
  | "On Time"
  | "Late"
  | "Half Day"
  | "Overtime"
  | "Early Departure"
  | "Missing Punch"
  | "On Leave"
  | "Holiday"
  | "Week Off"
  | "Regularized";

/**
 * Converts "HH:MM" 24-hour string to minutes from midnight.
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(":");
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight to "HH:MM" 24-hour string.
 */
export function minutesToTimeString(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Calculates duration in minutes between two time strings, handling cross-midnight/overnight shifts seamlessly.
 * E.g., 21:00 to 06:00 = 9 hours (540 mins).
 */
export function calculateDurationMinutes(startTimeStr: string, endTimeStr: string): number {
  const startMins = timeStringToMinutes(startTimeStr);
  const endMins = timeStringToMinutes(endTimeStr);

  if (endMins >= startMins) {
    return endMins - startMins;
  }
  // Cross-midnight shift (e.g. 21:00 to 06:00)
  return 1440 - startMins + endMins;
}

/**
 * Evaluates arrival time against shift start time and grace period.
 * Example: Shift 09:00, Grace 15 mins
 * 09:00 -> On time (0 late mins)
 * 09:15 -> On time / Grace boundary (0 late mins)
 * 09:16 -> Late (16 late mins from scheduled shift start)
 */
export function evaluateArrivalStatus(
  actualCheckInTimeStr: string,
  scheduledStartTimeStr: string,
  gracePeriodMins: number = 15
): {
  isLate: boolean;
  lateMinutes: number;
  graceBoundaryTimeStr: string;
} {
  const actualMins = timeStringToMinutes(actualCheckInTimeStr);
  const scheduledMins = timeStringToMinutes(scheduledStartTimeStr);
  const graceBoundaryMins = scheduledMins + gracePeriodMins;

  if (actualMins <= graceBoundaryMins) {
    return {
      isLate: false,
      lateMinutes: 0,
      graceBoundaryTimeStr: minutesToTimeString(graceBoundaryMins),
    };
  }

  return {
    isLate: true,
    lateMinutes: actualMins - scheduledMins,
    graceBoundaryTimeStr: minutesToTimeString(graceBoundaryMins),
  };
}

/**
 * Evaluates departure time against shift end time.
 */
export function evaluateDepartureStatus(
  actualCheckOutTimeStr: string,
  scheduledEndTimeStr: string,
  isOvernightShift: boolean = false
): {
  isEarly: boolean;
  earlyMinutes: number;
} {
  const actualMins = timeStringToMinutes(actualCheckOutTimeStr);
  const scheduledMins = timeStringToMinutes(scheduledEndTimeStr);

  if (!isOvernightShift) {
    if (actualMins < scheduledMins) {
      return { isEarly: true, earlyMinutes: scheduledMins - actualMins };
    }
    return { isEarly: false, earlyMinutes: 0 };
  }

  // For overnight shift (e.g., end is 06:00 morning)
  if (actualMins < scheduledMins) {
    return { isEarly: true, earlyMinutes: scheduledMins - actualMins };
  }
  return { isEarly: false, earlyMinutes: 0 };
}

/**
 * Computes net working hours by deducting break time from total gross span.
 */
export function computeNetWorkHours(
  grossWorkMinutes: number,
  breakMinutes: number = 0
): {
  netMinutes: number;
  netHoursDecimal: number;
  formattedNetDuration: string;
} {
  const netMinutes = Math.max(0, grossWorkMinutes - breakMinutes);
  const netHoursDecimal = Number((netMinutes / 60).toFixed(2));
  const h = Math.floor(netMinutes / 60);
  const m = netMinutes % 60;
  const formattedNetDuration = `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;

  return {
    netMinutes,
    netHoursDecimal,
    formattedNetDuration,
  };
}

/**
 * Computes final attendance status based on shift, actual punch timings, breaks, and thresholds.
 */
export function determineAttendanceStatus(params: {
  checkInTimeStr?: string;
  checkOutTimeStr?: string;
  shift: ShiftTiming;
  breakDurationMinutes?: number;
  isOnLeave?: boolean;
  isHoliday?: boolean;
  isWeeklyOff?: boolean;
  isRegularized?: boolean;
}): AttendanceCalculatedStatus {
  const {
    checkInTimeStr,
    checkOutTimeStr,
    shift,
    breakDurationMinutes = 0,
    isOnLeave = false,
    isHoliday = false,
    isWeeklyOff = false,
    isRegularized = false,
  } = params;

  if (isRegularized) return "Regularized";
  if (isOnLeave) return "On Leave";
  if (isHoliday) return "Holiday";
  if (isWeeklyOff) return "Week Off";

  if (!checkInTimeStr && !checkOutTimeStr) {
    return "Missing Punch";
  }

  if (checkInTimeStr && !checkOutTimeStr) {
    // Evaluating ongoing punch or check-in only
    const arrival = evaluateArrivalStatus(checkInTimeStr, shift.startTime, shift.gracePeriodMins);
    return arrival.isLate ? "Late" : "On Time";
  }

  if (checkInTimeStr && checkOutTimeStr) {
    const grossMins = calculateDurationMinutes(checkInTimeStr, checkOutTimeStr);
    const { netHoursDecimal } = computeNetWorkHours(grossMins, breakDurationMinutes);
    const halfDayThreshold = shift.halfDayHours ?? 4.5;
    const fullDayThreshold = shift.fullDayHours ?? 8.0;

    if (netHoursDecimal < halfDayThreshold) {
      return "Half Day";
    }

    if (netHoursDecimal > fullDayThreshold + 0.5) {
      return "Overtime";
    }

    const arrival = evaluateArrivalStatus(checkInTimeStr, shift.startTime, shift.gracePeriodMins);
    if (arrival.isLate) {
      return "Late";
    }

    return "On Time";
  }

  return "On Time";
}

/**
 * Formats seconds into HH:MM:SS string.
 */
export function formatSecondsToHms(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
