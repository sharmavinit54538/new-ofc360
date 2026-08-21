import { RawEnvelope } from "../envelope";
import { HRSettings } from "@/types/api/settings";

export function normalizeHRSettings(data: any): HRSettings {
  if (!data) return { headName: "", officialEmail: "", phone: "", escalationLead: "", grievanceEmail: "", autoOnboardingAlerts: false, policyDigestWeekly: false };
  const raw = (data as RawEnvelope<any>)?.data || data;
  return {
    headName: raw.headName || raw.head_name || raw.hrHeadName || raw.hr_head_name || raw.cpo_name || raw.cpoName || "",
    officialEmail: raw.officialEmail || raw.official_email || raw.hrEmail || raw.hr_email || raw.email || "",
    phone: raw.phone || raw.hrPhone || raw.hr_phone || raw.emergencyPhone || raw.emergency_phone || "",
    escalationLead: raw.escalationLead || raw.escalation_lead || raw.escalationContact || raw.escalation_contact || "",
    grievanceEmail: raw.grievanceEmail || raw.grievance_email || raw.poshEmail || raw.posh_email || raw.ethicsEmail || raw.ethics_email || "",
    autoOnboardingAlerts: Boolean(raw.autoOnboardingAlerts ?? raw.auto_onboarding_alerts ?? false),
    policyDigestWeekly: Boolean(raw.policyDigestWeekly ?? raw.policy_digest_weekly ?? false),
    companyId: raw.companyId || raw.company_id,
    updatedAt: raw.updatedAt || raw.updated_at,
  };
}
