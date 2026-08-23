import type { SuperAdminKPIs, SuperAdminFinancials, RevenueTrendItem, SubscriptionDistributionItem, StatusDistributionItem } from "./dashboardKpiTypes";

export interface SuperAdminDashboardCharts {
  revenueTrends?: RevenueTrendItem[];
  revenue_trend?: RevenueTrendItem[];
  subscriptionDistribution?: SubscriptionDistributionItem[];
  subscription_distribution?: SubscriptionDistributionItem[];
  organizationStatus?: StatusDistributionItem[];
  organization_status?: StatusDistributionItem[];
}
export interface SuperAdminDashboardData {
  kpis: SuperAdminKPIs;
  financials: SuperAdminFinancials;
  charts: SuperAdminDashboardCharts;
}
export interface SuperAdminHRAdminSummary {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  createdAt: string;
  status: "active" | "inactive";
}