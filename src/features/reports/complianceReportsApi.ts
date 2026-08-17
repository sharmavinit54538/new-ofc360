import { baseApi } from "@/services/api/baseApi";
import { unwrapEnvelope, RawEnvelope } from "@/services/api/envelope";
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

export const complianceReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceDashboard: builder.query<APIResponse<ComplianceDashboardKpis>, void>({
      query: () => ({
        url: "/api/v1/ai/compliance/dashboard",
        method: "GET",
      }),
      transformResponse: (raw: RawEnvelope<ComplianceDashboardKpis> | APIResponse<ComplianceDashboardKpis> | ComplianceDashboardKpis) => {
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ComplianceDashboardKpis>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Compliance dashboard retrieved",
          data: (data && typeof data === "object") ? data as ComplianceDashboardKpis : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ComplianceCheck[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Compliance checks retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<LaborLawStatus[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Labor law statuses retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<MissingDocument[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Missing documents retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ComplianceRisk[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Compliance risks retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<AuditReadiness>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Audit readiness retrieved",
          data: (data && typeof data === "object") ? data as AuditReadiness : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ComplianceAnalytics>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Compliance analytics retrieved",
          data: (data && typeof data === "object") ? data as ComplianceAnalytics : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ComplianceAlert[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Compliance alerts retrieved",
          data: Array.isArray(data) ? data : [],
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<ComplianceReportData>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Compliance report data retrieved",
          data: (data && typeof data === "object") ? data as ComplianceReportData : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<EmployeeComplianceDetail>);
        const data = (unwrapped && typeof unwrapped === "object" && "data" in unwrapped && (unwrapped as any).data !== undefined)
          ? (unwrapped as any).data
          : unwrapped;
        return {
          success: true,
          message: "Employee compliance detail retrieved",
          data: (data && typeof data === "object") ? data as EmployeeComplianceDetail : null,
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
        const unwrapped = unwrapEnvelope(raw as RawEnvelope<SecurityAuditLog[]>);
        const data = Array.isArray(unwrapped)
          ? unwrapped
          : (unwrapped && typeof unwrapped === "object" && Array.isArray((unwrapped as any).data))
          ? (unwrapped as any).data
          : [];
        return {
          success: true,
          message: "Security audit log retrieved",
          data: Array.isArray(data) ? data : [],
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
