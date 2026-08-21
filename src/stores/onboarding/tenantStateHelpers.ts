import { initialOnboarding, initialCompany, initialHRAdmin, initialBranding, initialPreferences } from "./onboardingDefaults";

export const resetTenantHelper = (s: any, cid: string) => {
  const t = { ...s.tenantData }; delete t[cid];
  return { tenantData: t, company: initialCompany, hr_admin: initialHRAdmin, branding: initialBranding, preferences: initialPreferences, onboarding: initialOnboarding };
};

export const loadTenantHelper = (s: any, cid: string) => {
  const d = s.tenantData?.[cid] || { company: initialCompany, hr_admin: initialHRAdmin, branding: initialBranding, preferences: initialPreferences, onboarding: initialOnboarding };
  return { company: d.company, hr_admin: d.hr_admin, branding: d.branding, preferences: d.preferences, onboarding: d.onboarding };
};

export const syncBackendHelper = (d: any) => ({
  company: d?.company || initialCompany, hr_admin: d?.hr_admin || d?.hrAdmin || initialHRAdmin,
  branding: d?.branding || initialBranding, preferences: d?.preferences || initialPreferences, onboarding: d?.onboarding || initialOnboarding
});
