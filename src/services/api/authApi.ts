/**
 * Legacy barrel file — re-exports from the canonical auth API.
 * All auth endpoints are defined in @/api/endpoints/auth.ts using
 * the canonical createApi instance from @/api/client.ts.
 *
 * This file exists only for backward compatibility.
 * New code should import directly from "@/api/endpoints/auth".
 */
export {
  authApi,
  unwrapLoginResponse,
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
} from "@/api/endpoints/auth";

export type {
  LoginRequest,
  LoginResponse,
  RawLoginData,
  RegisterRequest,
  VerifyEmailOtpRequest,
  ResendEmailOtpRequest,
  ResendEmailOtpResponse,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/api/endpoints/auth";