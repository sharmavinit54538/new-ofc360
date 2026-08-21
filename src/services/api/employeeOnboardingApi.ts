export * from "./employeeOnboarding/employeeOnboardingTypes";
export * from "./employeeOnboarding/employeeOnboardingStatusEndpoints";
export * from "./employeeOnboarding/employeeOnboardingPersonalEndpoints";
export * from "./employeeOnboarding/employeeOnboardingProfileEndpoints";
export * from "./employeeOnboarding/employeeOnboardingDocsEndpoints";

import { employeeOnboardingStatusApi } from "./employeeOnboarding/employeeOnboardingStatusEndpoints";
import { employeeOnboardingPersonalApi } from "./employeeOnboarding/employeeOnboardingPersonalEndpoints";
import { employeeOnboardingProfileApi } from "./employeeOnboarding/employeeOnboardingProfileEndpoints";
import { employeeOnboardingDocsApi } from "./employeeOnboarding/employeeOnboardingDocsEndpoints";

export const employeeOnboardingApi = {
  ...employeeOnboardingStatusApi,
  ...employeeOnboardingPersonalApi,
  ...employeeOnboardingProfileApi,
  ...employeeOnboardingDocsApi,
};