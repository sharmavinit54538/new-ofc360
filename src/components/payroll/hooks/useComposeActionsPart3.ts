import { usePayrollCreateAdvance, usePayrollApproveAdvance, usePayrollApproveOvertime, usePayrollTaxDeclaration, useSignOffWorkflow } from "./index";

export function useComposeActionsPart3(state: any) {
  const createAdv = usePayrollCreateAdvance(state);
  const approveAdv = usePayrollApproveAdvance();
  const approveOt = usePayrollApproveOvertime();
  const createTax = usePayrollTaxDeclaration(state);
  const signOff = useSignOffWorkflow(state);
  return { ...createAdv, ...approveAdv, ...approveOt, ...createTax, ...signOff };
}
