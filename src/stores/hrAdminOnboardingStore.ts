import { create } from "zustand";
import { getStoredData } from "@/utils/storage";
import { initialCompany, initialHRAdmin, initialBranding, initialPreferences } from "./onboarding/onboardingDefaults";
import { createStepActions } from "./onboarding/onboardingStepActions";

export const useHRAdminOnboardingStore = create<any>((set, get) => ({
  company: initialCompany, hrAdmin: initialHRAdmin, branding: initialBranding,
  preferences: initialPreferences,
  status: { step: 1, isCompleted: false, completedSteps: [1] },
  workflows: [], newHires: [],
  ...createStepActions(set, get),
}));