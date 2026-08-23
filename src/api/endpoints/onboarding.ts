/**
 * Legacy barrel file — re-exports from the canonical HR admin onboarding API.
 * New code should import directly from "@/features/onboarding/api".
 */
export {
  onboardingApi,
  useGetOnboardingStatusQuery,
  useGetOnboardingProgressQuery,
  useSaveCompanyMutation,
  useSaveCompanyDetailsMutation,
  useUpdateCompanyDetailsMutation,
  useSaveAdminProfileMutation,
  useUpdateAdminProfileMutation,
  useSaveHRSettingsMutation,
  useSaveDepartmentsMutation,
  useSaveDesignationsMutation,
  useInviteEmployeesMutation,
  useValidateInvitationQuery,
  useValidateTokenQuery,
  useActivateAccountMutation,
  useSaveBrandingMutation,
  useSavePreferencesMutation,
  useCompleteOnboardingMutation,
  useGetOnboardingTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/features/onboarding/api";

export type {
  OnboardingTask,
  OnboardingStatusResponse,
  OnboardingProgressResponse,
  InviteEmployeesRequest,
  ActivateAccountRequest,
  CompanyDetails,
  HRAdminProfile,
  CompanyBranding,
  OnboardingPreferences,
  OnboardingTaskItem,
} from "@/features/onboarding/api";