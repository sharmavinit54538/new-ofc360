import { describe, it, expect } from "vitest";
import { authApi, useLoginMutation, useGetCurrentUserQuery } from "@/services/api/authApi";
import { employeeApi, useGetEmployeesQuery, useCreateEmployeeMutation } from "@/services/api/employeeApi";
import { payrollApi, useGetPayrollPeriodsQuery, useFinalizePayrollMutation } from "@/services/api/payrollApi";
import { recruitmentApi, useGetJobsQuery, useUploadResumeMutation } from "@/services/api/recruitmentApi";
import { intelligenceApi, useGetAiModelsQuery, useExecuteAiModelMutation } from "@/services/api/intelligenceApi";
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

    expect(payrollApi.endpoints).toHaveProperty("getPayrollPeriods");
    expect(payrollApi.endpoints).toHaveProperty("finalizePayroll");

    expect(recruitmentApi.endpoints).toHaveProperty("getJobs");
    expect(recruitmentApi.endpoints).toHaveProperty("uploadResume");

    expect(intelligenceApi.endpoints).toHaveProperty("getAiModels");
    expect(intelligenceApi.endpoints).toHaveProperty("executeAiModel");

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
    expect(typeof useGetPayrollPeriodsQuery).toBe("function");
    expect(typeof useFinalizePayrollMutation).toBe("function");
    expect(typeof useGetJobsQuery).toBe("function");
    expect(typeof useUploadResumeMutation).toBe("function");
    expect(typeof useGetAiModelsQuery).toBe("function");
    expect(typeof useExecuteAiModelMutation).toBe("function");
    expect(typeof useGetEmployeeTimelineQuery).toBe("function");
    expect(typeof useAddTimelineEventMutation).toBe("function");
    expect(typeof useGetAttendanceRecordsQuery).toBe("function");
    expect(typeof useClockInMutation).toBe("function");
    expect(typeof useGetOnboardingTasksQuery).toBe("function");
    expect(typeof useGetPerformanceReviewsQuery).toBe("function");
    expect(typeof useGetAuditLogsQuery).toBe("function");
  });
});
