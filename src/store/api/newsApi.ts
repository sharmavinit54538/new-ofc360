import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNews: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/news` : typeof data === 'object' && data?.id ? `/api/v1/news` : '/api/v1/news',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    getNews: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/news` : typeof params === 'object' && params?.id ? `/api/v1/news` : '/api/v1/news',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    getNewsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/news/${paramsid` : typeof params === 'object' && params?.id ? `/api/v1/news/${params.id}` : '/api/v1/news/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    updateNewsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/news/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/news/${data.id}` : '/api/v1/news/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    deleteNewsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/news/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/news/${data.id}` : '/api/v1/news/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    updateNewsIdPublish: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/news/${data.id/publish` : typeof data === 'object' && data?.id ? `/api/v1/news/${data.id}/publish` : '/api/v1/news/{id}/publish',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateNewsMutation,
  useGetNewsQuery,
  useGetNewsIdQuery,
  useUpdateNewsIdMutation,
  useDeleteNewsIdMutation,
  useUpdateNewsIdPublishMutation,
} = newsApi;
