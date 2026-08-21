import { toast } from "sonner";
import type { RegularizationRequest } from "../../../types/attendance.types";

export function useCreateRegularizationAction(p: {
  user?: { id?: string; name?: string } | null;
  regModal: { regDate: string; regType: RegularizationRequest["missedPunchType"]; regTime: string; regReason: string; setRegReason: (v: string) => void; setIsRegModalOpen: (v: boolean) => void };
  addRegularization: (r: RegularizationRequest) => void;
}) {
  return () => {
    if (!p.regModal.regDate) { toast.error("Please select the missed attendance date."); return; }
    if (p.regModal.regDate > new Date().toISOString().split("T")[0]) { toast.error("Regularization cannot be applied for future dates."); return; }
    if (!p.regModal.regTime) { toast.error("Please specify the correct punch time."); return; }
    if (!p.regModal.regReason.trim()) { toast.error("Please provide a justification reason."); return; }
    p.addRegularization({ id: `reg_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", department: "Human Resources", date: p.regModal.regDate, missedPunchType: p.regModal.regType, requestedTime: p.regModal.regTime, reason: p.regModal.regReason.trim(), status: "Pending" });
    p.regModal.setRegReason(""); p.regModal.setIsRegModalOpen(false); toast.success("Regularization request submitted to manager!");
  };
}
