import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrictFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 4. SUPER ADMIN TYPES
// -------------------------------------------------------------
writeStrictFile(path.join(root, 'src/types/superAdmin/dashboardKpiTypes.ts'), `
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
`);

writeStrictFile(path.join(root, 'src/types/superAdmin/dashboardDataTypes.ts'), `
import type { SuperAdminKPIs, SuperAdminFinancials, RevenueTrendItem, SubscriptionDistributionItem, StatusDistributionItem } from "./dashboardKpiTypes";

export interface SuperAdminDashboardCharts {
  revenueTrends: RevenueTrendItem[]; subscriptionDistribution: SubscriptionDistributionItem[]; organizationStatus: StatusDistributionItem[];
}
export interface SuperAdminDashboardData {
  kpis: SuperAdminKPIs; financials: SuperAdminFinancials; charts: SuperAdminDashboardCharts;
}
export interface SuperAdminHRAdminSummary {
  id: string; fullName: string; email: string; companyName: string; createdAt: string; status: "active" | "inactive";
}
`);

writeStrictFile(path.join(root, 'src/types/superAdmin/orgUserTypes.ts'), `
export interface SuperAdminOrganization {
  id: string; name: string; domain: string; tier: "Starter" | "Professional" | "Enterprise";
  status: "Active" | "Suspended" | "Pending" | "Trial"; usersCount: number; maxUsers: number;
  mrr: number; createdAt: string; primaryContactEmail: string; region: string; complianceScore: number;
}
export interface CreateOrganizationPayload { name: string; domain: string; tier: string; primaryContactEmail: string; maxUsers: number; }
export type UpdateOrganizationPayload = Partial<CreateOrganizationPayload> & { status?: string };
export interface SuperAdminUser {
  id: string; name: string; email: string; role: "Super Admin" | "Org Admin" | "Support" | "Auditor";
  organizationId?: string; organizationName?: string; status: "Active" | "Suspended" | "Pending"; lastLogin?: string; createdAt: string;
}
export interface CreateUserPayload { name: string; email: string; role: string; organizationId?: string; }
export type UpdateUserPayload = Partial<CreateUserPayload> & { status?: string };
`);

writeStrictFile(path.join(root, 'src/types/superAdmin/subscriptionPlanTypes.ts'), `
export interface SuperAdminSubscription {
  id: string; organizationId: string; organizationName: string; plan: "Starter" | "Professional" | "Enterprise";
  billingCycle: "Monthly" | "Annual"; amount: number; status: "Active" | "Past Due" | "Cancelled" | "Trialing";
  nextBillingDate: string; autoRenew: boolean; seatsUsed: number; maxSeats: number;
}
export interface SuperAdminPlan {
  id: string; name: string; description: string; monthlyPrice: number; annualPrice: number;
  featureFlags: string[]; maxUsers: number; isPopular?: boolean;
}
export interface SuperAdminPayment {
  id: string; organizationId: string; organizationName: string; invoiceId: string;
  amount: number; status: "Succeeded" | "Failed" | "Pending" | "Refunded"; date: string; paymentMethod: string;
}
`);

writeStrictFile(path.join(root, 'src/types/superAdmin/securitySystemTypes.ts'), `
export interface SuperAdminSecurityData {
  mfaEnforcementPct: number; activeSessionsCount: number; threatLevel: "Low" | "Elevated" | "High"; blockedIpCount: number;
}
export interface SuperAdminSecurityEvent { id: string; eventType: string; severity: "Low" | "Medium" | "High" | "Critical"; ipAddress: string; userEmail?: string; timestamp: string; details: string; }
export interface SuperAdminSession { id: string; userEmail: string; organizationName: string; ipAddress: string; userAgent: string; startedAt: string; lastActiveAt: string; isRevoked: boolean; }
export interface SuperAdminAuditLogItem { id: string; actor: string; action: string; resource: string; ipAddress: string; timestamp: string; status: "Success" | "Failed"; }
export interface SuperAdminServiceHealth { name: string; status: "Healthy" | "Degraded" | "Down"; latencyMs: number; uptimePct: number; }
export interface SuperAdminSystemHealthData { overallStatus: "Operational" | "Degraded" | "Critical"; uptime: number; services: SuperAdminServiceHealth[]; }
export interface SuperAdminSettings { maintenanceMode: boolean; selfRegistrationEnabled: boolean; defaultTrialDays: number; alertEmailRecipients: string[]; }
export interface SuperAdminOnboardingItem { id: string; companyName: string; adminEmail: string; currentStep: number; progressPct: number; startedAt: string; }
export interface SuperAdminAnalyticsData { activeUsersToday: number; totalApiCalls24h: number; errorRatePct: number; storageUsedGb: number; }
export interface SuperAdminAnnouncement { id: string; title: string; content: string; targetAudience: "All" | "Admins" | "Enterprises"; priority: "Normal" | "Important" | "Urgent"; publishedAt: string; expiresAt?: string; }
`);

writeStrictFile(path.join(root, 'src/types/superAdmin.types.ts'), `
export type { SuperAdminKPIs, SuperAdminFinancials, RevenueTrendItem, SubscriptionDistributionItem, StatusDistributionItem } from "./superAdmin/dashboardKpiTypes";
export type { SuperAdminDashboardCharts, SuperAdminDashboardData, SuperAdminHRAdminSummary } from "./superAdmin/dashboardDataTypes";
export type { SuperAdminOrganization, CreateOrganizationPayload, UpdateOrganizationPayload, SuperAdminUser, CreateUserPayload, UpdateUserPayload } from "./superAdmin/orgUserTypes";
export type { SuperAdminSubscription, SuperAdminPlan, SuperAdminPayment } from "./superAdmin/subscriptionPlanTypes";
export type { SuperAdminSecurityData, SuperAdminSecurityEvent, SuperAdminSession, SuperAdminAuditLogItem, SuperAdminServiceHealth, SuperAdminSystemHealthData, SuperAdminSettings, SuperAdminOnboardingItem, SuperAdminAnalyticsData, SuperAdminAnnouncement } from "./superAdmin/securitySystemTypes";
`);

console.log('Modularized superAdmin.types.ts');
