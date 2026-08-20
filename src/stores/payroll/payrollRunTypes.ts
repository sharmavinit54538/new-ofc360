export interface PayrollRun {
  id: string; month: string; year: number; processedEmpCount: number;
  grossTotal: number; netTotal: number; status: "Draft" | "Processing" | "Approved" | "Disbursed";
  processedAt: string;
}
export interface SalaryStructure {
  id: string; gradeName: string; basicPct: number; hraPct: number; daPct: number;
  specialAllowancePct: number; conveyance: number; lta: number;
}
export interface PayslipItem {
  id: string; employeeId: string; employeeName: string; department: string;
  month: string; year: number; basic: number; hra: number; specialAllowance: number;
  pfDeduction: number; ptDeduction: number; tdsDeduction: number; netSalary: number;
  status: "Generated" | "Sent to Employee" | "Downloaded";
}