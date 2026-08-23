/**
 * Legacy barrel file — re-exports from the canonical settings API.
 * New code should import directly from "@/features/settings/api".
 */
export {
  settingsApi,
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
} from "@/features/settings/api";

export type {
  SecuritySettings,
  NotificationSettings,
  BrandingSettings,
  IntegrationSettings,
  BillingSettings,
} from "@/features/settings/api";