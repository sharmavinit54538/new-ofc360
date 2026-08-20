export interface SuperAdminKPIs {
  totalOrganizations: number; activeSubscriptions: number; totalUsers: number;
  totalRevenueMonthly: number; systemHealthScore: number; pendingAlertsCount: number;
}
export interface SuperAdminFinancials {
  mrr: number; arr: number; growthRatePct: number; churnRatePct: number; arpu: number; totalInvoiced: number;
}
export interface RevenueTrendItem { month: string; revenue: number; target: number; }
export interface SubscriptionDistributionItem { planName: string; count: number; percentage: number; color: string; }
export interface StatusDistributionItem { status: string; count: number; color: string; }