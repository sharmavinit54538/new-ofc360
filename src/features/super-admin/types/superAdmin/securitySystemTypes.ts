export interface SuperAdminSecurityData {
  mfaEnforcementPct: number;
  activeSessionsCount: number;
  threatLevel: "Low" | "Elevated" | "High";
  blockedIpCount: number;
}
export interface SuperAdminSecurityEvent {
  id: string;
  eventType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  ipAddress: string;
  userEmail?: string;
  timestamp: string;
  details: string;
}
export interface SuperAdminSession {
  id: string;
  userEmail: string;
  organizationName: string;
  ipAddress: string;
  userAgent: string;
  startedAt: string;
  lastActiveAt: string;
  isRevoked: boolean;
}
export interface SuperAdminAuditLogItem {
  id: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  status: "Success" | "Failed";
}
export interface SuperAdminServiceHealth {
  name: string;
  status: "Healthy" | "Degraded" | "Down" | "ONLINE" | "OFFLINE" | string;
  latencyMs?: number;
  response_time?: string;
  uptimePct?: number;
  is_healthy?: boolean;
}
export interface SuperAdminSystemHealthData {
  overallStatus: "Operational" | "Degraded" | "Critical";
  uptime: number;
  services: SuperAdminServiceHealth[];
}
export interface SuperAdminSettings {
  maintenanceMode: boolean;
  selfRegistrationEnabled: boolean;
  defaultTrialDays: number;
  alertEmailRecipients: string[];
}
export interface SuperAdminOnboardingItem {
  id: string;
  companyName: string;
  adminEmail: string;
  currentStep: number;
  progressPct: number;
  startedAt: string;
}
export interface SuperAdminAnalyticsData {
  activeUsersToday: number;
  totalApiCalls24h: number;
  errorRatePct: number;
  storageUsedGb: number;
}
export interface SuperAdminAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: "All" | "Admins" | "Enterprises";
  priority: "Normal" | "Important" | "Urgent";
  publishedAt: string;
  expiresAt?: string;
}