import { api as baseApi } from "@/api/client";
import { RawEnvelope } from "@/services/api/envelope";
import { HRSettings, UpdateHRSettingsRequest } from "@/types/api/settings";
import { normalizeHRSettings } from "./normalizeHRSettings";

export const hrSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHRSettings: builder.query<HRSettings, void>({
      query: () => "/api/v1/settings/hr",
      transformResponse: (response: RawEnvelope<any> | any) => normalizeHRSettings(response),
      providesTags: ["HRDirectory", "CompanySettings"],
    }),
    updateHRSettings: builder.mutation<HRSettings, UpdateHRSettingsRequest>({
      query: (body) => ({
        url: "/api/v1/settings/hr",
        method: "PUT",
        body: {
          head_name: body.headName || body.head_name, headName: body.headName || body.head_name,
          official_email: body.officialEmail || body.official_email, officialEmail: body.officialEmail || body.official_email,
          phone: body.phone,
          escalation_lead: body.escalationLead || body.escalation_lead, escalationLead: body.escalationLead || body.escalation_lead,
          grievance_email: body.grievanceEmail || body.grievance_email, grievanceEmail: body.grievanceEmail || body.grievance_email,
          auto_onboarding_alerts: body.autoOnboardingAlerts ?? body.auto_onboarding_alerts,
          policy_digest_weekly: body.policyDigestWeekly ?? body.policy_digest_weekly,
        },
      }),
      transformResponse: (response: RawEnvelope<any> | any) => normalizeHRSettings(response),
      invalidatesTags: ["HRDirectory", "CompanySettings"],
    }),
  }),
});
export const { useGetHRSettingsQuery, useLazyGetHRSettingsQuery, useUpdateHRSettingsMutation } = hrSettingsApi;
