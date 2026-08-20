import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeavesBalances: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/leaves/balances',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Leave'],
    }),
    createLeavesApply: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: '/api/v1/leaves/apply',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Leave', 'Attendance'],
    }),
    getLeavesHistory: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/leaves/history',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Leave'],
    }),
    getLeavesPending: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: '/api/v1/leaves/pending',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Leave'],
    }),
    createLeavesLeaveIdReview: builder.mutation<ApiResponse<any>, any>({
      query: (data) => {
        const id = typeof data === 'object' ? (data?.leave_id || data?.leaveId || data?.id) : data;
        return {
          url: `/api/v1/leaves/${id}/review`,
          method: 'POST',
          body: typeof data === 'object' ? data : undefined,
        };
      },
      invalidatesTags: ['Leave', 'Attendance'],
    }),
    getLeavesBalancesEmployeeId: builder.query<ApiResponse<any>, any>({
      query: (params) => {
        const empId = typeof params === 'object' ? (params?.employee_id || params?.employeeId || params?.id) : params;
        return {
          url: `/api/v1/leaves/balances/${empId}`,
          params: typeof params === 'object' ? params : undefined,
        };
      },
      providesTags: ['Leave'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeavesBalancesQuery,
  useCreateLeavesApplyMutation,
  useGetLeavesHistoryQuery,
  useGetLeavesPendingQuery,
  useCreateLeavesLeaveIdReviewMutation,
  useGetLeavesBalancesEmployeeIdQuery,
} = leaveApi;