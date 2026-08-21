import { RawEnvelope } from "../envelope";
import { EnableMFAResponse } from "@/types/api/settings";

export function normalizeMFAResponse(data: any): EnableMFAResponse {
  const raw = (data as RawEnvelope<any>)?.data || data || {};
  return {
    enabled: Boolean(raw.enabled || raw.mfa_enabled || raw.mfaEnabled || raw.success),
    requiresVerification: Boolean(raw.requiresVerification ?? raw.requires_verification ?? Boolean(raw.secret || raw.qr_code_uri || raw.qrCodeUri || raw.provisioning_uri)),
    secret: raw.secret || raw.manual_entry_key || raw.manualEntryKey,
    qrCodeUri: raw.qrCodeUri || raw.qr_code_uri || raw.qr_code || raw.qrCode,
    provisioningUri: raw.provisioningUri || raw.provisioning_uri || raw.otpauth_url,
    recoveryCodes: raw.recoveryCodes || raw.recovery_codes || [],
    message: raw.message || "MFA status updated",
  };
}
