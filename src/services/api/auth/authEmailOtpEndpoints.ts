import { baseApi } from "../baseApi";
import type { LoginResponse, VerifyEmailOtpRequest, ResendEmailOtpResponse, ResendEmailOtpRequest } from "./authApiTypes";
import { unwrapLoginResponse } from "./unwrapLoginResponse";

export const authEmailOtpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmailOtp: builder.mutation<LoginResponse, VerifyEmailOtpRequest>({
      query: (body) => ({ url: "/api/v1/auth/verify-email-otp", method: "POST", body }),
      transformResponse: (raw: any) => unwrapLoginResponse(raw),
      invalidatesTags: ["Auth", "User"],
    }),
    resendEmailOtp: builder.mutation<ResendEmailOtpResponse, ResendEmailOtpRequest>({
      query: (body) => ({ url: "/api/v1/auth/resend-email-otp", method: "POST", body }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "OTP resent successfully", verification_id: raw?.verification_id || raw?.data?.verification_id }),
    }),
  }),
});
export const { useVerifyEmailOtpMutation, useResendEmailOtpMutation } = authEmailOtpApi;
