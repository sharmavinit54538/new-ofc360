export interface ComponentBreakdown {
  basic: number;
  hra: number;
  da: number;
  specialAllowance: number;
  conveyance: number;
  lta: number;
  grossMonthly: number;
}

export interface StatutoryDeductionBreakdown {
  employeePf: number;
  employerPf: number;
  employeeEsi: number;
  employerEsi: number;
  professionalTax: number;
  monthlyTds: number;
  totalEmployeeDeductions: number;
}
