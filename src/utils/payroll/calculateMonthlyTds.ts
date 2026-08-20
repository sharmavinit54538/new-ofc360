import { calculateNewRegimeTax, calculateOldRegimeTax } from "./taxRegimeCalculations";

export function calculateMonthlyTds(
  annualTaxableEarnings: number,
  regime: "New Tax Regime (Sec 115BAC)" | "Old Tax Regime (With Exemptions)" = "New Tax Regime (Sec 115BAC)",
  d80C = 0, d80D = 0
): number {
  let taxable = Math.max(0, annualTaxableEarnings - 75000);
  if (regime === "Old Tax Regime (With Exemptions)") {
    taxable = Math.max(0, taxable - (Math.min(d80C, 150000) + Math.min(d80D, 25000)));
  }
  if (regime === "New Tax Regime (Sec 115BAC)" && taxable <= 700000) return 0;
  const rawTax = regime === "New Tax Regime (Sec 115BAC)" ? calculateNewRegimeTax(taxable) : calculateOldRegimeTax(taxable);
  return Math.round(Math.round(rawTax * 1.04) / 12);
}
