import { useApproveBonusMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollApproveBonus() {
  const [approveBonus, { isLoading: isApprovingBonus }] = useApproveBonusMutation();
  const handleApproveBonus = async (id: string) => {
    try {
      await approveBonus(id).unwrap();
      toast.success("Bonus approved for next payroll cycle.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve bonus.");
    }
  };
  return { handleApproveBonus, isApprovingBonus };
}
