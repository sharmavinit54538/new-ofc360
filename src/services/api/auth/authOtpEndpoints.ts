import { baseApi } from "../baseApi";

export const authOtpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<{ success: boolean; message: string }, { identifier: string; otp: string }>({
      query: (body) => ({ url: "/api/v1/auth/verify-email", method: "POST", body }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "Email verified successfully" }),
    }),
    resendOtp: builder.mutation<{ success: boolean; message: string }, { identifier: string }>({
      query: (body) => ({ url: "/api/v1/auth/resend-otp", method: "POST", body }),
      transformResponse: (raw: any) => ({ success: raw?.success ?? true, message: raw?.message || "OTP resent successfully" }),
    }),
  }),
});
export const { useVerifyEmailMutation, useResendOtpMutation } = authOtpApi;
