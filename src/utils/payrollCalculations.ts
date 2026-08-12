/**
 * OFC360 Payroll & Financial Calculation Engine
 * Authoritative payroll, CTC decomposition, statutory compliance (PF, ESI, PT, TDS),
 * LOP attendance deductions, overtime payouts, and net salary calculations.
 */

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

export interface DetailedPayrollComputation {
  employeeId: string;
  employeeName: string;
  annualCtc: number;
  monthlyCtc: number;
  components: ComponentBreakdown;
  bonusAmount: number;
  overtimeAmount: number;
  reimbursementAmount: number;
  grossEarnings: number;
  statutoryDeductions: StatutoryDeductionBreakdown;
  advanceEmiDeduction: number;
  lopDays: number;
  lopDeduction: number;
  totalDeductions: number;
  netSalary: number;
}

/**
 * Decomposes an Annual CTC into standard monthly salary components.
 */
export function decomposeCtc(
  annualCtc: number,
  structureOverride?: {
    basicPct?: number;
    hraPct?: number;
    daPct?: number;
    conveyance?: number;
    lta?: number;
  }
): ComponentBreakdown {
  const monthlyCtc = Math.max(0, annualCtc / 12);
  const basicPct = structureOverride?.basicPct ?? 50;
  const hraPct = structureOverride?.hraPct ?? 20;
  const daPct = structureOverride?.daPct ?? 10;
  const conveyance = structureOverride?.conveyance ?? 1600;
  const lta = structureOverride?.lta ?? 1250;

  const basic = Math.round(monthlyCtc * (basicPct / 100));
  const hra = Math.round(monthlyCtc * (hraPct / 100));
  const da = Math.round(monthlyCtc * (daPct / 100));
  
  const sumFixed = basic + hra + da + conveyance + lta;
  const specialAllowance = Math.max(0, monthlyCtc - sumFixed);
  const grossMonthly = Math.round(sumFixed + specialAllowance);

  return {
    basic,
    hra,
    da,
    specialAllowance,
    conveyance,
    lta,
    grossMonthly,
  };
}

/**
 * Calculates Indian Provident Fund (PF) contribution.
 * Employee: 12% of Basic (capped at ₹1,800/mo if Basic > ₹15,000 unless uncapped).
 */
export function calculatePfContribution(
  monthlyBasic: number,
  uncapped: boolean = false
): { employeePf: number; employerPf: number } {
  if (monthlyBasic <= 0) return { employeePf: 0, employerPf: 0 };
  const eligibleSalary = uncapped ? monthlyBasic : Math.min(monthlyBasic, 15000);
  const pfAmount = Math.round(eligibleSalary * 0.12);
  return { employeePf: pfAmount, employerPf: pfAmount };
}

/**
 * Calculates ESI (Employee State Insurance) contribution.
 * Applicable only if Gross Monthly Salary <= ₹21,000.
 */
export function calculateEsiContribution(
  grossMonthly: number
): { employeeEsi: number; employerEsi: number } {
  if (grossMonthly <= 0 || grossMonthly > 21000) {
    return { employeeEsi: 0, employerEsi: 0 };
  }
  const employeeEsi = Math.round(grossMonthly * 0.0075); // 0.75%
  const employerEsi = Math.round(grossMonthly * 0.0325); // 3.25%
  return { employeeEsi, employerEsi };
}

/**
 * Calculates Indian Professional Tax (PT).
 * Standard slab: Gross < ₹15,000 -> ₹0; Gross >= ₹15,000 -> ₹200/mo (₹300 in Feb).
 */
export function calculateProfessionalTax(grossMonthly: number, isFebruary: boolean = false): number {
  if (grossMonthly < 15000) return 0;
  return isFebruary ? 300 : 200;
}

/**
 * Estimates monthly TDS (Tax Deducted at Source) under Sec 115BAC (New Tax Regime).
 */
export function calculateMonthlyTds(
  annualTaxableEarnings: number,
  regime: "New Tax Regime (Sec 115BAC)" | "Old Tax Regime (With Exemptions)" = "New Tax Regime (Sec 115BAC)",
  declaredDeductions80C: number = 0,
  declaredDeductions80D: number = 0
): number {
  const stdDeduction = 75000;
  let taxableIncome = Math.max(0, annualTaxableEarnings - stdDeduction);

  if (regime === "Old Tax Regime (With Exemptions)") {
    const totalExemptions = Math.min(declaredDeductions80C, 150000) + Math.min(declaredDeductions80D, 25000);
    taxableIncome = Math.max(0, taxableIncome - totalExemptions);
  }

  // Sec 87A Tax Rebate (New Tax Regime: Taxable income up to 7 Lakhs pays 0 tax)
  if (regime === "New Tax Regime (Sec 115BAC)" && taxableIncome <= 700000) {
    return 0;
  }

  let annualTax = 0;

  if (regime === "New Tax Regime (Sec 115BAC)") {
    if (taxableIncome > 1500000) {
      annualTax += (taxableIncome - 1500000) * 0.30;
      taxableIncome = 1500000;
    }
    if (taxableIncome > 1200000) {
      annualTax += (taxableIncome - 1200000) * 0.20;
      taxableIncome = 1200000;
    }
    if (taxableIncome > 900000) {
      annualTax += (taxableIncome - 900000) * 0.15;
      taxableIncome = 900000;
    }
    if (taxableIncome > 600000) {
      annualTax += (taxableIncome - 600000) * 0.10;
      taxableIncome = 600000;
    }
    if (taxableIncome > 300000) {
      annualTax += (taxableIncome - 300000) * 0.05;
    }
  } else {
    // Old Tax Regime Slabs
    if (taxableIncome > 1000000) {
      annualTax += (taxableIncome - 1000000) * 0.30;
      taxableIncome = 1000000;
    }
    if (taxableIncome > 500000) {
      annualTax += (taxableIncome - 500000) * 0.20;
      taxableIncome = 500000;
    }
    if (taxableIncome > 250000) {
      annualTax += (taxableIncome - 250000) * 0.05;
    }
  }

  // 4% Health & Education Cess
  annualTax = Math.round(annualTax * 1.04);
  return Math.round(annualTax / 12);
}

/**
 * Computes complete individual employee monthly payroll breakdown.
 */
export function computeEmployeePayroll(params: {
  employeeId: string;
  employeeName: string;
  annualCtc: number;
  approvedBonus?: number;
  approvedOvertimeHours?: number;
  hourlyOtRate?: number;
  approvedReimbursement?: number;
  activeSalaryAdvanceEmi?: number;
  lopDays?: number;
  daysInMonth?: number;
  taxRegime?: "New Tax Regime (Sec 115BAC)" | "Old Tax Regime (With Exemptions)";
  declared80C?: number;
  declared80D?: number;
}): DetailedPayrollComputation {
  const {
    employeeId,
    employeeName,
    annualCtc,
    approvedBonus = 0,
    approvedOvertimeHours = 0,
    hourlyOtRate = 500,
    approvedReimbursement = 0,
    activeSalaryAdvanceEmi = 0,
    lopDays = 0,
    daysInMonth = 30,
    taxRegime = "New Tax Regime (Sec 115BAC)",
    declared80C = 0,
    declared80D = 0,
  } = params;

  const components = decomposeCtc(annualCtc);
  const monthlyCtc = Math.round(annualCtc / 12);

  // Overtime payout calculation
  const overtimeAmount = Math.round(approvedOvertimeHours * hourlyOtRate * 1.5);

  // Loss of Pay (LOP) Deduction
  const dailyRate = components.grossMonthly / daysInMonth;
  const lopDeduction = Math.round(lopDays * dailyRate);

  // Gross Earnings for the month
  const grossEarnings = Math.max(
    0,
    components.grossMonthly + approvedBonus + overtimeAmount - lopDeduction
  );

  // Statutory Deductions
  const pf = calculatePfContribution(components.basic);
  const esi = calculateEsiContribution(grossEarnings);
  const pt = calculateProfessionalTax(grossEarnings);
  const monthlyTds = calculateMonthlyTds(
    annualCtc,
    taxRegime,
    declared80C,
    declared80D
  );

  const statutoryDeductions: StatutoryDeductionBreakdown = {
    employeePf: pf.employeePf,
    employerPf: pf.employerPf,
    employeeEsi: esi.employeeEsi,
    employerEsi: esi.employerEsi,
    professionalTax: pt,
    monthlyTds,
    totalEmployeeDeductions: pf.employeePf + esi.employeeEsi + pt + monthlyTds,
  };

  const totalDeductions = statutoryDeductions.totalEmployeeDeductions + activeSalaryAdvanceEmi;
  const netSalary = Math.max(0, grossEarnings - totalDeductions + approvedReimbursement);

  return {
    employeeId,
    employeeName,
    annualCtc,
    monthlyCtc,
    components,
    bonusAmount: approvedBonus,
    overtimeAmount,
    reimbursementAmount: approvedReimbursement,
    grossEarnings,
    statutoryDeductions,
    advanceEmiDeduction: activeSalaryAdvanceEmi,
    lopDays,
    lopDeduction,
    totalDeductions,
    netSalary,
  };
}
