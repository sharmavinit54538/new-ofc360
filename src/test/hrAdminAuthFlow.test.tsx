import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setCredentials, logout } from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import { baseApi } from "@/services/api/baseApi";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import { hrAdminOnboardingApi } from "@/services/api/hrAdminOnboardingApi";
import { authApi } from "@/services/api/authApi";

// Mock helper to create test store
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

describe("OFC360 HR Admin Authentication & Onboarding Flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // ─── 1. API Client Header & Auth Enforcement Tests ───────────────────────
  describe("1. Header propagation and token validation", () => {
    it("CASE A: Missing or invalid token should NOT attach Authorization header and returns 401", async () => {
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

      let capturedAuthHeader: string | null = null;
      vi.spyOn(globalThis, "fetch").mockImplementationOnce(async (input, init) => {
        const headers = input instanceof Request ? input.headers : new Headers(init?.headers as any);
        capturedAuthHeader = headers.get("Authorization");
        return new Response(
          JSON.stringify({
            detail: "Not authenticated. Please provide a valid Bearer token.",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      });

      await store.dispatch(
        hrAdminOnboardingApi.endpoints.getHRAdminOnboardingStatus.initiate(undefined, {
          forceRefetch: true,
        })
      );

      expect(capturedAuthHeader).toBeNull();
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.token).toBeNull();
    });

    it("CASE B: Valid HR Admin access token attaches Authorization: Bearer <token> and returns 200 OK", async () => {
      const store = createTestStore({
        user: {
          id: "usr_hr_1",
          email: "hr.admin@acme.com",
          role: "hr_admin",
          name: "HR Admin",
          companyId: "11111111-1111-1111-1111-111111111111",
        },
        token: "valid_jwt_access_token_12345",
        refreshToken: "valid_refresh_token_67890",
        isAuthenticated: true,
        isInitializing: false,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
      });

      let capturedAuthHeader: string | null = null;
      vi.spyOn(globalThis, "fetch").mockImplementationOnce(async (input, init) => {
        const headers = input instanceof Request ? input.headers : new Headers(init?.headers as any);
        capturedAuthHeader = headers.get("Authorization");
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              completed: false,
              current_step: 1,
              total_steps: 4,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      });

      const result = await store.dispatch(
        hrAdminOnboardingApi.endpoints.getHRAdminOnboardingStatus.initiate(undefined, {
          forceRefetch: true,
        })
      );

      expect(capturedAuthHeader).toBe("Bearer valid_jwt_access_token_12345");
      expect(result.data).toEqual({
        completed: false,
        current_step: 1,
        total_steps: 4,
      });
    });

    it("CASE C: Valid token but non-HR Admin role receives 403 Forbidden", async () => {
      const store = createTestStore({
        user: {
          id: "usr_emp_1",
          email: "employee@acme.com",
          role: "employee",
          name: "Employee User",
          companyId: "11111111-1111-1111-1111-111111111111",
        },
        token: "employee_token_12345",
        refreshToken: "employee_refresh_token_67890",
        isAuthenticated: true,
        isInitializing: false,
        role: "employee",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
      });

      vi.spyOn(globalThis, "fetch").mockImplementationOnce(async () => {
        return new Response(
          JSON.stringify({
            detail: "Forbidden: You do not have permission to access HR Admin onboarding.",
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      });

      const result = await store.dispatch(
        hrAdminOnboardingApi.endpoints.getHRAdminOnboardingStatus.initiate(undefined, {
          forceRefetch: true,
        })
      );

      expect(result.error).toBeDefined();
      expect((result.error as any)?.status).toBe(403);
    });

    it("CASE D: Expired access token triggers automatic refresh and retries request with new token", async () => {
      const store = createTestStore({
        user: {
          id: "usr_hr_1",
          email: "hr.admin@acme.com",
          role: "hr_admin",
          name: "HR Admin",
          companyId: "11111111-1111-1111-1111-111111111111",
        },
        token: "expired_token_12345",
        refreshToken: "valid_refresh_token_67890",
        isAuthenticated: true,
        isInitializing: false,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
      });

      vi.spyOn(globalThis, "fetch")
        // 1. First call fails with 401 Token Expired
        .mockImplementationOnce(async () => {
          return new Response(JSON.stringify({ detail: "Token expired" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        })
        // 2. Refresh endpoint succeeds
        .mockImplementationOnce(async () => {
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                access_token: "new_refreshed_access_token_99999",
                refresh_token: "new_refresh_token_88888",
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        })
        // 3. Retried call succeeds with new token
        .mockImplementationOnce(async (input, init) => {
          const headers = input instanceof Request ? input.headers : new Headers(init?.headers as any);
          expect(headers.get("Authorization")).toBe("Bearer new_refreshed_access_token_99999");
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                completed: true,
                current_step: 4,
                total_steps: 4,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        });

      const result = await store.dispatch(
        hrAdminOnboardingApi.endpoints.getHRAdminOnboardingStatus.initiate(undefined, {
          forceRefetch: true,
        })
      );

      expect(result.data).toEqual({
        completed: true,
        current_step: 4,
        total_steps: 4,
      });
      expect(store.getState().auth.token).toBe("new_refreshed_access_token_99999");
    });
  });

  // ─── 2. Auth State Safety Tests ──────────────────────────────────────────
  describe("2. AuthSlice token validation and safety", () => {
    it("does NOT mark state as authenticated or save token when token is empty string", () => {
      const store = createTestStore();
      store.dispatch(
        setCredentials({
          user: { id: "usr_1", email: "test@test.com", role: "hr_admin", name: "HR Admin" },
          token: "",
          refreshToken: undefined,
        })
      );

      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.token).toBeNull();
      expect(localStorage.getItem("ofc360_access_token")).toBeNull();
    });

    it("correctly sets authenticated state and stores credentials when token is valid", () => {
      const store = createTestStore();
      store.dispatch(
        setCredentials({
          user: {
            id: "usr_1",
            email: "hr@company.com",
            role: "hr_admin",
            name: "HR Admin",
            companyId: "11111111-1111-1111-1111-111111111111",
          },
          token: "jwt_token_valid_secure_token_12345",
          refreshToken: "refresh_token_valid_secure_67890",
        })
      );

      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(store.getState().auth.token).toBe("jwt_token_valid_secure_token_12345");
      expect(localStorage.getItem("ofc360_access_token")).toBeNull();
      expect(localStorage.getItem("ofc360_refresh_token")).toBeNull();
    });
  });

  // ─── 3. Full OTP Verification Flow in LoginPage ──────────────────────────
  describe("3. Email OTP Login Flow in LoginPage", () => {
    it("handles unverified user login -> switches to OTP step -> verifies OTP -> stores token and completes login", async () => {
      const store = createTestStore();

      // Mock fetch:
      // 1. POST /api/v1/auth/login -> returns requires_email_verification
      // 2. POST /api/v1/auth/verify-email-otp -> returns access_token & user
      vi.spyOn(globalThis, "fetch")
        .mockImplementationOnce(async () => {
          return new Response(
            JSON.stringify({
              success: true,
              message: "Email verification required. An OTP has been sent to your email.",
              requires_email_verification: true,
              verification_id: "vid_test_12345",
              data: {
                requires_email_verification: true,
                verification_id: "vid_test_12345",
                masked_email: "h***@company.com",
                email: "hr.admin@company.com",
                access_token: null,
                refresh_token: null,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        })
        .mockImplementationOnce(async () => {
          return new Response(
            JSON.stringify({
              success: true,
              message: "Email verified and login successful.",
              data: {
                access_token: "jwt_otp_verified_token_98765",
                refresh_token: "refresh_otp_verified_token_54321",
                token_type: "Bearer",
                expires_in: 900,
                user: {
                  id: "usr_hr_verified",
                  name: "HR Admin",
                  email: "hr.admin@company.com",
                  role: "hr_admin",
                  company_id: "11111111-1111-1111-1111-111111111111",
                },
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        });

      renderWithProviders(
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div data-testid="dashboard-view">Dashboard</div>} />
          </Routes>
        </MemoryRouter>,
        store
      );

      // 1. Enter email and password
      const emailInput = screen.getByPlaceholderText(/you@company.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const submitButton = screen.getByRole("button", { name: /sign in to ofc360/i });

      fireEvent.change(emailInput, { target: { value: "hr.admin@company.com" } });
      fireEvent.change(passwordInput, { target: { value: "SecurePassword123!" } });
      fireEvent.click(submitButton);

      // 2. Verify UI switches to OTP verification screen
      await waitFor(() => {
        expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
        expect(screen.getByText(/h\*\*\*@company\.com/i)).toBeInTheDocument();
      });

      // Token should NOT be set yet
      expect(store.getState().auth.isAuthenticated).toBe(false);

      // 3. Enter 6-digit OTP
      const otpInputs = screen.getAllByRole("textbox");
      expect(otpInputs.length).toBe(6);

      ["1", "2", "3", "4", "5", "6"].forEach((digit, idx) => {
        fireEvent.change(otpInputs[idx], { target: { value: digit } });
      });

      const verifyOtpButton = screen.getByRole("button", { name: /verify & sign in/i });
      fireEvent.click(verifyOtpButton);

      // 4. Verify successful login and token persistence in memory only
      await waitFor(() => {
        expect(store.getState().auth.isAuthenticated).toBe(true);
        expect(store.getState().auth.token).toBe("jwt_otp_verified_token_98765");
        expect(localStorage.getItem("ofc360_access_token")).toBeNull();
      });
    });
  });
});
