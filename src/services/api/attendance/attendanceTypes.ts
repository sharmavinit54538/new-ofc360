export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "half_day" | "late" | "on_leave";
  location?: string;
  verificationMethod?: "gps" | "face_id" | "wifi" | "manual";
}

export interface ClockInInput {
  employeeId: string;
  location?: string;
  verificationMethod?: string;
  coordinates?: { lat: number; lng: number };
}
