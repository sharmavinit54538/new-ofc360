import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AttendanceTodayState, AttendanceHistoryResponse, HistoryQueryParams } from "../types";

export const myHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatus: builder.query<APIResponse<AttendanceTodayState>, void>({
      query: () => "/api/v1/attendance/face/me",
      providesTags: [{ type: "Attendance", id: "TODAY" }],
    }),
    getMyHistory: builder.query<APIResponse<AttendanceHistoryResponse>, HistoryQueryParams | void>({
      query: (params) => {
        const qp = new URLSearchParams();
        qp.append("page", String(params?.page ?? 1));
        qp.append("limit", String(params?.limit ?? 20));
        return `/api/v1/attendance/face/history?${qp.toString()}`;
      },
      providesTags: [{ type: "Attendance", id: "ME_HISTORY" }],
    }),
  }),
});
export const { useGetTodayStatusQuery, useGetMyHistoryQuery } = myHistoryApi;
