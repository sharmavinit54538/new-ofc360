import { baseApi } from "../baseApi";
import type { ForgotPasswordRequest, VerifyResetOtpRequest, ResetPasswordRequest } from "./authPasswordTypes";

export const authPasswordResetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (body) => ({ url: "/api/v1/auth/forgot-password", method: "POST", body }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "Password reset OTP sent" }),
    }),
    verifyResetOtp: builder.mutation<{ success: boolean; message: string }, VerifyResetOtpRequest>({
      query: (body) => ({ url: "/api/v1/auth/verify-reset-otp", method: "POST", body }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "OTP verified successfully" }),
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (body) => ({ url: "/api/v1/auth/reset-password", method: "POST", body: { identifier: body.email || body.identifier || "", otp: body.otp, new_password: body.new_password || body.newPassword } }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "Password reset successfully" }),
    }),
  }),
});
export const { useForgotPasswordMutation, useVerifyResetOtpMutation, useResetPasswordMutation } = authPasswordResetApi;
