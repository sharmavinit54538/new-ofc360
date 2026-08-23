/**
 * Legacy barrel file — re-exports from the canonical auth API.
 * New code should import directly from "@/features/auth/api".
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
} from "@/features/auth/api";

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
} from "@/features/auth/api";

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
} from "@/features/auth/api";

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