import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const pollsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPolls: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/polls` : typeof data === 'object' && data?.id ? `/api/v1/polls` : '/api/v1/polls',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    getPolls: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/polls` : typeof params === 'object' && params?.id ? `/api/v1/polls` : '/api/v1/polls',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    getPollsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/polls/${params.id}` : typeof params === 'object' && params?.id ? `/api/v1/polls/${params.id}` : '/api/v1/polls/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    deletePollsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/polls/${data.id}` : typeof data === 'object' && data?.id ? `/api/v1/polls/${data.id}` : '/api/v1/polls/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    createPollsIdVote: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/polls/${data.id}/vote` : typeof data === 'object' && data?.id ? `/api/v1/polls/${data.id}/vote` : '/api/v1/polls/{id}/vote',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    updatePollsIdClose: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/polls/${data.id}/close` : typeof data === 'object' && data?.id ? `/api/v1/polls/${data.id}/close` : '/api/v1/polls/{id}/close',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePollsMutation,
  useGetPollsQuery,
  useGetPollsIdQuery,
  useDeletePollsIdMutation,
  useCreatePollsIdVoteMutation,
  useUpdatePollsIdCloseMutation,
} = pollsApi;
