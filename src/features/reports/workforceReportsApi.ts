import { baseApi } from "@/services/api/baseApi";
import { RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  WorkforceDashboardMetrics,
  LeaveAnalytics,
  AttritionPrediction,
  WorkforceForecast,
} from "./types";
import { extractData } from "./unwrapHelper";

export const workforceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExecutiveHrDashboard: builder.query<APIResponse<WorkforceDashboardMetrics>, void>({
      query: () => ({
        url: "/api/v1/hr-analytics/dashboard",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<WorkforceDashboardMetrics> | APIResponse<WorkforceDashboardMetrics> | WorkforceDashboardMetrics) => {
        const data = extractData<WorkforceDashboardMetrics>(raw);
        return {
          success: true,
          message: "Workforce dashboard metrics retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "WorkforceReport", id: "DASHBOARD" }],
    }),

    getLeavesAnalytics: builder.query<APIResponse<LeaveAnalytics>, void>({
      query: () => ({
        url: "/api/v1/hr-analytics/leaves/analytics",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<LeaveAnalytics> | APIResponse<LeaveAnalytics> | LeaveAnalytics) => {
        const data = extractData<LeaveAnalytics>(raw);
        return {
          success: true,
          message: "Leave analytics retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "WorkforceReport", id: "LEAVES_ANALYTICS" }],
    }),

    createSnapshot: builder.mutation<APIResponse<{ snapshot_id: string; created_at: string }>, void>({
      query: () => ({
        url: "/api/v1/hr-analytics/snapshots",
        method: "POST",
      }),
      invalidatesTags: [{ type: "WorkforceReport", id: "DASHBOARD" }],
    }),

    predictAttrition: builder.mutation<APIResponse<AttritionPrediction>, string>({
      query: (employeeId) => ({
        url: `/api/v1/hr-analytics/attrition-prediction/${employeeId}`,
        method: "POST",
      }),
    }),

    generateWorkforceForecast: builder.mutation<
      APIResponse<WorkforceForecast>,
      Record<string, unknown> | void
    >({
      query: (body) => ({
        url: "/api/v1/hr-analytics/forecast",
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