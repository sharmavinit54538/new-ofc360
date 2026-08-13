import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const learningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2SkillGapAnalyze: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/skill-gap/analyze` : typeof data === 'object' && data?.id ? `/api/v2/skill-gap/analyze` : '/api/v2/skill-gap/analyze',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Learning'],
    }),
    createV2CareerPathPredict: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/career-path/predict` : typeof data === 'object' && data?.id ? `/api/v2/career-path/predict` : '/api/v2/career-path/predict',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Learning'],
    }),
    createV2LearningRecommend: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/learning/recommend` : typeof data === 'object' && data?.id ? `/api/v2/learning/recommend` : '/api/v2/learning/recommend',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Learning'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2SkillGapAnalyzeMutation,
  useCreateV2CareerPathPredictMutation,
  useCreateV2LearningRecommendMutation,
} = learningApi;
