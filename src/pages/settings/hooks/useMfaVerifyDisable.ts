import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";
import type { useMfaState } from "./useMfaState";
import type { useMfaActions } from "./useMfaActions";

export function useMfaVerifyDisable(s: ReturnType<typeof useMfaState>, a: ReturnType<typeof useMfaActions>) {
  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!s.otpCode.trim() || s.otpCode.trim().length < 6) return toast.error("Please enter a valid 6-digit verification code.");
    try {
      await a.verifyMFA({ code: s.otpCode.trim(), secret: s.mfaSetupData?.secret }).unwrap();
      s.setMfaEnabled(true); s.setIsMfaSetupOpen(false); s.setMfaSetupData(null);
      toast.success("Two-Factor Authentication activated and verified successfully!");
    } catch (err: any) { toast.error(normalizeError(err).message || "Verification failed."); }
  };

  const handleConfirmDisableMFA = async () => {
    try {
      await a.disableMFA().unwrap();
      s.setMfaEnabled(false); s.setIsMfaDisableOpen(false);
      toast.success("Two-Factor Authentication has been disabled.");
    } catch (err: any) { toast.error(normalizeError(err).message || "Failed to disable MFA."); }
  };

  return { handleVerifyMFA, handleConfirmDisableMFA };
}
