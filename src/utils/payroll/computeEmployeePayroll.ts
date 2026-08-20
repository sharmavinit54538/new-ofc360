import type { DetailedPayrollComputation } from "./detailedComputationType";
import { decomposeCtc } from "./decomposeCtc";
import { calculatePfContribution, calculateEsiContribution, calculateProfessionalTax } from "./pfEsiTax";
import { calculateMonthlyTds } from "./calculateMonthlyTds";

export function computeEmployeePayroll(params: any): DetailedPayrollComputation {
  const { employeeId, employeeName, annualCtc, approvedBonus = 0, approvedOvertimeHours = 0, hourlyOtRate = 500, approvedReimbursement = 0, activeSalaryAdvanceEmi = 0, lopDays = 0, daysInMonth = 30, taxRegime, declared80C = 0, declared80D = 0 } = params;
  const components = decomposeCtc(annualCtc);
  const overtimeAmount = Math.round(approvedOvertimeHours * hourlyOtRate * 1.5);
  const lopDeduction = Math.round(lopDays * (components.grossMonthly / daysInMonth));
  const grossEarnings = Math.max(0, components.grossMonthly + approvedBonus + overtimeAmount - lopDeduction);
  const pf = calculatePfContribution(components.basic);
  const esi = calculateEsiContribution(grossEarnings);
  const pt = calculateProfessionalTax(grossEarnings);
  const monthlyTds = calculateMonthlyTds(annualCtc, taxRegime, declared80C, declared80D);
  const totalDeductions = pf.employeePf + esi.employeeEsi + pt + monthlyTds + activeSalaryAdvanceEmi;
  return {
    employeeId, employeeName, annualCtc, monthlyCtc: Math.round(annualCtc / 12), components,
    bonusAmount: approvedBonus, overtimeAmount, reimbursementAmount: approvedReimbursement,
    grossEarnings, statutoryDeductions: { employeePf: pf.employeePf, employerPf: pf.employerPf, employeeEsi: esi.employeeEsi, employerEsi: esi.employerEsi, professionalTax: pt, monthlyTds, totalEmployeeDeductions: pf.employeePf + esi.employeeEsi + pt + monthlyTds },
    advanceEmiDeduction: activeSalaryAdvanceEmi, lopDays, lopDeduction, totalDeductions,
    netSalary: Math.max(0, grossEarnings - totalDeductions + approvedReimbursement),
  };
}
