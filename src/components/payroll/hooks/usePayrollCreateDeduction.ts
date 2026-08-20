import { useCreateDeductionMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateDeduction(props: any) {
  const [createDeduction, { isLoading: isCreatingDeduction }] = useCreateDeductionMutation();
  const handleCreateDeduction = async (): Promise<void> => {
    if (!props.dedName.trim()) {
      toast.error("Deduction name is required.");
      return;
    }
    try {
      await createDeduction({ name: props.dedName.trim(), type: props.dedType, is_pre_tax: props.dedPreTax, default_amount: 0, is_active: true } as any).unwrap();
      toast.success("New deduction rule created!");
      props.setDedName(""); props.setIsDedModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create deduction.");
    }
  };
  return { handleCreateDeduction, isCreatingDeduction };
}
