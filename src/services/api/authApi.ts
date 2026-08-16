import { baseApi } from "./baseApi";
import { AuthUser, normalizeRole } from "@/features/auth/authTypes";
import { RawEnvelope } from "./envelope";

export interface LoginRequest {
  identifier: string;
  password?: string;
  role?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

export interface RawLoginData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
}

export const unwrapLoginResponse = (raw: RawEnvelope<RawLoginData> | RawLoginData): LoginResponse => {
  const data = (raw as RawEnvelope<RawLoginData>)?.data || (raw as RawLoginData);
  const u = data?.user;
  const computedName =
    u?.name?.trim() ||
    u?.full_name?.trim() ||
    (u?.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : "") ||
    (u?.email ? u.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "User");

  const normalizedRole = normalizeRole(u?.role);
  const normalizedUser: AuthUser = u
    ? {
        ...u,
        name: computedName,
        role: normalizedRole,
        companyId: u.companyId || (u as any).company_id,
      }
    : {
        id: "usr_me",
        name: computedName,
        email: "",
        role: "employee",
      };

  return {
    user: normalizedUser,
    token: data?.access_token || data?.token || "",
    refreshToken: data?.refresh_token || data?.refreshToken,
  };
};

export interface RegisterRequest {
  first_name?: string;
  last_name?: string;
  name?: string;
  full_name?: string;
  identifier: string;
  phone?: string;
  password?: string;
  company_name?: string;
  role?: string;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface VerifyResetOtpRequest {
  identifier: string;
  otp: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  otp: string;
  newPassword?: string;
  new_password?: string;
  confirmPassword?: string;
  confirm_password?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  old_password?: string;
  newPassword?: string;
  new_password?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (raw: RawEnvelope<RawLoginData> | RawLoginData) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth", "User"],
    }),

    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (data) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (raw: RawEnvelope<RawLoginData> | RawLoginData) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth"],
    }),

    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/api/v1/auth/me",
      transformResponse: (raw: RawEnvelope<AuthUser> | AuthUser) => {
        const u = (raw as RawEnvelope<AuthUser>)?.data || (raw as AuthUser);
        if (!u) return u;
        const computedName =
          u.name?.trim() ||
          u.full_name?.trim() ||
          (u.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : "") ||
          (u.email ? u.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "User");
        return {
          ...u,
          name: computedName,
          role: normalizeRole(u.role),
          companyId: u.companyId || (u as any).company_id,
        };
      },
      providesTags: ["Auth", "User"],
    }),

    refreshSession: builder.mutation<{ token: string; refreshToken?: string }, { refreshToken: string }>({
      query: (body) => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        body: {
          refreshToken: body.refreshToken,
          refresh_token: body.refreshToken,
        },
      }),
      transformResponse: (raw: RawEnvelope<RawLoginData> | RawLoginData) => {
        const data = (raw as RawEnvelope<RawLoginData>)?.data || (raw as RawLoginData);
        return {
          token: data?.access_token || data?.token || "",
          refreshToken: data?.refresh_token || data?.refreshToken,
        };
      },
    }),

    verifyEmail: builder.mutation<{ success: boolean; message: string }, { identifier: string; otp: string }>({
      query: (body) => ({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => ({
        success: raw?.success ?? true,
        message: raw?.message || "Email verified successfully",
      }),
    }),

    resendOtp: builder.mutation<{ success: boolean; message: string }, { identifier: string }>({
      query: (body) => ({
        url: "/api/v1/auth/resend-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => ({
        success: raw?.success ?? true,
        message: raw?.message || "OTP resent successfully",
      }),
    }),

    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => ({
        success: raw?.success ?? true,
        message: raw?.message || "Password reset OTP sent",
      }),
    }),

    verifyResetOtp: builder.mutation<{ success: boolean; message: string }, VerifyResetOtpRequest>({
      query: (body) => ({
        url: "/api/v1/auth/verify-reset-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: any) => ({
        success: raw?.success ?? true,
        message: raw?.message || "OTP verified successfully",
      }),
    }),

    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body: {
          email: body.email,
          otp: body.otp,
          new_password: body.new_password || body.newPassword,
          newPassword: body.newPassword || body.new_password,
        },
      }),
      transformResponse: (raw: any) => ({
        success: raw?.success ?? true,
        message: raw?.message || "Password reset successfully",
      }),
    }),

    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/change-password",
        method: "POST",
        body: {
          old_password: body.old_password || body.oldPassword,
          oldPassword: body.oldPassword || body.old_password,
          new_password: body.new_password || body.newPassword,
          newPassword: body.newPassword || body.new_password,
        },
      }),
      transformResponse: (raw: any) => ({
        success: raw?.success ?? true,
        message: raw?.message || "Password changed successfully",
      }),
    }),

    logoutSession: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<null> | any) => {
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

