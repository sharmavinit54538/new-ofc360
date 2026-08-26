import { baseApi } from "./baseApi";
import type {
  PeopleIntelligenceSummary,
  Employee360Intelligence,
  DepartmentIntelligence,
  ManagerIntelligence,
  ExecutiveBriefing,
  ITSystemIntelligence,
  PeopleRecommendation,
  PeopleWorkflow,
  DataQualityIssue,
  PeopleAuditEntry,
  AskPeopleAIRequest,
  AskPeopleAIResponse,
} from "../people-ai/peopleAiTypes";
import { PeopleDetectionEngine } from "../people-ai/peopleDetectionEngine";
import { PeopleRecommendationEngine } from "../people-ai/peopleRecommendationEngine";
import { PeopleWorkflowEngine } from "../people-ai/peopleWorkflowEngine";
import { PeopleDataQualityEngine, type DataHealthReport } from "../people-ai/peopleDataQualityEngine";
import { PeopleCopilotService } from "../people-ai/peopleCopilotService";
import { PeopleAuditService } from "../people-ai/peopleAuditService";
import type { RootState } from "@/app/store";
import type { Employee, Department, Manager, AttendanceRecord } from "@/types/hr";
import type { SystemContext } from "../people-ai/peopleContextCollector";

export const peopleAiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPeopleIntelligenceSummary: builder.query<PeopleIntelligenceSummary, void>({
      queryFn: async (_arg, { getState }) => {
        try {
          const state = getState() as RootState;
          // Extract employees and departments from cache/store or defaults
          const employees = (state as any)?.employees?.list || [];
          const departments = (state as any)?.departments?.list || [];
          const managers = (state as any)?.managers?.list || [];

          const systemContext: SystemContext = {
            employees: Array.isArray(employees) && employees.length > 0 ? employees : [],
            departments: Array.isArray(departments) ? departments : [],
            managers: Array.isArray(managers) ? managers : [],
            attendanceRecords: [],
          };

          const summary = PeopleRecommendationEngine.generateSummary(systemContext);
          return { data: summary };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to generate people intelligence summary",
            },
          };
        }
      },
      providesTags: ["Timeline"],
    }),

    getEmployee360Intelligence: builder.query<Employee360Intelligence, { employeeId: string; employees?: Employee[]; departments?: Department[] }>({
      queryFn: async ({ employeeId, employees = [], departments = [] }) => {
        try {
          const systemContext: SystemContext = {
            employees,
            departments,
            managers: [],
            attendanceRecords: [],
          };

          const intel = PeopleDetectionEngine.analyzeEmployee(employeeId, systemContext);
          if (!intel) {
            return {
              error: {
                status: 404,
                data: { message: `Employee with ID ${employeeId} not found in active directory.` },
              },
            };
          }
          return { data: intel };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to evaluate employee intelligence",
            },
          };
        }
      },
      providesTags: (_res, _err, { employeeId }) => [{ type: "Employee", id: employeeId }],
    }),

    getDepartmentIntelligence: builder.query<DepartmentIntelligence, { departmentName: string; employees?: Employee[]; departments?: Department[] }>({
      queryFn: async ({ departmentName, employees = [], departments = [] }) => {
        try {
          const systemContext: SystemContext = {
            employees,
            departments,
            managers: [],
            attendanceRecords: [],
          };

          const intel = PeopleDetectionEngine.analyzeDepartment(departmentName, systemContext);
          return { data: intel };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to evaluate department intelligence",
            },
          };
        }
      },
      providesTags: ["Department"],
    }),

    getManagerIntelligence: builder.query<ManagerIntelligence, { managerId: string; employees?: Employee[]; managers?: Manager[] }>({
      queryFn: async ({ managerId, employees = [], managers = [] }) => {
        try {
          const systemContext: SystemContext = {
            employees,
            departments: [],
            managers,
            attendanceRecords: [],
          };

          const intel = PeopleDetectionEngine.analyzeManager(managerId, systemContext);
          return { data: intel };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to evaluate manager intelligence",
            },
          };
        }
      },
      providesTags: ["Manager"],
    }),

    getExecutiveIntelligence: builder.query<ExecutiveBriefing, { employees?: Employee[]; departments?: Department[] }>({
      queryFn: async ({ employees = [], departments = [] }) => {
        try {
          const systemContext: SystemContext = {
            employees,
            departments,
            managers: [],
            attendanceRecords: [],
          };

          const briefing = PeopleDetectionEngine.generateExecutiveBriefing(systemContext);
          return { data: briefing };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to generate executive briefing",
            },
          };
        }
      },
      providesTags: ["Company"],
    }),

    getITSystemIntelligence: builder.query<ITSystemIntelligence, { employees?: Employee[] }>({
      queryFn: async ({ employees = [] }) => {
        try {
          const systemContext: SystemContext = {
            employees,
            departments: [],
            managers: [],
            attendanceRecords: [],
          };

          const itIntel = PeopleDetectionEngine.generateITIntelligence(systemContext);
          return { data: itIntel };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to generate IT system intelligence",
            },
          };
        }
      },
      providesTags: ["Settings"],
    }),

    getPeopleDataHealth: builder.query<DataHealthReport, { employees: Employee[]; departments: Department[] }>({
      queryFn: async ({ employees, departments }) => {
        try {
          const report = PeopleDataQualityEngine.auditDataHealth(employees, departments);
          return { data: report };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to audit people data health",
            },
          };
        }
      },
      providesTags: ["Employee", "Department"],
    }),

    fixDataQualityIssue: builder.mutation<{ success: boolean; message: string }, { issue: DataQualityIssue; actor?: string }>({
      queryFn: async ({ issue, actor = "HR Admin" }) => {
        try {
          const res = PeopleDataQualityEngine.applyAutoFix(issue, actor);
          return { data: res };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to apply data quality auto-fix",
            },
          };
        }
      },
      invalidatesTags: ["Employee", "Department"],
    }),

    getPeopleAuditLogs: builder.query<PeopleAuditEntry[], void>({
      queryFn: async () => {
        try {
          const logs = PeopleAuditService.getAuditLogs();
          return { data: logs };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to load people audit logs",
            },
          };
        }
      },
      providesTags: ["Timeline"],
    }),

    askPeopleAI: builder.mutation<AskPeopleAIResponse, { request: AskPeopleAIRequest; employees: Employee[]; departments: Department[]; managers?: Manager[]; role?: string; userId?: string }>({
      queryFn: async ({ request, employees, departments, managers = [], role = "hr_admin", userId = "u1" }) => {
        try {
          const systemContext: SystemContext = {
            employees,
            departments,
            managers,
            attendanceRecords: [],
          };

          const resp = await PeopleCopilotService.queryPeopleAI(
            request,
            role as any,
            userId,
            systemContext
          );
          return { data: resp };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to process People AI query",
            },
          };
        }
      },
    }),

    triggerJoinerWorkflow: builder.mutation<PeopleWorkflow, { employee: Employee; initiator?: string }>({
      queryFn: async ({ employee, initiator = "HR Admin" }) => {
        try {
          const wf = PeopleWorkflowEngine.triggerJoinerWorkflow(employee, initiator);
          return { data: wf };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to trigger joiner workflow",
            },
          };
        }
      },
      invalidatesTags: ["Timeline", "Employee"],
    }),

    triggerMoverWorkflow: builder.mutation<PeopleWorkflow, { employee: Employee; changes: { newDepartment?: string; newRole?: string; newManager?: string }; initiator?: string }>({
      queryFn: async ({ employee, changes, initiator = "HR Admin" }) => {
        try {
          const wf = PeopleWorkflowEngine.triggerMoverWorkflow(employee, changes, initiator);
          return { data: wf };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to trigger mover workflow",
            },
          };
        }
      },
      invalidatesTags: ["Timeline", "Employee"],
    }),

    triggerLeaverWorkflow: builder.mutation<PeopleWorkflow, { employee: Employee; reason: string; initiator?: string }>({
      queryFn: async ({ employee, reason, initiator = "HR Admin" }) => {
        try {
          const wf = PeopleWorkflowEngine.triggerLeaverWorkflow(employee, reason, initiator);
          return { data: wf };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to trigger leaver workflow",
            },
          };
        }
      },
      invalidatesTags: ["Timeline", "Employee"],
    }),

    approveWorkflow: builder.mutation<PeopleWorkflow, { workflowId: string; actor?: string }>({
      queryFn: async ({ workflowId, actor = "HR Manager" }) => {
        try {
          const wf = PeopleWorkflowEngine.approveWorkflow(workflowId, actor);
          if (!wf) {
            return {
              error: {
                status: 404,
                data: { message: `Workflow ${workflowId} not found.` },
              },
            };
          }
          return { data: wf };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to approve workflow",
            },
          };
        }
      },
      invalidatesTags: ["Timeline"],
    }),

    rejectWorkflow: builder.mutation<PeopleWorkflow, { workflowId: string; reason: string; actor?: string }>({
      queryFn: async ({ workflowId, reason, actor = "HR Manager" }) => {
        try {
          const wf = PeopleWorkflowEngine.rejectWorkflow(workflowId, reason, actor);
          if (!wf) {
            return {
              error: {
                status: 404,
                data: { message: `Workflow ${workflowId} not found.` },
              },
            };
          }
          return { data: wf };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Failed to reject workflow",
            },
          };
        }
      },
      invalidatesTags: ["Timeline"],
    }),
  }),
});

export const {
  useGetPeopleIntelligenceSummaryQuery,
  useGetEmployee360IntelligenceQuery,
  useGetDepartmentIntelligenceQuery,
  useGetManagerIntelligenceQuery,
  useGetExecutiveIntelligenceQuery,
  useGetITSystemIntelligenceQuery,
  useGetPeopleDataHealthQuery,
  useFixDataQualityIssueMutation,
  useGetPeopleAuditLogsQuery,
  useAskPeopleAIMutation,
  useTriggerJoinerWorkflowMutation,
  useTriggerMoverWorkflowMutation,
  useTriggerLeaverWorkflowMutation,
  useApproveWorkflowMutation,
  useRejectWorkflowMutation,
} = peopleAiApi;
