import { toast } from "sonner";

export function useReviewLeaveAction(p: {
  updateLocalLeaveStatus: (id: string, status: string) => void;
  reviewLeaveApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  refetchLeaves: () => void;
}) {
  return async (id: string, status: "Approved" | "Denied") => {
    const normalized = status === "Approved" ? "approved" : "rejected";
    try {
      await p.reviewLeaveApi({ leave_id: id, status: normalized }).unwrap();
      p.refetchLeaves();
    } catch {
      // Local fallback
    }
    p.updateLocalLeaveStatus(id, normalized);
    toast.success(`Leave request ${status.toLowerCase()}!`);
  };
}
