import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";
import { baseApi } from "@/services/api/baseApi";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HRAdminOnboardingGuard } from "@/components/auth/HRAdminOnboardingGuard";
import * as hrAdminApiHooks from "@/services/api/hrAdminOnboardingApi";
import * as authHooks from "@/hooks/useAuth";
import { useHRAdminOnboardingStore } from "@/stores/hrAdminOnboardingStore";
import DashboardLayout from "@/layouts/DashboardLayout";

vi.mock("@/services/api/connectApi", () => ({
  useGetConnectNotificationsQuery: () => ({ data: [], isLoading: false }),
  useMarkNotificationReadMutation: () => [vi.fn()],
  useClearAllNotificationsMutation: () => [vi.fn()],
  useAcceptCallMutation: () => [vi.fn()],
  useRejectCallMutation: () => [vi.fn()],
}));

// Mock helper to create a test store
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

describe("HR Admin Onboarding Flow & Route Guard Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // ─── 1. Endpoint Normalization Tests ─────────────────────────────
  describe("1. hrAdminOnboardingApi status normalization", () => {
    it("normalizes { completed: true } correctly", () => {
      const raw = { success: true, message: "OK", data: { completed: true, current_step: 3, total_steps: 4 }, errors: null };
      const normalized = hrAdminApiHooks.normalizeOnboardingStatusResponse(raw);
      expect(normalized).toEqual({
        completed: true,
        current_step: 3,
        total_steps: 4,
      });
    });

    it("normalizes { is_completed: true } correctly", () => {
      const raw = { success: true, message: "OK", data: { is_completed: true, current_step: 4, total_steps: 4 }, errors: null };
      const normalized = hrAdminApiHooks.normalizeOnboardingStatusResponse(raw);
      expect(normalized).toEqual({
        completed: true,
        current_step: 4,
        total_steps: 4,
      });
    });

    it("normalizes { onboarding_completed: true } correctly", () => {
      const raw = { success: true, message: "OK", data: { onboarding_completed: true, current_step: 4, total_steps: 4 }, errors: null };
      const normalized = hrAdminApiHooks.normalizeOnboardingStatusResponse(raw);
      expect(normalized).toEqual({
        completed: true,
        current_step: 4,
        total_steps: 4,
      });
    });

    it("normalizes incomplete status with default step fallbacks", () => {
      const raw = { success: true, message: "OK", data: { completed: false }, errors: null };
      const normalized = hrAdminApiHooks.normalizeOnboardingStatusResponse(raw);
      expect(normalized).toEqual({
        completed: false,
        current_step: 0,
        total_steps: 4,
      });
    });
  });

  // ─── 2. HRAdminOnboardingGuard Business Cases ─────────────────────
  describe("2. HRAdminOnboardingGuard Route Protection", () => {
    it("CASE 1: Completed onboarding immediately redirects to /dashboard without rendering onboarding UI", () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: { completed: true, current_step: 3, total_steps: 4 },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/hr-admin/onboarding"]}>
          <Routes>
            <Route
              path="/hr-admin/onboarding"
              element={
                <HRAdminOnboardingGuard>
                  <div data-testid="onboarding-content">Onboarding Wizard Form</div>
                </HRAdminOnboardingGuard>
              }
            />
            <Route path="/dashboard" element={<div data-testid="dashboard-page">HR Admin Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      // Must navigate to /dashboard, NOT render onboarding content
      expect(screen.queryByTestId("onboarding-content")).toBeNull();
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    it("CASE 2 & 3: Incomplete / in-progress onboarding renders the onboarding UI at the current step", () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: { completed: false, current_step: 2, total_steps: 4 },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/hr-admin/onboarding"]}>
          <Routes>
            <Route
              path="/hr-admin/onboarding"
              element={
                <HRAdminOnboardingGuard>
                  <div data-testid="onboarding-content">Onboarding Wizard Step 3</div>
                </HRAdminOnboardingGuard>
              }
            />
            <Route path="/dashboard" element={<div data-testid="dashboard-page">HR Admin Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      // Renders onboarding content
      expect(screen.getByTestId("onboarding-content")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard-page")).toBeNull();
    });

    it("CASE 4: Loading state shows skeleton and does NOT render onboarding UI prematurely", () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: true,
        isError: false,
        refetch: vi.fn(),
      } as any);

      const { container } = renderWithProviders(
        <MemoryRouter initialEntries={["/hr-admin/onboarding"]}>
          <Routes>
            <Route
              path="/hr-admin/onboarding"
              element={
                <HRAdminOnboardingGuard>
                  <div data-testid="onboarding-content">Onboarding Wizard Form</div>
                </HRAdminOnboardingGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      // Does not show onboarding form
      expect(screen.queryByTestId("onboarding-content")).toBeNull();
      // Shows skeleton loader
      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    it("CASE 5: API error state shows retry UI and does NOT assume onboarding is incomplete", () => {
      const mockRefetch = vi.fn();

      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: true,
        refetch: mockRefetch,
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/hr-admin/onboarding"]}>
          <Routes>
            <Route
              path="/hr-admin/onboarding"
              element={
                <HRAdminOnboardingGuard>
                  <div data-testid="onboarding-content">Onboarding Wizard Form</div>
                </HRAdminOnboardingGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      // Does not render onboarding wizard
      expect(screen.queryByTestId("onboarding-content")).toBeNull();
      // Displays error message and retry button
      expect(screen.getByText(/Unable to Verify Onboarding Status/i)).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", { name: /Retry Verification/i });
      fireEvent.click(retryBtn);
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it("Unauthenticated user is redirected to /login", () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: null,
        isAuthenticated: false,
        role: "employee",
        companyId: null,
        sessionStatus: "unauthenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      renderWithProviders(
        <MemoryRouter initialEntries={["/hr-admin/onboarding"]}>
          <Routes>
            <Route
              path="/hr-admin/onboarding"
              element={
                <HRAdminOnboardingGuard>
                  <div data-testid="onboarding-content">Onboarding Wizard Form</div>
                </HRAdminOnboardingGuard>
              }
            />
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByTestId("onboarding-content")).toBeNull();
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("Non-HR admin role shows access restricted guard", () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "u2", email: "emp@co.com", role: "employee", name: "Employee" },
        isAuthenticated: true,
        role: "employee",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      renderWithProviders(
        <MemoryRouter initialEntries={["/hr-admin/onboarding"]}>
          <Routes>
            <Route
              path="/hr-admin/onboarding"
              element={
                <HRAdminOnboardingGuard>
                  <div data-testid="onboarding-content">Onboarding Wizard Form</div>
                </HRAdminOnboardingGuard>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByTestId("onboarding-content")).toBeNull();
      expect(screen.getByText(/Access Restricted/i)).toBeInTheDocument();
      expect(screen.getByText(/HR Admin onboarding is only available for accounts with the HR Administrator role/i)).toBeInTheDocument();
    });
  });

  // ─── 3. DashboardLayout Backend-Driven Protection ─────────────────
  describe("3. DashboardLayout Backend Onboarding Verification", () => {
    it("renders DashboardLayout when backend reports onboarding completed", async () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: { completed: true, current_step: 3, total_steps: 4 },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<div data-testid="dashboard-view">Dashboard Content</div>} />
            </Route>
            <Route path="/hr-admin/onboarding" element={<div data-testid="onboarding-view">Onboarding</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("dashboard-view")).toBeInTheDocument();
      expect(screen.queryByTestId("onboarding-view")).toBeNull();
    });

    it("redirects to /hr-admin/onboarding when backend reports onboarding incomplete", async () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: { completed: false, current_step: 1, total_steps: 4 },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<div data-testid="dashboard-view">Dashboard Content</div>} />
            </Route>
            <Route path="/hr-admin/onboarding" element={<div data-testid="onboarding-view">Onboarding</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId("onboarding-view")).toBeInTheDocument();
      expect(screen.queryByTestId("dashboard-view")).toBeNull();
    });

    it("does NOT redirect to onboarding when backend query returns an error", async () => {
      vi.spyOn(authHooks, "useAuth").mockReturnValue({
        user: { id: "user-1", email: "hr@company.com", role: "hr_admin", name: "HR Admin" },
        isAuthenticated: true,
        role: "hr_admin",
        companyId: "11111111-1111-1111-1111-111111111111",
        sessionStatus: "authenticated",
        logout: vi.fn(),
        setRole: vi.fn(),
        setCredentials: vi.fn(),
      });

      vi.spyOn(hrAdminApiHooks, "useGetHRAdminOnboardingStatusQuery").mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: true,
        refetch: vi.fn(),
      } as any);

      renderWithProviders(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<div data-testid="dashboard-view">Dashboard Content</div>} />
            </Route>
            <Route path="/hr-admin/onboarding" element={<div data-testid="onboarding-view">Onboarding</div>} />
          </Routes>
        </MemoryRouter>
      );

      // On error, does not redirect to onboarding
      expect(screen.getByTestId("dashboard-view")).toBeInTheDocument();
      expect(screen.queryByTestId("onboarding-view")).toBeNull();
    });
  });

  // ─── 4. Snake Case Data Hydration & Store Synchronization Tests ───
  describe("4. Snake Case Data Hydration & Store Synchronization", () => {
    it("synchronizes CompleteOnboardingData snake_case fields into store directly", () => {
      const backendResponse = {
        company: {
          company_name: "Acme Technologies Pvt Ltd",
          industry: "Information Technology & Services",
          country: "India",
          city: "Bengaluru",
          company_size: "51-200",
          timezone: "Asia/Kolkata",
          address: "123 Tech Park, Outer Ring Road",
          cin_number: "U72200KA2020PTC123456",
          gst_number: "29AAAAA0000A1Z5",
          pan_number: "ABCDE1234F",
          tan_number: "BLRA12345E",
          msme_registration_number: "UDYAM-KR-03-0012345",
          website: "https://acme.tech",
          official_email: "hr@acme.tech",
          official_phone: "+91 9876543210",
        },
        hr_admin: {
          first_name: "Rohan",
          last_name: "Verma",
          profile_photo: "data:image/png;base64,sample_photo",
          mobile_number: "+91 9876543210",
          designation: "VP Human Resources",
          preferred_language: "English",
        },
        branding: {
          company_logo: "data:image/png;base64,sample_logo",
          company_stamp: "data:image/png;base64,sample_stamp",
          authorized_signatory_name: "Rohan Verma",
          authorized_signatory_designation: "VP HR",
          letterhead: "data:image/png;base64,sample_letterhead",
        },
        preferences: {
          work_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          work_hours: "09:30 - 18:30",
          attendance_telemetry: "Face + Web Check-in",
          payroll_cycle_start: 1,
          notification_channels: ["Email", "In-App", "Slack"],
        },
        onboarding: {
          current_step: 3,
          completed_steps: [1, 2],
          remaining_steps: [3, 4, 5],
          completion_percentage: 40,
          is_completed: false,
        },
      };

      useHRAdminOnboardingStore.getState().syncFromBackend(backendResponse);
      const state = useHRAdminOnboardingStore.getState();

      // Check Company
      expect(state.company.cin_number).toBe("U72200KA2020PTC123456");
      expect(state.company.pan_number).toBe("ABCDE1234F");
      expect(state.company.tan_number).toBe("BLRA12345E");
      expect(state.company.msme_registration_number).toBe("UDYAM-KR-03-0012345");
      expect(state.company.official_email).toBe("hr@acme.tech");
      expect(state.company.official_phone).toBe("+91 9876543210");
      expect(state.company.company_name).toBe("Acme Technologies Pvt Ltd");

      // Check HR Admin
      expect(state.hr_admin.first_name).toBe("Rohan");
      expect(state.hr_admin.last_name).toBe("Verma");
      expect(state.hr_admin.profile_photo).toBe("data:image/png;base64,sample_photo");
      expect(state.hr_admin.mobile_number).toBe("+91 9876543210");
      expect(state.hr_admin.designation).toBe("VP Human Resources");
      expect(state.hr_admin.preferred_language).toBe("English");

      // Check Branding
      expect(state.branding.company_stamp).toBe("data:image/png;base64,sample_stamp");
      expect(state.branding.authorized_signatory_name).toBe("Rohan Verma");
      expect(state.branding.authorized_signatory_designation).toBe("VP HR");
      expect(state.branding.letterhead).toBe("data:image/png;base64,sample_letterhead");

      // Check Preferences
      expect(state.preferences.work_days).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
      expect(state.preferences.work_hours).toBe("09:30 - 18:30");
      expect(state.preferences.attendance_telemetry).toBe("Face + Web Check-in");
      expect(state.preferences.payroll_cycle_start).toBe(1);
      expect(state.preferences.notification_channels).toEqual(["Email", "In-App", "Slack"]);

      // Check Onboarding
      expect(state.onboarding.current_step).toBe(3);
      expect(state.onboarding.completed_steps).toEqual([1, 2]);
      expect(state.onboarding.completion_percentage).toBe(40);
      expect(state.onboarding.is_completed).toBe(false);
    });
  });
});