/**
 * Regex and input validation helper functions for HR Admin Onboarding.
 */

// Corporate Identification Number (CIN) - 21 characters e.g. U12345MH2020PTC123456
export function validateCIN(cin?: string): boolean {
  if (!cin || !cin.trim()) return true; // Optional field
  const cinRegex = /^[L|U]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i;
  return cinRegex.test(cin.trim());
}

// Goods and Services Tax Identification Number (GSTIN) - 15 characters e.g. 22AAAAA0000A1Z5
export function validateGSTIN(gstin?: string): boolean {
  if (!gstin || !gstin.trim()) return true; // Optional field
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/i;
  return gstinRegex.test(gstin.trim());
}

// Permanent Account Number (PAN) - 10 characters e.g. ABCDE1234F
export function validatePAN(pan?: string): boolean {
  if (!pan || !pan.trim()) return true; // Optional field
  const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/i;
  return panRegex.test(pan.trim());
}

// Tax Deduction Account Number (TAN) - 10 characters e.g. ABCD12345E
export function validateTAN(tan?: string): boolean {
  if (!tan || !tan.trim()) return true; // Optional field
  const tanRegex = /^[A-Z]{4}\d{5}[A-Z]{1}$/i;
  return tanRegex.test(tan.trim());
}

// Mobile Number Validation (International E.164 or 10-digit Indian standard)
export function validateMobileNumber(phone: string): boolean {
  if (!phone || !phone.trim()) return false;
  const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, "");
  const phoneRegex = /^(\+?\d{1,4})?[6-9]\d{9}$|^(\+\d{8,15})$/;
  return phoneRegex.test(cleanPhone);
}

// Normalization function to clean and trim string fields
export function cleanString(val?: string): string {
  return val ? val.trim() : "";
}

// Validate File MIME type and size in MB
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(
  file: File,
  allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/webp"],
  maxSizeBytes: number = 5 * 1024 * 1024 // 5 MB
): FileValidationResult {
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type}). Allowed formats: ${allowedMimeTypes.map((t) => t.replace("image/", "")).join(", ")}.`,
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${maxMB} MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`,
    };
  }

  return { valid: true };
}

// Convert File object to Base64 data URL string for persistent storage and rendering
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
