import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const aiInsightsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2MoodDetect: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/mood/detect` : typeof data === 'object' && data?.id ? `/api/v2/mood/detect` : '/api/v2/mood/detect',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
    createV2RiskAssess: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/risk/assess` : typeof data === 'object' && data?.id ? `/api/v2/risk/assess` : '/api/v2/risk/assess',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['AI'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2MoodDetectMutation,
  useCreateV2RiskAssessMutation,
} = aiInsightsApi;