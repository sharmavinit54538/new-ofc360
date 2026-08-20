export interface PayrollCycle {
  id: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'processing' | 'calculated' | 'approved' | 'disbursed' | 'locked';
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  totalDeductions: number;
  createdAt: string;
}

export interface Payslip {
  id: string;
  payrollCycleId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Record<string, number>;
  deductions: Record<string, number>;
  grossSalary: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  disbursementDate?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

export interface ApprovePayrollRequest {
  payrollCycleId: string;
  notes?: string;
}

export interface RunPayrollRequest {
  month: number;
  year: number;
  departmentId?: string;
  employeeIds?: string[];
}