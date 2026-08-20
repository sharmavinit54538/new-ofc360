export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(
  file: File,
  allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/webp"],
  maxSizeBytes: number = 5 * 1024 * 1024
): FileValidationResult {
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type}). Allowed formats: ${allowedMimeTypes.map((t) => t.replace("image/", "")).join(", ")}.`,
    };
  }
  if (file.size > maxSizeBytes) {
    const maxMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File size exceeds maximum limit of ${maxMB} MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.` };
  }
  return { valid: true };
}
