import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/onboarding/status` : typeof params === 'object' && params?.id ? `/api/v1/onboarding/status` : '/api/v1/onboarding/status',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
    getOnboardingProgress: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/onboarding/progress` : typeof params === 'object' && params?.id ? `/api/v1/onboarding/progress` : '/api/v1/onboarding/progress',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
    createOnboardingCompany: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/company` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/company` : '/api/v1/onboarding/company',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createOnboardingAdminProfile: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/admin-profile` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/admin-profile` : '/api/v1/onboarding/admin-profile',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createOnboardingHrSettings: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/hr-settings` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/hr-settings` : '/api/v1/onboarding/hr-settings',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createOnboardingDepartments: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/departments` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/departments` : '/api/v1/onboarding/departments',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createOnboardingDesignations: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/designations` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/designations` : '/api/v1/onboarding/designations',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createOnboardingInviteEmployees: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/invite-employees` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/invite-employees` : '/api/v1/onboarding/invite-employees',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    createOnboardingComplete: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/complete` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/complete` : '/api/v1/onboarding/complete',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
    getOnboardingValidate: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/onboarding/validate` : typeof params === 'object' && params?.id ? `/api/v1/onboarding/validate` : '/api/v1/onboarding/validate',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
    getOnboardingValidateToken: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/onboarding/validate-token` : typeof params === 'object' && params?.id ? `/api/v1/onboarding/validate-token` : '/api/v1/onboarding/validate-token',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Employee'],
    }),
    createOnboardingActivate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/onboarding/activate` : typeof data === 'object' && data?.id ? `/api/v1/onboarding/activate` : '/api/v1/onboarding/activate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingStatusQuery,
  useGetOnboardingProgressQuery,
  useCreateOnboardingCompanyMutation,
  useCreateOnboardingAdminProfileMutation,
  useCreateOnboardingHrSettingsMutation,
  useCreateOnboardingDepartmentsMutation,
  useCreateOnboardingDesignationsMutation,
  useCreateOnboardingInviteEmployeesMutation,
  useCreateOnboardingCompleteMutation,
  useGetOnboardingValidateQuery,
  useGetOnboardingValidateTokenQuery,
  useCreateOnboardingActivateMutation,
} = onboardingApi;