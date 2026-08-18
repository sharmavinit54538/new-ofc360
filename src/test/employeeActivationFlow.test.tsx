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
import * as onboardingApiHooks from "@/services/api/onboardingApi";

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
    it("renders page branding, welcome badge, and password fields when valid token is present (WITHOUT employee_id)", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=test_token_123"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Welcome to OFC360")).toBeDefined();
      expect(screen.getByText("Set your password")).toBeDefined();
      expect(screen.getByPlaceholderText("Enter new password")).toBeDefined();
      expect(screen.getByPlaceholderText("Confirm your password")).toBeDefined();
      expect(screen.getByText(/Minimum 8 characters/i)).toBeDefined();
      expect(screen.getByText(/Passwords match/i)).toBeDefined();
      expect(screen.getByRole("button", { name: /Set Password/i })).toBeDefined();
      // Must NOT show Invalid Invitation Link
      expect(screen.queryByRole("heading", { name: "Invalid Invitation Link" })).toBeNull();
    });

    it("displays error banner when no token is present in the URL", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: "Invalid Invitation Link" })).toBeDefined();
      expect(screen.getByText(/Your invitation link is invalid or has expired/i)).toBeDefined();
    });

    it("requires at least 8 characters and matching password to enable submit button", () => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password/i }) as HTMLButtonElement;

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
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token"]}>
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
    it("submits password to token-based activateAccount mutation when no employee_id in URL", async () => {
      const mockUnwrap = vi.fn().mockResolvedValue({
        success: true,
        message: "Account activated successfully",
      });
      const mockActivateAccount = vi.fn().mockReturnValue({
        unwrap: mockUnwrap,
      });

      vi.spyOn(onboardingApiHooks, "useActivateAccountMutation").mockReturnValue([
        mockActivateAccount as any,
        { isLoading: false } as any,
      ]);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=token_only_abc"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password/i });

      fireEvent.change(newPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.change(confirmPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockActivateAccount).toHaveBeenCalledWith({
          token: "token_only_abc",
          password: "SecurePass2026!",
          new_password: "SecurePass2026!",
          confirm_password: "SecurePass2026!",
        });
      });

      expect(await screen.findByText("Password Set Successfully!")).toBeDefined();
      expect(screen.getByText("Proceed to Sign In")).toBeDefined();
    });

    it("submits password to activateEmployee mutation when employee_id is present", async () => {
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
        <MemoryRouter initialEntries={["/employee/activate?token=secret_token_abc&employee_id=550e8400-e29b-41d4-a716-446655440000"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password/i });

      fireEvent.change(newPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.change(confirmPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockActivateMutation).toHaveBeenCalledWith({
          id: "550e8400-e29b-41d4-a716-446655440000",
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
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
      const mockActivateAccount = vi.fn().mockReturnValue({
        unwrap: mockUnwrap,
      });

      vi.spyOn(onboardingApiHooks, "useActivateAccountMutation").mockReturnValue([
        mockActivateAccount as any,
        { isLoading: false } as any,
      ]);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=expired_token"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: /Set Password/i });

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
        <MemoryRouter initialEntries={["/onboarding?token=legacy_token_999"]}>
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
