import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setCredentials, logout } from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import { baseApi } from "@/services/api/baseApi";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { normalizeRole, SystemRole } from "@/features/auth/authTypes";
import DashboardPage from "@/pages/DashboardPage";

const createTestStore = (preloadedAuthState?: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
    preloadedState: preloadedAuthState ? { auth: preloadedAuthState } : undefined,
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  store = createTestStore(),
  initialRoute = "/"
) => {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
      </TooltipProvider>
    </Provider>
  );
};

// Component that consumes useAuth to test hook contract and stability
function AuthConsumerComponent() {
  const { user, isAuthenticated, loading, isLoading, isInitializing, role, companyId, sessionStatus } =
    useAuth();

  return (
    <div>
      <div data-testid="user-name">{user?.name || "Anonymous"}</div>
      <div data-testid="user-role">{role}</div>
      <div data-testid="auth-status">{isAuthenticated ? "authenticated" : "unauthenticated"}</div>
      <div data-testid="loading-status">{loading ? "loading" : "ready"}</div>
      <div data-testid="is-loading">{isLoading ? "is-loading" : "not-loading"}</div>
      <div data-testid="is-initializing">{isInitializing ? "initializing" : "settled"}</div>
      <div data-testid="session-status">{sessionStatus}</div>
      <div data-testid="company-id">{companyId || "none"}</div>
    </div>
  );
}

describe("Global Role-Based Auth & Safe Rendering Architecture", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe("1. Role Normalization Utility", () => {
    it("correctly normalizes all standard roles", () => {
      expect(normalizeRole("super_admin")).toBe("super_admin");
      expect(normalizeRole("hr_admin")).toBe("hr_admin");
      expect(normalizeRole("manager")).toBe("manager");
      expect(normalizeRole("employee")).toBe("employee");
      expect(normalizeRole("executive")).toBe("executive");
      expect(normalizeRole("it_admin")).toBe("it_admin");
    });

    it("correctly normalizes legacy and alias roles", () => {
      expect(normalizeRole("admin")).toBe("hr_admin");
      expect(normalizeRole("hr")).toBe("hr_admin");
      expect(normalizeRole("cxo")).toBe("executive");
      expect(normalizeRole("ceo")).toBe("executive");
      expect(normalizeRole("cto")).toBe("executive");
      expect(normalizeRole("it")).toBe("it_admin");
      expect(normalizeRole("SUPER_ADMIN")).toBe("super_admin");
      expect(normalizeRole(null)).toBe("employee");
      expect(normalizeRole(undefined)).toBe("employee");
      expect(normalizeRole("")).toBe("employee");
    });
  });

  describe("2. useAuth Hook Contract & Rendering Stability", () => {
    it("returns consistent unauthenticated state when logged out", () => {
      const store = createTestStore({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isInitializing: false,
        role: "employee",
        companyId: null,
        sessionStatus: "unauthenticated",
      });

      renderWithProviders(<AuthConsumerComponent />, store);

      expect(screen.getByTestId("user-name").textContent).toBe("Anonymous");
      expect(screen.getByTestId("user-role").textContent).toBe("employee");
      expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
      expect(screen.getByTestId("loading-status").textContent).toBe("ready");
      expect(screen.getByTestId("is-loading").textContent).toBe("not-loading");
    });

    it("returns consistent authenticated state for each system role", () => {
      const testRoles: SystemRole[] = [
        "super_admin",
        "hr_admin",
        "manager",
        "employee",
        "executive",
        "it_admin",
      ];

      for (const role of testRoles) {
        const store = createTestStore({
          user: {
            id: `usr_${role}`,
            name: `${role} User`,
            email: `${role}@ofc360.com`,
            role,
            companyId: "comp_123",
          },
          token: "valid_jwt_token_sample",
          refreshToken: "valid_refresh_token_sample",
          isAuthenticated: true,
          isInitializing: false,
          role,
          companyId: "comp_123",
          sessionStatus: "authenticated",
        });

        const { unmount } = renderWithProviders(<AuthConsumerComponent />, store);

        expect(screen.getByTestId("user-name").textContent).toBe(`${role} User`);
        expect(screen.getByTestId("user-role").textContent).toBe(role);
        expect(screen.getByTestId("auth-status").textContent).toBe("authenticated");
        expect(screen.getByTestId("company-id").textContent).toBe("comp_123");

        unmount();
      }
    });

    it("maintains stable hook execution across repeated re-renders without React error #300", () => {
      const store = createTestStore({
        user: { id: "usr_1", name: "Test User", email: "test@ofc360.com", role: "employee" },
        token: "tok_123",
        isAuthenticated: true,
        isInitializing: false,
        role: "employee",
        companyId: null,
        sessionStatus: "authenticated",
      });

      const { rerender } = renderWithProviders(<AuthConsumerComponent />, store);
      expect(screen.getByTestId("user-name").textContent).toBe("Test User");

      // Multiple re-renders with changing auth state
      store.dispatch(
        setCredentials({
          user: { id: "usr_1", name: "Updated User", email: "test@ofc360.com", role: "manager" },
          token: "tok_456",
        })
      );

      rerender(
        <Provider store={store}>
          <TooltipProvider>
            <MemoryRouter initialEntries={["/"]}>
              <AuthConsumerComponent />
            </MemoryRouter>
          </TooltipProvider>
        </Provider>
      );

      expect(screen.getByTestId("user-name").textContent).toBe("Updated User");
      expect(screen.getByTestId("user-role").textContent).toBe("manager");
    });
  });

  describe("3. ProtectedRoute Gatekeeper", () => {
    it("renders loading skeleton while session is initializing", () => {
      const store = createTestStore({
        user: null,
        token: "pending_token",
        isAuthenticated: false,
        isInitializing: true,
        role: "employee",
        companyId: null,
        sessionStatus: "loading",
      });

      renderWithProviders(
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected Dashboard Content</div>} />
          </Route>
        </Routes>,
        store,
        "/dashboard"
      );

      expect(screen.getByText("Restoring OFC360 Session...")).toBeInTheDocument();
      expect(screen.queryByText("Protected Dashboard Content")).not.toBeInTheDocument();
    });

    it("redirects unauthenticated users to /login", () => {
      const store = createTestStore({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
        role: "employee",
        companyId: null,
        sessionStatus: "unauthenticated",
      });

      renderWithProviders(
        <Routes>
          <Route path="/login" element={<div>Login Page Target</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected Content</div>} />
          </Route>
        </Routes>,
        store,
        "/dashboard"
      );

      expect(screen.getByText("Login Page Target")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("renders protected route content when authenticated with valid user", () => {
      const store = createTestStore({
        user: { id: "usr_1", name: "Authenticated User", email: "auth@ofc360.com", role: "manager" },
        token: "valid_token_123",
        isAuthenticated: true,
        isInitializing: false,
        role: "manager",
        companyId: "comp_1",
        sessionStatus: "authenticated",
      });

      renderWithProviders(
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Protected Route Passed</div>} />
          </Route>
        </Routes>,
        store,
        "/dashboard"
      );

      expect(screen.getByText("Protected Route Passed")).toBeInTheDocument();
    });
  });

  describe("4. RoleGuard Module Access Control", () => {
    it("grants access to allowed roles", () => {
      const store = createTestStore({
        user: { id: "usr_mgr", name: "Manager User", email: "mgr@ofc360.com", role: "manager" },
        token: "tok_123",
        isAuthenticated: true,
        isInitializing: false,
        role: "manager",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(
        <RoleGuard allowedRoles={["manager", "hr_admin"]}>
          <div>Manager Only Area</div>
        </RoleGuard>,
        store
      );

      expect(screen.getByText("Manager Only Area")).toBeInTheDocument();
    });

    it("restricts access and displays RBAC guard UI when role is not allowed", () => {
      const store = createTestStore({
        user: { id: "usr_emp", name: "Employee User", email: "emp@ofc360.com", role: "employee" },
        token: "tok_123",
        isAuthenticated: true,
        isInitializing: false,
        role: "employee",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(
        <RoleGuard allowedRoles={["super_admin"]}>
          <div>Super Admin Only Area</div>
        </RoleGuard>,
        store
      );

      expect(screen.queryByText("Super Admin Only Area")).not.toBeInTheDocument();
      expect(screen.getByText("Access Restricted")).toBeInTheDocument();
      expect(screen.getByText("RBAC Guard Active")).toBeInTheDocument();
      expect(screen.getByText("Go Back")).toBeInTheDocument();
    });
  });

  describe("5. Centralized DashboardPage Role-Based Dispatch", () => {
    it("dispatches employee to Employee Portal without crash", () => {
      const store = createTestStore({
        user: { id: "usr_emp", name: "Alex Employee", email: "alex@ofc360.com", role: "employee" },
        token: "tok_emp",
        isAuthenticated: true,
        isInitializing: false,
        role: "employee",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(<DashboardPage />, store);

      expect(screen.getByText("Employee Portal")).toBeInTheDocument();
      expect(screen.getByText(/Personal Workspace/)).toBeInTheDocument();
    });

    it("dispatches manager to Manager Workspace without crash", () => {
      const store = createTestStore({
        user: { id: "usr_mgr", name: "Sarah Manager", email: "sarah@ofc360.com", role: "manager" },
        token: "tok_mgr",
        isAuthenticated: true,
        isInitializing: false,
        role: "manager",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(<DashboardPage />, store);

      expect(screen.getByText("Manager Workspace")).toBeInTheDocument();
      expect(screen.getByText(/My Team Scope/)).toBeInTheDocument();
    });

    it("dispatches executive to Executive Dashboard without crash", () => {
      const store = createTestStore({
        user: { id: "usr_exec", name: "Chief Officer", email: "cxo@ofc360.com", role: "executive" },
        token: "tok_exec",
        isAuthenticated: true,
        isInitializing: false,
        role: "executive",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(<DashboardPage />, store);

      expect(screen.getByText("Executive Dashboard")).toBeInTheDocument();
      expect(screen.getByText(/Executive Scope & Strategy/)).toBeInTheDocument();
    });

    it("dispatches it_admin to IT Admin Dashboard without crash", () => {
      const store = createTestStore({
        user: { id: "usr_it", name: "IT Administrator", email: "it@ofc360.com", role: "it_admin" },
        token: "tok_it",
        isAuthenticated: true,
        isInitializing: false,
        role: "it_admin",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(<DashboardPage />, store);

      expect(screen.getByText("SSO Provider Status")).toBeInTheDocument();
      expect(screen.getByText("MFA Enforcement")).toBeInTheDocument();
    });

    it("dispatches super_admin to Super Admin Dashboard without crash", () => {
      const store = createTestStore({
        user: { id: "usr_super", name: "Super Administrator", email: "super@ofc360.com", role: "super_admin" },
        token: "tok_super",
        isAuthenticated: true,
        isInitializing: false,
        role: "super_admin",
        companyId: null,
        sessionStatus: "authenticated",
      });

      const { container } = renderWithProviders(<DashboardPage />, store);

      expect(container.querySelector(".space-y-6")).toBeInTheDocument();
    });

    it("dispatches hr_admin to HR Admin Dashboard without crash", () => {
      const store = createTestStore({
        user: { id: "usr_hr", name: "HR Lead", email: "hr@ofc360.com", role: "hr_admin" },
        token: "tok_hr",
        isAuthenticated: true,
        isInitializing: false,
        role: "hr_admin",
        companyId: null,
        sessionStatus: "authenticated",
      });

      renderWithProviders(<DashboardPage />, store);

      expect(screen.getByText("Org-wide workforce intelligence & real-time HR analytics dashboard.")).toBeInTheDocument();
    });
  });
});
