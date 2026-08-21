import { extractValidationErrors } from "./extractValidationErrors";
import { extractDetailErrors } from "./extractDetailErrors";
import { extractStringMessages } from "./extractStringMessages";

export function extractErrorMessage(data: Record<string, unknown>, fallback: string): { message: string; details?: any } {
  const details = (data.details && typeof data.details === "object") ? (data.details as any) : undefined;
  const validation = extractValidationErrors(data);
  if (validation) return validation;
  const detail = extractDetailErrors(data);
  if (detail) return detail;
  const str = extractStringMessages(data);
  if (str) return { message: str, details };
  return { message: fallback, details };
}
