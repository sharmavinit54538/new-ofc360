import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const timesheetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimesheetsWeekly: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/timesheets/weekly` : typeof params === 'object' && params?.id ? `/api/v1/timesheets/weekly` : '/api/v1/timesheets/weekly',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Timesheet'],
    }),
    createTimesheetsWeekly: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/timesheets/weekly` : typeof data === 'object' && data?.id ? `/api/v1/timesheets/weekly` : '/api/v1/timesheets/weekly',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Timesheet'],
    }),
    createTimesheetsWeeklySubmit: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/timesheets/weekly/submit` : typeof data === 'object' && data?.id ? `/api/v1/timesheets/weekly/submit` : '/api/v1/timesheets/weekly/submit',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Timesheet'],
    }),
    getTimesheetsHistory: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/timesheets/history` : typeof params === 'object' && params?.id ? `/api/v1/timesheets/history` : '/api/v1/timesheets/history',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Timesheet'],
    }),
    getTimesheetsPending: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/timesheets/pending` : typeof params === 'object' && params?.id ? `/api/v1/timesheets/pending` : '/api/v1/timesheets/pending',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Timesheet'],
    }),
    createTimesheetsTimesheetIdReview: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/timesheets/${data.timesheet_id/review` : typeof data === 'object' && data?.id ? `/api/v1/timesheets/{timesheet_id}/review` : '/api/v1/timesheets/{timesheet_id}/review',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Timesheet'],
    }),
    createV2ShiftsPlans: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/shifts/plans` : typeof data === 'object' && data?.id ? `/api/v2/shifts/plans` : '/api/v2/shifts/plans',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Timesheet'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTimesheetsWeeklyQuery,
  useCreateTimesheetsWeeklyMutation,
  useCreateTimesheetsWeeklySubmitMutation,
  useGetTimesheetsHistoryQuery,
  useGetTimesheetsPendingQuery,
  useCreateTimesheetsTimesheetIdReviewMutation,
  useCreateV2ShiftsPlansMutation,
} = timesheetsApi;
