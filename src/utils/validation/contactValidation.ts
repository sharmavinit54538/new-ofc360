export function validateMobileNumber(phone: string): boolean {
  if (!phone || !phone.trim()) return false;
  const cleanPhone = phone.trim().replace(/[\s\-()]/g, "");
  const phoneRegex = /^(\+?\d{1,4})?[6-9]\d{9}$|^(\+\d{8,15})$/;
  return phoneRegex.test(cleanPhone);
}

export function cleanString(val?: string): string {
  return val ? val.trim() : "";
}
