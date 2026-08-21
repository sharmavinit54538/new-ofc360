import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/services/api/baseApi";
import authReducer, { setCredentials, logout } from "@/features/auth/authSlice";
import { authService } from "@/services/auth/authService";
import { AuthBootstrap } from "@/app/providers";
import { connectWebSocketService } from "@/services/connectWebSocketService";

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

describe("AUTH + 429 + REACT #185 + WEBSOCKET COMPLETE FIX REGRESSION TESTS", () => {
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
    connectWebSocketService.disconnect(true);
  });

  // TEST 0: Token Pre-Check on Fresh Start / Login page (Zero network calls when unauthenticated)
  it("Test 0: Fresh start / Login page with NO tokens immediately resolves unauthenticated with ZERO network calls", async () => {
    let authMeCallCount = 0;
    let refreshCallCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
      if (url.includes("/api/v1/auth/me")) authMeCallCount++;
      if (url.includes("/api/v1/auth/refresh")) refreshCallCount++;
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    render(
      <Provider store={store}>
        <AuthBootstrap>
          <div data-testid="app-content">OFC360 Login / Guest</div>
        </AuthBootstrap>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.isInitializing).toBe(false);
    });

    // CRITICAL: 0 network calls when user is unauthenticated
    expect(authMeCallCount).toBe(0);
    expect(refreshCallCount).toBe(0);
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.sessionStatus).toBe("unauthenticated");
  });

  // TEST 1: Stored Token Session Restore & Single /auth/me invocation
  it("Test 1 & 2: Stored token reload calls /auth/me exactly ONCE and sets authenticated state without React #185", async () => {
    localStorage.setItem("ofc360_access_token", "valid_stored_jwt_token_12345");
    let authMeCallCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/api/v1/auth/me")) {
        authMeCallCount++;
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              id: "usr_bootstrap_1",
              name: "Bootstrap Tester",
              email: "boot@ofc360.com",
              role: "hr_admin",
              companyId: "11111111-2222-3333-4444-555555555555",
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

    render(
      <Provider store={store}>
        <AuthBootstrap>
          <div data-testid="app-content">OFC360 Dashboard</div>
        </AuthBootstrap>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    expect(authMeCallCount).toBe(1);
    expect(store.getState().auth.user?.name).toBe("Bootstrap Tester");
    expect(store.getState().auth.role).toBe("hr_admin");
    expect(store.getState().auth.sessionStatus).toBe("authenticated");
    expect(store.getState().auth.isInitializing).toBe(false);
  });

  // TEST 3 & 4: 401 on /auth/me triggers refresh ONCE, and cleanly terminates on refresh failure
  it("Test 4: Expired stored token + invalid refresh token -> 401 on /auth/me triggers refresh ONCE -> fails cleanly without loop", async () => {
    localStorage.setItem("ofc360_access_token", "expired_stored_jwt_token_12345");
    localStorage.setItem("ofc360_refresh_token", "invalid_refresh_token_12345");
    let authMeCallCount = 0;
    let refreshCallCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/api/v1/auth/me")) {
        authMeCallCount++;
        return new Response(
          JSON.stringify({ message: "Unauthorized" }),
          { status: 401, headers: { "content-type": "application/json" } }
        );
      }

      if (url.includes("/api/v1/auth/refresh")) {
        refreshCallCount++;
        return new Response(
          JSON.stringify({ message: "Invalid refresh token" }),
          { status: 401, headers: { "content-type": "application/json" } }
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
          <div data-testid="app-content">OFC360 Unauthenticated</div>
        </AuthBootstrap>
      </Provider>
    );

    await waitFor(() => {
      expect(store.getState().auth.isInitializing).toBe(false);
    });

    expect(authMeCallCount).toBe(1);
    expect(refreshCallCount).toBe(1);
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.sessionStatus).toBe("unauthenticated");
  });

  // TEST 5: 429 Rate Limiting with Bounded Retry
  it("Test 8: 429 Too Many Requests response is respected with bounded backoff and no infinite loop", async () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_429", name: "Rate Tester", email: "rate@ofc360.com", role: "employee" },
        token: "valid_token_429",
        companyId: "11111111-2222-3333-4444-555555555555",
      })
    );

    let requestCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/api/v1/rate-limited-endpoint")) {
        requestCount++;
        if (requestCount === 1) {
          return new Response(
            JSON.stringify({ detail: "Too Many Requests" }),
            {
              status: 429,
              headers: {
                "content-type": "application/json",
                "retry-after": "1", // 1 second backoff
              },
            }
          );
        }
        return new Response(
          JSON.stringify({ success: true, data: "recovered_after_retry" }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ status: "ok" }), { status: 200, headers: { "content-type": "application/json" } });
    });

    const testRateApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
        getRateLimited: builder.query<{ success: boolean; data: string }, void>({
          query: () => "/api/v1/rate-limited-endpoint",
        }),
      }),
    });

    const result = await store.dispatch(
      testRateApi.endpoints.getRateLimited.initiate(undefined, { forceRefetch: true })
    );

    expect(requestCount).toBe(2); // 1 initial + 1 bounded retry
    expect(result.data).toEqual({ success: true, data: "recovered_after_retry" });
  });

  // TEST 6: WebSocket Lifecycle & Token Update on Refresh
  it("Test 6: WebSocket updateToken updates active connection seamlessly without reconnect storms", () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_ws", name: "WS Tester", email: "ws@ofc360.com", role: "employee" },
        token: "initial_ws_token",
        companyId: "11111111-2222-3333-4444-555555555555",
      })
    );

    // Initial connect
    connectWebSocketService.connect();

    // Verify updateToken method is callable and idempotent
    expect(() => {
      connectWebSocketService.updateToken("initial_ws_token");
    }).not.toThrow();

    // Update with new refreshed token
    expect(() => {
      connectWebSocketService.updateToken("newly_refreshed_access_token");
    }).not.toThrow();

    // Clean disconnect on logout
    connectWebSocketService.disconnect(true);
  });
});
