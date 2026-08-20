export function calculatePfContribution(monthlyBasic: number, uncapped = false) {
  if (monthlyBasic <= 0) return { employeePf: 0, employerPf: 0 };
  const eligible = uncapped ? monthlyBasic : Math.min(monthlyBasic, 15000);
  const pf = Math.round(eligible * 0.12);
  return { employeePf: pf, employerPf: pf };
}

export function calculateEsiContribution(grossMonthly: number) {
  if (grossMonthly <= 0 || grossMonthly > 21000) return { employeeEsi: 0, employerEsi: 0 };
  return { employeeEsi: Math.round(grossMonthly * 0.0075), employerEsi: Math.round(grossMonthly * 0.0325) };
}

export function calculateProfessionalTax(grossMonthly: number, isFebruary = false): number {
  if (grossMonthly < 15000) return 0;
  return isFebruary ? 300 : 200;
}
