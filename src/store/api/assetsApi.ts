import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/assets` : typeof params === 'object' && params?.id ? `/api/v1/assets` : '/api/v1/assets',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Asset'],
    }),
    createAssets: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets` : typeof data === 'object' && data?.id ? `/api/v1/assets` : '/api/v1/assets',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    getAssetsAnalytics: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/assets/analytics` : typeof params === 'object' && params?.id ? `/api/v1/assets/analytics` : '/api/v1/assets/analytics',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Asset'],
    }),
    getAssetsFilterOptions: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/assets/filter-options` : typeof params === 'object' && params?.id ? `/api/v1/assets/filter-options` : '/api/v1/assets/filter-options',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Asset'],
    }),
    getAssetsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/assets/${paramsid` : typeof params === 'object' && params?.id ? `/api/v1/assets/${params.id}` : '/api/v1/assets/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Asset'],
    }),
    updateAssetsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}` : '/api/v1/assets/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    deleteAssetsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}` : '/api/v1/assets/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    createAssetsIdAssign: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id/assign` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}/assign` : '/api/v1/assets/{id}/assign',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    createAssetsIdReturn: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id/return` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}/return` : '/api/v1/assets/{id}/return',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    createAssetsIdTransfer: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id/transfer` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}/transfer` : '/api/v1/assets/{id}/transfer',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    createAssetsIdLost: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id/lost` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}/lost` : '/api/v1/assets/{id}/lost',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    createAssetsIdRetired: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id/retired` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}/retired` : '/api/v1/assets/{id}/retired',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
    createAssetsIdMaintenance: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/assets/${data.id/maintenance` : typeof data === 'object' && data?.id ? `/api/v1/assets/${data.id}/maintenance` : '/api/v1/assets/{id}/maintenance',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Asset'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssetsQuery,
  useCreateAssetsMutation,
  useGetAssetsAnalyticsQuery,
  useGetAssetsFilterOptionsQuery,
  useGetAssetsIdQuery,
  useUpdateAssetsIdMutation,
  useDeleteAssetsIdMutation,
  useCreateAssetsIdAssignMutation,
  useCreateAssetsIdReturnMutation,
  useCreateAssetsIdTransferMutation,
  useCreateAssetsIdLostMutation,
  useCreateAssetsIdRetiredMutation,
  useCreateAssetsIdMaintenanceMutation,
} = assetsApi;
