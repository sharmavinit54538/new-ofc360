export const createStepActions = (set: any, get: any) => ({
  setCompanyDetails: (d: any) => set((s: any) => ({ company: { ...s.company, ...d } })),
  setHRAdminProfile: (p: any) => set((s: any) => ({ hrAdmin: { ...s.hrAdmin, ...p } })),
  setCompanyBranding: (b: any) => set((s: any) => ({ branding: { ...s.branding, ...b } })),
  setOnboardingPreferences: (p: any) => set((s: any) => ({ preferences: { ...s.preferences, ...p } })),
  setStep: (step: number) => set((s: any) => ({ status: { ...s.status, step } })),
  markStepComplete: (step: number) => set((s: any) => {
    const next = Array.from(new Set([...s.status.completedSteps, step]));
    return { status: { ...s.status, completedSteps: next } };
  }),
  completeOnboarding: () => set((s: any) => ({
    status: { ...s.status, isCompleted: true, completedAt: new Date().toISOString() }
  })),
});