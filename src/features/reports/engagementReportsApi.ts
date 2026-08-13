/**
 * TODO: backend not implemented — replace when /engagement or /enps endpoints ship
 * 
 * Note: This slice currently uses RTK Query `queryFn` to return typed static mock data
 * enclosed within the standard APIResponse<T> structure.
 * When real endpoints are available, swap `queryFn: async () => ({ data: ... })` 
 * to standard `query: () => ({ url: '/v1/engagement/...', method: 'GET' })`.
 */

import { baseApi } from "@/services/api/baseApi";
import { APIResponse, EngagementSummary, EnpsTrendItem } from "./types";

const MOCK_ENGAGEMENT_SUMMARY: EngagementSummary = {
  enpsScore: 42,
  responseRate: 88.5,
  promoters: 58,
  passives: 26,
  detractors: 16,
  trend: [
    { month: "Jan 2026", score: 32 },
    { month: "Feb 2026", score: 35 },
    { month: "Mar 2026", score: 38 },
    { month: "Apr 2026", score: 40 },
    { month: "May 2026", score: 42 },
  ],
};

const MOCK_ENPS_TREND: EnpsTrendItem[] = [
  { month: "Jan 2026", score: 32, responses: 142 },
  { month: "Feb 2026", score: 35, responses: 156 },
  { month: "Mar 2026", score: 38, responses: 168 },
  { month: "Apr 2026", score: 40, responses: 175 },
  { month: "May 2026", score: 42, responses: 188 },
];

export const engagementReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEngagementSummary: builder.query<APIResponse<EngagementSummary>, void>({
      // TODO: backend not implemented — replace when /engagement or /enps endpoints ship
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Engagement summary retrieved (Mocked Data)",
            data: MOCK_ENGAGEMENT_SUMMARY,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "EngagementReport", id: "SUMMARY" }],
    }),

    getEnpsTrend: builder.query<APIResponse<EnpsTrendItem[]>, void>({
      // TODO: backend not implemented — replace when /engagement or /enps endpoints ship
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "eNPS trend retrieved (Mocked Data)",
            data: MOCK_ENPS_TREND,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "EngagementReport", id: "TREND" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetEngagementSummaryQuery, useGetEnpsTrendQuery } = engagementReportsApi;
