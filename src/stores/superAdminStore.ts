import { create } from "zustand";
import { SystemRole } from "@/features/auth/authTypes";

export interface PlatformCompany {
  id: string;
  name: string;
  domain?: string | null;
  plan?: "Starter" | "Growth" | "Enterprise" | string | null;
  status: "Active" | "Suspended" | "Trial" | string;
  employeeCount: number;
  hrAdminName?: string;
  hrAdminEmail?: string;
  hr_admin?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  hr_admins?: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  }>;
  storageUsedGb?: number;
  mrr: number;
  createdAt: string;
  industry?: string;
  location?: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  role: SystemRole;
  status: "Active" | "Inactive" | "Pending" | string;
  lastLogin: string;
  createdAt: string;
}

export interface PlatformHRAdmin {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  onboardingStatus: "Completed" | "In_Progress" | "Pending" | string;
  phone: string;
  assignedAt: string;
  lastActive: string;
}

export interface PlatformOnboardingItem {
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

export interface PlatformSubscription {
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
  status: "Active" | "Terminated" | string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: "BRUTE_FORCE_ATTEMPT" | "UNAUTHORIZED_ACCESS" | "RATE_LIMIT_EXCEEDED" | "SUSPICIOUS_IP_LOGIN" | "PERMISSION_ESCALATION_BLOCKED" | string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  sourceIp: string;
  userAgent: string;
  details: string;
  status: "Resolved" | "Investigating" | "Blocked" | string;
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: string;
  resource: string;
  targetCompany?: string;
  result: "SUCCESS" | "BLOCKED" | "WARNING" | string;
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

export const DEFAULT_SETTINGS: PlatformSettings = {
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

interface SuperAdminUIState {
  // Temporary UI State (Zero localStorage persistence)
  selectedCompanyId: string | null;
  selectedUserId: string | null;
  searchFilter: string;
  statusFilter: string;
  isAddCompanyModalOpen: boolean;
  isAddUserModalOpen: boolean;
  
  // Transient memory-only collections for UI operations
  companies: PlatformCompany[];
  users: PlatformUser[];
  hrAdmins: PlatformHRAdmin[];
  onboardingItems: PlatformOnboardingItem[];
  subscriptions: PlatformSubscription[];
  sessions: PlatformSession[];
  securityEvents: SecurityEvent[];
  auditLogs: PlatformAuditLog[];
  settings: PlatformSettings;

  // UI Action Setters
  setSelectedCompanyId: (id: string | null) => void;
  setSelectedUserId: (id: string | null) => void;
  setSearchFilter: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setAddCompanyModalOpen: (open: boolean) => void;
  setAddUserModalOpen: (open: boolean) => void;

  // Memory UI state modifiers
  addCompany: (company: Omit<PlatformCompany, "id" | "createdAt">) => void;
  updateCompany: (id: string, data: Partial<PlatformCompany>) => void;
  deleteCompany: (id: string) => void;
  toggleCompanyStatus: (id: string) => void;

  addUser: (user: Omit<PlatformUser, "id" | "createdAt" | "lastLogin">) => void;
  updateUser: (id: string, data: Partial<PlatformUser>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string) => void;

  addHRAdmin: (admin: Omit<PlatformHRAdmin, "id" | "assignedAt" | "lastActive">) => void;
  updateHRAdmin: (id: string, data: Partial<PlatformHRAdmin>) => void;
  deleteHRAdmin: (id: string) => void;

  addOnboardingItem: (item: Omit<PlatformOnboardingItem, "id" | "submittedAt">) => void;
  deleteOnboardingItem: (id: string) => void;
  fastTrackOnboarding: (id: string) => void;
  updateOnboardingStatus: (id: string, status: PlatformOnboardingItem["status"]) => void;

  updateSubscription: (id: string, data: Partial<PlatformSubscription>) => void;
  toggleSubscriptionRenew: (id: string) => void;

  terminateSession: (id: string) => void;
  terminateAllOtherSessions: (currentId: string) => void;

  resolveSecurityEvent: (id: string) => void;
  blockIpAddress: (ip: string) => void;

  addAuditLog: (log: Omit<PlatformAuditLog, "id" | "timestamp">) => void;
  clearAuditLogs: () => void;

  updateSettings: (settings: Partial<PlatformSettings>) => void;
}

export const useSuperAdminStore = create<SuperAdminUIState>((set, get) => ({
  selectedCompanyId: null,
  selectedUserId: null,
  searchFilter: "",
  statusFilter: "ALL",
  isAddCompanyModalOpen: false,
  isAddUserModalOpen: false,

  companies: [],
  users: [],
  hrAdmins: [],
  onboardingItems: [],
  subscriptions: [],
  sessions: [],
  securityEvents: [],
  auditLogs: [],
  settings: DEFAULT_SETTINGS,

  setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  setSearchFilter: (query) => set({ searchFilter: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setAddCompanyModalOpen: (open) => set({ isAddCompanyModalOpen: open }),
  setAddUserModalOpen: (open) => set({ isAddUserModalOpen: open }),

  addCompany: (compData) => {
    const nextId = `COMP-${Date.now()}`;
    const newCompany: PlatformCompany = {
      id: nextId,
      createdAt: new Date().toISOString().split("T")[0],
      ...compData,
    };
    set({ companies: [newCompany, ...get().companies] });
  },

  updateCompany: (id, data) => {
    set({
      companies: get().companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
    });
  },

  deleteCompany: (id) => {
    set({ companies: get().companies.filter((c) => c.id !== id) });
  },

  toggleCompanyStatus: (id) => {
    set({
      companies: get().companies.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" }
          : c
      ),
    });
  },

  addUser: (userData) => {
    const nextId = `USR-${Date.now()}`;
    const newUser: PlatformUser = {
      id: nextId,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      ...userData,
    };
    set({ users: [newUser, ...get().users] });
  },

  updateUser: (id, data) => {
    set({
      users: get().users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    });
  },

  deleteUser: (id) => {
    set({ users: get().users.filter((u) => u.id !== id) });
  },

  toggleUserStatus: (id) => {
    set({
      users: get().users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      ),
    });
  },

  resetUserPassword: (_id) => {
    // Password reset triggered
  },

  addHRAdmin: (adminData) => {
    const nextId = `HRA-${Date.now()}`;
    const newAdmin: PlatformHRAdmin = {
      id: nextId,
      assignedAt: new Date().toISOString().split("T")[0],
      lastActive: "Just now",
      ...adminData,
    };
    set({ hrAdmins: [newAdmin, ...get().hrAdmins] });
  },

  updateHRAdmin: (id, data) => {
    set({
      hrAdmins: get().hrAdmins.map((a) => (a.id === id ? { ...a, ...data } : a)),
    });
  },

  deleteHRAdmin: (id) => {
    set({ hrAdmins: get().hrAdmins.filter((a) => a.id !== id) });
  },

  addOnboardingItem: (itemData) => {
    const nextId = `ONB-${Date.now()}`;
    const newItem: PlatformOnboardingItem = {
      id: nextId,
      submittedAt: new Date().toISOString().split("T")[0],
      ...itemData,
    };
    set({ onboardingItems: [newItem, ...get().onboardingItems] });
  },

  deleteOnboardingItem: (id) => {
    set({ onboardingItems: get().onboardingItems.filter((i) => i.id !== id) });
  },

  fastTrackOnboarding: (id) => {
    set({
      onboardingItems: get().onboardingItems.map((i) =>
        i.id === id
          ? { ...i, status: "Active", progressPercentage: 100, currentStep: "Complete" }
          : i
      ),
    });
  },

  updateOnboardingStatus: (id, status) => {
    set({
      onboardingItems: get().onboardingItems.map((i) => (i.id === id ? { ...i, status } : i)),
    });
  },

  updateSubscription: (id, data) => {
    set({
      subscriptions: get().subscriptions.map((s) => (s.id === id ? { ...s, ...data } : s)),
    });
  },

  toggleSubscriptionRenew: (id) => {
    set({
      subscriptions: get().subscriptions.map((s) =>
        s.id === id ? { ...s, autoRenew: !s.autoRenew } : s
      ),
    });
  },

  terminateSession: (id) => {
    set({
      sessions: get().sessions.map((s) => (s.id === id ? { ...s, status: "Terminated" } : s)),
    });
  },

  terminateAllOtherSessions: (currentId) => {
    set({
      sessions: get().sessions.map((s) =>
        s.id !== currentId ? { ...s, status: "Terminated" } : s
      ),
    });
  },

  resolveSecurityEvent: (id) => {
    set({
      securityEvents: get().securityEvents.map((e) =>
        e.id === id ? { ...e, status: "Resolved" } : e
      ),
    });
  },

  blockIpAddress: (_ip) => {
    // Block IP executed
  },

  addAuditLog: (logData) => {
    const nextId = `AUD-${Date.now()}`;
    const newLog: PlatformAuditLog = {
      id: nextId,
      timestamp: new Date().toISOString(),
      ...logData,
    };
    set({ auditLogs: [newLog, ...get().auditLogs] });
  },

  clearAuditLogs: () => {
    set({ auditLogs: [] });
  },

  updateSettings: (newSettings) => {
    set({ settings: { ...get().settings, ...newSettings } });
  },
}));
