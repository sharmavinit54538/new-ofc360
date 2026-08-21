import { toast } from "sonner";

export function useApplyLeaveAction(p: {
  user?: { id?: string; name?: string } | null;
  leaveModal: { leaveType: string; leaveStart: string; leaveEnd: string; leaveReason: string; setLeaveReason: (v: string) => void; setIsLeaveModalOpen: (v: boolean) => void };
  addLocalLeave: (l: Record<string, unknown>) => void; applyLeaveApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchLeaves: () => void;
}) {
  return async () => {
    if (!p.leaveModal.leaveStart || !p.leaveModal.leaveEnd || !p.leaveModal.leaveReason.trim()) { toast.error("Please fill all leave details."); return; }
    const payload = { employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", type: p.leaveModal.leaveType, from: p.leaveModal.leaveStart, to: p.leaveModal.leaveEnd, startDate: p.leaveModal.leaveStart, endDate: p.leaveModal.leaveEnd, days: 1, reason: p.leaveModal.leaveReason.trim() };
    const full = { ...payload, id: `leave_${Date.now()}`, leaveType: p.leaveModal.leaveType, totalDays: 1, status: "pending", appliedAt: new Date().toISOString() };
    try { await p.applyLeaveApi(payload).unwrap(); p.refetchLeaves(); } catch { /* local sync */ }
    p.addLocalLeave(full); p.leaveModal.setLeaveReason(""); p.leaveModal.setIsLeaveModalOpen(false); toast.success("Leave application submitted!");
  };
}
