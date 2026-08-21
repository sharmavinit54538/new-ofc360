import { resetTenantHelper, loadTenantHelper, syncBackendHelper } from "./tenantStateHelpers";
import { saveOnboardingStep } from "./saveStepHelper";
import { completeOnboardingHelper } from "./completeOnboardingHelper";

export const createOnboardingActions = (set: any, get: any) => ({
  resetOnboardingData: (cid: string) => set((s: any) => resetTenantHelper(s, cid)),
  loadForCompany: (cid: string) => set((s: any) => loadTenantHelper(s, cid)),
  syncFromBackend: (d: any) => set(syncBackendHelper(d)),
  saveStep: (step: number, data: any, cid: string) => {
    const r = saveOnboardingStep(get(), step, data, cid);
    if (r.success) set(r.stateUpdates);
    return r;
  },
  completeOnboarding: (cid: string) => {
    const r = completeOnboardingHelper(get(), cid);
    if (r.success) set(r.stateUpdates);
    return r;
  },
});