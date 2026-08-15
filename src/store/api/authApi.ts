export * from "@/services/api/authApi";
import {
  authApi,
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
} from "@/services/api/authApi";

// Aliases for backwards compatibility with any auto-generated imports
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

export default authApi;

