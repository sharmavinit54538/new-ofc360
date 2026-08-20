import type { SystemRole } from "@/features/auth/authTypes";

export interface PlatformCompany {
  id: string; name: string; domain?: string | null; plan?: string | null;
  status: "Active" | "Suspended" | "Trial" | string; employeeCount: number;
  hrAdminName?: string; hrAdminEmail?: string; hr_admin?: any; hr_admins?: any[];
  storageUsedGb?: number; mrr: number; createdAt: string; industry?: string; location?: string;
}

export interface PlatformUser {
  id: string; name: string; email: string; companyId: string;
  companyName: string; role: SystemRole; status: "Active" | "Inactive" | "Pending" | string;
  lastLogin: string; createdAt: string;
}

export interface PlatformHRAdmin {
  id: string; name: string; email: string; companyId: string;
  companyName: string; onboardingStatus: "Completed" | "In_Progress" | "Pending" | string;
  phone: string; assignedAt: string; lastActive: string;
}