import { sanitizeMessage } from "./sanitizeMessage";

export function extractDetailErrors(data: Record<string, unknown>): { message: string; details?: any } | null {
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const detailMsgs = data.detail.map((item: any) => {
      if (typeof item === "string") return item;
      const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : item?.field || "";
      const msg = item?.msg || item?.message || "invalid value";
      return field && field !== "body" ? `${field}: ${msg}` : msg;
    });
    return { message: detailMsgs.join(". "), details: (data.details as any) || (data.detail as any) };
  } else if (typeof data.detail === "string" && data.detail.trim().length > 0) {
    return { message: sanitizeMessage(data.detail), details: data.details as any };
  }
  return null;
}
