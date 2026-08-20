import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExportsEmployees: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/employees` : typeof params === 'object' && params?.id ? `/api/v1/exports/employees` : '/api/v1/exports/employees',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
    getExportsDepartments: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/departments` : typeof params === 'object' && params?.id ? `/api/v1/exports/departments` : '/api/v1/exports/departments',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
    getExportsManagers: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/managers` : typeof params === 'object' && params?.id ? `/api/v1/exports/managers` : '/api/v1/exports/managers',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
    getExportsAttendance: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/attendance` : typeof params === 'object' && params?.id ? `/api/v1/exports/attendance` : '/api/v1/exports/attendance',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
    getExportsLeaves: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/leaves` : typeof params === 'object' && params?.id ? `/api/v1/exports/leaves` : '/api/v1/exports/leaves',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
    getExportsPayroll: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/payroll` : typeof params === 'object' && params?.id ? `/api/v1/exports/payroll` : '/api/v1/exports/payroll',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
    getExportsPerformance: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/exports/performance` : typeof params === 'object' && params?.id ? `/api/v1/exports/performance` : '/api/v1/exports/performance',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Report'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExportsEmployeesQuery,
  useLazyGetExportsEmployeesQuery,
  useGetExportsDepartmentsQuery,
  useLazyGetExportsDepartmentsQuery,
  useGetExportsManagersQuery,
  useLazyGetExportsManagersQuery,
  useGetExportsAttendanceQuery,
  useLazyGetExportsAttendanceQuery,
  useGetExportsLeavesQuery,
  useLazyGetExportsLeavesQuery,
  useGetExportsPayrollQuery,
  useLazyGetExportsPayrollQuery,
  useGetExportsPerformanceQuery,
  useLazyGetExportsPerformanceQuery,
} = reportsApi;

// Re-export specific feature API hooks for full compatibility
export * from '@/features/reports/engagementReportsApi';
export * from '@/features/reports/cultureReportsApi';
export * from '@/features/reports/performanceReportsApi';
export * from '@/features/reports/complianceReportsApi';
export * from '@/features/reports/workforceReportsApi';
export * from '@/features/reports/reportsCoreApi';