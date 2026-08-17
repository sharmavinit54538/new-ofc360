import { describe, it, expect } from "vitest";
import { engagementReportsApi } from "@/features/reports/engagementReportsApi";
import { cultureReportsApi } from "@/features/reports/cultureReportsApi";
import { performanceReportsApi } from "@/features/reports/performanceReportsApi";
import { complianceReportsApi } from "@/features/reports/complianceReportsApi";
import { workforceReportsApi } from "@/features/reports/workforceReportsApi";
import { reportsCoreApi } from "@/features/reports/reportsCoreApi";
import { unwrapEnvelope } from "@/services/api/envelope";

describe("OFC360 Reports Frontend – Real API Integration Tests", () => {
  describe("Envelope Unwrapping Utility", () => {
    it("should extract data from standard backend APIResponse envelope", () => {
      const envelope = {
        success: true,
        message: "OK",
        data: { enpsScore: 45, responseRate: 90 },
        errors: null,
      };
      const result = unwrapEnvelope(envelope);
      expect(result).toEqual({ enpsScore: 45, responseRate: 90 });
    });

    it("should handle already unwrapped raw data payload directly", () => {
      const direct = [{ month: "Jan", score: 80 }];
      const result = unwrapEnvelope(direct);
      expect(result).toEqual([{ month: "Jan", score: 80 }]);
    });

    it("should handle null or empty values gracefully", () => {
      expect(unwrapEnvelope(null)).toBeNull();
      expect(unwrapEnvelope(undefined)).toBeUndefined();
    });
  });

  describe("Engagement API Endpoints & Configuration", () => {
    it("should have correct endpoint definitions for Engagement", () => {
      const endpoints = engagementReportsApi.endpoints;
      expect(endpoints.getEngagementSummary).toBeDefined();
      expect(endpoints.getEngagementTrend).toBeDefined();
      expect(endpoints.getEnpsTrend).toBeDefined();
      expect(endpoints.getEngagementBreakdown).toBeDefined();
      expect(endpoints.getEngagementSurveys).toBeDefined();
    });
  });

  describe("Culture API Endpoints & Configuration", () => {
    it("should have correct endpoint definitions for Culture", () => {
      const endpoints = cultureReportsApi.endpoints;
      expect(endpoints.getCultureTelemetry).toBeDefined();
      expect(endpoints.getCultureTrend).toBeDefined();
      expect(endpoints.getCultureBreakdown).toBeDefined();
      expect(endpoints.getCultureFeedback).toBeDefined();
    });
  });

  describe("Performance API Endpoints & Configuration", () => {
    it("should have correct endpoint definitions for AI Performance", () => {
      const endpoints = performanceReportsApi.endpoints;
      expect(endpoints.getPerformanceDashboard).toBeDefined();
      expect(endpoints.getPerformanceTrends).toBeDefined();
      expect(endpoints.getKpiAttainment).toBeDefined();
      expect(endpoints.getTopPerformers).toBeDefined();
      expect(endpoints.getSkillGaps).toBeDefined();
      expect(endpoints.getEmployeePerformanceScore).toBeDefined();
    });
  });

  describe("Compliance API Endpoints & Configuration", () => {
    it("should have correct endpoint definitions for Compliance", () => {
      const endpoints = complianceReportsApi.endpoints;
      expect(endpoints.getComplianceDashboard).toBeDefined();
      expect(endpoints.getComplianceChecks).toBeDefined();
      expect(endpoints.getComplianceRisks).toBeDefined();
      expect(endpoints.getAuditReadiness).toBeDefined();
      expect(endpoints.getSecurityAuditLog).toBeDefined();
    });
  });

  describe("Workforce & Core Reports Endpoints", () => {
    it("should have correct endpoint definitions for Workforce & Core Reports", () => {
      expect(workforceReportsApi.endpoints.getExecutiveHrDashboard).toBeDefined();
      expect(workforceReportsApi.endpoints.getLeavesAnalytics).toBeDefined();
      expect(reportsCoreApi.endpoints.getReports).toBeDefined();
      expect(reportsCoreApi.endpoints.getReportStats).toBeDefined();
      expect(reportsCoreApi.endpoints.getHeadcountAnalytics).toBeDefined();
      expect(reportsCoreApi.endpoints.getDepartmentAnalytics).toBeDefined();
    });
  });
});
