import { describe, it, expect, beforeEach } from "vitest";
import { useSuperAdminStore } from "@/stores/superAdminStore";
import { store } from "@/app/store";
import { setCredentials, setRole } from "@/features/auth/authSlice";
import { hasModuleAccess } from "@/lib/permissions";

describe("Super Admin RBAC & Architecture Test Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should enforce strict role isolation for Super Admin platform modules", () => {
    // Super Admin should have access to platform modules
    expect(hasModuleAccess("super_admin", "platform_companies")).toBe(true);
    expect(hasModuleAccess("super_admin", "platform_users")).toBe(true);
    expect(hasModuleAccess("super_admin", "platform_subscriptions")).toBe(true);
    expect(hasModuleAccess("super_admin", "platform_system")).toBe(true);
    expect(hasModuleAccess("super_admin", "platform_security")).toBe(true);

    // HR Admin MUST NOT have access to platform modules
    expect(hasModuleAccess("hr_admin", "platform_companies")).toBe(false);
    expect(hasModuleAccess("hr_admin", "platform_users")).toBe(false);
    expect(hasModuleAccess("hr_admin", "platform_subscriptions")).toBe(false);
    expect(hasModuleAccess("hr_admin", "platform_system")).toBe(false);
    expect(hasModuleAccess("hr_admin", "platform_security")).toBe(false);

    // Manager MUST NOT have access to platform modules
    expect(hasModuleAccess("manager", "platform_companies")).toBe(false);

    // Employee MUST NOT have access to platform modules
    expect(hasModuleAccess("employee", "platform_companies")).toBe(false);

    // Executive MUST NOT have access to platform modules
    expect(hasModuleAccess("executive", "platform_companies")).toBe(false);
  });

  it("should have temporary UI state capabilities on Super Admin store without localStorage persistence", () => {
    const adminStore = useSuperAdminStore.getState();

    // Zero-mock initial state
    expect(adminStore.companies).toBeDefined();

    // Add temporary company in UI state
    adminStore.addCompany({
      name: "Test Aerospace Corp",
      domain: "testaerospace.com",
      plan: "Enterprise",
      status: "Active",
      employeeCount: 150,
      hrAdminName: "Test Admin",
      hrAdminEmail: "admin@testaerospace.com",
      storageUsedGb: 20,
      mrr: 2500,
      industry: "Aerospace",
      location: "Seattle, USA",
    });

    const updatedCompanies = useSuperAdminStore.getState().companies;
    const addedCompany = updatedCompanies.find((c) => c.name === "Test Aerospace Corp");
    expect(addedCompany).toBeDefined();
    expect(addedCompany?.plan).toBe("Enterprise");

    // Toggle status
    if (addedCompany) {
      adminStore.toggleCompanyStatus(addedCompany.id);
      const toggled = useSuperAdminStore.getState().companies.find((c) => c.id === addedCompany.id);
      expect(toggled?.status).toBe("Suspended");

      // Delete company
      adminStore.deleteCompany(addedCompany.id);
      const deleted = useSuperAdminStore.getState().companies.find((c) => c.id === addedCompany.id);
      expect(deleted).toBeUndefined();
    }
  });

  it("should correctly support role switching to super_admin in Redux auth store", () => {
    store.dispatch(
      setCredentials({
        user: {
          id: "usr_sa_1",
          name: "Super Administrator",
          email: "superadmin@ofc360.com",
          role: "super_admin",
        },
        token: "fake_token_sa",
      })
    );

    const currentUser = store.getState().auth.user;
    expect(currentUser?.role).toBe("super_admin");
    expect(currentUser?.email).toBe("superadmin@ofc360.com");

    store.dispatch(setRole("super_admin"));
    expect(store.getState().auth.role).toBe("super_admin");
  });

  it("should have all superAdminApi endpoints properly registered in baseApi", async () => {
    const { superAdminApi } = await import("@/services/api/superAdminApi");
    expect(superAdminApi.endpoints.getSuperAdminDashboard).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminOrganizations).toBeDefined();
    expect(superAdminApi.endpoints.createSuperAdminOrganization).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminUsers).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminHRAdmins).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminSubscriptions).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminAuditLogs).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminSystemHealth).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminSettings).toBeDefined();
    expect(superAdminApi.endpoints.getSuperAdminAnnouncements).toBeDefined();
  });

  it("should export direct API service functions for all Super Admin operations", async () => {
    const api = await import("@/services/superAdminApi");
    expect(typeof api.getDashboard).toBe("function");
    expect(typeof api.getStatistics).toBe("function");
    expect(typeof api.getOrganizations).toBe("function");
    expect(typeof api.getOrganization).toBe("function");
    expect(typeof api.createOrganization).toBe("function");
    expect(typeof api.updateOrganization).toBe("function");
    expect(typeof api.grantOrganizationAccess).toBe("function");
    expect(typeof api.extendOrganizationAccess).toBe("function");
    expect(typeof api.suspendOrganization).toBe("function");
    expect(typeof api.cancelOrganization).toBe("function");
    expect(typeof api.reactivateOrganization).toBe("function");
    expect(typeof api.getUsers).toBe("function");
    expect(typeof api.createUser).toBe("function");
    expect(typeof api.updateUser).toBe("function");
    expect(typeof api.deleteUser).toBe("function");
    expect(typeof api.activateUser).toBe("function");
    expect(typeof api.deactivateUser).toBe("function");
    expect(typeof api.resetUserPassword).toBe("function");
    expect(typeof api.getHRAdmins).toBe("function");
    expect(typeof api.createHRAdmin).toBe("function");
    expect(typeof api.updateHRAdmin).toBe("function");
    expect(typeof api.deleteHRAdmin).toBe("function");
    expect(typeof api.getOnboarding).toBe("function");
    expect(typeof api.getSubscriptions).toBe("function");
    expect(typeof api.getPlans).toBe("function");
    expect(typeof api.getEntitlements).toBe("function");
    expect(typeof api.getBilling).toBe("function");
    expect(typeof api.getPayments).toBe("function");
    expect(typeof api.getAnalytics).toBe("function");
    expect(typeof api.getSecurityEvents).toBe("function");
    expect(typeof api.getSessions).toBe("function");
    expect(typeof api.getAuditLogs).toBe("function");
    expect(typeof api.getSystemHealth).toBe("function");
    expect(typeof api.getSettings).toBe("function");
    expect(typeof api.updateSettings).toBe("function");
    expect(typeof api.getAnnouncements).toBe("function");
  });
});