import { ApiError } from "./errors/errorTypes";
import { sanitizeMessage } from "./errors/sanitizeMessage";
import { parseFetchBaseQueryError } from "./errors/parseFetchBaseQueryError";

export type { ApiError } from "./errors/errorTypes";

export function normalizeError(error: unknown): ApiError {
  if (!error) return { status: "CUSTOM_ERROR", message: "An unknown error occurred." };
  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, unknown>;
    if ("status" in errObj) return parseFetchBaseQueryError(errObj);
    if ("message" in errObj && typeof errObj.message === "string") {
      return { status: "CUSTOM_ERROR", message: sanitizeMessage(errObj.message) };
    }
  }
  if (typeof error === "string") return { status: "CUSTOM_ERROR", message: sanitizeMessage(error) };
  return { status: "CUSTOM_ERROR", message: "An unexpected error occurred." };
}