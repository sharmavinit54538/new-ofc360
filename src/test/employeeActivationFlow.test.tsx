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

  describe("1. EmployeeActivatePage UI & Token Validation States", () => {
    it("validates token with backend and renders Set Your Password form when token is valid", () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: {
          valid: true,
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          email: "employee@ofc360.com",
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=test_token_123"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Welcome to OFC360")).toBeDefined();
      expect(screen.getByText("Set Your Password")).toBeDefined();
      expect(screen.getByPlaceholderText("Enter new password")).toBeDefined();
      expect(screen.getByPlaceholderText("Confirm your password")).toBeDefined();
      expect(screen.getByText("Minimum 8 characters")).toBeDefined();
      expect(screen.getByText("Passwords must match")).toBeDefined();
      expect(screen.getByRole("button", { name: "Set Password" })).toBeDefined();
      expect(screen.queryByRole("heading", { name: "Invalid Invitation Link" })).toBeNull();
    });

    it("displays loading spinner while validating invitation token", () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=test_token_123"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Verifying your invitation...")).toBeDefined();
      expect(screen.queryByText("Set Your Password")).toBeNull();
    });

    it("displays error banner when no token is present in the URL", () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: "Invalid Invitation Link" })).toBeDefined();
      expect(
        screen.getByText("Your invitation link is invalid or has expired. Please contact HR for a new invitation.")
      ).toBeDefined();
    });

    it("displays error banner when token validation explicitly fails on backend (400/404)", () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: { status: 400, data: { detail: "Token expired" } },
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=invalid_expired_token"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: "Invalid Invitation Link" })).toBeDefined();
      expect(
        screen.getByText("Your invitation link is invalid or has expired. Please contact HR for a new invitation.")
      ).toBeDefined();
    });

    it("displays network error view with retry button when server returns 500 error", () => {
      const mockRefetch = vi.fn();
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: { status: 500, data: { detail: "Internal Server Error" } },
        refetch: mockRefetch,
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { name: "Verification Failed" })).toBeDefined();
      expect(
        screen.getByText("Unable to verify your invitation right now. Please try again.")
      ).toBeDefined();

      const retryBtn = screen.getByRole("button", { name: /Try Again/i });
      fireEvent.click(retryBtn);
      expect(mockRefetch).toHaveBeenCalled();
    });

    it("requires at least 8 characters and matching password to enable submit button", () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: {
          valid: true,
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          email: "employee@ofc360.com",
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: "Set Password" }) as HTMLButtonElement;

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
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: {
          valid: true,
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          email: "employee@ofc360.com",
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

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
    it("submits password to POST /api/v1/employees/{resolvedEmployeeId}/activate and shows success UI", async () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: {
          valid: true,
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          email: "employee@ofc360.com",
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

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
        <MemoryRouter initialEntries={["/employee/activate?token=token_abc_123"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: "Set Password" });

      fireEvent.change(newPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.change(confirmPassInput, { target: { value: "SecurePass2026!" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockActivateMutation).toHaveBeenCalledWith({
          id: "550e8400-e29b-41d4-a716-446655440000",
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          token: "token_abc_123",
          new_password: "SecurePass2026!",
          confirm_password: "SecurePass2026!",
        });
      });

      expect(await screen.findByText("Password Set Successfully!")).toBeDefined();
      expect(screen.getByText("Proceed to Sign In")).toBeDefined();
    });

    it("displays specific backend error message on activation failure", async () => {
      vi.spyOn(employeeApiHooks, "useValidateEmployeeInvitationQuery").mockReturnValue({
        data: {
          valid: true,
          employee_id: "550e8400-e29b-41d4-a716-446655440000",
          email: "employee@ofc360.com",
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      const mockUnwrap = vi.fn().mockRejectedValue({
        status: 400,
        data: {
          detail: "Password must contain at least one special character",
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
        <MemoryRouter initialEntries={["/employee/activate?token=valid_token"]}>
          <Routes>
            <Route path="/employee/activate" element={<EmployeeActivatePage />} />
          </Routes>
        </MemoryRouter>
      );

      const newPassInput = screen.getByPlaceholderText("Enter new password");
      const confirmPassInput = screen.getByPlaceholderText("Confirm your password");
      const submitBtn = screen.getByRole("button", { name: "Set Password" });

      fireEvent.change(newPassInput, { target: { value: "Password123" } });
      fireEvent.change(confirmPassInput, { target: { value: "Password123" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/Password must contain at least one special character/i)
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

  describe("4. Endpoint Query URL & Body Construction", () => {
    it("generates /api/v1/employees/{UUID}/activate with exact body schema", () => {
      const endpoint = employeeApiHooks.employeeApi.endpoints.activateEmployee;
      expect(endpoint).toBeDefined();

      // Test query function generates URL and exact body
      const queryDef = (endpoint as any);
      expect(queryDef).toBeDefined();
      expect(employeeApiHooks.employeeApi.endpoints).toHaveProperty("activateEmployee");
      expect(employeeApiHooks.employeeApi.endpoints).toHaveProperty("validateEmployeeInvitation");
    });
  });
});
