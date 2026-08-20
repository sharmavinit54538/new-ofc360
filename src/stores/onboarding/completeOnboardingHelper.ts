export function completeOnboardingHelper(s: any, cid: string) {
  const req = [1, 2, 3];
  const ok = req.every((x) => s.onboarding.completed_steps.includes(x));
  if (!ok) return { success: false, error: "Onboarding is incomplete: steps 1, 2, and 3 are required." };
  const onboarding = { ...s.onboarding, is_completed: true, completed_at: new Date().toISOString(), completion_percentage: 100 };
  const tenantData = { ...s.tenantData, [cid]: { ...s.tenantData[cid], onboarding } };
  return { success: true, stateUpdates: { onboarding, tenantData } };
}
