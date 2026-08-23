import { useApproveReimbursementMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollApproveReimbursement() {
  const [approveReimbursement, { isLoading: isApprovingReimb }] = useApproveReimbursementMutation();
  const handleApproveReimbursement = async (id: string) => {
    try {
      await approveReimbursement(id).unwrap();
      toast.success("Reimbursement claim approved for payment.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve claim.");
    }
  };
  return { handleApproveReimbursement, isApprovingReimb };
}
