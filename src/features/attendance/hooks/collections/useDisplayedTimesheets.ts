import { useMemo } from "react";
import type { DisplayedTimesheet } from "../types/attendance.types";

export function useDisplayedTimesheets(timesheetsApiRes: unknown, localTimesheets: DisplayedTimesheet[]) {
  return useMemo(() => {
    const raw = (timesheetsApiRes as { data?: Record<string, unknown>[] })?.data || (timesheetsApiRes as Record<string, unknown>[]);
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((t) => ({
        id: String(t.id || Math.random()), employeeName: String(t.employeeName || t.employee_name || "Alex Mercer"),
        projectName: String(t.projectName || t.project || "OFC360 Platform"), taskDescription: String(t.taskDescription || t.task || "Module Development"),
        loggedHours: Number(t.loggedHours || t.hours || 8), billable: t.billable !== false,
        status: (String(t.status || "Submitted")).charAt(0).toUpperCase() + String(t.status || "Submitted").slice(1),
      }));
    }
    return localTimesheets;
  }, [timesheetsApiRes, localTimesheets]);
}
