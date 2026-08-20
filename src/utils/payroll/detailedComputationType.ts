import type { ComponentBreakdown, StatutoryDeductionBreakdown } from "./types";

export interface DetailedPayrollComputation {
  employeeId: string;
  employeeName: string;
  annualCtc: number;
  monthlyCtc: number;
  components: ComponentBreakdown;
  bonusAmount: number;
  overtimeAmount: number;
  reimbursementAmount: number;
  grossEarnings: number;
  statutoryDeductions: StatutoryDeductionBreakdown;
  advanceEmiDeduction: number;
  lopDays: number;
  lopDeduction: number;
  totalDeductions: number;
  netSalary: number;
}
