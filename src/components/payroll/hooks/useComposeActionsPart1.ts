import { usePayrollRunAction, usePayrollCreateStructure, usePayrollDeleteStructure, usePayrollDownloadPayslip, usePayrollBulkEmailPayslips } from "./index";

export function useComposeActionsPart1(state: any) {
  const run = usePayrollRunAction(state);
  const createStr = usePayrollCreateStructure(state);
  const deleteStr = usePayrollDeleteStructure();
  const downloadPay = usePayrollDownloadPayslip();
  const bulkEmail = usePayrollBulkEmailPayslips();
  return { ...run, ...createStr, ...deleteStr, ...downloadPay, ...bulkEmail };
}
