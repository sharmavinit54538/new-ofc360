import { unwrapEnvelope, RawEnvelope } from "@/services/api/envelope";
import { APIResponse } from "./types";

export function extractData<T>(raw: RawEnvelope<T> | APIResponse<T> | T): T | null {
  const unwrapped = unwrapEnvelope(raw as RawEnvelope<T>);
  if (unwrapped && typeof unwrapped === "object" && "data" in unwrapped) {
    return (unwrapped as { data: T }).data;
  }
  return (unwrapped as T) ?? null;
}

export function extractArray<T>(raw: RawEnvelope<T[]> | APIResponse<T[]> | T[]): T[] {
  const unwrapped = unwrapEnvelope(raw as RawEnvelope<T[]>);
  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }
  if (unwrapped && typeof unwrapped === "object" && "data" in unwrapped) {
    const d = (unwrapped as { data: unknown }).data;
    if (Array.isArray(d)) {
      return d as T[];
    }
  }
  return [];
}