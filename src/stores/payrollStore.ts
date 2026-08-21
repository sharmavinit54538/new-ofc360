import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { DEFAULT_PAYROLL_RUNS, DEFAULT_SALARY_STRUCTURES } from "./payroll/mockPayrollData";
import { createPayrollActions } from "./payroll/payrollActions";

export type { PayrollRun, SalaryStructure, PayslipItem } from "./payroll/payrollRunTypes";
export type { ReimbursementClaim, BonusPayout } from "./payroll/reimbursementBonusTypes";
export type { SalaryAdvanceLoan, TaxDeclaration, ComplianceFiling } from "./payroll/taxAdvanceTypes";

export const usePayrollStore = create<any>((set, get) => ({
  payrollRuns: getStoredData("ofc360_payroll_runs_v1", []),
  salaryStructures: [], payslips: [],
  reimbursements: [], bonuses: [], advances: [], taxDeclarations: [], complianceFilings: [],
  ...createPayrollActions(set, get),
}));