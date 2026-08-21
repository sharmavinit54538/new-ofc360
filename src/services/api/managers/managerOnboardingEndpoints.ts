import { baseApi } from "../baseApi";
import { Manager } from "@/types/hr";
import type { ResetPasswordResponse, ValidateOnboardingTokenResponse, ActivateManagerOnboardingPayload } from "./managerApiTypes";

export const managerOnboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    resetManagerPassword: builder.mutation<ResetPasswordResponse, string>({
      query: (id) => ({ url: `/api/v1/managers/${id}/reset-password`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
    }),
    validateManagerOnboardingToken: builder.query<ValidateOnboardingTokenResponse, string>({
      query: (token) => `/api/v1/managers/onboarding/validate?token=${encodeURIComponent(token)}`,
      transformResponse: (raw: any) => raw?.data || raw,
    }),
    activateManagerOnboarding: builder.mutation<Manager, ActivateManagerOnboardingPayload>({
      query: (body) => ({ url: "/api/v1/managers/onboarding/activate", method: "POST", body }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),
    completeManagerOnboarding: builder.mutation<Manager, Record<string, unknown> | void>({
      query: (body) => ({ url: "/api/v1/managers/onboarding/complete", method: "POST", body: body || {} }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),
  }),
});
export const {
  useResetManagerPasswordMutation, useValidateManagerOnboardingTokenQuery,
  useLazyValidateManagerOnboardingTokenQuery, useActivateManagerOnboardingMutation,
  useCompleteManagerOnboardingMutation,
} = managerOnboardingApi;
