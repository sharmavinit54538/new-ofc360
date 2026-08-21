import { baseApi } from "../baseApi";
import { CompanyDetails, HRAdminProfile, CompanyBranding, OnboardingPreferences } from "@/types/hrAdminOnboarding";

export const onboardingCompanyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveCompany: builder.mutation<any, Partial<CompanyDetails>>({
      query: (body) => ({ url: "/api/v1/onboarding/company", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    saveCompanyDetails: builder.mutation<any, Partial<CompanyDetails>>({
      query: (body) => ({ url: "/api/v1/onboarding/company-details", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    updateCompanyDetails: builder.mutation<any, Partial<CompanyDetails>>({
      query: (body) => ({ url: "/api/v1/onboarding/company-details", method: "PUT", body }),
      invalidatesTags: ["Onboarding"],
    }),
    saveAdminProfile: builder.mutation<any, Partial<HRAdminProfile>>({
      query: (body) => ({ url: "/api/v1/onboarding/admin-profile", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    updateAdminProfile: builder.mutation<any, Partial<HRAdminProfile>>({
      query: (body) => ({ url: "/api/v1/onboarding/admin-profile", method: "PUT", body }),
      invalidatesTags: ["Onboarding"],
    }),
    saveBranding: builder.mutation<any, Partial<CompanyBranding>>({
      query: (body) => ({ url: "/api/v1/onboarding/branding", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    savePreferences: builder.mutation<any, Partial<OnboardingPreferences>>({
      query: (body) => ({ url: "/api/v1/onboarding/preferences", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
    saveHRSettings: builder.mutation<any, Partial<OnboardingPreferences>>({
      query: (body) => ({ url: "/api/v1/onboarding/hr-settings", method: "POST", body }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});
export const {
  useSaveCompanyMutation, useSaveCompanyDetailsMutation, useUpdateCompanyDetailsMutation,
  useSaveAdminProfileMutation, useUpdateAdminProfileMutation, useSaveBrandingMutation,
  useSavePreferencesMutation, useSaveHRSettingsMutation,
} = onboardingCompanyApi;
