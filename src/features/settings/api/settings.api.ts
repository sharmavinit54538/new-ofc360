import { api } from "@/api/client";

export interface SecuritySettings {
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
    expiry_days: number;
    history_count: number;
  };
  mfa: {
    enabled: boolean;
    methods: ("totp" | "sms" | "email")[];
    required_for_roles: string[];
  };
  session: {
    timeout_minutes: number;
    max_concurrent_sessions: number;
    remember_me_days: number;
  };
  ip_whitelist: {
    enabled: boolean;
    allowed_ips: string[];
  };
  device_management: {
    trusted_devices_only: boolean;
    max_devices_per_user: number;
  };
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    smtp_host?: string;
    smtp_port?: number;
    smtp_user?: string;
    from_email?: string;
    from_name?: string;
  };
  sms: {
    enabled: boolean;
    provider?: string;
    api_key?: string;
    sender_id?: string;
  };
  push: {
    enabled: boolean;
    firebase_config?: any;
  };
  in_app: {
    enabled: boolean;
    retention_days: number;
  };
  events: Record<string, { email: boolean; sms: boolean; push: boolean; in_app: boolean }>;
}

export interface BrandingSettings {
  company_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  login_background_url?: string;
  custom_css?: string;
  custom_domain?: string;
}

export interface IntegrationSettings {
  slack: {
    enabled: boolean;
    webhook_url?: string;
    bot_token?: string;
    signing_secret?: string;
  };
  teams: {
    enabled: boolean;
    webhook_url?: string;
  };
  google_workspace: {
    enabled: boolean;
    client_id?: string;
    client_secret?: string;
  };
  microsoft_365: {
    enabled: boolean;
    client_id?: string;
    client_secret?: string;
  };
  github: {
    enabled: boolean;
    client_id?: string;
    client_secret?: string;
  };
  jira: {
    enabled: boolean;
    base_url?: string;
    email?: string;
    api_token?: string;
  };
}

export interface BillingSettings {
  plan: string;
  billing_cycle: "monthly" | "yearly";
  seats: number;
  price_per_seat: number;
  currency: string;
  payment_method?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  next_billing_date?: string;
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    pdf_url?: string;
  }>;
}

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSecuritySettings: builder.query<SecuritySettings, void>({
      query: () => "/api/v1/settings/security",
      providesTags: ["Settings", "Security"],
    }),

    updateSecuritySettings: builder.mutation<SecuritySettings, Partial<SecuritySettings>>({
      query: (body) => ({
        url: "/api/v1/settings/security",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings", "Security"],
    }),

    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => "/api/v1/settings/notifications",
      providesTags: ["Settings"],
    }),

    updateNotificationSettings: builder.mutation<NotificationSettings, Partial<NotificationSettings>>({
      query: (body) => ({
        url: "/api/v1/settings/notifications",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    getBrandingSettings: builder.query<BrandingSettings, void>({
      query: () => "/api/v1/settings/branding",
      providesTags: ["Settings", "Branding"],
    }),

    updateBrandingSettings: builder.mutation<BrandingSettings, Partial<BrandingSettings>>({
      query: (body) => ({
        url: "/api/v1/settings/branding",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings", "Branding"],
    }),

    getIntegrationSettings: builder.query<IntegrationSettings, void>({
      query: () => "/api/v1/settings/integrations",
      providesTags: ["Settings"],
    }),

    updateIntegrationSettings: builder.mutation<IntegrationSettings, Partial<IntegrationSettings>>({
      query: (body) => ({
        url: "/api/v1/settings/integrations",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    getBillingSettings: builder.query<BillingSettings, void>({
      query: () => "/api/v1/settings/billing",
      providesTags: ["Settings", "Billing"],
    }),

    updateBillingSettings: builder.mutation<BillingSettings, Partial<BillingSettings>>({
      query: (body) => ({
        url: "/api/v1/settings/billing",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings", "Billing"],
    }),

    getSubscriptionPlans: builder.query<any[], void>({
      query: () => "/api/v1/settings/plans",
      providesTags: ["Settings", "Billing"],
    }),

    upgradeSubscription: builder.mutation<any, { plan_id: string; billing_cycle: "monthly" | "yearly" }>({
      query: (body) => ({
        url: "/api/v1/settings/upgrade",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings", "Billing"],
    }),

    cancelSubscription: builder.mutation<any, void>({
      query: () => ({
        url: "/api/v1/settings/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Settings", "Billing"],
    }),

    getAuditLogs: builder.query<any[], { page?: number; limit?: number; start_date?: string; end_date?: string }>({
      query: (params) => `/api/v1/settings/audit-logs?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Settings", "Audit"],
    }),

    exportAuditLogs: builder.query<Blob, { start_date: string; end_date: string; format?: "csv" | "pdf" }>({
      query: ({ start_date, end_date, format = "csv" }) => ({
        url: `/api/v1/settings/audit-logs/export?start_date=${start_date}&end_date=${end_date}&format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    testEmailConfiguration: builder.mutation<{ success: boolean; message: string }, { test_email: string }>({
      query: (body) => ({
        url: "/api/v1/settings/test-email",
        method: "POST",
        body,
      }),
    }),

    testSmsConfiguration: builder.mutation<{ success: boolean; message: string }, { test_phone: string }>({
      query: (body) => ({
        url: "/api/v1/settings/test-sms",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetBrandingSettingsQuery,
  useUpdateBrandingSettingsMutation,
  useGetIntegrationSettingsQuery,
  useUpdateIntegrationSettingsMutation,
  useGetBillingSettingsQuery,
  useUpdateBillingSettingsMutation,
  useGetSubscriptionPlansQuery,
  useUpgradeSubscriptionMutation,
  useCancelSubscriptionMutation,
  useGetAuditLogsQuery,
  useExportAuditLogsQuery,
  useTestEmailConfigurationMutation,
  useTestSmsConfigurationMutation,
} = settingsApi;

export type {
  SecuritySettings,
  NotificationSettings,
  BrandingSettings,
  IntegrationSettings,
  BillingSettings,
};