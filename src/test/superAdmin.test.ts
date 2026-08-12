import { describe, it, expect, beforeEach } from "vitest";
import { useSuperAdminStore } from "@/stores/superAdminStore";
import { store } from "@/app/store";
import { setCredentials, setRole } from "@/features/auth/authSlice";
import { hasModuleAccess, hasPermission, ROLE_CONFIGS } from "@/lib/permissions";

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

    // CXO MUST NOT have access to platform modules
    expect(hasModuleAccess("cxo", "platform_companies")).toBe(false);
  });

  it("should have all required CRUD capabilities on Super Admin store", () => {
    const adminStore = useSuperAdminStore.getState();

    // Zero-mock initial state
    expect(adminStore.companies).toBeDefined();

    // Add new company
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
});

