import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployees: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees` : typeof data === 'object' && data?.id ? `/api/v1/employees` : '/api/v1/employees',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    getEmployees: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/employees` : typeof params === 'object' && params?.id ? `/api/v1/employees` : '/api/v1/employees',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
    getEmployeesId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/employees/${params}` : typeof params === 'object' && params?.id ? `/api/v1/employees/${params.id}` : '/api/v1/employees/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
    updateEmployeesId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}` : '/api/v1/employees/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    deleteEmployeesId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}` : '/api/v1/employees/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdSendInvitation: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/send-invitation` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/send-invitation` : '/api/v1/employees/{id}/send-invitation',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdSendInvite: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/send-invite` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/send-invite` : '/api/v1/employees/{id}/send-invite',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdDeactivate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/deactivate` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/deactivate` : '/api/v1/employees/{id}/deactivate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdActivateByAdmin: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/activate-by-admin` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/activate-by-admin` : '/api/v1/employees/{id}/activate-by-admin',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdActivate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/activate` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/activate` : '/api/v1/employees/{id}/activate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdApprove: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/approve` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/approve` : '/api/v1/employees/{id}/approve',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdReject: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/reject` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/reject` : '/api/v1/employees/{id}/reject',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployeesIdResetPassword: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/employees/${data}/reset-password` : typeof data === 'object' && data?.id ? `/api/v1/employees/${data.id}/reset-password` : '/api/v1/employees/{id}/reset-password',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    getEmployeesIdOnboardingStatus: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/employees/${params}/onboarding-status` : typeof params === 'object' && params?.id ? `/api/v1/employees/${params.id}/onboarding-status` : '/api/v1/employees/{id}/onboarding-status',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEmployeesMutation,
  useGetEmployeesQuery,
  useGetEmployeesIdQuery,
  useUpdateEmployeesIdMutation,
  useDeleteEmployeesIdMutation,
  useCreateEmployeesIdSendInvitationMutation,
  useCreateEmployeesIdSendInviteMutation,
  useCreateEmployeesIdDeactivateMutation,
  useCreateEmployeesIdActivateByAdminMutation,
  useCreateEmployeesIdActivateMutation,
  useCreateEmployeesIdApproveMutation,
  useCreateEmployeesIdRejectMutation,
  useCreateEmployeesIdResetPasswordMutation,
  useGetEmployeesIdOnboardingStatusQuery,
} = employeeApi;
