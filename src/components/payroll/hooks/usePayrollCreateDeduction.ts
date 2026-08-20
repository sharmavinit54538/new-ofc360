import { useCreateDeductionMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateDeduction(props: any) {
  const [createDeduction, { isLoading: isCreatingDeduction }] = useCreateDeductionMutation();
  const handleCreateDeduction = async () => {
    if (!props.dedName.trim()) return toast.error("Deduction name is required.");
    try {
      await createDeduction({ name: props.dedName.trim(), type: props.dedType, value: parseFloat(props.dedPct) || 0, amount_type: "percentage", is_mandatory: true }).unwrap();
      toast.success("Statutory deduction rule created!");
      props.setDedName(""); props.setIsDedModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create deduction rule.");
    }
  };
  return { handleCreateDeduction, isCreatingDeduction };
}
