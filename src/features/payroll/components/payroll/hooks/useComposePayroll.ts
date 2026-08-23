import { formatCurrency } from "@/utils/currency";
import * as H from "./index";

export function useComposePayroll() {
  const nav = H.usePayrollNav();
  const coreData = H.usePayrollCoreData(nav.activeTab);
  const payslipsReimb = H.usePayrollPayslipsReimb(nav.activeTab);
  const bonusDedAdv = H.usePayrollBonusDedAdv(nav.activeTab);
  const otTaxTransfers = H.usePayrollOtTaxTransfers(nav.activeTab);
  const miscData = H.usePayrollMiscData(nav.activeTab);
  const modals = H.usePayrollModals();
  const forms1 = H.usePayrollForms1();
  const forms2 = H.usePayrollForms2();
  const forms3 = H.usePayrollForms3();
  const copilotActions = H.useCopilotActions();

  const state = {
    ...nav,
    ...coreData,
    ...payslipsReimb,
    ...bonusDedAdv,
    ...otTaxTransfers,
    ...miscData,
    ...modals,
    ...forms1,
    ...forms2,
    ...forms3,
    ...copilotActions,
  };

  const full = { ...state, fmt: (n: number) => formatCurrency(n, state.backendSettings.currency || "INR (₹)") };

  const actionsPart1 = H.useComposeActionsPart1(full);
  const actionsPart2 = H.useComposeActionsPart2(full);
  const actionsPart3 = H.useComposeActionsPart3(full);
  const actionsPart4 = H.useComposeActionsPart4(full);

  return {
    ...full,
    ...actionsPart1,
    ...actionsPart2,
    ...actionsPart3,
    ...actionsPart4,
  };
}
