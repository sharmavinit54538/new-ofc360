import { formatSecs } from "../../../utils/formatSecs";
import type { PunchRecord } from "../../../types/attendanceRecord";

export function evaluateCheckOut(gross: number, brk: number) {
  const net = Math.max(0, gross - brk);
  const netHrs = net / 3600;
  const status: PunchRecord["status"] = netHrs < 4.5 ? "Half Day" : netHrs > 8.5 ? "Overtime" : "On Time";
  return { net, netFormatted: formatSecs(net), status, grossFormatted: formatSecs(gross), breakFormatted: formatSecs(brk) };
}
