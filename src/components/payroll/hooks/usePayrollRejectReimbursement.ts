import { useRejectReimbursementMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollRejectReimbursement() {
  const [rejectReimbursement, { isLoading: isRejectingReimb }] = useRejectReimbursementMutation();
  const handleRejectReimbursement = async (id: string) => {
    try {
      await rejectReimbursement({ claim_id: id, reason: "Documentation incomplete" }).unwrap();
      toast.success("Reimbursement claim rejected.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject claim.");
    }
  };
  return { handleRejectReimbursement, isRejectingReimb };
}
