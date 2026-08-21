import { toast } from "sonner";

interface LeaveModalState {
  leaveType: string;
  leaveStart: string;
  leaveEnd: string;
  leaveReason: string;
  setLeaveReason: (val: string) => void;
  setIsLeaveModalOpen: (val: boolean) => void;
}

interface UseLeaveActionsProps {
  user: { id?: string; name?: string } | null | undefined;
  leaveModal: LeaveModalState;
  addLocalLeave: (leave: Record<string, unknown>) => void;
  updateLocalLeaveStatus: (id: string, status: string) => void;
  applyLeaveApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  reviewLeaveApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  refetchLeaves: () => void;
}

export function useLeaveActions({
  user,
  leaveModal,
  addLocalLeave,
  updateLocalLeaveStatus,
  applyLeaveApi,
  reviewLeaveApi,
  refetchLeaves,
}: UseLeaveActionsProps) {
  const handleApplyLeave = async () => {
    if (!leaveModal.leaveStart || !leaveModal.leaveEnd || !leaveModal.leaveReason.trim()) {
      toast.error("Please fill all leave details.");
      return;
    }
    const payload = {
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      type: leaveModal.leaveType,
      from: leaveModal.leaveStart,
      to: leaveModal.leaveEnd,
      startDate: leaveModal.leaveStart,
      endDate: leaveModal.leaveEnd,
      days: 1,
      reason: leaveModal.leaveReason.trim(),
    };
    const fullLeavePayload: Record<string, unknown> = {
      id: `leave_${Date.now()}`,
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      leaveType: leaveModal.leaveType,
      type: leaveModal.leaveType,
      from: leaveModal.leaveStart,
      to: leaveModal.leaveEnd,
      startDate: leaveModal.leaveStart,
      endDate: leaveModal.leaveEnd,
      days: 1,
      totalDays: 1,
      reason: leaveModal.leaveReason.trim(),
      status: "pending",
      appliedAt: new Date().toISOString(),
    };
    try {
      await applyLeaveApi(payload).unwrap();
      refetchLeaves();
    } catch {
      // Local sync fallback
    }
    addLocalLeave(fullLeavePayload);
    leaveModal.setLeaveReason("");
    leaveModal.setIsLeaveModalOpen(false);
    toast.success("Leave application submitted successfully!");
  };

  const handleReviewLeave = async (id: string, status: "Approved" | "Denied") => {
    const normalizedStatus = status === "Approved" ? "approved" : "rejected";
    try {
      await reviewLeaveApi({ leave_id: id, status: normalizedStatus }).unwrap();
      refetchLeaves();
    } catch {
      // Local fallback
    }
    updateLocalLeaveStatus(id, normalizedStatus);
    toast.success(`Leave request ${status.toLowerCase()}!`);
  };

  return {
    handleApplyLeave,
    handleReviewLeave,
  };
}
