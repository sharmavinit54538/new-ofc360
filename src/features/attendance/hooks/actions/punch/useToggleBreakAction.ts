import { toast } from "sonner";
import type { PunchRecord } from "../../../types/attendance.types";

export function useToggleBreakAction(p: {
  user?: { id?: string; name?: string } | null; currentTime: Date; isClockedIn: boolean; isOnBreak: boolean;
  setIsOnBreak: (v: boolean) => void; addPunch: (p: PunchRecord) => void;
}) {
  return () => {
    if (!p.isClockedIn) return;
    const timeStr = p.currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const type = p.isOnBreak ? "Break-Resume" : "Break-Start";
    p.setIsOnBreak(!p.isOnBreak);
    p.addPunch({
      id: `punch_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer",
      department: "Human Resources", timestamp: timeStr, date: new Date().toISOString().split("T")[0],
      type, method: "Selfie Camera", location: "Main HQ Office", status: "On Time",
    });
    if (p.isOnBreak) toast.success("Resumed work from break"); else toast.info("Break started");
  };
}
