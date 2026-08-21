import { toast } from "sonner";
import type { OvertimeEntry } from "../../../types/attendance.types";

export function useCreateOvertimeAction(p: {
  user?: { id?: string; name?: string } | null;
  overtimeModal: { otHours: string; otMultiplier: string; otReason: string; setOtReason: (v: string) => void; setIsOvertimeModalOpen: (v: boolean) => void };
  addOvertime: (ot: OvertimeEntry) => void;
}) {
  return () => {
    if (!p.overtimeModal.otReason.trim()) { toast.error("Please enter a reason for overtime."); return; }
    const ot = parseFloat(p.overtimeModal.otHours) || 2;
    p.addOvertime({ id: `ot_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", department: "Human Resources", date: new Date().toISOString().split("T")[0], standardHours: 8, actualHours: 8 + ot, overtimeHours: ot, rateMultiplier: p.overtimeModal.otMultiplier, reason: p.overtimeModal.otReason.trim(), status: "Pending" });
    p.overtimeModal.setOtReason(""); p.overtimeModal.setIsOvertimeModalOpen(false); toast.success("Overtime request sent to manager!");
  };
}
