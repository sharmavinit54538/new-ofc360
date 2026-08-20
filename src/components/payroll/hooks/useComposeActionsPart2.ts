import { usePayrollCreateReimbursement, usePayrollApproveReimbursement, usePayrollRejectReimbursement, usePayrollActionsBonus, usePayrollCreateDeduction, usePayrollDeleteDeduction } from "./index";

export function useComposeActionsPart2(state: any) {
  const createReimb = usePayrollCreateReimbursement(state);
  const approveReimb = usePayrollApproveReimbursement();
  const rejectReimb = usePayrollRejectReimbursement();
  const bonus = usePayrollActionsBonus(state);
  const createDed = usePayrollCreateDeduction(state);
  const deleteDed = usePayrollDeleteDeduction();
  return { ...createReimb, ...approveReimb, ...rejectReimb, ...bonus, ...createDed, ...deleteDed };
}
