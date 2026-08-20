export interface SalaryStructure {
  id: string; name: string; description?: string;
  components: { name: string; type: 'earning' | 'deduction'; calculationType: 'flat' | 'percentage'; value: number; }[];
}
export interface Payslip {
  id: string; employeeId: string; employeeName: string; month: string; year: number;
  earnings: { name: string; amount: number }[]; deductions: { name: string; amount: number }[];
  grossPay: number; totalDeductions: number; netPay: number; status: 'draft' | 'generated' | 'paid';
}