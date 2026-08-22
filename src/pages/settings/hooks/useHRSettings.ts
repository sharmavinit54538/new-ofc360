import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGetHRSettingsQuery, useUpdateHRSettingsMutation } from "@/services/api/settingsApi";
import { normalizeError } from "@/services/api/normalizeError";
import type { HRFormData } from "../types/hrTypes";

export function useHRSettings() {
  const { data: hrSettings, isLoading: isLoadingHR, isFetching: isFetchingHR, refetch: refetchHR } = useGetHRSettingsQuery();
  const [updateHRSettings, { isLoading: isSavingHR }] = useUpdateHRSettingsMutation();
  const [hrData, setHrData] = useState<HRFormData>({ headName: "", officialEmail: "", phone: "", escalationLead: "", grievanceEmail: "", autoOnboardingAlerts: false, policyDigestWeekly: false });

  useEffect(() => {
    if (hrSettings) {
      setHrData({ headName: hrSettings.headName || "", officialEmail: hrSettings.officialEmail || "", phone: hrSettings.phone || "", escalationLead: hrSettings.escalationLead || "", grievanceEmail: hrSettings.grievanceEmail || "", autoOnboardingAlerts: Boolean(hrSettings.autoOnboardingAlerts), policyDigestWeekly: Boolean(hrSettings.policyDigestWeekly) });
    }
  }, [hrSettings]);

  const handleSaveHR = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHRSettings(hrData).unwrap();
      toast.success("HR contact and policy details updated successfully!");
    } catch (err: any) {
      toast.error(normalizeError(err).message || "Failed to save HR settings.");
    }
  };

  return { hrData, setHrData, isLoadingHR, isFetchingHR, isSavingHR, refetchHR, handleSaveHR };
}
