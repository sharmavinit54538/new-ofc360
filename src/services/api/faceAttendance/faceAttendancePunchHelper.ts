import type { FacePunchPayload } from "./faceAttendanceParamsTypes";

export function buildFacePunchFormData(body: FormData | FacePunchPayload, defaultFilename: string): FormData {
  if (body instanceof FormData) return body;
  const formData = new FormData();
  const img = body.image || body.photo || body.file;
  if (img) {
    if (typeof img === "string") { formData.append("image", img); formData.append("photo", img); }
    else { formData.append("image", img, defaultFilename); formData.append("photo", img, defaultFilename); formData.append("file", img, defaultFilename); }
  }
  if (body.latitude !== undefined && body.latitude !== null) formData.append("latitude", String(body.latitude));
  if (body.longitude !== undefined && body.longitude !== null) formData.append("longitude", String(body.longitude));
  if (body.coordinates?.lat !== undefined) formData.append("latitude", String(body.coordinates.lat));
  if (body.coordinates?.lng !== undefined) formData.append("longitude", String(body.coordinates.lng));
  if (body.device_info) formData.append("device_info", String(body.device_info));
  if (body.ip_address) formData.append("ip_address", String(body.ip_address));
  if (body.method || body.verificationMethod) formData.append("verification_method", String(body.method || body.verificationMethod));
  if (body.location) formData.append("location", String(body.location));
  if (body.notes) formData.append("notes", String(body.notes));
  return formData;
}
