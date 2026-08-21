export interface FaceAttendanceMeResponse {
  id?: string; employeeId?: string; employeeName?: string; date?: string;
  status: "not_checked_in" | "checked_in" | "checked_out" | "present" | "absent" | "late" | string;
  checkInTime?: string | null; checkOutTime?: string | null; workingDuration?: string | number | null;
  hoursWorked?: number | null; isFaceVerified?: boolean; confidenceScore?: number | null; location?: string | null; notes?: string | null;
  [key: string]: unknown;
}
export interface FaceAttendanceRecord {
  id: string; employeeId?: string; employeeName?: string; employeeEmail?: string; department?: string; role?: string; date: string;
  checkIn?: string | null; checkOut?: string | null; workingHours?: string | number | null;
  status: "Present" | "Absent" | "Half Day" | "Late" | "Checked In" | "Checked Out" | string;
  verificationStatus?: "Verified" | "Failed" | "Pending" | string; confidence?: number | null; location?: string; photoUrl?: string;
  [key: string]: unknown;
}
export interface PaginatedAttendanceResponse<T> { items: T[]; total: number; page: number; limit: number; totalPages: number; }
