import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { api as baseApi } from "@/api/client";
import { authApi } from "@/api/endpoints/auth";
import authReducer, { setCredentials, logout } from "@/features/auth/authSlice";

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

type TestStore = ReturnType<typeof createTestStore>;

describe("OFC360 JWT Security Hardening & Cookie Auth Flow", () => {
  let store: TestStore;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();

    store = createTestStore();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("1. [AUTH PERSISTENCE] setCredentials updates state and persists JWT credentials to localStorage for 1-year session", () => {
    const testUser = {
      id: "usr_secure_1",
      name: "Security Tester",
      email: "tester@ofc360.com",
      role: "hr_admin" as const,
      companyId: "11111111-2222-3333-4444-555555555555",
    };

    store.dispatch(
      setCredentials({
        user: testUser,
        token: "jwt_super_secret_access_token_header_payload_signature",
        refreshToken: "jwt_super_secret_refresh_token_string",
        companyId: testUser.companyId,
      })
    );

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("jwt_super_secret_access_token_header_payload_signature");
    expect(state.refreshToken).toBe("jwt_super_secret_refresh_token_string");
    expect(state.user?.email).toBe("tester@ofc360.com");

    // Persistent storage validation
    expect(localStorage.getItem("ofc360_access_token")).toBe("jwt_super_secret_access_token_header_payload_signature");
    expect(localStorage.getItem("ofc360_refresh_token")).toBe("jwt_super_secret_refresh_token_string");
    expect(localStorage.getItem("ofc360_company_id")).toBe("11111111-2222-3333-4444-555555555555");
  });

  it("2. [AUTH PERSISTENCE] Login mutation flow unwraps tokens and user for downstream persistence", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            access_token: "jwt_login_access_token_1234567890",
            refresh_token: "jwt_login_refresh_token_0987654321",
            user: {
              id: "usr_login_1",
              name: "Logged In User",
              email: "user@ofc360.com",
              role: "employee",
            },
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      )
    );

    const result = await store.dispatch(
      authApi.endpoints.login.initiate({
        identifier: "user@ofc360.com",
        password: "Password123!",
      })
    );

    expect(result.data).toBeDefined();
    expect(result.data.token).toBe("jwt_login_access_token_1234567890");
  });


  it("3. [CORS & COOKIES] baseApi uses credentials: include on all requests", async () => {
    let capturedCredentials: RequestCredentials | undefined;
    vi.spyOn(global, "fetch").mockImplementationOnce(async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedCredentials = init?.credentials || (input instanceof Request ? input.credentials : (input as any)?.credentials);
      return new Response(
        JSON.stringify({
          success: true,
          data: { id: "usr_me_1", email: "me@ofc360.com", role: "employee" },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      );
    });

    await store.dispatch(authApi.endpoints.getCurrentUser.initiate());

    expect(capturedCredentials).toBe("include");
  });

  it("4. [CONCURRENT REFRESH MUTEX] Multiple simultaneous 401 requests trigger a SINGLE refresh call", async () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_concurrent", name: "Concurrent Tester", email: "conc@ofc360.com", role: "hr_admin" },
        token: "expired_token_init",
        refreshToken: "valid_refresh_cookie_token",
        companyId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      })
    );

    let refreshCallCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/auth/refresh")) {
        refreshCallCount++;
        // Simulate small network latency for refresh
        await new Promise((r) => setTimeout(r, 25));
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              access_token: "new_refreshed_access_token_99999",
              refresh_token: "new_refreshed_refresh_token_88888",
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      // Initial protected endpoints return 401 on first call, 200 on retry
      if (url.includes("/api/v1/test-resource")) {
        const authHeader = (input instanceof Request && input.headers.get("authorization")) || "";
        if (authHeader.includes("new_refreshed_access_token_99999")) {
          return new Response(JSON.stringify({ data: "success_after_refresh" }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ detail: "Token expired" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const testConcurrentApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
        getResA: builder.query<{ data: string }, void>({
          query: () => "/api/v1/test-resource-a",
        }),
        getResB: builder.query<{ data: string }, void>({
          query: () => "/api/v1/test-resource-b",
        }),
        getResC: builder.query<{ data: string }, void>({
          query: () => "/api/v1/test-resource-c",
        }),
      }),
    });

    // Fire 3 simultaneous API calls encountering 401
    const [resA, resB, resC] = await Promise.all([
      store.dispatch(testConcurrentApi.endpoints.getResA.initiate(undefined, { forceRefetch: true })),
      store.dispatch(testConcurrentApi.endpoints.getResB.initiate(undefined, { forceRefetch: true })),
      store.dispatch(testConcurrentApi.endpoints.getResC.initiate(undefined, { forceRefetch: true })),
    ]);

    // Single-flight verification: Refresh endpoint called EXACTLY ONCE
    expect(refreshCallCount).toBe(1);

    // All 3 requests successfully resolved after the single refresh
    expect(resA.data).toEqual({ data: "success_after_refresh" });
    expect(resB.data).toEqual({ data: "success_after_refresh" });
    expect(resC.data).toEqual({ data: "success_after_refresh" });

    // Store state updated with new in-memory credentials
    expect(store.getState().auth.token).toBe("new_refreshed_access_token_99999");
    expect(store.getState().auth.isAuthenticated).toBe(true);

    // Storage updated with new refreshed token
    expect(localStorage.getItem("ofc360_access_token")).toBe("new_refreshed_access_token_99999");
  });


  it("5. [PREVENT INFINITE LOOP] Refresh failure immediately logs out and avoids refresh recursion", async () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_fail", name: "Fail Tester", email: "fail@ofc360.com", role: "employee" },
        token: "expired_token_fail",
        refreshToken: "refresh_token_to_fail",
        companyId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      })
    );

    let refreshCallCount = 0;

    vi.spyOn(global, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);

      if (url.includes("/auth/refresh")) {
        refreshCallCount++;
        return new Response(JSON.stringify({ message: "Invalid refresh token or cookie expired" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ detail: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    });

    const testFailApi = baseApi.injectEndpoints({
      endpoints: (builder) => ({
        getFailingEndpoint: builder.query<{ data: string }, void>({
          query: () => "/api/v1/test-failing-endpoint",
        }),
      }),
    });

    await store.dispatch(testFailApi.endpoints.getFailingEndpoint.initiate(undefined, { forceRefetch: true }));

    // Refresh should have executed only once and failed without an infinite loop
    expect(refreshCallCount).toBe(1);

    // Auth state is cleanly unauthenticated
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.sessionStatus).toBe("unauthenticated");
  });

  it("6. [LOGOUT CLEANUP] Logout clears in-memory state and storage remains free of secrets", () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_logout", name: "Logout User", email: "out@ofc360.com", role: "employee" },
        token: "active_token_12345",
        refreshToken: "active_refresh_12345",
        companyId: "11111111-2222-3333-4444-555555555555",
      })
    );

    expect(store.getState().auth.isAuthenticated).toBe(true);

    store.dispatch(logout());

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.companyId).toBeNull();
    expect(state.sessionStatus).toBe("unauthenticated");

    // Verify storage is completely clean
    expect(localStorage.getItem("ofc360_access_token")).toBeNull();
    expect(localStorage.getItem("ofc360_refresh_token")).toBeNull();
    expect(sessionStorage.getItem("ofc360_access_token")).toBeNull();
    expect(sessionStorage.getItem("ofc360_refresh_token")).toBeNull();
  });
});