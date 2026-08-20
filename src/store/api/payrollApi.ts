import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createV2PayrollRuns: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/payroll/runs` : typeof data === 'object' && data?.id ? `/api/v2/payroll/runs` : '/api/v2/payroll/runs',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
    createV2PayrollRunsRunIdProcess: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/payroll/runs/${data}/process` : typeof data === 'object' && data?.id ? `/api/v2/payroll/runs/{run_id}/process` : '/api/v2/payroll/runs/{run_id}/process',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
    createV2PayrollRunsRunIdApprove: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/payroll/runs/${data}/approve` : typeof data === 'object' && data?.id ? `/api/v2/payroll/runs/{run_id}/approve` : '/api/v2/payroll/runs/{run_id}/approve',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
    createV2PayrollRunsRunIdPay: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/payroll/runs/${data}/pay` : typeof data === 'object' && data?.id ? `/api/v2/payroll/runs/{run_id}/pay` : '/api/v2/payroll/runs/{run_id}/pay',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
    createV2PayrollRunsRunIdAnomalies: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/payroll/runs/${data}/anomalies` : typeof data === 'object' && data?.id ? `/api/v2/payroll/runs/{run_id}/anomalies` : '/api/v2/payroll/runs/{run_id}/anomalies',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
    createV2CompensationBenchmarks: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/compensation/benchmarks` : typeof data === 'object' && data?.id ? `/api/v2/compensation/benchmarks` : '/api/v2/compensation/benchmarks',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
    createV2CompensationRecommendationsEmployeeId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v2/compensation/recommendations/${data}` : typeof data === 'object' && data?.id ? `/api/v2/compensation/recommendations/{employee_id}` : '/api/v2/compensation/recommendations/{employee_id}',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Payroll'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateV2PayrollRunsMutation,
  useCreateV2PayrollRunsRunIdProcessMutation,
  useCreateV2PayrollRunsRunIdApproveMutation,
  useCreateV2PayrollRunsRunIdPayMutation,
  useCreateV2PayrollRunsRunIdAnomaliesMutation,
  useCreateV2CompensationBenchmarksMutation,
  useCreateV2CompensationRecommendationsEmployeeIdMutation,
} = payrollApi;
