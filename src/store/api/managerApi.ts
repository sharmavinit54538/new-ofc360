import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createManagers: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers` : typeof data === 'object' && data?.id ? `/api/v1/managers` : '/api/v1/managers',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    getManagers: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/managers` : typeof params === 'object' && params?.id ? `/api/v1/managers` : '/api/v1/managers',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Manager'],
    }),
    getManagersOnboardingValidate: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/managers/onboarding/validate` : typeof params === 'object' && params?.id ? `/api/v1/managers/onboarding/validate` : '/api/v1/managers/onboarding/validate',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Manager'],
    }),
    createManagersOnboardingActivate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/onboarding/activate` : typeof data === 'object' && data?.id ? `/api/v1/managers/onboarding/activate` : '/api/v1/managers/onboarding/activate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    getManagersProfile: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/managers/profile` : typeof params === 'object' && params?.id ? `/api/v1/managers/profile` : '/api/v1/managers/profile',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Manager'],
    }),
    createManagersSendInvite: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/send-invite` : typeof data === 'object' && data?.id ? `/api/v1/managers/send-invite` : '/api/v1/managers/send-invite',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    getManagersId: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/managers/${paramsid` : typeof params === 'object' && params?.id ? `/api/v1/managers/${params.id}` : '/api/v1/managers/{id}',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['Manager'],
    }),
    updateManagersId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}` : '/api/v1/managers/{id}',
        method: 'PUT',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    deleteManagersId: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}` : '/api/v1/managers/{id}',
        method: 'DELETE',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    createManagersIdSendInvitation: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id/send-invitation` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}/send-invitation` : '/api/v1/managers/{id}/send-invitation',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    createManagersIdActivate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id/activate` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}/activate` : '/api/v1/managers/{id}/activate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    createManagersIdResetPassword: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id/reset-password` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}/reset-password` : '/api/v1/managers/{id}/reset-password',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    createManagersOnboardingComplete: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/onboarding/complete` : typeof data === 'object' && data?.id ? `/api/v1/managers/onboarding/complete` : '/api/v1/managers/onboarding/complete',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    createManagersIdDeactivate: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id/deactivate` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}/deactivate` : '/api/v1/managers/{id}/deactivate',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
    createManagersIdActivateByAdmin: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/managers/${data.id/activate-by-admin` : typeof data === 'object' && data?.id ? `/api/v1/managers/${data.id}/activate-by-admin` : '/api/v1/managers/{id}/activate-by-admin',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['Manager'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateManagersMutation,
  useGetManagersQuery,
  useGetManagersOnboardingValidateQuery,
  useCreateManagersOnboardingActivateMutation,
  useGetManagersProfileQuery,
  useCreateManagersSendInviteMutation,
  useGetManagersIdQuery,
  useUpdateManagersIdMutation,
  useDeleteManagersIdMutation,
  useCreateManagersIdSendInvitationMutation,
  useCreateManagersIdActivateMutation,
  useCreateManagersIdResetPasswordMutation,
  useCreateManagersOnboardingCompleteMutation,
  useCreateManagersIdDeactivateMutation,
  useCreateManagersIdActivateByAdminMutation,
} = managerApi;
