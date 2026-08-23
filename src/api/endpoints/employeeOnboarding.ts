/**
 * Legacy barrel file — re-exports from the canonical employee onboarding API.
 * New code should import directly from "@/features/onboarding/api".
 */
export {
  employeeOnboardingApi,
  useGetEmployeeOnboardingStatusQuery,
  useGetEmployeeOnboardingProgressQuery,
  useSaveEmployeeStep1Mutation,
  useSaveEmployeeStep2Mutation,
  useSaveEmployeeStep3Mutation,
  useSaveEmployeeStep4Mutation,
  useSaveEmployeeStep5Mutation,
  useSaveEmployeeStep6Mutation,
  useSaveEmployeeStep7Mutation,
  useUploadStep8DocumentMutation,
  useDeleteStep8DocumentMutation,
  useFinalizeStep8DocumentsMutation,
  useSaveEmployeeStep9Mutation,
  useCompleteEmployeeOnboardingMutation,
  useSaveEmployeeDraftMutation,
} from "@/features/onboarding/api";

export type {
  OnboardingAPIResponse,
  EmployeeOnboardingStatus,
  EmployeeOnboardingProgressData,
  EmployeeStep1Personal,
  EmployeeStep2Bank,
  EmployeeStep3Statutory,
  EmployeeStep4EmergencyContact,
  EmployeeStep5Education,
  EmployeeStep6PriorEmployment,
  EmployeeStep7AdditionalDetails,
  EmployeeStep8Document,
  EmployeeStep8FinalizePayload,
  EmployeeStep9Policies,
} from "@/features/onboarding/api";