import { initialOnboarding, initialCompany, initialHRAdmin, initialBranding, initialPreferences } from "./onboardingDefaults";
import { saveOnboardingStep } from "./saveStepHelper";
import { completeOnboardingHelper } from "./completeOnboardingHelper";

export const createOnboardingActions = (set: any, get: any) => ({
  resetOnboardingData: (cid: string) => set((s: any) => {
    const t = { ...s.tenantData }; delete t[cid];
    return { tenantData: t, company: initialCompany, hr_admin: initialHRAdmin, branding: initialBranding, preferences: initialPreferences, onboarding: initialOnboarding };
  }),
  loadForCompany: (cid: string) => set((s: any) => {
    const d = s.tenantData?.[cid] || { company: initialCompany, hr_admin: initialHRAdmin, branding: initialBranding, preferences: initialPreferences, onboarding: initialOnboarding };
    return { company: d.company, hr_admin: d.hr_admin, branding: d.branding, preferences: d.preferences, onboarding: d.onboarding };
  }),
  syncFromBackend: (d: any) => set({
    company: d?.company || initialCompany, hr_admin: d?.hr_admin || d?.hrAdmin || initialHRAdmin,
    branding: d?.branding || initialBranding, preferences: d?.preferences || initialPreferences, onboarding: d?.onboarding || initialOnboarding
  }),
  saveStep: (step: number, data: any, cid: string) => {
    const r = saveOnboardingStep(get(), step, data, cid); if (r.success) set(r.stateUpdates); return r;
  },
  completeOnboarding: (cid: string) => {
    const r = completeOnboardingHelper(get(), cid); if (r.success) set(r.stateUpdates); return r;
  },
});