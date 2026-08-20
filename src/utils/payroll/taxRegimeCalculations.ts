export function calculateNewRegimeTax(income: number): number {
  let tax = 0;
  let remaining = income;
  if (remaining > 1500000) { tax += (remaining - 1500000) * 0.30; remaining = 1500000; }
  if (remaining > 1200000) { tax += (remaining - 1200000) * 0.20; remaining = 1200000; }
  if (remaining > 900000) { tax += (remaining - 900000) * 0.15; remaining = 900000; }
  if (remaining > 600000) { tax += (remaining - 600000) * 0.10; remaining = 600000; }
  if (remaining > 300000) { tax += (remaining - 300000) * 0.05; }
  return tax;
}

export function calculateOldRegimeTax(income: number): number {
  let tax = 0;
  let remaining = income;
  if (remaining > 1000000) { tax += (remaining - 1000000) * 0.30; remaining = 1000000; }
  if (remaining > 500000) { tax += (remaining - 500000) * 0.20; remaining = 500000; }
  if (remaining > 250000) { tax += (remaining - 250000) * 0.05; }
  return tax;
}
