import { describe, it, expect, beforeEach } from "vitest";
import authReducer, {
  setCredentials,
  updateUser,
  setRole,
  setCompanyContext,
  logout,
  setInitializing,
} from "@/features/auth/authSlice";
import { AuthState } from "@/features/auth/authTypes";

describe("authSlice", () => {
  let initialState: AuthState;

  beforeEach(() => {
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
      companyId: "comp_01",
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

  it("should handle setCredentials", () => {
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
      })
    );

    expect(state.user).toEqual(newUser);
    expect(state.token).toBe("new_jwt_token");
    expect(state.refreshToken).toBe("new_refresh_token");
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe("hr_admin");
    expect(state.sessionStatus).toBe("authenticated");
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

  it("should handle setCompanyContext", () => {
    const state = authReducer(initialState, setCompanyContext("comp_99"));
    expect(state.companyId).toBe("comp_99");
  });

  it("should handle setInitializing", () => {
    const state = authReducer(initialState, setInitializing(true));
    expect(state.isInitializing).toBe(true);
    expect(state.sessionStatus).toBe("loading");
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

  it("should handle logout", () => {
    const state = authReducer(initialState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.sessionStatus).toBe("unauthenticated");
  });
});

