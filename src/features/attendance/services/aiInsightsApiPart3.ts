import { baseApi } from "@/services/api/baseApi";
import type { APIResponse, AttendanceHealthScore, AbsenteeWatchlist } from "../types";

export const aiInsightsApiPart3 = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealthScore: builder.query<APIResponse<AttendanceHealthScore>, void>({
      query: () => "/api/v1/ai/attendance/health-score",
      providesTags: ["AttendanceAnalytics"],
    }),
    getWatchlist: builder.query<APIResponse<AbsenteeWatchlist>, void>({
      query: () => "/api/v1/ai/attendance/watchlist",
      providesTags: ["AttendanceAnalytics"],
    }),
  }),
});
export const { useGetHealthScoreQuery, useGetWatchlistQuery } = aiInsightsApiPart3;
