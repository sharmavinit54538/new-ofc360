import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  WorkforceDashboardMetrics,
  LeaveAnalytics,
  AttritionPrediction,
  WorkforceForecast,
} from "./types";

export const workforceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExecutiveHrDashboard: builder.query<APIResponse<WorkforceDashboardMetrics>, void>({
      query: () => ({
        url: "/v1/hr-analytics/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "WorkforceReport", id: "DASHBOARD" }],
    }),

    getLeavesAnalytics: builder.query<APIResponse<LeaveAnalytics>, void>({
      query: () => ({
        url: "/v1/hr-analytics/leaves/analytics",
        method: "GET",
      }),
      providesTags: [{ type: "WorkforceReport", id: "LEAVES_ANALYTICS" }],
    }),

    createSnapshot: builder.mutation<APIResponse<{ snapshot_id: string; created_at: string }>, void>({
      query: () => ({
        url: "/v1/hr-analytics/snapshots",
        method: "POST",
      }),
      invalidatesTags: [{ type: "WorkforceReport", id: "DASHBOARD" }],
    }),

    predictAttrition: builder.mutation<APIResponse<AttritionPrediction>, string>({
      query: (employeeId) => ({
        url: `/v1/hr-analytics/attrition-prediction/${employeeId}`,
        method: "POST",
      }),
    }),

    generateWorkforceForecast: builder.mutation<
      APIResponse<WorkforceForecast>,
      Record<string, any> | void
    >({
      query: (body) => ({
        url: "/v1/hr-analytics/forecast",
        method: "POST",
        body: body || {},
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExecutiveHrDashboardQuery,
  useGetLeavesAnalyticsQuery,
  useCreateSnapshotMutation,
  usePredictAttritionMutation,
  useGenerateWorkforceForecastMutation,
} = workforceReportsApi;

// Re-exported core analytics hooks so Workforce tab component can import everything from workforceReportsApi
export {
  useGetHeadcountAnalyticsQuery,
  useGetDepartmentAnalyticsQuery,
  useGetTenureAnalyticsQuery,
} from "./reportsCoreApi";
