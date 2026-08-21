export const PAYROLL_CORE_TAGS = [
  "Payroll", "Payslip", "PayrollAnalytics", "PayCycle", "SalaryProcessing", "SalaryStructure",
  "Overtime", "Bonus", "Deduction", "Reimbursement", "Advance", "BankTransfer",
] as const;

export const PAYROLL_MORE_TAGS = [
  "Compliance", "PayrollDashboard", "PayrollSettings", "Tax", "SalaryComponent", "Allowance",
  "Template", "Security", "AiPayroll",
] as const;

export const PAYROLL_TAGS = [...PAYROLL_CORE_TAGS, ...PAYROLL_MORE_TAGS] as const;
