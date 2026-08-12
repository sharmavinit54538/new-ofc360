import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";

export interface PlatformCompany {
  id: string;
  name: string;
  domain: string;
  plan: "Starter" | "Growth" | "Enterprise";
  status: "Active" | "Suspended" | "Trial";
  employeeCount: number;
  hrAdminName: string;
  hrAdminEmail: string;
  storageUsedGb: number;
  mrr: number;
  createdAt: string;
  industry: string;
  location: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  role: "hr_admin" | "manager" | "employee" | "cxo" | "it_admin";
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  createdAt: string;
}

export interface PlatformHRAdmin {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  onboardingStatus: "Completed" | "In_Progress" | "Pending";
  phone: string;
  assignedAt: string;
  lastActive: string;
}

export interface PlatformOnboardingItem {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  tier: "Starter" | "Growth" | "Enterprise";
  progressPercentage: number;
  currentStep: string;
  status: "Pending_Review" | "Active" | "Blocked";
  submittedAt: string;
  notes?: string;
}

export interface PlatformSubscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: "Starter" | "Growth" | "Enterprise";
  billingCycle: "Monthly" | "Annual";
  amount: number;
  nextBillingDate: string;
  status: "Active" | "Past_Due" | "Canceled";
  activeLicenses: number;
  maxLicenses: number;
  autoRenew: boolean;
}

export interface PlatformSession {
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
  status: "Active" | "Terminated";
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: "BRUTE_FORCE_ATTEMPT" | "UNAUTHORIZED_ACCESS" | "RATE_LIMIT_EXCEEDED" | "SUSPICIOUS_IP_LOGIN" | "PERMISSION_ESCALATION_BLOCKED";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  sourceIp: string;
  userAgent: string;
  details: string;
  status: "Resolved" | "Investigating" | "Blocked";
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  resource: string;
  targetCompany?: string;
  result: "SUCCESS" | "BLOCKED" | "WARNING";
  ip: string;
}

export interface PlatformSettings {
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

const DEFAULT_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  enforceMfaGlobally: true,
  sessionTimeoutMinutes: 60,
  defaultTrialDays: 14,
  emailSenderName: "OFC360 System",
  emailSenderAddress: "no-reply@ofc360.com",
  aiTokenRateLimitPerHour: 50000,
  securityAlertEmail: "security@ofc360.com",
  autoBackupIntervalHours: 6,
};

const STORAGE_KEYS = {
  COMPANIES: "ofc360_platform_companies_live",
  USERS: "ofc360_platform_users_live",
  HR_ADMINS: "ofc360_platform_hradmins_live",
  ONBOARDING: "ofc360_platform_onboarding_live",
  SUBSCRIPTIONS: "ofc360_platform_subscriptions_live",
  SESSIONS: "ofc360_platform_sessions_live",
  SECURITY_EVENTS: "ofc360_platform_security_events_live",
  AUDIT_LOGS: "ofc360_platform_audit_logs_live",
  SETTINGS: "ofc360_platform_settings_live",
};

interface SuperAdminState {
  companies: PlatformCompany[];
  users: PlatformUser[];
  hrAdmins: PlatformHRAdmin[];
  onboardingItems: PlatformOnboardingItem[];
  subscriptions: PlatformSubscription[];
  sessions: PlatformSession[];
  securityEvents: SecurityEvent[];
  auditLogs: PlatformAuditLog[];
  settings: PlatformSettings;

  // Companies CRUD
  addCompany: (company: Omit<PlatformCompany, "id" | "createdAt">) => void;
  updateCompany: (id: string, data: Partial<PlatformCompany>) => void;
  deleteCompany: (id: string) => void;
  toggleCompanyStatus: (id: string) => void;

  // Users CRUD
  addUser: (user: Omit<PlatformUser, "id" | "createdAt" | "lastLogin">) => void;
  updateUser: (id: string, data: Partial<PlatformUser>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string) => void;

  // HR Admins CRUD
  addHRAdmin: (admin: Omit<PlatformHRAdmin, "id" | "assignedAt" | "lastActive">) => void;
  updateHRAdmin: (id: string, data: Partial<PlatformHRAdmin>) => void;
  deleteHRAdmin: (id: string) => void;

  // Onboarding
  addOnboardingItem: (item: Omit<PlatformOnboardingItem, "id" | "submittedAt">) => void;
  deleteOnboardingItem: (id: string) => void;
  fastTrackOnboarding: (id: string) => void;
  updateOnboardingStatus: (id: string, status: PlatformOnboardingItem["status"]) => void;

  // Subscriptions
  updateSubscription: (id: string, data: Partial<PlatformSubscription>) => void;
  toggleSubscriptionRenew: (id: string) => void;

  // Sessions
  terminateSession: (id: string) => void;
  terminateAllOtherSessions: (currentId: string) => void;

  // Security Events
  resolveSecurityEvent: (id: string) => void;
  blockIpAddress: (ip: string) => void;

  // Audit Logs
  addAuditLog: (log: Omit<PlatformAuditLog, "id" | "timestamp">) => void;
  clearAuditLogs: () => void;

  // Settings
  updateSettings: (settings: Partial<PlatformSettings>) => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set, get) => ({
  companies: getStoredData<PlatformCompany[]>(STORAGE_KEYS.COMPANIES, []),
  users: getStoredData<PlatformUser[]>(STORAGE_KEYS.USERS, []),
  hrAdmins: getStoredData<PlatformHRAdmin[]>(STORAGE_KEYS.HR_ADMINS, []),
  onboardingItems: getStoredData<PlatformOnboardingItem[]>(STORAGE_KEYS.ONBOARDING, []),
  subscriptions: getStoredData<PlatformSubscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, []),
  sessions: getStoredData<PlatformSession[]>(STORAGE_KEYS.SESSIONS, []),
  securityEvents: getStoredData<SecurityEvent[]>(STORAGE_KEYS.SECURITY_EVENTS, []),
  auditLogs: getStoredData<PlatformAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []),
  settings: getStoredData<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),

  addCompany: (compData) => {
    const nextId = `COMP-${String(get().companies.length + 101)}`;
    const newCompany: PlatformCompany = {
      id: nextId,
      createdAt: new Date().toISOString().split("T")[0],
      ...compData,
    };
    const updated = [newCompany, ...get().companies];
    setStoredData(STORAGE_KEYS.COMPANIES, updated);
    set({ companies: updated });

    // Also register real subscription record
    const newSub: PlatformSubscription = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      companyId: nextId,
      companyName: newCompany.name,
      plan: newCompany.plan,
      billingCycle: "Monthly",
      amount: newCompany.mrr,
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "Active",
      activeLicenses: newCompany.employeeCount || 1,
      maxLicenses: (newCompany.employeeCount || 1) + 50,
      autoRenew: true,
    };
    const updatedSubs = [newSub, ...get().subscriptions];
    setStoredData(STORAGE_KEYS.SUBSCRIPTIONS, updatedSubs);
    set({ subscriptions: updatedSubs });

    // Automatically record real audit log
    get().addAuditLog({
      actor: "Super Administrator",
      actorEmail: "superadmin@ofc360.com",
      action: "COMPANY_CREATED",
      resource: `Company ${newCompany.name}`,
      targetCompany: newCompany.name,
      result: "SUCCESS",
      ip: window.location.hostname || "127.0.0.1",
    });
  },

  updateCompany: (id, data) => {
    const updated = get().companies.map((c) => (c.id === id ? { ...c, ...data } : c));
    setStoredData(STORAGE_KEYS.COMPANIES, updated);
    set({ companies: updated });
  },

  deleteCompany: (id) => {
    const comp = get().companies.find((c) => c.id === id);
    const updated = get().companies.filter((c) => c.id !== id);
    setStoredData(STORAGE_KEYS.COMPANIES, updated);
    set({ companies: updated });

    if (comp) {
      get().addAuditLog({
        actor: "Super Administrator",
        actorEmail: "superadmin@ofc360.com",
        action: "COMPANY_DELETED",
        resource: `Company ID ${id}`,
        targetCompany: comp.name,
        result: "SUCCESS",
        ip: window.location.hostname || "127.0.0.1",
      });
    }
  },

  toggleCompanyStatus: (id) => {
    const comp = get().companies.find((c) => c.id === id);
    if (!comp) return;
    const newStatus = comp.status === "Active" ? "Suspended" : "Active";
    get().updateCompany(id, { status: newStatus });
  },

  addUser: (userData) => {
    const nextId = `USR-${String(get().users.length + 101)}`;
    const newUser: PlatformUser = {
      id: nextId,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      ...userData,
    };
    const updated = [newUser, ...get().users];
    setStoredData(STORAGE_KEYS.USERS, updated);
    set({ users: updated });

    get().addAuditLog({
      actor: "Super Administrator",
      actorEmail: "superadmin@ofc360.com",
      action: "USER_PROVISIONED",
      resource: `User ${newUser.email}`,
      targetCompany: newUser.companyName,
      result: "SUCCESS",
      ip: window.location.hostname || "127.0.0.1",
    });
  },

  updateUser: (id, data) => {
    const updated = get().users.map((u) => (u.id === id ? { ...u, ...data } : u));
    setStoredData(STORAGE_KEYS.USERS, updated);
    set({ users: updated });
  },

  deleteUser: (id) => {
    const updated = get().users.filter((u) => u.id !== id);
    setStoredData(STORAGE_KEYS.USERS, updated);
    set({ users: updated });
  },

  toggleUserStatus: (id) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    get().updateUser(id, { status: newStatus });
  },

  resetUserPassword: (id) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;
    get().addAuditLog({
      actor: "Super Administrator",
      actorEmail: "superadmin@ofc360.com",
      action: "USER_PASSWORD_RESET_TRIGGERED",
      resource: `User ${user.email}`,
      targetCompany: user.companyName,
      result: "SUCCESS",
      ip: window.location.hostname || "127.0.0.1",
    });
  },

  addHRAdmin: (adminData) => {
    const nextId = `HRA-${String(get().hrAdmins.length + 101)}`;
    const newAdmin: PlatformHRAdmin = {
      id: nextId,
      assignedAt: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      ...adminData,
    };
    const updated = [newAdmin, ...get().hrAdmins];
    setStoredData(STORAGE_KEYS.HR_ADMINS, updated);
    set({ hrAdmins: updated });

    get().addAuditLog({
      actor: "Super Administrator",
      actorEmail: "superadmin@ofc360.com",
      action: "HR_ADMIN_PROVISIONED",
      resource: `HR Admin ${newAdmin.email}`,
      targetCompany: newAdmin.companyName,
      result: "SUCCESS",
      ip: window.location.hostname || "127.0.0.1",
    });
  },

  updateHRAdmin: (id, data) => {
    const updated = get().hrAdmins.map((a) => (a.id === id ? { ...a, ...data } : a));
    setStoredData(STORAGE_KEYS.HR_ADMINS, updated);
    set({ hrAdmins: updated });
  },

  deleteHRAdmin: (id) => {
    const updated = get().hrAdmins.filter((a) => a.id !== id);
    setStoredData(STORAGE_KEYS.HR_ADMINS, updated);
    set({ hrAdmins: updated });
  },

  addOnboardingItem: (itemData) => {
    const nextId = `ONB-${String(get().onboardingItems.length + 101)}`;
    const newItem: PlatformOnboardingItem = {
      id: nextId,
      submittedAt: new Date().toISOString().split("T")[0],
      ...itemData,
    };
    const updated = [newItem, ...get().onboardingItems];
    setStoredData(STORAGE_KEYS.ONBOARDING, updated);
    set({ onboardingItems: updated });
  },

  deleteOnboardingItem: (id) => {
    const updated = get().onboardingItems.filter((o) => o.id !== id);
    setStoredData(STORAGE_KEYS.ONBOARDING, updated);
    set({ onboardingItems: updated });
  },

  fastTrackOnboarding: (id) => {
    const item = get().onboardingItems.find((o) => o.id === id);
    if (!item) return;

    // Fast-track onboarding item
    const updated = get().onboardingItems.map((o) =>
      o.id === id
        ? { ...o, progressPercentage: 100, currentStep: "Completed & Active", status: "Active" as const }
        : o
    );
    setStoredData(STORAGE_KEYS.ONBOARDING, updated);
    set({ onboardingItems: updated });

    // Provision real company
    get().addCompany({
      name: item.companyName,
      domain: `${item.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      plan: item.tier,
      status: "Active",
      employeeCount: 25,
      hrAdminName: item.contactName,
      hrAdminEmail: item.email,
      storageUsedGb: 10.0,
      mrr: item.tier === "Enterprise" ? 3500 : item.tier === "Growth" ? 1800 : 600,
      industry: "Technology",
      location: "Global",
    });
  },

  updateOnboardingStatus: (id, status) => {
    const updated = get().onboardingItems.map((o) => (o.id === id ? { ...o, status } : o));
    setStoredData(STORAGE_KEYS.ONBOARDING, updated);
    set({ onboardingItems: updated });
  },

  updateSubscription: (id, data) => {
    const updated = get().subscriptions.map((s) => (s.id === id ? { ...s, ...data } : s));
    setStoredData(STORAGE_KEYS.SUBSCRIPTIONS, updated);
    set({ subscriptions: updated });
  },

  toggleSubscriptionRenew: (id) => {
    const sub = get().subscriptions.find((s) => s.id === id);
    if (!sub) return;
    get().updateSubscription(id, { autoRenew: !sub.autoRenew });
  },

  terminateSession: (id) => {
    const updated = get().sessions.map((s) =>
      s.id === id ? { ...s, status: "Terminated" as const } : s
    );
    setStoredData(STORAGE_KEYS.SESSIONS, updated);
    set({ sessions: updated });
  },

  terminateAllOtherSessions: (currentId) => {
    const updated = get().sessions.map((s) =>
      s.id !== currentId ? { ...s, status: "Terminated" as const } : s
    );
    setStoredData(STORAGE_KEYS.SESSIONS, updated);
    set({ sessions: updated });
  },

  resolveSecurityEvent: (id) => {
    const updated = get().securityEvents.map((e) =>
      e.id === id ? { ...e, status: "Resolved" as const } : e
    );
    setStoredData(STORAGE_KEYS.SECURITY_EVENTS, updated);
    set({ securityEvents: updated });
  },

  blockIpAddress: (ip) => {
    get().addAuditLog({
      actor: "Super Administrator",
      actorEmail: "superadmin@ofc360.com",
      action: "IP_BLOCKED_IN_FIREWALL",
      resource: `IP Address ${ip}`,
      result: "BLOCKED",
      ip: window.location.hostname || "127.0.0.1",
    });
  },

  addAuditLog: (logData) => {
    const nextId = `AUD-${String(get().auditLogs.length + 101)}`;
    const newLog: PlatformAuditLog = {
      id: nextId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      ...logData,
    };
    const updated = [newLog, ...get().auditLogs];
    setStoredData(STORAGE_KEYS.AUDIT_LOGS, updated);
    set({ auditLogs: updated });
  },

  clearAuditLogs: () => {
    setStoredData(STORAGE_KEYS.AUDIT_LOGS, []);
    set({ auditLogs: [] });
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    setStoredData(STORAGE_KEYS.SETTINGS, updated);
    set({ settings: updated });
  },
}));
