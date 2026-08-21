import { toast } from "sonner";
import type { RosterItem } from "../../../types/attendance.types";

export function useCreateRosterAction(p: {
  rosterModal: { rosterEmp: string; rosterShift: string; rosterDay: string; setIsRosterModalOpen: (v: boolean) => void };
  addRoster: (r: RosterItem) => void; createShiftPlanApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
}) {
  return async () => {
    if (!p.rosterModal.rosterEmp.trim()) { toast.error("Please select an employee."); return; }
    const r: RosterItem = { id: `roster_${Date.now()}`, employeeId: "EMP-" + Math.floor(1000 + Math.random() * 9000), employeeName: p.rosterModal.rosterEmp, department: "Engineering", shiftName: p.rosterModal.rosterShift, timing: "09:00 - 18:00", dayOfWeek: p.rosterModal.rosterDay, date: new Date().toLocaleDateString() };
    try { await p.createShiftPlanApi(r).unwrap(); } catch { /* local fallback */ }
    p.addRoster(r); p.rosterModal.setIsRosterModalOpen(false); toast.success(`Roster assigned for ${p.rosterModal.rosterEmp}!`);
  };
}
