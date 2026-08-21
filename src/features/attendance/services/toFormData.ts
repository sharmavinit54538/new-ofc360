import type { FacePunchRequest } from "../types/facePunchRequest";

export function toFormData(body: FormData | FacePunchRequest): FormData {
  if (body instanceof FormData) return body;
  const formData = new FormData();
  if (body.file) formData.append("file", body.file);
  if (body.latitude !== undefined && body.latitude !== null) {
    formData.append("latitude", String(body.latitude));
  }
  if (body.longitude !== undefined && body.longitude !== null) {
    formData.append("longitude", String(body.longitude));
  }
  if (body.device_info) formData.append("device_info", body.device_info);
  if (body.ip_address) formData.append("ip_address", body.ip_address);
  return formData;
}
