import { baseApi } from "./baseApi";
import { RawEnvelope, unwrapEnvelope } from "./envelope";
import {
  HRSettings,
  UpdateHRSettingsRequest,
  MFASettings,
  EnableMFAResponse,
  VerifyMFARequest,
  DisableMFARequest,
} from "@/types/api/settings";

export function normalizeHRSettings(data: any): HRSettings {
  if (!data) {
    return {
      headName: "",
      officialEmail: "",
      phone: "",
      escalationLead: "",
      grievanceEmail: "",
      autoOnboardingAlerts: false,
      policyDigestWeekly: false,
    };
  }

  const raw = (data as RawEnvelope<any>)?.data || data;

  return {
    headName:
      raw.headName ||
      raw.head_name ||
      raw.hrHeadName ||
      raw.hr_head_name ||
      raw.cpo_name ||
      raw.cpoName ||
      "",
    officialEmail:
      raw.officialEmail ||
      raw.official_email ||
      raw.hrEmail ||
      raw.hr_email ||
      raw.email ||
      "",
    phone:
      raw.phone ||
      raw.hrPhone ||
      raw.hr_phone ||
      raw.emergencyPhone ||
      raw.emergency_phone ||
      "",
    escalationLead:
      raw.escalationLead ||
      raw.escalation_lead ||
      raw.escalationContact ||
      raw.escalation_contact ||
      "",
    grievanceEmail:
      raw.grievanceEmail ||
      raw.grievance_email ||
      raw.poshEmail ||
      raw.posh_email ||
      raw.ethicsEmail ||
      raw.ethics_email ||
      "",
    autoOnboardingAlerts: Boolean(
      raw.autoOnboardingAlerts ?? raw.auto_onboarding_alerts ?? false
    ),
    policyDigestWeekly: Boolean(
      raw.policyDigestWeekly ?? raw.policy_digest_weekly ?? false
    ),
    companyId: raw.companyId || raw.company_id,
    updatedAt: raw.updatedAt || raw.updated_at,
  };
}

export function normalizeMFAResponse(data: any): EnableMFAResponse {
  const raw = (data as RawEnvelope<any>)?.data || data || {};
  return {
    enabled: Boolean(raw.enabled || raw.mfa_enabled || raw.mfaEnabled || raw.success),
    requiresVerification: Boolean(
      raw.requiresVerification ?? raw.requires_verification ?? Boolean(raw.secret || raw.qr_code_uri || raw.qrCodeUri || raw.provisioning_uri)
    ),
    secret: raw.secret || raw.manual_entry_key || raw.manualEntryKey,
    qrCodeUri: raw.qrCodeUri || raw.qr_code_uri || raw.qr_code || raw.qrCode,
    provisioningUri: raw.provisioningUri || raw.provisioning_uri || raw.otpauth_url,
    recoveryCodes: raw.recoveryCodes || raw.recovery_codes || [],
    message: raw.message || "MFA status updated",
  };
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHRSettings: builder.query<HRSettings, void>({
      query: () => "/api/v1/settings/hr",
      transformResponse: (response: RawEnvelope<any> | any) => normalizeHRSettings(response),
      providesTags: ["HRDirectory", "CompanySettings"],
    }),

    updateHRSettings: builder.mutation<HRSettings, UpdateHRSettingsRequest>({
      query: (body) => {
        // Provide both camelCase and snake_case representations in the payload
        const payload = {
          head_name: body.headName || body.head_name,
          headName: body.headName || body.head_name,
          official_email: body.officialEmail || body.official_email,
          officialEmail: body.officialEmail || body.official_email,
          phone: body.phone,
          escalation_lead: body.escalationLead || body.escalation_lead,
          escalationLead: body.escalationLead || body.escalation_lead,
          grievance_email: body.grievanceEmail || body.grievance_email,
          grievanceEmail: body.grievanceEmail || body.grievance_email,
          auto_onboarding_alerts: body.autoOnboardingAlerts ?? body.auto_onboarding_alerts,
          autoOnboardingAlerts: body.autoOnboardingAlerts ?? body.auto_onboarding_alerts,
          policy_digest_weekly: body.policyDigestWeekly ?? body.policy_digest_weekly,
          policyDigestWeekly: body.policyDigestWeekly ?? body.policy_digest_weekly,
        };
        return {
          url: "/api/v1/settings/hr",
          method: "PUT",
          body: payload,
        };
      },
      transformResponse: (response: RawEnvelope<any> | any) => normalizeHRSettings(response),
      invalidatesTags: ["HRDirectory", "CompanySettings"],
    }),

    getMFASettings: builder.query<MFASettings, void>({
      query: () => "/api/v1/settings/mfa/status",
      transformResponse: (response: any) => {
        const raw = unwrapEnvelope(response) || {};
        return {
          enabled: Boolean(raw.enabled || raw.mfa_enabled || raw.mfaEnabled || raw.two_factor_enabled),
          method: raw.method || "authenticator",
        };
      },
      providesTags: ["SecuritySettings"],
    }),

    enableMFA: builder.mutation<EnableMFAResponse, { method?: string; password?: string } | void>({
      query: (body) => ({
        url: "/api/v1/settings/mfa/enable",
        method: "POST",
        body: body || {},
      }),
      transformResponse: (response: any) => normalizeMFAResponse(response),
      invalidatesTags: ["SecuritySettings", "Auth", "User"],
    }),

    disableMFA: builder.mutation<{ success: boolean; message?: string }, DisableMFARequest | void>({
      query: (body) => ({
        url: "/api/v1/settings/mfa/disable",
        method: "POST",
        body: body || {},
      }),
      transformResponse: (response: any) => {
        const raw = unwrapEnvelope(response) || {};
        return {
          success: raw.success ?? true,
          message: raw.message || "MFA disabled successfully",
        };
      },
      invalidatesTags: ["SecuritySettings", "Auth", "User"],
    }),

    verifyMFA: builder.mutation<{ success: boolean; message?: string }, VerifyMFARequest>({
      query: (body) => ({
        url: "/api/v1/settings/mfa/verify",
        method: "POST",
        body: {
          code: body.code || body.otp,
          otp: body.code || body.otp,
          secret: body.secret,
        },
      }),
      transformResponse: (response: any) => {
        const raw = unwrapEnvelope(response) || {};
        return {
          success: raw.success ?? true,
          message: raw.message || "MFA verified and activated",
        };
      },
      invalidatesTags: ["SecuritySettings", "Auth", "User"],
    }),
  }),
});

export const {
  useGetHRSettingsQuery,
  useLazyGetHRSettingsQuery,
  useUpdateHRSettingsMutation,
  useGetMFASettingsQuery,
  useLazyGetMFASettingsQuery,
  useEnableMFAMutation,
  useDisableMFAMutation,
  useVerifyMFAMutation,
} = settingsApi;
