import type { HRFormData } from "../types/hrTypes";

export function mapHRData(hrSettings: any): HRFormData {
  return {
    headName: hrSettings?.headName || "",
    officialEmail: hrSettings?.officialEmail || "",
    phone: hrSettings?.phone || "",
    escalationLead: hrSettings?.escalationLead || "",
    grievanceEmail: hrSettings?.grievanceEmail || "",
    autoOnboardingAlerts: Boolean(hrSettings?.autoOnboardingAlerts),
    policyDigestWeekly: Boolean(hrSettings?.policyDigestWeekly),
  };
}