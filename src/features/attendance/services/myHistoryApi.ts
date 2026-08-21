import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AttendanceTodayState, AttendanceHistoryResponse, HistoryQueryParams } from "../types";

export const myHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatus: builder.query<APIResponse<AttendanceTodayState>, void>({
      query: () => "/api/v1/attendance/face/me",
      providesTags: [{ type: "Attendance", id: "TODAY" }],
    }),
    getMyHistory: builder.query<APIResponse<AttendanceHistoryResponse>, HistoryQueryParams | void>({
      query: (p) => `/api/v1/attendance/face/history?page=${p?.page ?? 1}&limit=${p?.limit ?? 20}`,
      providesTags: [{ type: "Attendance", id: "ME_HISTORY" }],
    }),
  }),
});
export const { useGetTodayStatusQuery, useGetMyHistoryQuery } = myHistoryApi;
