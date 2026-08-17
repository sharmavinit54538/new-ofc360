import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCalendarEvents: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: '/api/v1/calendar/events',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Calendar'],
    }),
    getCalendarEvents: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/calendar/events',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Calendar'],
    }),
    getCalendarEventsId: builder.query<ApiResponse<any>, any>({
      query: (params) => {
        const id = typeof params === 'object' ? (params?.id || params?.eventId) : params;
        return {
          url: `/api/v1/calendar/events/${id}`,
        };
      },
      providesTags: ['Calendar'],
    }),
    updateCalendarEventsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.id || data?.eventId) : data;
        return {
          url: `/api/v1/calendar/events/${id}`,
          method: 'PUT',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Calendar'],
    }),
    deleteCalendarEventsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.id || data?.eventId) : data;
        return {
          url: `/api/v1/calendar/events/${id}`,
          method: 'DELETE',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Calendar'],
    }),
    createCalendarHolidays: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: '/api/v1/calendar/holidays',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Calendar'],
    }),
    getCalendarHolidays: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/calendar/holidays',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Calendar'],
    }),
    updateCalendarHolidaysId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.id || data?.holidayId) : data;
        return {
          url: `/api/v1/calendar/holidays/${id}`,
          method: 'PUT',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Calendar'],
    }),
    deleteCalendarHolidaysId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.id || data?.holidayId) : data;
        return {
          url: `/api/v1/calendar/holidays/${id}`,
          method: 'DELETE',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Calendar'],
    }),
    createCalendarMeetings: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: '/api/v1/calendar/meetings',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Calendar'],
    }),
    getCalendarMeetings: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/calendar/meetings',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Calendar'],
    }),
    getCalendarMeetingsId: builder.query<ApiResponse<any>, any>({
      query: (params) => {
        const id = typeof params === 'object' ? (params?.id || params?.meetingId) : params;
        return {
          url: `/api/v1/calendar/meetings/${id}`,
        };
      },
      providesTags: ['Calendar'],
    }),
    updateCalendarMeetingsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.id || data?.meetingId) : data;
        return {
          url: `/api/v1/calendar/meetings/${id}`,
          method: 'PUT',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Calendar'],
    }),
    deleteCalendarMeetingsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.id || data?.meetingId) : data;
        return {
          url: `/api/v1/calendar/meetings/${id}`,
          method: 'DELETE',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Calendar'],
    }),
    getCalendarBirthdays: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/calendar/birthdays',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Calendar'],
    }),
    getCalendarAnniversaries: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/calendar/anniversaries',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Calendar'],
    }),
    getCalendarDashboard: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/calendar/dashboard',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Calendar'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCalendarEventsMutation,
  useGetCalendarEventsQuery,
  useGetCalendarEventsIdQuery,
  useUpdateCalendarEventsIdMutation,
  useDeleteCalendarEventsIdMutation,
  useCreateCalendarHolidaysMutation,
  useGetCalendarHolidaysQuery,
  useUpdateCalendarHolidaysIdMutation,
  useDeleteCalendarHolidaysIdMutation,
  useCreateCalendarMeetingsMutation,
  useGetCalendarMeetingsQuery,
  useGetCalendarMeetingsIdQuery,
  useUpdateCalendarMeetingsIdMutation,
  useDeleteCalendarMeetingsIdMutation,
  useGetCalendarBirthdaysQuery,
  useGetCalendarAnniversariesQuery,
  useGetCalendarDashboardQuery,
} = calendarApi;
