import { SystemRole } from "@/features/auth/authTypes";

export interface SuperAdminKPIs {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
  total_hr_admins: number;
  total_employees: number;
  total_managers: number;
  total_executives: number;
  total_it_admins: number;
  total_super_admins: number;
  active_users: number;
  inactive_users: number;
  paid_organizations: number;
  complimentary_organizations: number;
  free_organizations: number;
  trial_organizations: number;
  suspended_organizations: number;
  expired_organizations: number;
  total_employees_count: number;
  total_workforce_managed: number;
  active_security_incidents: number;
  dau: number;
  mau: number;
}

export interface SuperAdminFinancials {
  total_revenue: number;
  mrr: number;
  arr: number;
  monthly_recurring_revenue: number;
  annual_recurring_revenue: number;
  revenue_growth: number;
  pending_payments: number;
  failed_payments: number;
}

export interface RevenueTrendItem {
  month: string;
  revenue: number;
  mrr: number;
}

export interface SubscriptionDistributionItem {
  plan: string;
  count: number;
}

export interface StatusDistributionItem {
  name: string;
  value: number;
  color?: string;
}

export interface SuperAdminDashboardCharts {
  revenue_trend: RevenueTrendItem[];
  subscription_distribution: SubscriptionDistributionItem[];
  status_distribution: StatusDistributionItem[];
}

export interface SuperAdminDashboardData {
  kpis: SuperAdminKPIs;
  financials: SuperAdminFinancials;
  charts: SuperAdminDashboardCharts;
  unpaid_active_customers: unknown[];
}

export interface SuperAdminHRAdminSummary {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface SuperAdminOrganization {
  id: string;
  name: string;
  domain?: string | null;
  plan?: "Starter" | "Growth" | "Enterprise" | string | null;
  status: "Active" | "Suspended" | "Trial" | "Deactivated" | string;
  access_status?: string;
  access_type?: string;
  payment_status?: string;
  access_source?: string;
  access_granted_by?: string;
  access_expires_at?: string | null;
  access_grant_reason?: string;
  mrr?: number;
  storageUsedGb?: number;
  industry?: string;
  location?: string;
  user_count?: number;
  employee_count?: number;
  employeeCount?: number;
  hr_admin?: SuperAdminHRAdminSummary | null;
  hr_admins?: SuperAdminHRAdminSummary[];
  hrAdminName?: string;
  hrAdminEmail?: string;
  owner?: {
    name: string;
    email: string;
    phone?: string;
  } | null;
  created_at: string;
  createdAt: string;
}

export interface CreateOrganizationPayload {
  name: string;
  domain?: string;
  plan?: "Starter" | "Growth" | "Enterprise" | string;
  status?: "Active" | "Suspended" | "Trial" | string;
  hrAdminName?: string;
  hrAdminEmail: string;
  phone?: string;
  employeeCount?: number;
  mrr?: number;
  industry?: string;
  location?: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  domain?: string;
  plan?: string;
  status?: string;
  hrAdminName?: string;
  hrAdminEmail?: string;
  phone?: string;
  employeeCount?: number;
  mrr?: number;
  industry?: string;
  location?: string;
}

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: SystemRole | string;
  organization_id?: string | null;
  companyId?: string;
  company_id?: string | null;
  company_name?: string;
  companyName?: string;
  organization?: string;
  account_status?: string;
  status: "Active" | "Inactive" | "Pending" | string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  createdAt: string;
  last_login?: string | null;
  lastLogin?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role: string;
  companyId?: string;
  organization_id?: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  role?: string;
  status?: string;
}

export interface SuperAdminSubscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: "Starter" | "Growth" | "Enterprise" | string;
  billingCycle: "Monthly" | "Annual" | string;
  amount: number;
  nextBillingDate: string;
  status: "Active" | "Past_Due" | "Canceled" | string;
  activeLicenses: number;
  maxLicenses: number;
  autoRenew: boolean;
}

export interface SuperAdminPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  max_employees: number;
  is_active: boolean;
}

export interface SuperAdminPayment {
  id: string;
  amount: number;
  currency: string;
  gateway: string;
  invoice_number: string;
  status: string;
  organization_name?: string;
  companyName?: string;
  payment_date: string;
}

export interface SuperAdminSecurityData {
  security_score: number;
  active_sessions_count: number;
  jwt_algorithm: string;
  mfa_enforced: boolean;
  failed_logins_24h: number;
}

export interface SuperAdminSecurityEvent {
  id: string;
  timestamp: string;
  type: "BRUTE_FORCE_ATTEMPT" | "UNAUTHORIZED_ACCESS" | "RATE_LIMIT_EXCEEDED" | "SUSPICIOUS_IP_LOGIN" | "PERMISSION_ESCALATION_BLOCKED" | string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  sourceIp: string;
  userAgent: string;
  details: string;
  status: "Resolved" | "Investigating" | "Blocked" | string;
}

export interface SuperAdminSession {
  id: string;
  adminName: string;
  adminEmail: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  device: string;
  loginTime: string;
  lastActivity: string;
  status: "Active" | "Terminated" | string;
}

export interface SuperAdminAuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  resource: string;
  targetCompany?: string;
  result: "SUCCESS" | "BLOCKED" | "WARNING" | string;
  ip: string;
  ip_address?: string;
  details?: string;
}

export interface SuperAdminServiceHealth {
  name: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | string;
  response_time: string;
  is_healthy: boolean;
  latency?: string;
}

export interface SuperAdminSystemHealthData {
  services: SuperAdminServiceHealth[];
  status?: string;
}

export interface SuperAdminSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  enforceMfaGlobally: boolean;
  sessionTimeoutMinutes: number;
  defaultTrialDays: number;
  emailSenderName: string;
  emailSenderAddress: string;
  aiTokenRateLimitPerHour: number;
  securityAlertEmail: string;
  autoBackupIntervalHours: number;
}

export interface SuperAdminOnboardingItem {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  tier: "Starter" | "Growth" | "Enterprise" | string;
  progressPercentage: number;
  currentStep: string;
  status: "Pending_Review" | "Active" | "Blocked" | string;
  submittedAt: string;
  notes?: string;
}

export interface SuperAdminAnalyticsData {
  module_usage: { name: string; usage: number }[];
  storage: {
    total_used_gb: number;
    total_allocated_gb: number;
    documents_count: number;
  };
}

export interface SuperAdminAnnouncement {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  created_at: string;
}
