/**
 * Legacy barrel file — re-exports from the canonical auth API.
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

// Backwards-compat aliases for auto-generated imports
import {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useRefreshSessionMutation,
  useLogoutSessionMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} from "@/api/endpoints/auth";

export const useCreateAuthLoginMutation = useLoginMutation;
export const useCreateAuthRegisterMutation = useRegisterMutation;
export const useGetAuthMeQuery = useGetCurrentUserQuery;
export const useCreateAuthRefreshMutation = useRefreshSessionMutation;
export const useCreateAuthRefreshTokenMutation = useRefreshSessionMutation;
export const useCreateAuthLogoutMutation = useLogoutSessionMutation;
export const useCreateAuthVerifyEmailMutation = useVerifyEmailMutation;
export const useCreateAuthResendOtpMutation = useResendOtpMutation;
export const useCreateAuthForgotPasswordMutation = useForgotPasswordMutation;
export const useCreateAuthResetPasswordMutation = useResetPasswordMutation;
export const useUpdateAuthChangePasswordMutation = useChangePasswordMutation;