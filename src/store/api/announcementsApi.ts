import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAnnouncements: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/announcements` : typeof data === 'object' && data?.id ? `/api/v1/announcements` : '/api/v1/announcements',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    getAnnouncements: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/announcements` : typeof params === 'object' && params?.id ? `/api/v1/announcements` : '/api/v1/announcements',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    getAnnouncementsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/announcements/${paramsid` : typeof params === 'object' && params?.id ? `/api/v1/announcements/${params.id}` : '/api/v1/announcements/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Event'],
    }),
    updateAnnouncementsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/announcements/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/announcements/${data.id}` : '/api/v1/announcements/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    deleteAnnouncementsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/announcements/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/announcements/${data.id}` : '/api/v1/announcements/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    updateAnnouncementsIdPublish: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/announcements/${data.id/publish` : typeof data === 'object' && data?.id ? `/api/v1/announcements/${data.id}/publish` : '/api/v1/announcements/{id}/publish',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
    updateAnnouncementsIdArchive: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/announcements/${data.id/archive` : typeof data === 'object' && data?.id ? `/api/v1/announcements/${data.id}/archive` : '/api/v1/announcements/{id}/archive',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Event'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAnnouncementsMutation,
  useGetAnnouncementsQuery,
  useGetAnnouncementsIdQuery,
  useUpdateAnnouncementsIdMutation,
  useDeleteAnnouncementsIdMutation,
  useUpdateAnnouncementsIdPublishMutation,
  useUpdateAnnouncementsIdArchiveMutation,
} = announcementsApi;
