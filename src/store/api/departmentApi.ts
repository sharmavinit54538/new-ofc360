import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDepartments: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments` : typeof data === 'object' && data?.id ? `/api/v1/departments` : '/api/v1/departments',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    getDepartments: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/departments` : typeof params === 'object' && params?.id ? `/api/v1/departments` : '/api/v1/departments',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Department'],
    }),
    getDepartmentsId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/departments/${params.id}` : typeof params === 'object' && params?.id ? `/api/v1/departments/${params.id}` : '/api/v1/departments/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Department'],
    }),
    updateDepartmentsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments/${data.id}` : typeof data === 'object' && data?.id ? `/api/v1/departments/${data.id}` : '/api/v1/departments/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartmentsId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments/${data.id}` : typeof data === 'object' && data?.id ? `/api/v1/departments/${data.id}` : '/api/v1/departments/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    createDepartmentsIdAssignManager: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments/${data.id}/assign-manager` : typeof data === 'object' && data?.id ? `/api/v1/departments/${data.id}/assign-manager` : '/api/v1/departments/{id}/assign-manager',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    createDepartmentsIdAssignEmployees: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments/${data.id}/assign-employees` : typeof data === 'object' && data?.id ? `/api/v1/departments/${data.id}/assign-employees` : '/api/v1/departments/{id}/assign-employees',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartmentsIdRemoveManager: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments/${data.id}/remove-manager` : typeof data === 'object' && data?.id ? `/api/v1/departments/${data.id}/remove-manager` : '/api/v1/departments/{id}/remove-manager',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartmentsIdRemoveEmployeeEmployeeId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/departments/${data.id}/remove-employee/${data.employee_id}` : typeof data === 'object' && data?.id ? `/api/v1/departments/${data.id}/remove-employee/{employee_id}` : '/api/v1/departments/{id}/remove-employee/{employee_id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Department'],
    }),
    getDepartmentsIdEmployees: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/departments/${params.id}/employees` : typeof params === 'object' && params?.id ? `/api/v1/departments/${params.id}/employees` : '/api/v1/departments/{id}/employees',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Department'],
    }),
    getDepartmentsIdManager: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/departments/${params.id}/manager` : typeof params === 'object' && params?.id ? `/api/v1/departments/${params.id}/manager` : '/api/v1/departments/{id}/manager',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Department'],
    }),
    getDepartmentsIdStats: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/departments/${params.id}/stats` : typeof params === 'object' && params?.id ? `/api/v1/departments/${params.id}/stats` : '/api/v1/departments/{id}/stats',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Department'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateDepartmentsMutation,
  useGetDepartmentsQuery,
  useGetDepartmentsIdQuery,
  useUpdateDepartmentsIdMutation,
  useDeleteDepartmentsIdMutation,
  useCreateDepartmentsIdAssignManagerMutation,
  useCreateDepartmentsIdAssignEmployeesMutation,
  useDeleteDepartmentsIdRemoveManagerMutation,
  useDeleteDepartmentsIdRemoveEmployeeEmployeeIdMutation,
  useGetDepartmentsIdEmployeesQuery,
  useGetDepartmentsIdManagerQuery,
  useGetDepartmentsIdStatsQuery,
} = departmentApi;
