import { toast } from "sonner";
import type { RegularizationRequest } from "../../types/attendance.types";

interface RegularizationModalState {
  regDate: string;
  regType: RegularizationRequest["missedPunchType"];
  regTime: string;
  regReason: string;
  setRegReason: (val: string) => void;
  setIsRegModalOpen: (val: boolean) => void;
}

interface UseRegularizationActionsProps {
  user: { id?: string; name?: string } | null | undefined;
  regModal: RegularizationModalState;
  addRegularization: (reg: Omit<RegularizationRequest, "id"> | RegularizationRequest) => void;
  updateRegularizationStatus: (
    id: string,
    status: string,
    approverName?: string,
    reviewComment?: string
  ) => void;
}

export function useRegularizationActions({
  user,
  regModal,
  addRegularization,
  updateRegularizationStatus,
}: UseRegularizationActionsProps) {
  const handleCreateRegularization = () => {
    if (!regModal.regDate) {
      toast.error("Please select the missed attendance date.");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (regModal.regDate > todayStr) {
      toast.error("Regularization cannot be applied for future dates.");
      return;
    }
    if (!regModal.regTime) {
      toast.error("Please specify the correct punch time.");
      return;
    }
    if (!regModal.regReason.trim()) {
      toast.error("Please provide a justification reason.");
      return;
    }
    addRegularization({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Human Resources",
      date: regModal.regDate,
      missedPunchType: regModal.regType,
      requestedTime: regModal.regTime,
      reason: regModal.regReason.trim(),
      status: "Pending",
    });
    regModal.setRegReason("");
    regModal.setIsRegModalOpen(false);
    toast.success("Regularization request submitted to manager!");
  };

  return {
    handleCreateRegularization,
    updateRegularizationStatus,
  };
}
