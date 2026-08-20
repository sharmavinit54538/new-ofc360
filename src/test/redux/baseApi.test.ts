import { describe, it, expect } from "vitest";
import { store } from "@/app/store";
import { baseApi } from "@/services/api/baseApi";
import { API_TAGS } from "@/services/api/apiTags";

describe("baseApi & store integration", () => {
  it("should configure store with baseApi reducer and middleware", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("ui");
    expect(state).toHaveProperty("company");
    expect(state).toHaveProperty("api");
  });

  it("should contain all mandatory domain API tags", () => {
    expect(API_TAGS).toContain("Auth");
    expect(API_TAGS).toContain("User");
    expect(API_TAGS).toContain("Company");
    expect(API_TAGS).toContain("Employee");
    expect(API_TAGS).toContain("Attendance");
    expect(API_TAGS).toContain("Leave");
    expect(API_TAGS).toContain("Payroll");
    expect(API_TAGS).toContain("Payslip");
    expect(API_TAGS).toContain("PayrollAnalytics");
    expect(API_TAGS).toContain("Recruitment");
    expect(API_TAGS).toContain("Candidate");
    expect(API_TAGS).toContain("Job");
    expect(API_TAGS).toContain("Onboarding");
    expect(API_TAGS).toContain("Performance");
    expect(API_TAGS).toContain("Document");
    expect(API_TAGS).toContain("Notification");
    expect(API_TAGS).toContain("AuditLog");
    expect(API_TAGS).toContain("Intelligence");
    expect(API_TAGS).toContain("AIModel");
    expect(API_TAGS).toContain("Timeline");
  });

  it("should allow resetting API state on logout", () => {
    store.dispatch(baseApi.util.resetApiState());
    const stateAfterReset = store.getState();
    expect(stateAfterReset.api.queries).toEqual({});
    expect(stateAfterReset.api.mutations).toEqual({});
  });
});