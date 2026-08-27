import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import authReducer, { setCredentials, logout, getInitialAuthState } from "@/features/auth/authSlice";
import { baseApi } from "@/services/api/baseApi";
import { authService } from "@/services/auth/authService";
import { AuthBootstrap } from "@/app/providers";
import ProtectedRoute from "@/components/ProtectedRoute";

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware),
  });

describe("OFC360 1-Year Auth Persistence & Session Restoration Acceptance Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    authService.resetInitState();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("1. [LOGIN PERSISTENCE] Login persists tokens, user metadata, and company ID to localStorage", () => {
    const store = createTestStore();
    const mockUser = {
      id: "usr_persisted_1",
      name: "Persistence User",
      email: "persist@ofc360.com",
      role: "hr_admin" as const,
      companyId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    };

    store.dispatch(
      setCredentials({
        user: mockUser,
        token: "jwt_long_term_access_token_12345",
        refreshToken: "jwt_long_term_refresh_token_67890",
        companyId: mockUser.companyId,
      })
    );

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("jwt_long_term_access_token_12345");
    expect(state.refreshToken).toBe("jwt_long_term_refresh_token_67890");
    expect(state.companyId).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

    // Persistent storage checks
    expect(localStorage.getItem("ofc360_access_token")).toBe("jwt_long_term_access_token_12345");
    expect(localStorage.getItem("ofc360_refresh_token")).toBe("jwt_long_term_refresh_token_67890");
    expect(localStorage.getItem("ofc360_company_id")).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(JSON.parse(localStorage.getItem("ofc360_user") || "{}").email).toBe("persist@ofc360.com");
  });

  it("2. [PRE-HYDRATION ON REFRESH] App startup pre-hydrates initial state from localStorage with loading status", () => {
    localStorage.setItem("ofc360_access_token", "stored_valid_token_abc");
    localStorage.setItem("ofc360_refresh_token", "stored_refresh_token_xyz");
    localStorage.setItem("ofc360_company_id", "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    localStorage.setItem(
      "ofc360_user",
      JSON.stringify({
        id: "usr_prehydrate_1",
        name: "Prehydrate Tester",
        email: "pre@ofc360.com",
        role: "manager",
        companyId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      })
    );

    const initialState = getInitialAuthState();
    expect(initialState.token).toBe("stored_valid_token_abc");
    expect(initialState.refreshToken).toBe("stored_refresh_token_xyz");
    expect(initialState.user?.name).toBe("Prehydrate Tester");
    expect(initialState.role).toBe("manager");
    expect(initialState.companyId).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(initialState.isInitializing).toBe(true);
    expect(initialState.sessionStatus).toBe("loading");
    expect(initialState.isAuthenticated).toBe(true);
  });

  it("3. [REFRESH SESSION RESTORATION] Refreshing page verifies stored token via /auth/me and stays authenticated", async () => {
    localStorage.setItem("ofc360_access_token", "jwt_valid_stored_token_123");
    localStorage.setItem("ofc360_refresh_token", "jwt_valid_refresh_token_123");
    localStorage.setItem(
      "ofc360_user",
      JSON.stringify({
        id: "usr_refresh_test",
        name: "Refresh User",
        email: "user@ofc360.com",
        role: "employee",
      })
    );

    let meCallCount = 0;
    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
      if (url.includes("/api/v1/auth/me")) {
        meCallCount++;
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              id: "usr_refresh_test",
              name: "Refresh User",
              email: "user@ofc360.com",
              role: "employee",
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/people"]}>
          <AuthBootstrap>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/people" element={<div data-testid="people-page">People Directory Page</div>} />
              </Route>
              <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            </Routes>
          </AuthBootstrap>
        </MemoryRouter>
      </Provider>
    );

    // Initial render shows restoring session loader
    expect(screen.getByText(/Restoring OFC360 Session/i)).toBeInTheDocument();

    // After auth bootstrap completes, protected page is shown
    await waitFor(() => {
      expect(screen.getByTestId("people-page")).toBeInTheDocument();
    });

    expect(meCallCount).toBe(1);
    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.sessionStatus).toBe("authenticated");
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("4. [EXPIRED TOKEN AUTO REFRESH] Expired stored access token automatically calls /auth/refresh and restores session", async () => {
    localStorage.setItem("ofc360_access_token", "expired_access_token_123");
    localStorage.setItem("ofc360_refresh_token", "valid_refresh_token_123");

    let meCount = 0;
    let refreshCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
      if (url.includes("/api/v1/auth/me")) {
        meCount++;
        if (meCount === 1) {
          return new Response(JSON.stringify({ message: "Token expired" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({
            id: "usr_renewed_1",
            name: "Renewed User",
            email: "renewed@ofc360.com",
            role: "manager",
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      if (url.includes("/api/v1/auth/refresh")) {
        refreshCount++;
        return new Response(
          JSON.stringify({
            access_token: "newly_refreshed_access_token_777",
            refresh_token: "newly_refreshed_refresh_token_888",
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AuthBootstrap>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard Content</div>} />
              </Route>
              <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            </Routes>
          </AuthBootstrap>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    expect(meCount).toBe(2);
    expect(refreshCount).toBe(1);
    expect(store.getState().auth.token).toBe("newly_refreshed_access_token_777");
    expect(localStorage.getItem("ofc360_access_token")).toBe("newly_refreshed_access_token_777");
    expect(localStorage.getItem("ofc360_refresh_token")).toBe("newly_refreshed_refresh_token_888");
  });

  it("5. [COOKIE / TOKEN RESTORATION] Restores session via /auth/me when valid token is stored", async () => {
    localStorage.setItem("ofc360_access_token", "cookie_bearer_token_123");
    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
      if (url.includes("/api/v1/auth/me")) {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              id: "usr_cookie_1",
              name: "Cookie User",
              email: "cookie@ofc360.com",
              role: "hr_admin",
              companyId: "33333333-4444-5555-6666-777777777777",
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AuthBootstrap>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard Content</div>} />
              </Route>
              <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            </Routes>
          </AuthBootstrap>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    expect(store.getState().auth.isAuthenticated).toBe(true);
    expect(store.getState().auth.user?.name).toBe("Cookie User");
  });


  it("6. [EXPLICIT LOGOUT CLEANUP] Logout completely clears memory and localStorage", () => {
    const store = createTestStore();
    store.dispatch(
      setCredentials({
        user: { id: "usr_out", name: "Out User", email: "out@ofc360.com", role: "employee" },
        token: "token_to_clear_12345",
        refreshToken: "refresh_to_clear_12345",
        companyId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      })
    );

    expect(localStorage.getItem("ofc360_access_token")).toBe("token_to_clear_12345");

    store.dispatch(logout());

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.refreshToken).toBeNull();
    expect(store.getState().auth.companyId).toBeNull();

    expect(localStorage.getItem("ofc360_access_token")).toBeNull();
    expect(localStorage.getItem("ofc360_refresh_token")).toBeNull();
    expect(localStorage.getItem("ofc360_user")).toBeNull();
    expect(localStorage.getItem("ofc360_company_id")).toBeNull();
  });
});
