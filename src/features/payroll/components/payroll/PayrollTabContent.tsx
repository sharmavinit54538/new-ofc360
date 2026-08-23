import { usePayrollContext } from "./PayrollContext";
import * as T from "./tabs";
const MAP: Record<string, any> = {
  copilot: T.CopilotTab, "salary-processing": T.SalaryProcessingTab, "salary-structure": T.SalaryStructureTab,
  payslips: T.PayslipsTab, reimbursements: T.ReimbursementsTab, bonuses: T.BonusesTab,
  deductions: T.DeductionsTab, advances: T.AdvancesTab, overtime: T.OvertimeTab,
  tax: T.TaxTab, approvals: T.ApprovalsTab, "bank-transfers": T.BankTransfersTab,
  compliance: T.ComplianceTab, reports: T.ReportsTab, settings: T.SettingsTab,
};
export function PayrollTabContent() {
  const { activeTab } = usePayrollContext();
  const Component = MAP[activeTab] || T.SalaryProcessingTab;
  return <Component />;
}
