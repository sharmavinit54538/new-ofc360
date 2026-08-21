import { toast } from "sonner";
import type { TimesheetEntry } from "../../../types/attendance.types";

export function useCreateTimesheetAction(p: {
  user?: { id?: string; name?: string } | null;
  timesheetModal: { tsProject: string; tsTask: string; tsHours: string; tsBillable: boolean; setTsProject: (v: string) => void; setTsTask: (v: string) => void; setIsTimesheetModalOpen: (v: boolean) => void };
  addLocalTimesheet: (ts: TimesheetEntry) => void; createTimesheetApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchTimesheets: () => void;
}) {
  return async () => {
    if (!p.timesheetModal.tsProject.trim() || !p.timesheetModal.tsTask.trim()) { toast.error("Project and Task details are required."); return; }
    const ts: TimesheetEntry = { id: `ts_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", projectName: p.timesheetModal.tsProject.trim(), taskDescription: p.timesheetModal.tsTask.trim(), loggedHours: parseFloat(p.timesheetModal.tsHours) || 8, billable: p.timesheetModal.tsBillable, date: new Date().toISOString().split("T")[0], status: "Submitted" };
    try { await p.createTimesheetApi(ts).unwrap(); p.refetchTimesheets(); } catch { /* local fallback */ }
    p.addLocalTimesheet(ts); p.timesheetModal.setTsProject(""); p.timesheetModal.setTsTask(""); p.timesheetModal.setIsTimesheetModalOpen(false); toast.success("Timesheet entry submitted!");
  };
}
