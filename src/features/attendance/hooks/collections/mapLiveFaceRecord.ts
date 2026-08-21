import type { FaceAttendanceRecord, PunchRecord } from "../../types";

export function mapLiveFaceRecord(f: FaceAttendanceRecord): PunchRecord {
  return {
    id: f.id || `f_${Math.random()}`,
    employeeId: f.employee_id || "EMP",
    employeeName: f.employee?.name || f.employee_name || "Employee",
    department: f.employee?.department || "General",
    timestamp: f.check_in_time || f.check_out_time || (f.created_at ? new Date(f.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"),
    date: f.date || (f.created_at ? new Date(f.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
    type: f.check_out_time ? "Check-Out" : "Check-In",
    location: f.location || "Facial Punch Station",
    status: f.is_late ? "Late" : "Present",
  };
}
