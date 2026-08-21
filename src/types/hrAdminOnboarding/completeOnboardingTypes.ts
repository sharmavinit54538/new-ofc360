import type { CompanyDetails } from "./companyTypes";
import type { HRAdminProfile, CompanyBranding } from "./profileBrandingTypes";
import type { OnboardingPreferences } from "./onboardingPrefTypes";
import type { OnboardingStatus } from "./onboardingStatusTypes";

export interface CompleteOnboardingData {
  company: CompanyDetails;
  hr_admin: HRAdminProfile;
  branding: CompanyBranding;
  preferences: OnboardingPreferences;
  onboarding: OnboardingStatus;
  [key: string]: any;
}
