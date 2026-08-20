import { timeStringToMinutes } from "./timeConversions";
export { formatSecondsToHms } from "./formatSeconds";

export function calculateDurationMinutes(start: string, end: string): number {
  const s = timeStringToMinutes(start);
  const e = timeStringToMinutes(end);
  return e >= s ? e - s : 1440 - s + e;
}

export function computeNetWorkHours(gross: number, breakMins = 0) {
  const netMinutes = Math.max(0, gross - breakMins);
  const netHoursDecimal = Number((netMinutes / 60).toFixed(2));
  const h = Math.floor(netMinutes / 60);
  const m = netMinutes % 60;
  return { netMinutes, netHoursDecimal, formattedNetDuration: `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m` };
}
