import { useMemo } from "react";
import type { DisplayedLeave } from "../types/attendance.types";

export function useDisplayedLeaves(leavesApiRes: unknown, localLeaves: DisplayedLeave[]) {
  return useMemo(() => {
    const raw = (leavesApiRes as { data?: Record<string, unknown>[] })?.data || (leavesApiRes as Record<string, unknown>[]);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((l) => ({
        id: String(l.id || Math.random()), employeeName: String(l.employeeName || l.employee_name || "Team Member"),
        type: String(l.leaveType || l.type || "Casual Leave"), startDate: String(l.startDate || l.start_date || l.from || "2026-08-10"),
        endDate: String(l.endDate || l.end_date || l.to || "2026-08-11"), days: Number(l.totalDays || l.days || 1),
        reason: String(l.reason || "Personal work"),
        status: (String(l.status || "Pending")).charAt(0).toUpperCase() + String(l.status || "Pending").slice(1),
      }));
    }
    return localLeaves;
  }, [leavesApiRes, localLeaves]);
}
