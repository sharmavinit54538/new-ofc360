import type { FaceAttendanceRecord } from "../../services/attendanceApi";
import type { PunchRecord } from "../../types/attendance.types";

export function mapLiveFaceRecord(item: FaceAttendanceRecord): PunchRecord {
  return {
    id: item.id, employeeName: item.employeeName || "Team Member", department: item.department || "Engineering",
    timestamp: item.checkIn || "09:15 AM", date: item.date, type: (item.checkOut ? "Check-Out" : "Check-In") as PunchRecord["type"],
    method: "Selfie Camera" as PunchRecord["method"], location: item.location || "Main HQ Office",
    status: (item.status || "Present") as PunchRecord["status"], workHours: item.workingHours ? String(item.workingHours) : undefined,
  };
}
