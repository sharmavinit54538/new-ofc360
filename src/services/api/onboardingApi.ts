export type { OnboardingTaskItem as OnboardingTask } from "@/types/hrAdminOnboarding";
export * from "./onboarding/onboardingApiTypes";
export * from "./onboarding/onboardingStatusEndpoints";
export * from "./onboarding/onboardingCompanyEndpoints";
export * from "./onboarding/onboardingOrganizationEndpoints";
export * from "./onboarding/onboardingTasksEndpoints";

import { onboardingStatusApi } from "./onboarding/onboardingStatusEndpoints";
import { onboardingCompanyApi } from "./onboarding/onboardingCompanyEndpoints";
import { onboardingOrganizationApi } from "./onboarding/onboardingOrganizationEndpoints";
import { onboardingTasksApi } from "./onboarding/onboardingTasksEndpoints";

export const onboardingApi = {
  ...onboardingStatusApi,
  ...onboardingCompanyApi,
  ...onboardingOrganizationApi,
  ...onboardingTasksApi,
};