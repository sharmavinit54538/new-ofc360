import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AbsencePatternData, OvertimeData, ShiftViolationsData } from "../types";

export const aiInsightsApiPart2 = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbsencePatterns: builder.query<APIResponse<AbsencePatternData>, void>({
      query: () => "/api/v1/ai/attendance/absence-pattern",
      providesTags: ["AttendanceAnalytics"],
    }),
    getOvertime: builder.query<APIResponse<OvertimeData>, void>({
      query: () => "/api/v1/ai/attendance/overtime",
      providesTags: ["AttendanceAnalytics"],
    }),
    getShiftViolations: builder.query<APIResponse<ShiftViolationsData>, void>({
      query: () => "/api/v1/ai/attendance/shift-violations",
      providesTags: ["AttendanceAnalytics"],
    }),
  }),
});
export const { useGetAbsencePatternsQuery, useGetOvertimeQuery, useGetShiftViolationsQuery } = aiInsightsApiPart2;
