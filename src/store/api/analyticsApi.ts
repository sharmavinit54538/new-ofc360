import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInternalDashboard: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/internal/dashboard` : typeof params === 'object' && params?.id ? `/api/v1/internal/dashboard` : '/api/v1/internal/dashboard',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Analytics'],
    }),
    getV2HrAnalyticsDashboard: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v2/hr-analytics/dashboard` : typeof params === 'object' && params?.id ? `/api/v2/hr-analytics/dashboard` : '/api/v2/hr-analytics/dashboard',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Analytics'],
    }),
    createV2HrAnalyticsSnapshots: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/hr-analytics/snapshots` : typeof data === 'object' && data?.id ? `/api/v2/hr-analytics/snapshots` : '/api/v2/hr-analytics/snapshots',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Analytics'],
    }),
    createV2HrAnalyticsAttritionPredictionEmployeeId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/hr-analytics/attrition-prediction/${data.employee_id}` : typeof data === 'object' && data?.id ? `/api/v2/hr-analytics/attrition-prediction/{employee_id}` : '/api/v2/hr-analytics/attrition-prediction/{employee_id}',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Analytics'],
    }),
    createV2HrAnalyticsForecast: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/hr-analytics/forecast` : typeof data === 'object' && data?.id ? `/api/v2/hr-analytics/forecast` : '/api/v2/hr-analytics/forecast',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Analytics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInternalDashboardQuery,
  useGetV2HrAnalyticsDashboardQuery,
  useCreateV2HrAnalyticsSnapshotsMutation,
  useCreateV2HrAnalyticsAttritionPredictionEmployeeIdMutation,
  useCreateV2HrAnalyticsForecastMutation,
} = analyticsApi;
