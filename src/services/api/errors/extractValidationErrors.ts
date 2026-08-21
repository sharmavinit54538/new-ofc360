export function extractValidationErrors(data: Record<string, unknown>): { message: string; details?: any } | null {
  if (!data.errors) return null;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const msgs = data.errors.map((e: any) => {
      if (typeof e === "string") return e;
      if (e && typeof e === "object") return e.message || e.msg || (e.field ? `${e.field}: ${e.message || "invalid"}` : JSON.stringify(e));
      return String(e);
    });
    return { message: msgs.join(". "), details: (data.details as any) || (data.errors as any) };
  } else if (typeof data.errors === "object" && Object.keys(data.errors).length > 0) {
    const errObj = data.errors as Record<string, any>;
    const fieldMsgs = Object.entries(errObj).map(([field, val]) => `${field}: ${Array.isArray(val) ? val.join(", ") : typeof val === "object" ? JSON.stringify(val) : String(val)}`);
    return { message: fieldMsgs.join(". "), details: (data.details as any) || errObj };
  }
  return null;
}
