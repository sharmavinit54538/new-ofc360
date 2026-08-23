import { api as baseApi } from "@/api/client";
import { unwrapEnvelope } from "@/services/api/envelope";
import { MFASettings, EnableMFAResponse, VerifyMFARequest, DisableMFARequest } from "@/types/api/settings";
import { normalizeMFAResponse } from "./normalizeMFAResponse";

export const mfaSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMFASettings: builder.query<MFASettings, void>({
      query: () => "/api/v1/settings/mfa/status",
      transformResponse: (response: any) => ({ enabled: Boolean(unwrapEnvelope(response)?.enabled || unwrapEnvelope(response)?.mfa_enabled), method: unwrapEnvelope(response)?.method || "authenticator" }),
      providesTags: ["SecuritySettings"],
    }),
    enableMFA: builder.mutation<EnableMFAResponse, { method?: string; password?: string } | void>({
      query: (body) => ({ url: "/api/v1/settings/mfa/enable", method: "POST", body: body || {} }),
      transformResponse: (response: any) => normalizeMFAResponse(response),
      invalidatesTags: ["SecuritySettings", "Auth", "User"],
    }),
    disableMFA: builder.mutation<{ success: boolean; message?: string }, DisableMFARequest | void>({
      query: (body) => ({ url: "/api/v1/settings/mfa/disable", method: "POST", body: body || {} }),
      transformResponse: (response: any) => ({ success: unwrapEnvelope(response)?.success ?? true, message: unwrapEnvelope(response)?.message || "MFA disabled successfully" }),
      invalidatesTags: ["SecuritySettings", "Auth", "User"],
    }),
    verifyMFA: builder.mutation<{ success: boolean; message?: string }, VerifyMFARequest>({
      query: (body) => ({ url: "/api/v1/settings/mfa/verify", method: "POST", body: { code: body.code || body.otp, otp: body.code || body.otp, secret: body.secret } }),
      transformResponse: (response: any) => ({ success: unwrapEnvelope(response)?.success ?? true, message: unwrapEnvelope(response)?.message || "MFA verified and activated" }),
      invalidatesTags: ["SecuritySettings", "Auth", "User"],
    }),
  }),
});
export const { useGetMFASettingsQuery, useLazyGetMFASettingsQuery, useEnableMFAMutation, useDisableMFAMutation, useVerifyMFAMutation } = mfaSettingsApi;
