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

interface RawAuthEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

interface RawLoginData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user: AuthUser;
}

const unwrapLoginResponse = (raw: RawAuthEnvelope<RawLoginData>): LoginResponse => {
  const data = raw?.data || (raw as unknown as RawLoginData);
  const u = data?.user;
  const computedName =
    u?.name?.trim() ||
    u?.full_name?.trim() ||
    (u?.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : "") ||
    (u?.email ? u.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");
  const normalizedUser = u ? { ...u, name: computedName || u.name || "User" } : u;
  return {
    user: normalizedUser,
    token: data.access_token || (data as any).token || "",
    refreshToken: data.refresh_token || (data as any).refreshToken,
  };
};

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
      transformResponse: (raw: RawAuthEnvelope<RawLoginData>) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth", "User"],
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (data) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (raw: RawAuthEnvelope<RawLoginData>) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth"],
    }),

    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/api/v1/auth/me",
      transformResponse: (raw: RawAuthEnvelope<AuthUser>) =>
        raw?.data || (raw as unknown as AuthUser),
      providesTags: ["Auth", "User"],
    }),

    refreshSession: builder.mutation<{ token: string; refreshToken?: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawAuthEnvelope<RawLoginData>) => ({
        token: raw.data ? raw.data.access_token : (raw as any).token || "",
        refreshToken: raw.data ? raw.data.refresh_token : (raw as any).refreshToken,
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

    logoutSession: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      transformResponse: (raw: RawAuthEnvelope<null> | void) => {
        if (raw && typeof raw === "object" && "success" in raw) {
          return { success: raw.success, message: raw.message || "Logged out" };
        }
        return { success: true, message: "Logged out" };
      },
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useRefreshSessionMutation,
  useLogoutSessionMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
