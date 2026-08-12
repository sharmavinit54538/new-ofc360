export interface RawEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

export function unwrapEnvelope<T>(raw: RawEnvelope<T> | T): T {
  if (raw && typeof raw === "object" && "data" in raw && "success" in raw) {
    return (raw as RawEnvelope<T>).data;
  }
  return raw as T;
}
