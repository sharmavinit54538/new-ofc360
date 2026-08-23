export interface SuperAdminKPIs {
  totalOrganizations?: number;
  total_organizations?: number;
  activeOrganizations?: number;
  active_organizations?: number;
  trialOrganizations?: number;
  trial_organizations?: number;
  activeSubscriptions?: number;
  active_subscriptions?: number;
  totalUsers?: number;
  total_users?: number;
  totalEmployees?: number;
  total_employees?: number;
  totalEmployeesCount?: number;
  total_employees_count?: number;
  totalWorkforceManaged?: number;
  total_workforce_managed?: number;
  totalHRAdmins?: number;
  total_hr_admins?: number;
  totalRevenueMonthly?: number;
  total_revenue_monthly?: number;
  systemHealthScore?: number;
  system_health_score?: number;
  pendingAlertsCount?: number;
  pending_alerts_count?: number;
  activeSecurityIncidents?: number;
  active_security_incidents?: number;
}
export interface SuperAdminFinancials {
  mrr: number;
  arr?: number;
  growthRatePct?: number;
  churnRatePct?: number;
  arpu?: number;
  totalInvoiced?: number;
}
export interface RevenueTrendItem {
  month: string;
  revenue: number;
  target?: number;
}
export interface SubscriptionDistributionItem {
  plan?: string;
  planName?: string;
  count: number;
  percentage?: number;
  color?: string;
}
export interface StatusDistributionItem {
  status: string;
  count: number;
  color?: string;
}