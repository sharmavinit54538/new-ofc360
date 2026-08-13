import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEvents: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/events` : typeof data === 'object' && data?.id ? `/api/v1/events` : '/api/v1/events',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    getEvents: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/events` : typeof params === 'object' && params?.id ? `/api/v1/events` : '/api/v1/events',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    getEventsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/events/${paramsid` : typeof params === 'object' && params?.id ? `/api/v1/events/${params.id}` : '/api/v1/events/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    updateEventsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/events/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/events/${data.id}` : '/api/v1/events/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    deleteEventsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/events/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/events/${data.id}` : '/api/v1/events/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEventsIdPublish: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/events/${data.id/publish` : typeof data === 'object' && data?.id ? `/api/v1/events/${data.id}/publish` : '/api/v1/events/{id}/publish',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEventsIdCancel: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/events/${data.id/cancel` : typeof data === 'object' && data?.id ? `/api/v1/events/${data.id}/cancel` : '/api/v1/events/{id}/cancel',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    createEventsIdRegister: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/events/${data.id/register` : typeof data === 'object' && data?.id ? `/api/v1/events/${data.id}/register` : '/api/v1/events/{id}/register',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEventsMutation,
  useGetEventsQuery,
  useGetEventsIdQuery,
  useUpdateEventsIdMutation,
  useDeleteEventsIdMutation,
  useUpdateEventsIdPublishMutation,
  useUpdateEventsIdCancelMutation,
  useCreateEventsIdRegisterMutation,
} = eventsApi;
