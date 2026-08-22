import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGetHRSettingsQuery, useUpdateHRSettingsMutation } from "@/services/api/settingsApi";
import { normalizeError } from "@/services/api/normalizeError";
import type { HRFormData } from "../types/hrTypes";
import { mapHRData } from "./mapHRData";

export function useHRSettings() {
  const { data: hrSettings, isLoading: isLoadingHR, isFetching: isFetchingHR, refetch: refetchHR } = useGetHRSettingsQuery();
  const [updateHRSettings, { isLoading: isSavingHR }] = useUpdateHRSettingsMutation();
  const [hrData, setHrData] = useState<HRFormData>(mapHRData(null));
  useEffect(() => { if (hrSettings) setHrData(mapHRData(hrSettings)); }, [hrSettings]);
  const handleSaveHR = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await updateHRSettings(hrData).unwrap(); toast.success("HR details updated!"); } catch (err: any) { toast.error(normalizeError(err).message || "Failed to save HR settings."); }
  };
  return { hrData, setHrData, isLoadingHR, isFetchingHR, isSavingHR, refetchHR, handleSaveHR };
}