import { useDeleteDeductionMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollDeleteDeduction() {
  const [deleteDeduction, { isLoading: isDeletingDeduction }] = useDeleteDeductionMutation();
  const handleDeleteDeduction = async (id: string) => {
    try {
      await deleteDeduction(id).unwrap();
      toast.success("Statutory deduction rule deleted.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete deduction rule.");
    }
  };
  return { handleDeleteDeduction, isDeletingDeduction };
}
