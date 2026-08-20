import { describe, it, expect } from "vitest";
import { authApi, useLoginMutation, useGetCurrentUserQuery } from "@/services/api/authApi";
import {
  employeeApi,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetEmployeeStatsQuery,
  useGetEmployeeDashboardQuery,
  useImportEmployeesMutation,
  useLazyExportEmployeesQuery,
  useSendInvitationMutation,
  useSendInviteMutation,
  useDeactivateEmployeeMutation,
  useActivateEmployeeByAdminMutation,
  useActivateEmployeeMutation,
  useApproveOnboardingMutation,
  useRejectOnboardingMutation,
  useResetEmployeePasswordMutation,
  useGetOnboardingStatusQuery,
  useUpdateEmployeeFullMutation,
} from "@/services/api/employeeApi";
import { payrollApi, useGetPayrollPeriodsQuery, useFinalizePayrollMutation } from "@/services/api/payrollApi";
import { recruitmentApi, useGetJobsQuery, useUploadResumeMutation } from "@/services/api/recruitmentApi";
import { timelineApi, useGetEmployeeTimelineQuery, useAddTimelineEventMutation } from "@/services/api/timelineApi";
import { attendanceApi, useGetAttendanceRecordsQuery, useClockInMutation } from "@/services/api/attendanceApi";
import { onboardingApi, useGetOnboardingTasksQuery } from "@/services/api/onboardingApi";
import { performanceApi, useGetPerformanceReviewsQuery } from "@/services/api/performanceApi";
import { auditApi, useGetAuditLogsQuery } from "@/services/api/auditApi";

describe("RTK Query Feature API Endpoints", () => {
  it("should successfully inject endpoints into baseApi", () => {
    expect(authApi.endpoints).toHaveProperty("login");
    expect(authApi.endpoints).toHaveProperty("getCurrentUser");

    expect(employeeApi.endpoints).toHaveProperty("getEmployees");
    expect(employeeApi.endpoints).toHaveProperty("createEmployee");
    expect(employeeApi.endpoints).toHaveProperty("getEmployeeStats");
    expect(employeeApi.endpoints).toHaveProperty("getEmployeeDashboard");
    expect(employeeApi.endpoints).toHaveProperty("importEmployees");
    expect(employeeApi.endpoints).toHaveProperty("exportEmployees");
    expect(employeeApi.endpoints).toHaveProperty("updateEmployeeFull");
    expect(employeeApi.endpoints).toHaveProperty("sendInvitation");
    expect(employeeApi.endpoints).toHaveProperty("sendInvite");
    expect(employeeApi.endpoints).toHaveProperty("deactivateEmployee");
    expect(employeeApi.endpoints).toHaveProperty("activateEmployeeByAdmin");
    expect(employeeApi.endpoints).toHaveProperty("activateEmployee");
    expect(employeeApi.endpoints).toHaveProperty("approveOnboarding");
    expect(employeeApi.endpoints).toHaveProperty("rejectOnboarding");
    expect(employeeApi.endpoints).toHaveProperty("resetEmployeePassword");
    expect(employeeApi.endpoints).toHaveProperty("getOnboardingStatus");

    expect(payrollApi.endpoints).toHaveProperty("getPayrollPeriods");
    expect(payrollApi.endpoints).toHaveProperty("finalizePayroll");

    expect(recruitmentApi.endpoints).toHaveProperty("getJobs");
    expect(recruitmentApi.endpoints).toHaveProperty("uploadResume");

    expect(timelineApi.endpoints).toHaveProperty("getEmployeeTimeline");
    expect(timelineApi.endpoints).toHaveProperty("addTimelineEvent");

    expect(attendanceApi.endpoints).toHaveProperty("getAttendanceRecords");
    expect(attendanceApi.endpoints).toHaveProperty("clockIn");

    expect(onboardingApi.endpoints).toHaveProperty("getOnboardingTasks");
    expect(performanceApi.endpoints).toHaveProperty("getPerformanceReviews");
    expect(auditApi.endpoints).toHaveProperty("getAuditLogs");
  });

  it("should export valid generated hooks", () => {
    expect(typeof useLoginMutation).toBe("function");
    expect(typeof useGetCurrentUserQuery).toBe("function");
    expect(typeof useGetEmployeesQuery).toBe("function");
    expect(typeof useCreateEmployeeMutation).toBe("function");
    expect(typeof useGetEmployeeStatsQuery).toBe("function");
    expect(typeof useGetEmployeeDashboardQuery).toBe("function");
    expect(typeof useImportEmployeesMutation).toBe("function");
    expect(typeof useLazyExportEmployeesQuery).toBe("function");
    expect(typeof useSendInvitationMutation).toBe("function");
    expect(typeof useSendInviteMutation).toBe("function");
    expect(typeof useDeactivateEmployeeMutation).toBe("function");
    expect(typeof useActivateEmployeeByAdminMutation).toBe("function");
    expect(typeof useActivateEmployeeMutation).toBe("function");
    expect(typeof useApproveOnboardingMutation).toBe("function");
    expect(typeof useRejectOnboardingMutation).toBe("function");
    expect(typeof useResetEmployeePasswordMutation).toBe("function");
    expect(typeof useGetOnboardingStatusQuery).toBe("function");
    expect(typeof useUpdateEmployeeFullMutation).toBe("function");
    expect(typeof useGetPayrollPeriodsQuery).toBe("function");
    expect(typeof useFinalizePayrollMutation).toBe("function");
    expect(typeof useGetJobsQuery).toBe("function");
    expect(typeof useUploadResumeMutation).toBe("function");
    expect(typeof useGetEmployeeTimelineQuery).toBe("function");
    expect(typeof useAddTimelineEventMutation).toBe("function");
    expect(typeof useGetAttendanceRecordsQuery).toBe("function");
    expect(typeof useClockInMutation).toBe("function");
    expect(typeof useGetOnboardingTasksQuery).toBe("function");
    expect(typeof useGetPerformanceReviewsQuery).toBe("function");
    expect(typeof useGetAuditLogsQuery).toBe("function");
  });
});