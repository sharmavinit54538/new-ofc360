import { create } from "zustand";
import { initialOnboarding, initialCompany, initialHRAdmin, initialBranding, initialPreferences } from "./onboarding/onboardingDefaults";
import { createOnboardingActions } from "./onboarding/onboardingStepActions";

export const useHRAdminOnboardingStore = create<any>((set, get) => ({
  company: initialCompany, hr_admin: initialHRAdmin, branding: initialBranding,
  preferences: initialPreferences, onboarding: initialOnboarding, tenantData: {},
  ...createOnboardingActions(set, get),
}));