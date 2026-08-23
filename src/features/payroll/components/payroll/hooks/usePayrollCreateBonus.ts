import { useCreateBonusMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateBonus(props: any) {
  const [createBonus, { isLoading: isCreatingBonus }] = useCreateBonusMutation();
  const handleCreateBonus = async (): Promise<void> => {
    if (!props.bonusEmp.trim() || !props.bonusAmount) {
      toast.error("Employee name and amount are required.");
      return;
    }
    try {
      await createBonus({ employee_name: props.bonusEmp.trim(), bonus_type: props.bonusType, amount: parseFloat(props.bonusAmount) || 0, pay_period: "Current Cycle", is_taxable: true, status: "pending" } as any).unwrap();
      toast.success("Bonus allocated successfully!");
      props.setBonusEmp(""); props.setBonusAmount(""); props.setIsBonusModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create bonus.");
    }
  };
  return { handleCreateBonus, isCreatingBonus };
}
