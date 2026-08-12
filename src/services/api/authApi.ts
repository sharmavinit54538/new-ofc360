import { baseApi } from "./baseApi";
import { AuthUser } from "@/features/auth/authTypes";

export interface LoginRequest {
  email: string;
  password?: string;
  role?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  first_name?: string;
  last_name?: string;
  name?: string;
  full_name?: string;
  email: string;
  password?: string;
  company_name?: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (data) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/api/v1/auth/me",
      providesTags: ["Auth", "User"],
    }),

    refreshSession: builder.mutation<{ token: string; refreshToken?: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        body,
      }),
    }),

    verifyEmail: builder.mutation<{ success: boolean; message: string }, { email: string; otp: string }>({
      query: (body) => ({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    resendOtp: builder.mutation<{ success: boolean; message: string }, { email: string }>({
      query: (body) => ({
        url: "/api/v1/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    verifyResetOtp: builder.mutation<{ success: boolean; message: string }, { email: string; otp: string }>({
      query: (body) => ({
        url: "/api/v1/auth/verify-reset-otp",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<{ success: boolean; message: string }, { oldPassword?: string; newPassword?: string }>({
      query: (body) => ({
        url: "/api/v1/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useRefreshSessionMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
