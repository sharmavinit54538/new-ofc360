import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/services/api/baseApi";
import authReducer, { setCredentials } from "@/features/auth/authSlice";

// Inject test endpoints for refresh flow testing
const testAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestDepartments: builder.query<{ id: string; name: string }[], void>({
      query: () => "/api/v1/test-departments",
    }),
    testLogin: builder.mutation<{ token: string }, { email: string }>({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

describe("baseQueryWithReauth Token Refresh Interceptor", () => {
  let store: any;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    store = configureStore({
      reducer: {
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(baseApi.middleware),
    });
  });

  it("should not attempt refresh on public auth endpoints returning 401", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    );

    const result = await store.dispatch(
      testAuthApi.endpoints.testLogin.initiate({ email: "invalid@ofc360.com" })
    );

    expect(result.error).toBeDefined();
    expect((result.error as any)?.status).toBe(401);
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it("should cleanly logout when refresh token is missing on 401", async () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_1", name: "Alex", email: "alex@ofc360.com", role: "hr_admin" },
        token: "expired_token_123",
        companyId: "11111111-1111-1111-1111-111111111111",
      })
    );

    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "Token expired" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    );

    await store.dispatch(
      testAuthApi.endpoints.getTestDepartments.initiate(undefined, { forceRefetch: true })
    );

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.refreshToken).toBeNull();
  });


  it("should execute single-flight refresh and retry request on 401", async () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_1", name: "Alex", email: "alex@ofc360.com", role: "hr_admin" },
        token: "expired_token_123",
        refreshToken: "valid_refresh_token_456",
        companyId: "11111111-1111-1111-1111-111111111111",
      })
    );

    vi.spyOn(global, "fetch")
      // 1. Initial protected request -> returns 401
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Signature has expired" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      )
      // 2. Token refresh request -> returns new access & refresh tokens
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            data: {
              access_token: "new_valid_token_999",
              refresh_token: "new_refresh_token_888",
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          }
        )
      )
      // 3. Retried original request -> returns 200 success data
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: "dept_1", name: "Engineering" }]), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    const result = await store.dispatch(
      testAuthApi.endpoints.getTestDepartments.initiate(undefined, { forceRefetch: true })
    );

    expect(result.data).toEqual([{ id: "dept_1", name: "Engineering" }]);
    expect(store.getState().auth.token).toBe("new_valid_token_999");
    expect(store.getState().auth.refreshToken).toBe("new_refresh_token_888");
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });

  it("should cleanly logout when refresh fails with 401", async () => {
    store.dispatch(
      setCredentials({
        user: { id: "usr_1", name: "Alex", email: "alex@ofc360.com", role: "hr_admin" },
        token: "expired_token_123",
        refreshToken: "expired_refresh_token_456",
        companyId: "11111111-1111-1111-1111-111111111111",
      })
    );

    vi.spyOn(global, "fetch")
      // 1. Initial 401
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Token expired" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      )
      // 2. Refresh returns 401
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Invalid refresh token" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      );

    await store.dispatch(
      testAuthApi.endpoints.getTestDepartments.initiate(undefined, { forceRefetch: true })
    );

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
    expect(store.getState().auth.refreshToken).toBeNull();
  });
});

