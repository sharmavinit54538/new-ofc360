import { usePayrollCreateBonus } from "./usePayrollCreateBonus";
import { usePayrollApproveBonus } from "./usePayrollApproveBonus";

export function usePayrollActionsBonus(props: any) {
  const { handleCreateBonus, isCreatingBonus } = usePayrollCreateBonus(props);
  const { handleApproveBonus, isApprovingBonus } = usePayrollApproveBonus();
  return { handleCreateBonus, handleApproveBonus, isCreatingBonus, isApprovingBonus };
}
