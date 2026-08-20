import type { DetailedPayrollComputation } from "./detailedComputationType";
import { decomposeCtc } from "./decomposeCtc";
import { calculatePfContribution, calculateEsiContribution, calculateProfessionalTax } from "./pfEsiTax";
import { calculateMonthlyTds } from "./calculateMonthlyTds";

export function computeEmployeePayroll(p: any): DetailedPayrollComputation {
  const comp = decomposeCtc(p.annualCtc);
  const ot = Math.round((p.approvedOvertimeHours || 0) * (p.hourlyOtRate || 500) * 1.5);
  const lop = Math.round((p.lopDays || 0) * (comp.grossMonthly / (p.daysInMonth || 30)));
  const gross = Math.max(0, comp.grossMonthly + (p.approvedBonus || 0) + ot - lop);
  const pf = calculatePfContribution(comp.basic);
  const esi = calculateEsiContribution(gross);
  const pt = calculateProfessionalTax(gross);
  const tds = calculateMonthlyTds(p.annualCtc, p.taxRegime, p.declared80C || 0, p.declared80D || 0);
  const stat = { employeePf: pf.employeePf, employerPf: pf.employerPf, employeeEsi: esi.employeeEsi, employerEsi: esi.employerEsi, professionalTax: pt, monthlyTds: tds, totalEmployeeDeductions: pf.employeePf + esi.employeeEsi + pt + tds };
  return {
    employeeId: p.employeeId, employeeName: p.employeeName, annualCtc: p.annualCtc, monthlyCtc: Math.round(p.annualCtc / 12), components: comp,
    bonusAmount: p.approvedBonus || 0, overtimeAmount: ot, reimbursementAmount: p.approvedReimbursement || 0, grossEarnings: gross, statutoryDeductions: stat,
    advanceEmiDeduction: p.activeSalaryAdvanceEmi || 0, lopDays: p.lopDays || 0, lopDeduction: lop, totalDeductions: stat.totalEmployeeDeductions + (p.activeSalaryAdvanceEmi || 0),
    netSalary: Math.max(0, gross - (stat.totalEmployeeDeductions + (p.activeSalaryAdvanceEmi || 0)) + (p.approvedReimbursement || 0)),
  };
}
