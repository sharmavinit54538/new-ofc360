import { describe, it, expect, beforeEach } from "vitest";
import authReducer, {
  setCredentials,
  updateUser,
  setRole,
  setCompanyContext,
  logout,
  setInitializing,
  setSessionStatus,
} from "@/features/auth/authSlice";
import { AuthState } from "@/features/auth/authTypes";

describe("authSlice", () => {
  let initialState: AuthState;

  beforeEach(() => {
    localStorage.clear();
    initialState = {
      user: {
        id: "usr_100",
        name: "Test User",
        email: "test@ofc360.com",
        role: "employee",
      },
      token: "test_token_123",
      refreshToken: "refresh_token_123",
      isAuthenticated: true,
      isInitializing: false,
      role: "employee",
      companyId: "00000000-0000-0000-0000-000000000001",
      sessionStatus: "authenticated",
    };
  });

  it("should have unauthenticated default state when no storage present", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.sessionStatus).toBe("unauthenticated");
  });

  it("should handle setCredentials and persist to localStorage", () => {
    const newUser = {
      id: "usr_200",
      name: "Jane HR",
      email: "jane@ofc360.com",
      role: "hr_admin" as const,
    };
    const state = authReducer(
      initialState,
      setCredentials({
        user: newUser,
        token: "new_jwt_token",
        refreshToken: "new_refresh_token",
        companyId: "22222222-2222-2222-2222-222222222222",
      })
    );

    expect(state.user?.name).toBe("Jane HR");
    expect(state.token).toBe("new_jwt_token");
    expect(state.refreshToken).toBe("new_refresh_token");
    expect(state.companyId).toBe("22222222-2222-2222-2222-222222222222");
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitializing).toBe(false);
    expect(state.role).toBe("hr_admin");
    expect(state.sessionStatus).toBe("authenticated");

    expect(localStorage.getItem("ofc360_access_token")).toBe("new_jwt_token");
    expect(localStorage.getItem("ofc360_refresh_token")).toBe("new_refresh_token");
    expect(localStorage.getItem("ofc360_company_id")).toBe("22222222-2222-2222-2222-222222222222");
    expect(JSON.parse(localStorage.getItem("ofc360_user") || "{}").email).toBe("jane@ofc360.com");
  });

  it("should handle updateUser", () => {
    const state = authReducer(initialState, updateUser({ name: "Updated Name" }));
    expect(state.user?.name).toBe("Updated Name");
    expect(state.user?.email).toBe("test@ofc360.com");
  });

  it("should handle setRole", () => {
    const state = authReducer(initialState, setRole("manager"));
    expect(state.role).toBe("manager");
    expect(state.user?.role).toBe("manager");
  });

  it("should handle setCompanyContext and persist to storage", () => {
    const state = authReducer(initialState, setCompanyContext("99999999-9999-9999-9999-999999999999"));
    expect(state.companyId).toBe("99999999-9999-9999-9999-999999999999");
    expect(localStorage.getItem("ofc360_company_id")).toBe("99999999-9999-9999-9999-999999999999");
  });

  it("should handle setInitializing", () => {
    const stateLoading = authReducer(initialState, setInitializing(true));
    expect(stateLoading.isInitializing).toBe(true);
    expect(stateLoading.sessionStatus).toBe("loading");

    const stateDone = authReducer(initialState, setInitializing(false));
    expect(stateDone.isInitializing).toBe(false);
    expect(stateDone.sessionStatus).toBe("authenticated");
  });

  it("should handle setSessionStatus", () => {
    const state = authReducer(initialState, setSessionStatus("unauthenticated"));
    expect(state.sessionStatus).toBe("unauthenticated");
    expect(state.isAuthenticated).toBe(false);
  });

  it("should normalize raw 'admin' role to 'hr_admin' on setCredentials", () => {
    const rawAdminUser = {
      id: "usr_admin",
      name: "Admin User",
      email: "admin@ofc360.com",
      role: "admin" as any,
    };
    const state = authReducer(
      initialState,
      setCredentials({
        user: rawAdminUser,
        token: "admin_jwt_token",
      })
    );

    expect(state.role).toBe("hr_admin");
    expect(state.user?.role).toBe("hr_admin");
  });

  it("should normalize raw 'admin' role to 'hr_admin' on updateUser", () => {
    const state = authReducer(initialState, updateUser({ role: "admin" as any }));
    expect(state.role).toBe("hr_admin");
    expect(state.user?.role).toBe("hr_admin");
  });

  it("should handle logout and clear all storage tokens", () => {
    localStorage.setItem("ofc360_access_token", "active_token");
    localStorage.setItem("ofc360_refresh_token", "active_refresh");
    localStorage.setItem("ofc360_user", JSON.stringify({ id: "1", name: "Test" }));
    localStorage.setItem("ofc360_company_id", "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

    const state = authReducer(initialState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.companyId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitializing).toBe(false);
    expect(state.sessionStatus).toBe("unauthenticated");

    expect(localStorage.getItem("ofc360_access_token")).toBeNull();
    expect(localStorage.getItem("ofc360_refresh_token")).toBeNull();
    expect(localStorage.getItem("ofc360_user")).toBeNull();
    expect(localStorage.getItem("ofc360_company_id")).toBeNull();
  });
});


