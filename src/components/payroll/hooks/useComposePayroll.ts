import { formatCurrency } from "@/utils/currency";
import * as H from "./index";

export function useComposePayroll() {
  const nav = H.usePayrollNav();
  const state = {
    ...nav, ...H.usePayrollCoreData(nav.activeTab), ...H.usePayrollPayslipsReimb(nav.activeTab),
    ...H.usePayrollBonusDedAdv(nav.activeTab), ...H.usePayrollOtTaxTransfers(nav.activeTab),
    ...H.usePayrollMiscData(nav.activeTab), ...H.usePayrollModals(), ...H.usePayrollForms1(),
    ...H.usePayrollForms2(), ...H.usePayrollForms3(), ...H.useCopilotActions(),
  };
  const full = { ...state, fmt: (n: number) => formatCurrency(n, state.backendSettings.currency || "INR (₹)") };
  return {
    ...full, ...H.useComposeActionsPart1(full), ...H.useComposeActionsPart2(full),
    ...H.useComposeActionsPart3(full), ...H.useComposeActionsPart4(full),
  };
}
