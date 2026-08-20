import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const documentIntelligenceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2DocumentIntelligenceUpload: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/upload` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/upload` : '/api/v2/document-intelligence/upload',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceClassify: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/classify` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/classify` : '/api/v2/document-intelligence/classify',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceExtract: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/extract` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/extract` : '/api/v2/document-intelligence/extract',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceAnalyze: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/analyze` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/analyze` : '/api/v2/document-intelligence/analyze',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceCompare: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/compare` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/compare` : '/api/v2/document-intelligence/compare',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceValidate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/validate` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/validate` : '/api/v2/document-intelligence/validate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceSearch: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/search` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/search` : '/api/v2/document-intelligence/search',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    createV2DocumentIntelligenceQuery: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/document-intelligence/query` : typeof data === 'object' && data?.id ? `/api/v2/document-intelligence/query` : '/api/v2/document-intelligence/query',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['DocumentIntelligence'],
    }),
    getV2DocumentIntelligenceInsights: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v2/document-intelligence/insights` : typeof params === 'object' && params?.id ? `/api/v2/document-intelligence/insights` : '/api/v2/document-intelligence/insights',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['DocumentIntelligence'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2DocumentIntelligenceUploadMutation,
  useCreateV2DocumentIntelligenceClassifyMutation,
  useCreateV2DocumentIntelligenceExtractMutation,
  useCreateV2DocumentIntelligenceAnalyzeMutation,
  useCreateV2DocumentIntelligenceCompareMutation,
  useCreateV2DocumentIntelligenceValidateMutation,
  useCreateV2DocumentIntelligenceSearchMutation,
  useCreateV2DocumentIntelligenceQueryMutation,
  useGetV2DocumentIntelligenceInsightsQuery,
} = documentIntelligenceApi;