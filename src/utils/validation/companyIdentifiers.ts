export function validateCIN(cin?: string): boolean {
  if (!cin || !cin.trim()) return true;
  return /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i.test(cin.trim());
}

export function validateGSTIN(gstin?: string): boolean {
  if (!gstin || !gstin.trim()) return true;
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/i.test(gstin.trim());
}

export function validatePAN(pan?: string): boolean {
  if (!pan || !pan.trim()) return true;
  return /^[A-Z]{5}\d{4}[A-Z]{1}$/i.test(pan.trim());
}

export function validateTAN(tan?: string): boolean {
  if (!tan || !tan.trim()) return true;
  return /^[A-Z]{4}\d{5}[A-Z]{1}$/i.test(tan.trim());
}
