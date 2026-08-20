import { appendArray } from "./appendArray";

export function appendEntry(formData: FormData, key: string, value: any): void {
  if (value === undefined || value === null) return;
  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value);
  } else if (Array.isArray(value)) {
    appendArray(formData, key, value);
  } else if (typeof value === "object") {
    formData.append(key, JSON.stringify(value));
  } else {
    formData.append(key, String(value));
  }
}
