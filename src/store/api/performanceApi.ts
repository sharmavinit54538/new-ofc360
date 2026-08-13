import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2PerformanceCycles: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/performance/cycles` : typeof data === 'object' && data?.id ? `/api/v2/performance/cycles` : '/api/v2/performance/cycles',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Performance'],
    }),
    createV2PerformanceGoals: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/performance/goals` : typeof data === 'object' && data?.id ? `/api/v2/performance/goals` : '/api/v2/performance/goals',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Performance'],
    }),
    createV2PerformanceReviews: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/performance/reviews` : typeof data === 'object' && data?.id ? `/api/v2/performance/reviews` : '/api/v2/performance/reviews',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Performance'],
    }),
    createV2PerformanceReviewsReviewIdEvaluate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/performance/reviews/${data.review_id/evaluate` : typeof data === 'object' && data?.id ? `/api/v2/performance/reviews/{review_id}/evaluate` : '/api/v2/performance/reviews/{review_id}/evaluate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Performance'],
    }),
    createV2GoalsGenerate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/goals/generate` : typeof data === 'object' && data?.id ? `/api/v2/goals/generate` : '/api/v2/goals/generate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Goal'],
    }),
    createV2GoalsAdjust: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/goals/adjust` : typeof data === 'object' && data?.id ? `/api/v2/goals/adjust` : '/api/v2/goals/adjust',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Goal'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2PerformanceCyclesMutation,
  useCreateV2PerformanceGoalsMutation,
  useCreateV2PerformanceReviewsMutation,
  useCreateV2PerformanceReviewsReviewIdEvaluateMutation,
  useCreateV2GoalsGenerateMutation,
  useCreateV2GoalsAdjustMutation,
} = performanceApi;
