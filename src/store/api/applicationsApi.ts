import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApplicationsStats: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/applications/stats` : typeof params === 'object' && params?.id ? `/api/v1/applications/stats` : '/api/v1/applications/stats',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Application'],
    }),
    getApplications: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/applications` : typeof params === 'object' && params?.id ? `/api/v1/applications` : '/api/v1/applications',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Application'],
    }),
    getApplicationsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/applications/${paramsid` : typeof params === 'object' && params?.id ? `/api/v1/applications/${params.id}` : '/api/v1/applications/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Application'],
    }),
    updateApplicationsIdShortlist: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data.id/shortlist` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/shortlist` : '/api/v1/applications/{id}/shortlist',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Application'],
    }),
    updateApplicationsIdReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data.id/reject` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/reject` : '/api/v1/applications/{id}/reject',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Application'],
    }),
    updateApplicationsIdHold: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data.id/hold` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/hold` : '/api/v1/applications/{id}/hold',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Application'],
    }),
    updateApplicationsIdStage: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/${data.id/stage` : typeof data === 'object' && data?.id ? `/api/v1/applications/${data.id}/stage` : '/api/v1/applications/{id}/stage',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Application'],
    }),
    createApplicationsBulkMove: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/bulk-move` : typeof data === 'object' && data?.id ? `/api/v1/applications/bulk-move` : '/api/v1/applications/bulk-move',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Application'],
    }),
    createApplicationsBulkTag: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/applications/bulk-tag` : typeof data === 'object' && data?.id ? `/api/v1/applications/bulk-tag` : '/api/v1/applications/bulk-tag',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Application'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetApplicationsStatsQuery,
  useGetApplicationsQuery,
  useGetApplicationsIdQuery,
  useUpdateApplicationsIdShortlistMutation,
  useUpdateApplicationsIdRejectMutation,
  useUpdateApplicationsIdHoldMutation,
  useUpdateApplicationsIdStageMutation,
  useCreateApplicationsBulkMoveMutation,
  useCreateApplicationsBulkTagMutation,
} = applicationsApi;
