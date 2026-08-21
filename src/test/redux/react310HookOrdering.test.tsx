import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { useRef, useState, useEffect } from "react";
import { render, act, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/services/api/baseApi";
import authReducer, {
  setCredentials,
  setInitializing,
  setSessionStatus,
  logout,
} from "@/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth/authService";
import { AuthBootstrap } from "@/app/providers";

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
  });

/**
 * Component that uses useAuth AND useRef to detect any React #310 hook count/order violations
 */
function TestAuthComponentWithUseRef() {
  const { user, isAuthenticated, loading, role, logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div>
      <input ref={inputRef} data-testid="test-input" defaultValue="initial" />
      <div data-testid="auth-status">{isAuthenticated ? "authenticated" : "unauthenticated"}</div>
      <div data-testid="user-name">{user?.name || "anonymous"}</div>
      <div data-testid="user-role">{role}</div>
      <div data-testid="loading-status">{loading ? "loading" : "idle"}</div>
      <div data-testid="render-count">{renderCountRef.current}</div>
      <button onClick={() => logout()} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

describe("REACT #310 & AUTH LIFECYCLE REGRESSION SUITE", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    authService.resetInitState();
    store = createTestStore();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("Test 1: useAuth + useRef maintains identical hook ordering across all auth state transitions (ZERO React #310)", async () => {
    const { rerender } = render(
      <Provider store={store}>
        <TestAuthComponentWithUseRef />
      </Provider>
    );

    // Initial state: loading = true, isAuthenticated = false
    expect(screen.getByTestId("loading-status").textContent).toBe("loading");
    expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");

    // Transition 1: Set unauthenticated (isInitializing = false)
    act(() => {
      store.dispatch(setInitializing(false));
      store.dispatch(setSessionStatus("unauthenticated"));
    });

    expect(screen.getByTestId("loading-status").textContent).toBe("idle");
    expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");

    // Transition 2: User logs in (setCredentials)
    act(() => {
      store.dispatch(
        setCredentials({
          user: {
            id: "usr_active_1",
            name: "John Doe",
            email: "john@ofc360.com",
            role: "hr_admin",
            companyId: "11111111-2222-3333-4444-555555555555",
          },
          token: "jwt_token_active",
          refreshToken: "refresh_token_active",
        })
      );
    });

    expect(screen.getByTestId("auth-status").textContent).toBe("authenticated");
    expect(screen.getByTestId("user-name").textContent).toBe("John Doe");
    expect(screen.getByTestId("user-role").textContent).toBe("hr_admin");
    expect(screen.getByTestId("loading-status").textContent).toBe("idle");

    // Transition 3: User logs out
    act(() => {
      store.dispatch(logout());
    });

    expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
    expect(screen.getByTestId("user-name").textContent).toBe("anonymous");
    expect(screen.getByTestId("loading-status").textContent).toBe("idle");

    // Re-render check
    rerender(
      <Provider store={store}>
        <TestAuthComponentWithUseRef />
      </Provider>
    );

    expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
  });

  it("Test 2: /auth/me 401 -> refresh 401 terminates cleanly with ZERO extra requests or loops", async () => {
    localStorage.setItem("ofc360_access_token", "expired_test_access_jwt");
    localStorage.setItem("ofc360_refresh_token", "expired_test_refresh_jwt");
    let meCount = 0;
    let refreshCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/api/v1/auth/me")) {
        meCount++;
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }

      if (url.includes("/api/v1/auth/refresh")) {
        refreshCount++;
        return new Response(JSON.stringify({ message: "Refresh token expired" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    render(
      <Provider store={store}>
        <AuthBootstrap>
          <TestAuthComponentWithUseRef />
        </AuthBootstrap>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.isInitializing).toBe(false);
    });

    // Exactly 1 /me and 1 /refresh
    expect(meCount).toBe(1);
    expect(refreshCount).toBe(1);
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.sessionStatus).toBe("unauthenticated");
    expect(screen.getByTestId("auth-status").textContent).toBe("unauthenticated");
  });

  it("Test 3: /auth/me 401 -> refresh 200 -> retry /auth/me 200 successfully authenticates session", async () => {
    localStorage.setItem("ofc360_access_token", "expired_test_access_jwt");
    localStorage.setItem("ofc360_refresh_token", "valid_test_refresh_jwt");
    let meCount = 0;
    let refreshCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/api/v1/auth/me")) {
        meCount++;
        if (meCount === 1) {
          // First attempt: 401
          return new Response(JSON.stringify({ message: "Token expired" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
        // Retry attempt after refresh: 200
        return new Response(
          JSON.stringify({
            id: "usr_refreshed_1",
            name: "Jane Smith",
            email: "jane@ofc360.com",
            role: "manager",
            companyId: "22222222-3333-4444-5555-666666666666",
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      if (url.includes("/api/v1/auth/refresh")) {
        refreshCount++;
        return new Response(
          JSON.stringify({
            access_token: "new_refreshed_jwt",
            refresh_token: "new_refreshed_refresh_token",
            access_expires_at: Date.now() + 3600000,
            refresh_expires_at: Date.now() + 86400000,
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    render(
      <Provider store={store}>
        <AuthBootstrap>
          <TestAuthComponentWithUseRef />
        </AuthBootstrap>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    expect(meCount).toBe(2); // 1 initial 401 + 1 retried 200
    expect(refreshCount).toBe(1);
    expect(store.getState().auth.user?.name).toBe("Jane Smith");
    expect(store.getState().auth.role).toBe("manager");
    expect(store.getState().auth.token).toBe("new_refreshed_jwt");
    expect(store.getState().auth.sessionStatus).toBe("authenticated");
    expect(screen.getByTestId("auth-status").textContent).toBe("authenticated");
  });
});
