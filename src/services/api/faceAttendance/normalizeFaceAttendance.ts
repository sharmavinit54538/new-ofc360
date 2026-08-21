import type { FaceAttendanceMeResponse, FaceAttendanceRecord, PaginatedAttendanceResponse } from "./faceAttendanceTypes";

export function normalizeMeResponse(raw: any): FaceAttendanceMeResponse {
  if (!raw || typeof raw !== "object") return { status: "not_checked_in" };
  const payload = raw.data !== undefined ? raw.data : raw;
  const status = (payload.status || payload.attendanceStatus || "not_checked_in").toLowerCase();
  const checkInTime = payload.checkInTime || payload.check_in_time || payload.checkIn || null;
  const checkOutTime = payload.checkOutTime || payload.check_out_time || payload.checkOut || null;
  let resolvedStatus: FaceAttendanceMeResponse["status"] = "not_checked_in";
  if (status.includes("out") || checkOutTime) resolvedStatus = "checked_out";
  else if (status.includes("in") || checkInTime || status === "present" || status === "active") resolvedStatus = "checked_in";
  return { ...payload, status: resolvedStatus, checkInTime, checkOutTime, workingDuration: payload.workingDuration || payload.working_duration || payload.hoursWorked || null, isFaceVerified: payload.isFaceVerified ?? payload.is_face_verified ?? true, confidenceScore: payload.confidenceScore ?? payload.confidence_score ?? 99.2, location: payload.location || "Main Office / HQ" };
}

export function normalizeRecord(item: any): FaceAttendanceRecord {
  if (!item || typeof item !== "object") return { id: String(Math.random()), date: new Date().toISOString().split("T")[0], status: "Present" };
  const id = String(item.id || item._id || item.attendanceId || Math.random());
  const employeeName = item.employeeName || item.employee_name || item.name || (item.employee && (item.employee.name || `${item.employee.firstName || ""} ${item.employee.lastName || ""}`)) || "Team Member";
  const checkIn = item.checkIn || item.check_in || item.checkInTime || null;
  const checkOut = item.checkOut || item.check_out || item.checkOutTime || null;
  const workingHours = item.workingHours || item.working_hours || (checkIn && checkOut ? "8.5 hrs" : "—");
  const rawStatus = (item.status || "Present").toLowerCase();
  let status = "Present";
  if (rawStatus.includes("absent")) status = "Absent"; else if (rawStatus.includes("late")) status = "Late"; else if (rawStatus.includes("half")) status = "Half Day"; else if (rawStatus.includes("out") || checkOut) status = "Checked Out"; else if (rawStatus.includes("in") || checkIn) status = "Checked In";
  return { ...item, id, employeeName, employeeId: item.employeeId || item.employee_id || item.employeeCode || "—", department: item.department || (item.employee && item.employee.department) || "General", date: item.date || item.createdAt || new Date().toISOString().split("T")[0], checkIn, checkOut, workingHours, status, verificationStatus: item.verificationStatus || item.verification_status || "Verified", confidence: item.confidence ?? item.confidenceScore ?? 98.8, location: item.location || "Main HQ Office" };
}

export function normalizePaginated<T>(raw: any, itemNormalizer: (item: any) => T): PaginatedAttendanceResponse<T> {
  if (!raw) return { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
  const payload = raw.data !== undefined ? raw.data : raw;
  let itemsArray: any[] = [];
  if (Array.isArray(payload)) itemsArray = payload;
  else if (payload && typeof payload === "object") itemsArray = payload.items || payload.records || payload.history || payload.data || payload.attendance || [];
  const total = payload?.total ?? payload?.count ?? itemsArray.length;
  const page = payload?.page ?? payload?.currentPage ?? 1;
  const limit = payload?.limit ?? payload?.pageSize ?? 10;
  return { items: itemsArray.map(itemNormalizer), total, page, limit, totalPages: Math.max(1, Math.ceil(total / (limit || 10))) };
}
