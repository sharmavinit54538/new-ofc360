import { useApproveAdvanceMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollApproveAdvance() {
  const [approveAdvance, { isLoading: isApprovingAdvance }] = useApproveAdvanceMutation();
  const handleApproveAdvance = async (id: string) => {
    try {
      await approveAdvance(id).unwrap();
      toast.success("Salary advance loan approved. Monthly EMI deduction active.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve loan.");
    }
  };
  return { handleApproveAdvance, isApprovingAdvance };
}
