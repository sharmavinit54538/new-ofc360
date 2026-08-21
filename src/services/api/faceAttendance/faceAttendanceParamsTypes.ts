export interface GetFaceHistoryParams { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string; month?: string; }
export interface GetTeamAttendanceParams { page?: number; limit?: number; search?: string; date?: string; status?: string; }
export interface GetCompanyAttendanceParams { page?: number; limit?: number; search?: string; department?: string; date?: string; startDate?: string; endDate?: string; status?: string; }
export interface FaceAttendanceAnalyticsResponse {
  totalEmployees: number; presentToday: number; absentToday: number; checkedIn: number; checkedOut: number; lateEmployees: number; attendanceRate: number;
  dailyTrend: Array<{ date: string; present: number; absent: number; late?: number }>;
  departmentStats: Array<{ department: string; present: number; total: number; rate: number }>;
  punchDistribution?: Array<{ hour: string; count: number }>;
  [key: string]: unknown;
}
export interface FacePunchPayload {
  image?: string | Blob | File; photo?: string | Blob | File; file?: Blob | File;
  location?: string; coordinates?: { lat: number; lng: number }; notes?: string; [key: string]: unknown;
}
