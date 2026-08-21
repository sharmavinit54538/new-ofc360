import { baseApi } from "../baseApi";
import { RawEnvelope, unwrapEnvelope } from "../envelope";
import type { OnboardingStatusResponse, OnboardingWizardData, SaveStepPayload } from "@/types/hrAdminOnboardingApi.types";
import { normalizeOnboardingStatusResponse } from "./normalizeHRAdminStatus";

const BASE = "/api/v1/hr-admin/onboarding";

export const hrAdminWizardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHRAdminOnboardingStatus: builder.query<OnboardingStatusResponse, void>({
      query: () => `${BASE}/status`,
      transformResponse: (raw: any) => normalizeOnboardingStatusResponse(raw),
      providesTags: ["HRAdminOnboarding"],
    }),
    getHRAdminOnboardingWizardData: builder.query<OnboardingWizardData, void>({
      query: () => BASE,
      transformResponse: (raw: RawEnvelope<OnboardingWizardData>) => unwrapEnvelope(raw),
      providesTags: ["HRAdminOnboarding"],
    }),
    saveHRAdminOnboardingStep: builder.mutation<OnboardingWizardData, { stepIndex: number; payload: SaveStepPayload }>({
      query: ({ stepIndex, payload }) => ({ url: `${BASE}/step/${stepIndex}`, method: "POST", body: payload }),
      transformResponse: (raw: RawEnvelope<OnboardingWizardData>) => unwrapEnvelope(raw),
      invalidatesTags: ["HRAdminOnboarding"],
    }),
    completeHRAdminOnboarding: builder.mutation<OnboardingWizardData, void>({
      query: () => ({ url: `${BASE}/complete`, method: "POST" }),
      transformResponse: (raw: RawEnvelope<OnboardingWizardData>) => unwrapEnvelope(raw),
      invalidatesTags: ["HRAdminOnboarding"],
    }),
  }),
});
export const { useGetHRAdminOnboardingStatusQuery, useGetHRAdminOnboardingWizardDataQuery, useSaveHRAdminOnboardingStepMutation, useCompleteHRAdminOnboardingMutation } = hrAdminWizardApi;
