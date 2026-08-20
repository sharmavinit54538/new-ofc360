import { timeStringToMinutes, minutesToTimeString } from "./timeConversions";

export function evaluateArrivalStatus(actual: string, scheduled: string, grace = 15) {
  const actualM = timeStringToMinutes(actual);
  const schedM = timeStringToMinutes(scheduled);
  const graceBoundary = schedM + grace;
  if (actualM <= graceBoundary) {
    return { isLate: false, lateMinutes: 0, graceBoundaryTimeStr: minutesToTimeString(graceBoundary) };
  }
  return { isLate: true, lateMinutes: actualM - schedM, graceBoundaryTimeStr: minutesToTimeString(graceBoundary) };
}

export function evaluateDepartureStatus(actual: string, scheduled: string, _isOvernight = false) {
  const actualM = timeStringToMinutes(actual);
  const schedM = timeStringToMinutes(scheduled);
  if (actualM < schedM) return { isEarly: true, earlyMinutes: schedM - actualM };
  return { isEarly: false, earlyMinutes: 0 };
}
