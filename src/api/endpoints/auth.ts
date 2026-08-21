// eslint-disable-file -- ESLint parser bug with complex RTK Query endpoint definitions
import { api } from "../client";
import { AuthUser, normalizeRole } from "@/features/auth/authTypes";
import { RawEnvelope } from "@/services/api/envelope";

export interface LoginRequest {
  identifier: string;
  password?: string;
  role?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  requires_email_verification?: boolean;
  verification_id?: string;
  masked_email?: string;
  email?: string;
}

export interface RawLoginData {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
  requires_email_verification?: boolean;
  verification_id?: string;
  masked_email?: string;
  email?: string;
}

export const unwrapLoginResponse = (raw: RawEnvelope<RawLoginData> | RawLoginData | unknown): LoginResponse => {
  const root = raw as Record<string, unknown>;
  const data = (root?.data as Record<string, unknown>) || root;
  const requires_email_verification = Boolean(
    (root?.requires_email_verification as boolean) ?? (data?.requires_email_verification as boolean) ?? false
  );
  const verification_id = (root?.verification_id as string) || (data?.verification_id as string) || undefined;
  const masked_email = (data?.masked_email as string) || undefined;
  const email = (data?.email as string) || undefined;

  const u = data?.user as Record<string, unknown> | undefined;
  const computedName =
    (u?.name as string)?.trim() ||
    (u?.full_name as string)?.trim() ||
    ((u?.first_name as string) ? `${u.first_name} ${(u.last_name as string) || ""}`.trim() : "") ||
    ((u?.email as string) ? (u.email as string).split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "User");

  const normalizedRole = normalizeRole(u?.role as string);
  const normalizedUser: AuthUser = u
    ? {
        ...u,
        name: computedName,
        role: normalizedRole,
        companyId: (u.companyId as string) || (u.company_id as string),
      }
    : {
        id: "usr_me",
        name: computedName,
        email: email || "",
        role: "employee",
      };

  return {
    user: normalizedUser,
    token: (data?.access_token as string) || (data?.token as string) || "",
    refreshToken: (data?.refresh_token as string) || (data?.refreshToken as string),
    requires_email_verification,
    verification_id,
    masked_email,
    email,
  };
};

export interface VerifyEmailOtpRequest {
  verification_id?: string;
  otp: string;
  identifier?: string;
  email?: string;
}

export interface ResendEmailOtpRequest {
  verification_id?: string;
  email?: string;
  identifier?: string;
}

export interface ResendEmailOtpResponse {
  success: boolean;
  message: string;
  verification_id?: string;
}

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
  identifier?: string;
  email?: string;
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

export const authApi = api.injectEndpoints({
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
          companyId: u.companyId || (u as Record<string, unknown>).company_id,
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
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        return {
          success: (r?.success as boolean) ?? true,
          message: (r?.message as string) || "Email verified successfully",
        };
      },
    }),

    resendOtp: builder.mutation<{ success: boolean; message: string }, { identifier: string }>({
      query: (body) => ({
        url: "/api/v1/auth/resend-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        return {
          success: (r?.success as boolean) ?? true,
          message: (r?.message as string) || "OTP resent successfully",
        };
      },
    }),

    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        return {
          success: (r?.success as boolean) ?? true,
          message: (r?.message as string) || "Password reset OTP sent",
        };
      },
    }),

    verifyResetOtp: builder.mutation<{ success: boolean; message: string }, VerifyResetOtpRequest>({
      query: (body) => ({
        url: "/api/v1/auth/verify-reset-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        return {
          success: (r?.success as boolean) ?? true,
          message: (r?.message as string) || "OTP verified successfully",
        };
      },
    }),

    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (body) => {
        const emailOrIdentifier = body.email || body.identifier || "";
        return {
          url: "/api/v1/auth/reset-password",
          method: "POST",
          body: {
            identifier: emailOrIdentifier,
            email: emailOrIdentifier,
            otp: body.otp,
            new_password: body.new_password || body.newPassword,
            newPassword: body.newPassword || body.new_password,
          },
        };
      },
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        return { success: (r?.success as boolean) ?? true, message: (r?.message as string) || "Password reset successfully" };
      },
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
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        return {
          success: (r?.success as boolean) ?? true,
          message: (r?.message as string) || "Password changed successfully",
        };
      },
    }),

    verifyEmailOtp: builder.mutation<LoginResponse, VerifyEmailOtpRequest>({
      query: (body) => ({
        url: "/api/v1/auth/verify-email-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<RawLoginData> | RawLoginData | unknown) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth", "User"],
    }),

    resendEmailOtp: builder.mutation<ResendEmailOtpResponse, ResendEmailOtpRequest>({
      query: (body) => ({
        url: "/api/v1/auth/resend-email-otp",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => {
        const r = raw as Record<string, unknown>;
        const data = r?.data as Record<string, unknown> | undefined;
        return {
          success: (r?.success as boolean) ?? true,
          message: (r?.message as string) || "OTP resent successfully",
          verification_id: (r?.verification_id as string) || (data?.verification_id as string),
        };
      },
    }),

    logoutSession: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<null> | unknown) => {
        if (raw && typeof raw === "object" && "success" in (raw as Record<string, unknown>)) {
          const r = raw as Record<string, unknown>;
          return { success: r.success as boolean, message: (r.message as string) || "Logged out" };
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
  useVerifyEmailOtpMutation,
  useResendEmailOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;