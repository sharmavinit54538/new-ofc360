import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AttendanceHistoryResponse, HistoryQueryParams, CompanyHistoryQueryParams } from "../types";

export const teamCompanyHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamHistory: builder.query<APIResponse<AttendanceHistoryResponse>, HistoryQueryParams | void>({
      query: (p) => `/api/v1/attendance/face/team?page=${p?.page ?? 1}&limit=${p?.limit ?? 20}`,
      providesTags: [{ type: "Attendance", id: "TEAM" }],
    }),
    getCompanyHistory: builder.query<APIResponse<AttendanceHistoryResponse>, CompanyHistoryQueryParams | void>({
      query: (p) => `/api/v1/attendance/face/company?branch=${p?.branch || ""}&department=${p?.department || ""}&page=${p?.page ?? 1}&limit=${p?.limit ?? 20}`,
      providesTags: [{ type: "Attendance", id: "COMPANY" }],
    }),
  }),
});
export const { useGetTeamHistoryQuery, useGetCompanyHistoryQuery } = teamCompanyHistoryApi;
