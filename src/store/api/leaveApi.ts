import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeavesBalances: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/leaves/balances` : typeof params === 'object' && params?.id ? `/api/v1/leaves/balances` : '/api/v1/leaves/balances',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Leave'],
    }),
    createLeavesApply: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/leaves/apply` : typeof data === 'object' && data?.id ? `/api/v1/leaves/apply` : '/api/v1/leaves/apply',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Leave'],
    }),
    getLeavesHistory: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/leaves/history` : typeof params === 'object' && params?.id ? `/api/v1/leaves/history` : '/api/v1/leaves/history',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Leave'],
    }),
    getLeavesPending: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/leaves/pending` : typeof params === 'object' && params?.id ? `/api/v1/leaves/pending` : '/api/v1/leaves/pending',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Leave'],
    }),
    createLeavesLeaveIdReview: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/leaves/${data.leave_id}/review` : typeof data === 'object' && data?.id ? `/api/v1/leaves/{leave_id}/review` : '/api/v1/leaves/{leave_id}/review',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Leave'],
    }),
    getLeavesBalancesEmployeeId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/leaves/balances/${params.employee_id}` : typeof params === 'object' && params?.id ? `/api/v1/leaves/balances/{employee_id}` : '/api/v1/leaves/balances/{employee_id}',
        params: typeof params === 'object' ? params : undefined,
      }),
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
