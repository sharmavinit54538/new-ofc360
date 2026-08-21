import { evaluateArrivalStatus } from "@/utils/attendanceCalculations";
import type { ShiftTemplate } from "../../../../types/attendance.types";

export function evaluateCheckIn(currentTime: Date, shifts: ShiftTemplate[]) {
  const shift = shifts[0] || { startTime: "09:00", gracePeriodMins: 15 };
  const cur24 = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
  const arrival = evaluateArrivalStatus(cur24, shift.startTime, shift.gracePeriodMins);
  const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { arrival, timeStr };
}
