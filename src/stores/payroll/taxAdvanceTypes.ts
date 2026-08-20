export interface SalaryAdvanceLoan {
  id: string; employeeId: string; employeeName: string; requestedAmount: number;
  approvedAmount: number; emiMonthly: number; tenureMonths: number; remainingAmount: number;
  status: "Pending" | "Approved" | "Rejected" | "Active" | "Repaid"; appliedAt: string;
}
export interface TaxDeclaration {
  employeeId: string; employeeName: string; regime: "New" | "Old";
  section80C: number; section80D: number; hraExemption: number; homeLoanInterest: number;
  status: "Submitted" | "Verified" | "Locked";
}
export interface ComplianceFiling { id: string; period: string; type: "PF (ECR)" | "ESIC" | "PT Return" | "TDS (24Q)"; dueDate: string; filedDate?: string; amount: number; challanNumber?: string; status: "Pending" | "Filed" | "Overdue"; }