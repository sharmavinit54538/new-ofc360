import { toast } from "sonner";
import type { ShiftTemplate } from "../../../types/attendance.types";

export function useCreateShiftAction(p: {
  shiftModal: { shiftName: string; shiftStart: string; shiftEnd: string; shiftGrace: string; shiftDept: string; setShiftName: (v: string) => void; setIsShiftModalOpen: (v: boolean) => void };
  addShift: (s: ShiftTemplate) => void; createShiftPlanApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
}) {
  return async () => {
    if (!p.shiftModal.shiftName.trim()) { toast.error("Please enter a shift name."); return; }
    const s: ShiftTemplate = { id: `shift_${Date.now()}`, name: p.shiftModal.shiftName.trim(), startTime: p.shiftModal.shiftStart, endTime: p.shiftModal.shiftEnd, gracePeriodMins: parseInt(p.shiftModal.shiftGrace) || 15, halfDayHours: 4.5, fullDayHours: 8.0, breakDurationMins: 45, department: p.shiftModal.shiftDept };
    try { await p.createShiftPlanApi(s).unwrap(); } catch { /* local fallback */ }
    p.addShift(s); p.shiftModal.setShiftName(""); p.shiftModal.setIsShiftModalOpen(false); toast.success("Shift template created!");
  };
}
