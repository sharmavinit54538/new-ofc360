import { toast } from "sonner";
import type { OvertimeEntry } from "../../types/attendance.types";

interface OvertimeModalState {
  otHours: string;
  otMultiplier: string;
  otReason: string;
  setOtReason: (val: string) => void;
  setIsOvertimeModalOpen: (val: boolean) => void;
}

interface UseOvertimeActionsProps {
  user: { id?: string; name?: string } | null | undefined;
  overtimeModal: OvertimeModalState;
  addOvertime: (ot: Omit<OvertimeEntry, "id"> | OvertimeEntry) => void;
  updateOvertimeStatus: (id: string, status: string) => void;
}

export function useOvertimeActions({
  user,
  overtimeModal,
  addOvertime,
  updateOvertimeStatus,
}: UseOvertimeActionsProps) {
  const handleCreateOvertime = () => {
    if (!overtimeModal.otReason.trim()) {
      toast.error("Please enter a reason for overtime.");
      return;
    }
    const ot = parseFloat(overtimeModal.otHours) || 2;
    addOvertime({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Human Resources",
      date: new Date().toISOString().split("T")[0],
      standardHours: 8,
      actualHours: 8 + ot,
      overtimeHours: ot,
      rateMultiplier: overtimeModal.otMultiplier,
      reason: overtimeModal.otReason.trim(),
      status: "Pending",
    });
    overtimeModal.setOtReason("");
    overtimeModal.setIsOvertimeModalOpen(false);
    toast.success("Overtime approval request sent to manager!");
  };

  return {
    handleCreateOvertime,
    updateOvertimeStatus,
  };
}
