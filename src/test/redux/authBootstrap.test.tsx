import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import authReducer from "@/features/auth/authSlice";
import { AuthBootstrap } from "@/app/providers";
import ProtectedRoute from "@/components/ProtectedRoute";

describe("AuthBootstrap & ProtectedRoute Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render loading state on ProtectedRoute when session is initializing", () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: "stored_token",
          refreshToken: "stored_refresh",
          isAuthenticated: true,
          isInitializing: true,
          role: "employee" as const,
          companyId: null,
          sessionStatus: "loading" as const,
        },
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Restoring OFC360 Session/i)).toBeInTheDocument();
  });

  it("should render protected content when user is authenticated and not initializing", () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: { id: "1", name: "Alex", email: "alex@ofc360.com", role: "hr_admin" },
          token: "valid_token",
          refreshToken: "valid_refresh",
          isAuthenticated: true,
          isInitializing: false,
          role: "hr_admin" as const,
          companyId: "comp_1",
          sessionStatus: "authenticated" as const,
        },
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("should redirect to /login when user is unauthenticated", () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isInitializing: false,
          role: "employee" as const,
          companyId: null,
          sessionStatus: "unauthenticated" as const,
        },
      },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
