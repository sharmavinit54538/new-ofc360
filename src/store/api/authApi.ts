import { baseApi } from './baseApi';
import { ApiResponse } from '@/types/api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAuthRegister: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/register` : typeof data === 'object' && data?.id ? `/api/v1/auth/register` : '/api/v1/auth/register',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthVerifyEmail: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/verify-email` : typeof data === 'object' && data?.id ? `/api/v1/auth/verify-email` : '/api/v1/auth/verify-email',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthResendOtp: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/resend-otp` : typeof data === 'object' && data?.id ? `/api/v1/auth/resend-otp` : '/api/v1/auth/resend-otp',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthLogin: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/login` : typeof data === 'object' && data?.id ? `/api/v1/auth/login` : '/api/v1/auth/login',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthRefreshToken: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/refresh-token` : typeof data === 'object' && data?.id ? `/api/v1/auth/refresh-token` : '/api/v1/auth/refresh-token',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthRefresh: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/refresh` : typeof data === 'object' && data?.id ? `/api/v1/auth/refresh` : '/api/v1/auth/refresh',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthLogout: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/logout` : typeof data === 'object' && data?.id ? `/api/v1/auth/logout` : '/api/v1/auth/logout',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthForgotPassword: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/forgot-password` : typeof data === 'object' && data?.id ? `/api/v1/auth/forgot-password` : '/api/v1/auth/forgot-password',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthResetPassword: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/reset-password` : typeof data === 'object' && data?.id ? `/api/v1/auth/reset-password` : '/api/v1/auth/reset-password',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    getAuthMe: builder.query<ApiResponse<any>, any>({
      query: (params) => ({
        url: typeof params === 'string' || typeof params === 'number' ? `/api/v1/auth/me` : typeof params === 'object' && params?.id ? `/api/v1/auth/me` : '/api/v1/auth/me',
        params: typeof params === 'object' ? params : undefined,
      }),
      providesTags: ['User'],
    }),
    updateAuthChangePassword: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/change-password` : typeof data === 'object' && data?.id ? `/api/v1/auth/change-password` : '/api/v1/auth/change-password',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    updateAuthChangeEmail: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/change-email` : typeof data === 'object' && data?.id ? `/api/v1/auth/change-email` : '/api/v1/auth/change-email',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    createAuthVerifyNewEmail: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/verify-new-email` : typeof data === 'object' && data?.id ? `/api/v1/auth/verify-new-email` : '/api/v1/auth/verify-new-email',
        method: 'POST',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
    updateAuthChangePhone: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: typeof data === 'string' || typeof data === 'number' ? `/api/v1/auth/change-phone` : typeof data === 'object' && data?.id ? `/api/v1/auth/change-phone` : '/api/v1/auth/change-phone',
        method: 'PATCH',
        body: typeof data === 'object' ? data : undefined,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateAuthRegisterMutation,
  useCreateAuthVerifyEmailMutation,
  useCreateAuthResendOtpMutation,
  useCreateAuthLoginMutation,
  useCreateAuthRefreshTokenMutation,
  useCreateAuthRefreshMutation,
  useCreateAuthLogoutMutation,
  useCreateAuthForgotPasswordMutation,
  useCreateAuthResetPasswordMutation,
  useGetAuthMeQuery,
  useUpdateAuthChangePasswordMutation,
  useUpdateAuthChangeEmailMutation,
  useCreateAuthVerifyNewEmailMutation,
  useUpdateAuthChangePhoneMutation,
} = authApi;
