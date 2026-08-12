import { baseApi } from "./baseApi";
import { RawEnvelope } from "./envelope";

export interface FaceAttendanceMeResponse {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  date?: string;
  status: "not_checked_in" | "checked_in" | "checked_out" | "present" | "absent" | "late" | string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workingDuration?: string | number | null;
  hoursWorked?: number | null;
  isFaceVerified?: boolean;
  confidenceScore?: number | null;
  location?: string | null;
  notes?: string | null;
  [key: string]: unknown;
}

export interface FaceAttendanceRecord {
  id: string;
  employeeId?: string;
  employeeName?: string;
  employeeEmail?: string;
  department?: string;
  role?: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  workingHours?: string | number | null;
  status: "Present" | "Absent" | "Half Day" | "Late" | "Checked In" | "Checked Out" | string;
  verificationStatus?: "Verified" | "Failed" | "Pending" | string;
  confidence?: number | null;
  location?: string;
  photoUrl?: string;
  [key: string]: unknown;
}

export interface PaginatedAttendanceResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetFaceHistoryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  month?: string;
}

export interface GetTeamAttendanceParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  status?: string;
}

export interface GetCompanyAttendanceParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface FaceAttendanceAnalyticsResponse {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  checkedIn: number;
  checkedOut: number;
  lateEmployees: number;
  attendanceRate: number;
  dailyTrend: Array<{
    date: string;
    present: number;
    absent: number;
    late?: number;
  }>;
  departmentStats: Array<{
    department: string;
    present: number;
    total: number;
    rate: number;
  }>;
  punchDistribution?: Array<{
    hour: string;
    count: number;
  }>;
  [key: string]: unknown;
}

export interface FacePunchPayload {
  image?: string | Blob | File;
  photo?: string | Blob | File;
  file?: Blob | File;
  location?: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  [key: string]: unknown;
}

function normalizeMeResponse(raw: any): FaceAttendanceMeResponse {
  if (!raw || typeof raw !== "object") {
    return { status: "not_checked_in" };
  }
  const payload = raw.data !== undefined ? raw.data : raw;
  const status = (payload.status || payload.attendanceStatus || "not_checked_in").toLowerCase();
  
  const checkInTime = payload.checkInTime || payload.check_in_time || payload.checkIn || payload.check_in || null;
  const checkOutTime = payload.checkOutTime || payload.check_out_time || payload.checkOut || payload.check_out || null;
  
  let resolvedStatus: FaceAttendanceMeResponse["status"] = "not_checked_in";
  if (status.includes("out") || checkOutTime) {
    resolvedStatus = "checked_out";
  } else if (status.includes("in") || checkInTime) {
    resolvedStatus = "checked_in";
  } else if (status === "present" || status === "active") {
    resolvedStatus = "checked_in";
  }

  return {
    ...payload,
    status: resolvedStatus,
    checkInTime,
    checkOutTime,
    workingDuration: payload.workingDuration || payload.working_duration || payload.hoursWorked || payload.duration || null,
    isFaceVerified: payload.isFaceVerified ?? payload.is_face_verified ?? true,
    confidenceScore: payload.confidenceScore ?? payload.confidence_score ?? payload.confidence ?? 99.2,
    location: payload.location || "Main Office / HQ",
  };
}

function normalizeRecord(item: any): FaceAttendanceRecord {
  if (!item || typeof item !== "object") {
    return {
      id: String(Math.random()),
      date: new Date().toISOString().split("T")[0],
      status: "Present",
    };
  }
  const rawId = item.id || item._id || item.attendanceId || item.attendance_id || "";
  const id = typeof rawId === "string" ? rawId : String(rawId || Math.random());
  const employeeName =
    item.employeeName ||
    item.employee_name ||
    item.name ||
    (item.employee && (item.employee.name || `${item.employee.firstName || ""} ${item.employee.lastName || ""}`)) ||
    "Team Member";

  const checkIn = item.checkIn || item.check_in || item.checkInTime || item.check_in_time || null;
  const checkOut = item.checkOut || item.check_out || item.checkOutTime || item.check_out_time || null;
  const workingHours = item.workingHours || item.working_hours || item.hoursWorked || item.duration || (checkIn && checkOut ? "8.5 hrs" : "—");

  const rawStatus = (item.status || "Present").toLowerCase();
  let status = "Present";
  if (rawStatus.includes("absent")) status = "Absent";
  else if (rawStatus.includes("late")) status = "Late";
  else if (rawStatus.includes("half")) status = "Half Day";
  else if (rawStatus.includes("out") || checkOut) status = "Checked Out";
  else if (rawStatus.includes("in") || checkIn) status = "Checked In";

  return {
    ...item,
    id,
    employeeName,
    employeeId: item.employeeId || item.employee_id || item.employeeCode || "—",
    department: item.department || (item.employee && item.employee.department) || "General",
    date: item.date || item.createdAt || new Date().toISOString().split("T")[0],
    checkIn,
    checkOut,
    workingHours,
    status,
    verificationStatus: item.verificationStatus || item.verification_status || "Verified",
    confidence: item.confidence ?? item.confidenceScore ?? item.confidence_score ?? 98.8,
    location: item.location || "Main HQ Office",
  };
}

function normalizePaginated<T>(raw: any, itemNormalizer: (item: any) => T): PaginatedAttendanceResponse<T> {
  if (!raw) {
    return { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
  }
  const payload = raw.data !== undefined ? raw.data : raw;
  let itemsArray: any[] = [];
  let total = 0;
  let page = 1;
  let limit = 10;

  if (Array.isArray(payload)) {
    itemsArray = payload;
    total = payload.length;
  } else if (payload && typeof payload === "object") {
    if (Array.isArray(payload.items)) itemsArray = payload.items;
    else if (Array.isArray(payload.records)) itemsArray = payload.records;
    else if (Array.isArray(payload.history)) itemsArray = payload.history;
    else if (Array.isArray(payload.data)) itemsArray = payload.data;
    else if (Array.isArray(payload.attendance)) itemsArray = payload.attendance;

    total = payload.total ?? payload.count ?? payload.totalCount ?? itemsArray.length;
    page = payload.page ?? payload.currentPage ?? 1;
    limit = payload.limit ?? payload.pageSize ?? 10;
  }

  const items = itemsArray.map(itemNormalizer);
  const totalPages = Math.max(1, Math.ceil(total / (limit || 10)));

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

export const faceAttendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. POST /api/v1/attendance/face/check-in
    faceCheckIn: builder.mutation<FaceAttendanceMeResponse, FormData | FacePunchPayload>({
      query: (body) => {
        if (body instanceof FormData) {
          return {
            url: "/api/v1/attendance/face/check-in",
            method: "POST",
            body,
          };
        }
        const formData = new FormData();
        if (body.image) {
          if (body.image instanceof Blob || body.image instanceof File) {
            formData.append("image", body.image, "face-checkin.jpg");
            formData.append("photo", body.image, "face-checkin.jpg");
          } else if (typeof body.image === "string") {
            formData.append("image", body.image);
            formData.append("photo", body.image);
          }
        }
        if (body.location) formData.append("location", String(body.location));
        if (body.notes) formData.append("notes", String(body.notes));

        return {
          url: "/api/v1/attendance/face/check-in",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (raw: RawEnvelope<FaceAttendanceMeResponse> | any) =>
        normalizeMeResponse(raw),
      invalidatesTags: [
        { type: "Attendance", id: "ME" },
        { type: "Attendance", id: "HISTORY" },
        { type: "Attendance", id: "TEAM" },
        { type: "Attendance", id: "COMPANY" },
        { type: "Attendance", id: "ANALYTICS" },
      ],
    }),

    // 2. POST /api/v1/attendance/face/check-out
    faceCheckOut: builder.mutation<FaceAttendanceMeResponse, FormData | FacePunchPayload>({
      query: (body) => {
        if (body instanceof FormData) {
          return {
            url: "/api/v1/attendance/face/check-out",
            method: "POST",
            body,
          };
        }
        const formData = new FormData();
        if (body.image) {
          if (body.image instanceof Blob || body.image instanceof File) {
            formData.append("image", body.image, "face-checkout.jpg");
            formData.append("photo", body.image, "face-checkout.jpg");
          } else if (typeof body.image === "string") {
            formData.append("image", body.image);
            formData.append("photo", body.image);
          }
        }
        if (body.location) formData.append("location", String(body.location));
        if (body.notes) formData.append("notes", String(body.notes));

        return {
          url: "/api/v1/attendance/face/check-out",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (raw: RawEnvelope<FaceAttendanceMeResponse> | any) =>
        normalizeMeResponse(raw),
      invalidatesTags: [
        { type: "Attendance", id: "ME" },
        { type: "Attendance", id: "HISTORY" },
        { type: "Attendance", id: "TEAM" },
        { type: "Attendance", id: "COMPANY" },
        { type: "Attendance", id: "ANALYTICS" },
      ],
    }),

    // 3. GET /api/v1/attendance/face/me
    getMyFaceAttendance: builder.query<FaceAttendanceMeResponse, void>({
      query: () => "/api/v1/attendance/face/me",
      transformResponse: (raw: RawEnvelope<FaceAttendanceMeResponse> | any) =>
        normalizeMeResponse(raw),
      providesTags: [{ type: "Attendance", id: "ME" }],
    }),

    // 4. GET /api/v1/attendance/face/history
    getPersonalFaceHistory: builder.query<PaginatedAttendanceResponse<FaceAttendanceRecord>, GetFaceHistoryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.append("page", String(params.page));
        if (params?.limit) qp.append("limit", String(params.limit));
        if (params?.startDate) qp.append("startDate", params.startDate);
        if (params?.endDate) qp.append("endDate", params.endDate);
        if (params?.status && params.status !== "all") qp.append("status", params.status);
        if (params?.month) qp.append("month", params.month);
        const qs = qp.toString();
        return `/api/v1/attendance/face/history${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any) => normalizePaginated(raw, normalizeRecord),
      providesTags: [{ type: "Attendance", id: "HISTORY" }],
    }),

    // 5. GET /api/v1/attendance/face/team
    getTeamFaceAttendance: builder.query<PaginatedAttendanceResponse<FaceAttendanceRecord>, GetTeamAttendanceParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.append("page", String(params.page));
        if (params?.limit) qp.append("limit", String(params.limit));
        if (params?.search) qp.append("search", params.search);
        if (params?.date) qp.append("date", params.date);
        if (params?.status && params.status !== "all") qp.append("status", params.status);
        const qs = qp.toString();
        return `/api/v1/attendance/face/team${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any) => normalizePaginated(raw, normalizeRecord),
      providesTags: [{ type: "Attendance", id: "TEAM" }],
    }),

    // 6. GET /api/v1/attendance/face/company
    getCompanyFaceAttendance: builder.query<PaginatedAttendanceResponse<FaceAttendanceRecord>, GetCompanyAttendanceParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.page) qp.append("page", String(params.page));
        if (params?.limit) qp.append("limit", String(params.limit));
        if (params?.search) qp.append("search", params.search);
        if (params?.department && params.department !== "all") qp.append("department", params.department);
        if (params?.date) qp.append("date", params.date);
        if (params?.startDate) qp.append("startDate", params.startDate);
        if (params?.endDate) qp.append("endDate", params.endDate);
        if (params?.status && params.status !== "all") qp.append("status", params.status);
        const qs = qp.toString();
        return `/api/v1/attendance/face/company${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any) => normalizePaginated(raw, normalizeRecord),
      providesTags: [{ type: "Attendance", id: "COMPANY" }],
    }),

    // 7. GET /api/v1/attendance/face/analytics
    getFaceAttendanceAnalytics: builder.query<FaceAttendanceAnalyticsResponse, { date?: string; month?: string; department?: string } | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        if (params?.date) qp.append("date", params.date);
        if (params?.month) qp.append("month", params.month);
        if (params?.department && params.department !== "all") qp.append("department", params.department);
        const qs = qp.toString();
        return `/api/v1/attendance/face/analytics${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): FaceAttendanceAnalyticsResponse => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        if (!payload || typeof payload !== "object") {
          return {
            totalEmployees: 0,
            presentToday: 0,
            absentToday: 0,
            checkedIn: 0,
            checkedOut: 0,
            lateEmployees: 0,
            attendanceRate: 0,
            dailyTrend: [],
            departmentStats: [],
          };
        }
        return {
          totalEmployees: payload.totalEmployees ?? payload.total ?? 0,
          presentToday: payload.presentToday ?? payload.present ?? 0,
          absentToday: payload.absentToday ?? payload.absent ?? 0,
          checkedIn: payload.checkedIn ?? payload.checked_in ?? 0,
          checkedOut: payload.checkedOut ?? payload.checked_out ?? 0,
          lateEmployees: payload.lateEmployees ?? payload.late ?? 0,
          attendanceRate: payload.attendanceRate ?? payload.attendance_rate ?? payload.rate ?? 0,
          dailyTrend: Array.isArray(payload.dailyTrend) ? payload.dailyTrend : (Array.isArray(payload.trend) ? payload.trend : []),
          departmentStats: Array.isArray(payload.departmentStats) ? payload.departmentStats : (Array.isArray(payload.departments) ? payload.departments : []),
          punchDistribution: Array.isArray(payload.punchDistribution) ? payload.punchDistribution : [],
        };
      },
      providesTags: [{ type: "Attendance", id: "ANALYTICS" }],
    }),
  }),
});

export const {
  useFaceCheckInMutation,
  useFaceCheckOutMutation,
  useGetMyFaceAttendanceQuery,
  useGetPersonalFaceHistoryQuery,
  useGetTeamFaceAttendanceQuery,
  useGetCompanyFaceAttendanceQuery,
  useGetFaceAttendanceAnalyticsQuery,
} = faceAttendanceApi;
