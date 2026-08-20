import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const exitsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExitsResign: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/resign` : typeof data === 'object' && data?.id ? `/api/v1/exits/resign` : '/api/v1/exits/resign',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    getExitsMyRequest: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exits/my-request` : typeof params === 'object' && params?.id ? `/api/v1/exits/my-request` : '/api/v1/exits/my-request',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Exit'],
    }),
    deleteExitsMyRequest: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/my-request` : typeof data === 'object' && data?.id ? `/api/v1/exits/my-request` : '/api/v1/exits/my-request',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    getExitsStats: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exits/stats` : typeof params === 'object' && params?.id ? `/api/v1/exits/stats` : '/api/v1/exits/stats',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Exit'],
    }),
    getExits: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exits` : typeof params === 'object' && params?.id ? `/api/v1/exits` : '/api/v1/exits',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Exit'],
    }),
    getExitsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exits/${params.id}` : typeof params === 'object' && params?.id ? `/api/v1/exits/${params.id}` : '/api/v1/exits/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Exit'],
    }),
    updateExitsIdApprove: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/approve` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/approve` : '/api/v1/exits/{id}/approve',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/reject` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/reject` : '/api/v1/exits/{id}/reject',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdStartNoticePeriod: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/start-notice-period` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/start-notice-period` : '/api/v1/exits/{id}/start-notice-period',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdComplete: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/complete` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/complete` : '/api/v1/exits/{id}/complete',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdManagerApprove: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/manager-approve` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/manager-approve` : '/api/v1/exits/{id}/manager-approve',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdManagerReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/manager-reject` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/manager-reject` : '/api/v1/exits/{id}/manager-reject',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdKnowledgeTransferComplete: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/knowledge-transfer-complete` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/knowledge-transfer-complete` : '/api/v1/exits/{id}/knowledge-transfer-complete',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    getExitsIdAssets: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exits/${params.id}/assets` : typeof params === 'object' && params?.id ? `/api/v1/exits/${params.id}/assets` : '/api/v1/exits/{id}/assets',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Exit'],
    }),
    updateExitsIdAssetReturn: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/asset-return` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/asset-return` : '/api/v1/exits/{id}/asset-return',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdClearance: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/clearance` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/clearance` : '/api/v1/exits/{id}/clearance',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    createExitsIdExitInterview: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/exit-interview` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/exit-interview` : '/api/v1/exits/{id}/exit-interview',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    updateExitsIdFnf: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/fnf` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/fnf` : '/api/v1/exits/{id}/fnf',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
    getExitsIdDocuments: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exits/${params.id}/documents` : typeof params === 'object' && params?.id ? `/api/v1/exits/${params.id}/documents` : '/api/v1/exits/{id}/documents',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Exit'],
    }),
    createExitsIdGenerateDocuments: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/exits/${data.id}/generate-documents` : typeof data === 'object' && data?.id ? `/api/v1/exits/${data.id}/generate-documents` : '/api/v1/exits/{id}/generate-documents',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Exit'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateExitsResignMutation,
  useGetExitsMyRequestQuery,
  useDeleteExitsMyRequestMutation,
  useGetExitsStatsQuery,
  useGetExitsQuery,
  useGetExitsIdQuery,
  useUpdateExitsIdApproveMutation,
  useUpdateExitsIdRejectMutation,
  useUpdateExitsIdStartNoticePeriodMutation,
  useUpdateExitsIdCompleteMutation,
  useUpdateExitsIdManagerApproveMutation,
  useUpdateExitsIdManagerRejectMutation,
  useUpdateExitsIdKnowledgeTransferCompleteMutation,
  useGetExitsIdAssetsQuery,
  useUpdateExitsIdAssetReturnMutation,
  useUpdateExitsIdClearanceMutation,
  useCreateExitsIdExitInterviewMutation,
  useUpdateExitsIdFnfMutation,
  useGetExitsIdDocumentsQuery,
  useCreateExitsIdGenerateDocumentsMutation,
} = exitsApi;
