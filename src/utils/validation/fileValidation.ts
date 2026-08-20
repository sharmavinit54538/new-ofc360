export interface FileValidationResult { valid: boolean; error?: string; }

export function validateImageFile(file: File, allowed = ["image/jpeg", "image/png", "image/webp"], maxBytes = 5242880): FileValidationResult {
  if (!allowed.includes(file.type)) {
    return { valid: false, error: `Invalid format (${file.type}). Allowed: ${allowed.map((t) => t.replace("image/", "")).join(", ")}.` };
  }
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds limit of ${(maxBytes / 1048576).toFixed(0)} MB.` };
  }
  return { valid: true };
}
