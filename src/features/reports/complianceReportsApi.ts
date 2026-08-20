import { baseApi } from "@/services/api/baseApi";
import { RawEnvelope } from "@/services/api/envelope";
import {
  APIResponse,
  ComplianceDashboardKpis,
  ComplianceCheck,
  LaborLawStatus,
  MissingDocument,
  ComplianceRisk,
  AuditReadiness,
  ComplianceAnalytics,
  ComplianceAlert,
  ComplianceReportData,
  EmployeeComplianceDetail,
  AnalyzeCompliancePayload,
  AuditPayload,
  RiskAnalysisPayload,
  SecurityAuditLog,
} from "./types";
import { extractData, extractArray } from "./unwrapHelper";

export const complianceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceDashboard: builder.query<APIResponse<ComplianceDashboardKpis>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/dashboard",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceDashboardKpis> | APIResponse<ComplianceDashboardKpis> | ComplianceDashboardKpis) => {
        const data = extractData<ComplianceDashboardKpis>(raw);
        return {
          success: true,
          message: "Compliance dashboard retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "DASHBOARD" }],
    }),

    getComplianceChecks: builder.query<APIResponse<ComplianceCheck[]>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/checks",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceCheck[]> | APIResponse<ComplianceCheck[]> | ComplianceCheck[]) => {
        const data = extractArray<ComplianceCheck>(raw);
        return {
          success: true,
          message: "Compliance checks retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "CHECKS" }],
    }),

    getLaborLaws: builder.query<APIResponse<LaborLawStatus[]>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/labor-laws",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<LaborLawStatus[]> | APIResponse<LaborLawStatus[]> | LaborLawStatus[]) => {
        const data = extractArray<LaborLawStatus>(raw);
        return {
          success: true,
          message: "Labor law statuses retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "LABOR_LAWS" }],
    }),

    getMissingDocuments: builder.query<APIResponse<MissingDocument[]>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/missing-documents",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<MissingDocument[]> | APIResponse<MissingDocument[]> | MissingDocument[]) => {
        const data = extractArray<MissingDocument>(raw);
        return {
          success: true,
          message: "Missing documents retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "MISSING_DOCS" }],
    }),

    getComplianceRisks: builder.query<APIResponse<ComplianceRisk[]>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/risks",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceRisk[]> | APIResponse<ComplianceRisk[]> | ComplianceRisk[]) => {
        const data = extractArray<ComplianceRisk>(raw);
        return {
          success: true,
          message: "Compliance risks retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "RISKS" }],
    }),

    getAuditReadiness: builder.query<APIResponse<AuditReadiness>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/audit-readiness",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<AuditReadiness> | APIResponse<AuditReadiness> | AuditReadiness) => {
        const data = extractData<AuditReadiness>(raw);
        return {
          success: true,
          message: "Audit readiness retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "AUDIT_READINESS" }],
    }),

    getComplianceAnalytics: builder.query<APIResponse<ComplianceAnalytics>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/analytics",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceAnalytics> | APIResponse<ComplianceAnalytics> | ComplianceAnalytics) => {
        const data = extractData<ComplianceAnalytics>(raw);
        return {
          success: true,
          message: "Compliance analytics retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "ANALYTICS" }],
    }),

    getComplianceAlerts: builder.query<APIResponse<ComplianceAlert[]>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/alerts",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceAlert[]> | APIResponse<ComplianceAlert[]> | ComplianceAlert[]) => {
        const data = extractArray<ComplianceAlert>(raw);
        return {
          success: true,
          message: "Compliance alerts retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "ALERTS" }],
    }),

    getComplianceReport: builder.query<APIResponse<ComplianceReportData>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/report",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceReportData> | APIResponse<ComplianceReportData> | ComplianceReportData) => {
        const data = extractData<ComplianceReportData>(raw);
        return {
          success: true,
          message: "Compliance report data retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "REPORT" }],
    }),

    getEmployeeComplianceDetail: builder.query<
      APIResponse<EmployeeComplianceDetail>,
      string
    >({
      query: (employeeId) => ({
        url: `/api/v1/ai/compliance/employee/${employeeId}`,
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<EmployeeComplianceDetail> | APIResponse<EmployeeComplianceDetail> | EmployeeComplianceDetail) => {
        const data = extractData<EmployeeComplianceDetail>(raw);
        return {
          success: true,
          message: "Employee compliance detail retrieved",
          data,
          errors: null,
        };
      },
      providesTags: (_res, _err, id) => [
        { type: "ComplianceReport", id: `EMPLOYEE_${id}` },
      ],
    }),

    analyzeCompliance: builder.mutation<APIResponse<unknown>, AnalyzeCompliancePayload>({
      query: (body) => ({
        url: "/api/v1/ai/compliance/analyze",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ComplianceReport", id: "DASHBOARD" }],
    }),

    runAudit: builder.mutation<APIResponse<unknown>, AuditPayload>({
      query: (body) => ({
        url: "/api/v1/ai/compliance/audit",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ComplianceReport", id: "AUDIT_READINESS" }],
    }),

    runRiskAnalysis: builder.mutation<APIResponse<ComplianceRisk[]>, RiskAnalysisPayload>({
      query: (body) => ({
        url: "/api/v1/ai/compliance/risk-analysis",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ComplianceReport", id: "RISKS" }],
    }),

    getSecurityAuditLog: builder.query<APIResponse<SecurityAuditLog[]>, void>({
      query: () => ({
        url: "/api/v2/payroll/security/audit",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<SecurityAuditLog[]> | APIResponse<SecurityAuditLog[]> | SecurityAuditLog[]) => {
        const data = extractArray<SecurityAuditLog>(raw);
        return {
          success: true,
          message: "Security audit log retrieved",
          data,
          errors: null,
        };
      },
      providesTags: [{ type: "ComplianceReport", id: "SECURITY_AUDIT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetComplianceDashboardQuery,
  useGetComplianceChecksQuery,
  useGetLaborLawsQuery,
  useGetMissingDocumentsQuery,
  useGetComplianceRisksQuery,
  useGetAuditReadinessQuery,
  useGetComplianceAnalyticsQuery,
  useGetComplianceAlertsQuery,
  useGetComplianceReportQuery,
  useGetEmployeeComplianceDetailQuery,
  useAnalyzeComplianceMutation,
  useRunAuditMutation,
  useRunRiskAnalysisMutation,
  useGetSecurityAuditLogQuery,
} = complianceReportsApi;