import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  RecruitmentFunnelAnalytics,
  RecruitmentDashboardStats,
  RecruitingNotification,
} from "./types";

export const recruitmentAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruitmentAnalytics: builder.query<
      APIResponse<RecruitmentFunnelAnalytics>,
      void
    >({
      query: () => "/api/v1/recruitment/analytics",
      providesTags: [{ type: "RecruitmentAnalytics", id: "ANALYTICS" }],
    }),

    getRecruitmentDashboardStats: builder.query<
      APIResponse<RecruitmentDashboardStats>,
      void
    >({
      query: () => "/api/v1/recruitment/stats",
      providesTags: [{ type: "RecruitmentAnalytics", id: "STATS" }],
    }),

    getRecruitingNotifications: builder.query<
      APIResponse<RecruitingNotification[]>,
      void
    >({
      query: () => "/api/v1/recruitment/notifications",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "RecruitmentAnalytics" as const,
                id: `NOTIF_${id}`,
              })),
              { type: "RecruitmentAnalytics", id: "NOTIFICATIONS" },
            ]
          : [{ type: "RecruitmentAnalytics", id: "NOTIFICATIONS" }],
    }),

    markNotificationRead: builder.mutation<
      APIResponse<{ success: boolean }>,
      string
    >({
      query: (id) => ({
        url: `/api/v1/recruitment/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "RecruitmentAnalytics", id: "NOTIFICATIONS" },
        { type: "RecruitmentAnalytics", id: `NOTIF_${id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecruitmentAnalyticsQuery,
  useGetRecruitmentDashboardStatsQuery,
  useGetRecruitingNotificationsQuery,
  useMarkNotificationReadMutation,
} = recruitmentAnalyticsApi;
