import { baseApi } from "../baseApi";
import type { OnboardingStatusResponse, OnboardingProgressResponse } from "./onboardingApiTypes";

export const onboardingStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingStatus: builder.query<OnboardingStatusResponse, void>({
      query: () => "/api/v1/onboarding/status",
      providesTags: ["Onboarding"],
    }),
    getOnboardingProgress: builder.query<OnboardingProgressResponse, void>({
      query: () => "/api/v1/onboarding/progress",
      providesTags: ["Onboarding"],
    }),
    completeOnboarding: builder.mutation<any, void>({
      query: () => ({ url: "/api/v1/onboarding/complete", method: "POST" }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});
export const { useGetOnboardingStatusQuery, useGetOnboardingProgressQuery, useCompleteOnboardingMutation } = onboardingStatusApi;
