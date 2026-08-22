import { toast } from "sonner";
import { useEnableMFAMutation, useDisableMFAMutation, useVerifyMFAMutation } from "@/services/api/settingsApi";
import { normalizeError } from "@/services/api/normalizeError";
import type { useMfaState } from "./useMfaState";

export function useMfaActions(s: ReturnType<typeof useMfaState>) {
  const [enableMFA, { isLoading: isEnablingMFA }] = useEnableMFAMutation();
  const [disableMFA, { isLoading: isDisablingMFA }] = useDisableMFAMutation();
  const [verifyMFA, { isLoading: isVerifyingMFA }] = useVerifyMFAMutation();
  const handleToggleMFA = async (enableReq: boolean) => {
    if (!enableReq) return s.setIsMfaDisableOpen(true);
    try {
      const res = await enableMFA().unwrap();
      if (res.requiresVerification || res.qrCodeUri || res.secret || res.provisioningUri) {
        s.setMfaSetupData(res); s.setOtpCode(""); s.setIsMfaSetupOpen(true);
      } else if (res.enabled) { s.setMfaEnabled(true); toast.success("Two-Factor Authentication enabled!"); }
    } catch (err: any) { toast.error(normalizeError(err).message || "Failed to initiate MFA setup."); }
  };
  return { enableMFA, disableMFA, verifyMFA, isEnablingMFA, isDisablingMFA, isVerifyingMFA, handleToggleMFA };
}