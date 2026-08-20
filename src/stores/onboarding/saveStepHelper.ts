export function saveOnboardingStep(s: any, stepNum: number, data: any, cid: string) {
  if (stepNum === 1 && !data?.company?.company_name?.trim()) return { success: false, error: "Company Name is required" };
  if (stepNum === 2 && data?.hr_admin?.mobile_number && !/^\+?[0-9\s-]{10,15}$/.test(data.hr_admin.mobile_number)) return { success: false, error: "Invalid Mobile Number" };
  const company = data.company ? { ...s.company, ...data.company } : s.company;
  const hr_admin = data.hr_admin ? { ...s.hr_admin, ...data.hr_admin } : s.hr_admin;
  const branding = data.branding ? { ...s.branding, ...data.branding } : s.branding;
  const preferences = data.preferences ? { ...s.preferences, ...data.preferences } : s.preferences;
  const completed = Array.from(new Set([...s.onboarding.completed_steps, stepNum]));
  const onboarding = { ...s.onboarding, completed_steps: completed, current_step: Math.max(s.onboarding.current_step, stepNum + 1), completion_percentage: Math.round((completed.length / 5) * 100) };
  const tenantData = { ...s.tenantData, [cid]: { company, hr_admin, branding, preferences, onboarding } };
  return { success: true, stateUpdates: { company, hr_admin, branding, preferences, onboarding, tenantData } };
}
