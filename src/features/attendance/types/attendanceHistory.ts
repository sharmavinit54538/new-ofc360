import type { AttendanceRecord } from "./attendanceRecord";

export interface AttendanceHistoryResponse {
  page: number;
  limit: number;
  total: number;
  items: AttendanceRecord[];
  records?: AttendanceRecord[];
}
