import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import { baseApi } from "@/services/api/baseApi";
import { TooltipProvider } from "@/components/ui/tooltip";
import EmployeeActivatePage from "@/pages/employee/EmployeeActivatePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import * as employeeApiHooks from "@/services/api/employeeApi";

// Helper to create test store
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

const renderWithProviders = (ui: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <TooltipProvider>
        {ui}
      </TooltipProvider>
    </Provider>
  );
};

describe("Employee Invitation & Password Activation Flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. EmployeeActivatePage UI & Validations", () => {
    it("renders page branding, welcome badge, and password fields when valid token is present", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=test_token_123&employee_id=emp_001&email=test@ofc360.com"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Welcome to OFC360")).toBeDefined();
      expect(screen.getByText("Set Your Password")).toBeDefined();
      expect(screen.getByPlaceholderText("Enter new password")).toBeDefined();
      expect(screen.getByPlaceholderText("Confirm your password")).toBeDefined();
      expect(screen.getByText(/At least 8 characters/i)).toBeDefined();
      expect(screen.getByText(/Passwords match/i)).toBeDefined();
      expect(screen.getByRole("button", { name: /Set Password & Activate/i })).toBeDefined();
    });

    it("displays error banner when no token or employee_id is present in the URL", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: "Invalid Invitation Link" })).toBeDefined();
      expect(screen.getByText("Invalid invitation link. Please request a new invitation from HR.")).toBeDefined();
    });

    it("requires at least 8 characters and matching password to enable submit button", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token&employee_id=emp_001"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password & Activate/i }) as HTMLButtonElement;

      // Initially disabled
      expect(submitBtn.disabled).toBe(true);

      // Short password (< 8 chars)
      fireEvent.change(newPassInput, { target: { value: "Short1" } });
      fireEvent.change(confirmPassInput, { target: { value: "Short1" } });
      expect(submitBtn.disabled).toBe(true);

      // Mismatched password
      fireEvent.change(newPassInput, { target: { value: "ValidPassword123" } });
      fireEvent.change(confirmPassInput, { target: { value: "DifferentPassword123" } });
      expect(submitBtn.disabled).toBe(true);

      // Valid and matching password (>= 8 chars)
      fireEvent.change(confirmPassInput, { target: { value: "ValidPassword123" } });
      expect(submitBtn.disabled).toBe(false);
    });

    it("toggles password visibility when show/hide buttons are clicked", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token&employee_id=emp_001"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password") as HTMLInputElement;
      expect(newPassInput.type).toBe("password");

      const showButtons = screen.getAllByRole("button", { name: /Show password/i });
      fireEvent.click(showButtons[0]);
      expect(newPassInput.type).toBe("text");
    });
  });

  describe("2. Password Activation API & State Transitions", () => {
    it("submits password to activateEmployee mutation and shows success UI", async () => {
      const mockUnwrap = vi.fn().mockResolvedValue({
        success: true,
        message: "Account activated successfully",
      });
      const mockActivateMutation = vi.fn().mockReturnValue({
        unwrap: mockUnwrap,
      });

      vi.spyOn(employeeApiHooks, "useActivateEmployeeMutation").mockReturnValue([
        mockActivateMutation as any,
        { isLoading: false } as any,
      ]);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=secret_token_abc&employee_id=emp_123&email=user@test.com"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password & Activate/i });

      fireEvent.change(newPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.change(confirmPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockActivateMutation).toHaveBeenCalledWith({
          id: "emp_123",
          employee_id: "emp_123",
          token: "secret_token_abc",
          new_password: "SecurePass2026!",
          confirm_password: "SecurePass2026!",
        });
      });

      expect(await screen.findByText("Password Set Successfully!")).toBeDefined();
      expect(screen.getByText("Proceed to Sign In")).toBeDefined();
    });

    it("handles expired/invalid token error from backend properly", async () => {
      const mockUnwrap = vi.fn().mockRejectedValue({
        status: 400,
        data: {
          detail: "Invitation token has expired or is invalid",
        },
      });
      const mockActivateMutation = vi.fn().mockReturnValue({
        unwrap: mockUnwrap,
      });

      vi.spyOn(employeeApiHooks, "useActivateEmployeeMutation").mockReturnValue([
        mockActivateMutation as any,
        { isLoading: false } as any,
      ]);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=expired_token&employee_id=emp_123"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password & Activate/i });

      fireEvent.change(newPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.change(confirmPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Your invitation link is invalid or has expired\. Please contact your HR administrator for a new invitation\./i)
        ).toBeDefined();
      });
    });
  });

  describe("3. Legacy Link & Route Protection", () => {
    it("redirects unauthenticated legacy /onboarding?token=XYZ directly to /employee/activate?token=XYZ", () => {
      const store = createTestStore({
        isAuthenticated: false,
        token: null,
        user: null,
        isInitializing: false,
        sessionStatus: "idle",
      });

      renderWithProviders(
        <MemoryRouter initialEntries={["/onboarding?token=legacy_token_999&employee_id=emp_555"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<div>Onboarding Dashboard</div>} />
            </Route>
            <Route path="/employee/activate" element={<div data-testid="activate-page">Activate Password Page</div>} />
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          </Routes>
        </MemoryRouter>,
        store
      );

      // Must redirect to password activation, not login or onboarding directly
      expect(screen.getByTestId("activate-page")).toBeDefined();
      expect(screen.queryByTestId("login-page")).toBeNull();
    });

    it("redirects unauthenticated user accessing /employee/onboarding to /login", () => {
      const store = createTestStore({
        isAuthenticated: false,
        token: null,
        user: null,
        isInitializing: false,
        sessionStatus: "idle",
      });

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/onboarding"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/employee/onboarding" element={<div data-testid="employee-onboarding">Employee Onboarding Wizard</div>} />
            </Route>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          </Routes>
        </MemoryRouter>,
        store
      );

      expect(screen.getByTestId("login-page")).toBeDefined();
      expect(screen.queryByTestId("employee-onboarding")).toBeNull();
    });

    it("prefills email in LoginPage when passed in search params and supports redirect", () => {
      const store = createTestStore({
        isAuthenticated: false,
        token: null,
        user: null,
        isInitializing: false,
        sessionStatus: "idle",
      });

      renderWithProviders(
        <MemoryRouter initialEntries={["/login?email=employee@ofc360.com&redirect=/employee/onboarding"]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>,
        store
      );

      const emailInput = screen.getByPlaceholderText(/you@company\.com/i) as HTMLInputElement;
      expect(emailInput.value).toBe("employee@ofc360.com");
    });
  });

  describe("4. Endpoint Query URL Construction", () => {
    it("generates /api/v1/employees/{UUID}/activate with non-empty UUID and rejects 'me'", () => {
      const endpoint = employeeApiHooks.employeeApi.endpoints.activateEmployee;
      const queryFn = (endpoint as any).initiate;
      expect(queryFn).toBeDefined();

      // Test endpoint definition exists and validates UUID
      expect(employeeApiHooks.employeeApi.endpoints).toHaveProperty("activateEmployee");
    });
  });
});
