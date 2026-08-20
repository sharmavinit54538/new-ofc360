import { useCreateBonusMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateBonus(props: any) {
  const [createBonus, { isLoading: isCreatingBonus }] = useCreateBonusMutation();
  const handleCreateBonus = async () => {
    if (!props.bonusEmp.trim() || !props.bonusAmount) return toast.error("Employee name and amount are required.");
    try {
      await createBonus({ employee_name: props.bonusEmp.trim(), title: props.bonusType, bonus_type: props.bonusType.toLowerCase().includes("performance") ? "performance" : "annual", amount: parseFloat(props.bonusAmount) || 0, status: "pending" }).unwrap();
      toast.success("Bonus payout entry added!");
      props.setBonusEmp(""); props.setBonusAmount(""); props.setIsBonusModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add bonus.");
    }
  };
  return { handleCreateBonus, isCreatingBonus };
}
