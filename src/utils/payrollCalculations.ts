export type { ComponentBreakdown, StatutoryDeductionBreakdown } from "./payroll/types";
export type { DetailedPayrollComputation } from "./payroll/detailedComputationType";
export { decomposeCtc } from "./payroll/decomposeCtc";
export { calculatePfContribution, calculateEsiContribution, calculateProfessionalTax } from "./payroll/pfEsiTax";
export { calculateMonthlyTds } from "./payroll/calculateMonthlyTds";
export { computeEmployeePayroll } from "./payroll/computeEmployeePayroll";
