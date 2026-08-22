import { useState, useEffect } from "react";
import { useGetMFASettingsQuery } from "@/services/api/settingsApi";
import type { EnableMFAResponse } from "@/types/api/settings";

export function useMfaState() {
  const { data: mfaSettings, isLoading: isLoadingMFA } = useGetMFASettingsQuery();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [isMfaSetupOpen, setIsMfaSetupOpen] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState<EnableMFAResponse | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isMfaDisableOpen, setIsMfaDisableOpen] = useState(false);

  useEffect(() => {
    if (mfaSettings) setMfaEnabled(Boolean(mfaSettings.enabled));
  }, [mfaSettings]);

  return { mfaEnabled, setMfaEnabled, isMfaSetupOpen, setIsMfaSetupOpen, mfaSetupData, setMfaSetupData, otpCode, setOtpCode, copiedSecret, setCopiedSecret, isMfaDisableOpen, setIsMfaDisableOpen, isLoadingMFA };
}
