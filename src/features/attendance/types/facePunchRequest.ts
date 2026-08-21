export interface FacePunchRequest {
  file: File | Blob;
  latitude?: number;
  longitude?: number;
  device_info?: string;
  ip_address?: string;
}
