import { useApplyLeaveAction } from "./leaves/useApplyLeaveAction";
import { useReviewLeaveAction } from "./leaves/useReviewLeaveAction";

export function useLeaveActions(p: {
  user?: { id?: string; name?: string } | null;
  leaveModal: { leaveType: string; leaveStart: string; leaveEnd: string; leaveReason: string; setLeaveReason: (v: string) => void; setIsLeaveModalOpen: (v: boolean) => void };
  addLocalLeave: (leave: Record<string, unknown>) => void; updateLocalLeaveStatus: (id: string, status: string) => void;
  applyLeaveApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  reviewLeaveApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchLeaves: () => void;
}) {
  const handleApplyLeave = useApplyLeaveAction(p);
  const handleReviewLeave = useReviewLeaveAction(p);
  return { handleApplyLeave, handleReviewLeave };
}
