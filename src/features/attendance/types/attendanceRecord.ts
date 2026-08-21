export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  company_id?: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  face_image_url?: string;
  checkout_image_url?: string;
  latitude?: number;
  longitude?: number;
  device_info?: string;
  ip_address?: string;
  working_hours?: number;
  created_at: string;
  updated_at: string;
}
