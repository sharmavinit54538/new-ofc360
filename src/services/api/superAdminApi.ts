export * from "./superAdmin/superAdminDashboardEndpoints";
export * from "./superAdmin/superAdminOrganizationsEndpoints";
export * from "./superAdmin/superAdminOrgStandalone";
export * from "./superAdmin/superAdminUsersEndpoints";
export * from "./superAdmin/superAdminUserStandalone";
export * from "./superAdmin/superAdminBillingEndpoints";
export * from "./superAdmin/superAdminSecurityEndpoints";
export * from "./superAdmin/superAdminAuditHealthEndpoints";
export * from "./superAdmin/superAdminOnboardingAnalyticsEndpoints";

import { superAdminDashboardApi } from "./superAdmin/superAdminDashboardEndpoints";
import { superAdminOrganizationsApi } from "./superAdmin/superAdminOrganizationsEndpoints";
import { superAdminUsersApi } from "./superAdmin/superAdminUsersEndpoints";
import { superAdminBillingApi } from "./superAdmin/superAdminBillingEndpoints";
import { superAdminSecurityApi } from "./superAdmin/superAdminSecurityEndpoints";
import { superAdminAuditHealthApi } from "./superAdmin/superAdminAuditHealthEndpoints";
import { superAdminOnboardingAnalyticsApi } from "./superAdmin/superAdminOnboardingAnalyticsEndpoints";

export const superAdminApi = {
  ...superAdminDashboardApi, ...superAdminOrganizationsApi, ...superAdminUsersApi,
  ...superAdminBillingApi, ...superAdminSecurityApi, ...superAdminAuditHealthApi,
  ...superAdminOnboardingAnalyticsApi,
};