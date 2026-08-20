import { useApproveOvertimeMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollApproveOvertime() {
  const [approveOvertime, { isLoading: isApprovingOvertime }] = useApproveOvertimeMutation();
  const handleApproveOvertime = async (id: string) => {
    try {
      await approveOvertime(id).unwrap();
      toast.success("Overtime payout approved.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve overtime.");
    }
  };
  return { handleApproveOvertime, isApprovingOvertime };
}
