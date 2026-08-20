export interface ReimbursementClaim {
  id: string; employeeId: string; employeeName: string; category: string;
  amount: number; description: string; status: "Pending" | "Approved" | "Rejected"; submittedAt: string;
}
export interface BonusPayout {
  id: string; employeeId: string; employeeName: string; type: string;
  amount: number; month: string; status: "Draft" | "Approved" | "Paid";
}