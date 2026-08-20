import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const productivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2ProductivityLogs: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/productivity/logs` : typeof data === 'object' && data?.id ? `/api/v2/productivity/logs` : '/api/v2/productivity/logs',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Productivity'],
    }),
    createV2ProductivityForecastEmployeeId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/productivity/forecast/${data}` : typeof data === 'object' && data?.id ? `/api/v2/productivity/forecast/{employee_id}` : '/api/v2/productivity/forecast/{employee_id}',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Productivity'],
    }),
    createV2WorkforceForecast: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/workforce/forecast` : typeof data === 'object' && data?.id ? `/api/v2/workforce/forecast` : '/api/v2/workforce/forecast',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Productivity'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2ProductivityLogsMutation,
  useCreateV2ProductivityForecastEmployeeIdMutation,
  useCreateV2WorkforceForecastMutation,
} = productivityApi;
