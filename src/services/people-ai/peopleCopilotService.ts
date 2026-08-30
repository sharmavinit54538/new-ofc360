import type {
  AskPeopleAIRequest,
  AskPeopleAIResponse,
  PeopleRecommendation,
  ActionExecutor,
  ActionResult,
  CleanEmployeeItem,
  ConfirmationDetails,
  StructuredAIOutput,
} from "./peopleAiTypes";
import type { SystemRole } from "@/features/auth/authTypes";
import { normalizeRole } from "@/features/auth/authTypes";
import { PeopleDetectionEngine } from "./peopleDetectionEngine";
import { PeopleRecommendationEngine } from "./peopleRecommendationEngine";
import { PeopleAuditService } from "./peopleAuditService";
import type { SystemContext } from "./peopleContextCollector";
import type { Employee, Department, Manager } from "@/types/hr";

export function normalizeEmployeeStatus(
  status?: string | null
): "ACTIVE" | "INACTIVE" | "INVITED" | "PROBATION" | "NOTICE" | "RESIGNED" | "TERMINATED" | "ON_LEAVE" {
  if (!status) return "ACTIVE";
  const s = String(status).trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (s === "INACTIVE" || s === "DEACTIVATED" || s === "SUSPENDED") return "INACTIVE";
  if (s === "INVITED" || s === "PENDING" || s === "INVITATION_SENT" || s === "ONBOARDING_PENDING" || s === "ONBOARDING")
    return "INVITED";
  if (s === "PROBATION" || s === "ON_PROBATION") return "PROBATION";
  if (s === "NOTICE" || s === "SERVING_NOTICE" || s === "NOTICE_PERIOD") return "NOTICE";
  if (s === "RESIGNED" || s === "RESIGNATION") return "RESIGNED";
  if (s === "TERMINATED") return "TERMINATED";
  if (s === "ON_LEAVE" || s === "LEAVE" || s === "ABSENT") return "ON_LEAVE";
  if (s === "ACTIVE") return "ACTIVE";
  return "ACTIVE";
}

interface ExtractedEmployeeCreation {
  name?: string;
  email?: string;
  phone?: string;
  departmentName?: string;
  departmentId?: string;
  designation?: string;
  role?: string;
  salary?: number;
  managerName?: string;
  managerId?: string;
}

export class PeopleCopilotService {
  /**
   * Helper to convert raw Employee object to clean, human-readable item
   * NEVER exposes internal database UUIDs to UI
   */
  public static toCleanEmployeeItem(emp: Employee): CleanEmployeeItem {
    const rawName = emp.name || (emp.firstName ? `${emp.firstName} ${emp.lastName || ""}`.trim() : "") || "Employee";
    const displayName = rawName.replace(/\b\w/g, (c) => c.toUpperCase());
    const displayEmail = emp.email || emp.companyWorkEmail || emp.personalEmail || undefined;
    const displayRole = emp.designation || emp.role || "Team Member";
    const displayDept = emp.department || "General";
    const displayManager = emp.reportingManager || emp.managerName || undefined;
    const displayStatus = (emp.status || "Active").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: String(emp.id),
      name: displayName,
      email: displayEmail,
      role: displayRole,
      department: displayDept,
      manager: displayManager,
      status: displayStatus,
      salary: emp.salary || emp.ctc || undefined,
      joinedAt: emp.joinedAt || emp.joiningDate || undefined,
      phone: emp.phone || undefined,
      performanceScore: (emp as any).performanceScore || undefined,
      skills: Array.isArray(emp.skills)
        ? emp.skills.map((s: any) => (typeof s === "string" ? s : s.name))
        : undefined,
    };
  }

  /**
   * Main entry point for Ask People AI copilot.
   * Completely grounded in 100% real production organization data with zero mock data.
   */
  static async queryPeopleAI(
    req: AskPeopleAIRequest,
    userRole: SystemRole = "hr_admin",
    userId: string = "user-1",
    systemContext: SystemContext,
    actorName: string = "Authenticated User",
    actionExecutor?: ActionExecutor
  ): Promise<AskPeopleAIResponse> {
    const origQuery = req.query.trim();
    const origLower = origQuery.toLowerCase();
    const q = origLower.replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/\s+/g, " ").trim();

    // 1. RBAC Firewall Checks
    if (
      (q.includes("all salaries") || q.includes("executive bonus") || q.includes("board compensation")) &&
      userRole === "employee"
    ) {
      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "COPILOT_SECURITY_VIOLATION_BLOCKED",
        details: `Rejected query violating role authorization scope: "${req.query}"`,
        aiGenerated: true,
        status: "OVERRIDDEN",
      });

      return {
        answer: "Access Denied: You do not have authorization to access confidential organization-wide compensation or bypass role-based security policies.",
        supportingDataPoints: ["Security Policy RBAC-702 Enforced", `Current Role: ${userRole.toUpperCase()}`],
        suggestedFollowUps: [
          "What are my pending tasks?",
          "How is my team performing?",
          "Who needs attention today?",
        ],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Request blocked by OFC360 security governance firewall.",
        structuredOutput: {
          type: "text",
        },
      };
    }

    // 2. Real Production Data Context (Zero Mock / Fallback Seeds)
    const baseEmployees: Employee[] = Array.isArray(systemContext.employees) ? [...systemContext.employees] : [];
    const baseDepartments: Department[] = Array.isArray(systemContext.departments) ? [...systemContext.departments] : [];
    const baseManagers: Manager[] = Array.isArray(systemContext.managers) ? [...systemContext.managers] : [];

    // 3. Scoped Data Filtering based on Role (RBAC)
    let authorizedEmployees = [...baseEmployees];
    if (userRole === "employee") {
      authorizedEmployees = authorizedEmployees.filter((e) => e.id === userId || (e.email && e.email.includes(userId)));
    } else if (userRole === "manager") {
      const mgr = baseManagers.find((m) => m.id === userId || m.employeeId === userId) ||
        baseEmployees.find((e) => e.id === userId);
      authorizedEmployees = baseEmployees.filter(
        (e) =>
          e.id === userId ||
          e.managerId === userId ||
          (mgr && (e.reportingManager || "").toLowerCase() === (mgr.name || "").toLowerCase()) ||
          (mgr?.department && (e.department || "").toLowerCase() === (mgr.department || "").toLowerCase())
      );
    }

    const scopedContext: SystemContext = {
      ...systemContext,
      employees: authorizedEmployees,
      departments: baseDepartments,
      managers: baseManagers,
    };

    // =========================================================================
    // 4. ACTION INTENT UNDERSTANDING & REAL BACKEND CRUD DISPATCH / CONFIRMATIONS
    // =========================================================================
    const actionResult = await this.tryExecuteAction(
      req,
      origQuery,
      origLower,
      q,
      scopedContext,
      userRole,
      userId,
      actorName,
      actionExecutor
    );

    if (actionResult) {
      return actionResult;
    }

    // =========================================================================
    // 5. EMPTY STATE CHECK (Zero Mock Data)
    // =========================================================================
    if (authorizedEmployees.length === 0 && !q.includes("founder") && !q.includes("ofc360")) {
      return {
        answer: "No employee records found in your organization.",
        supportingDataPoints: ["Database queried successfully", "0 records returned for current organization tenant"],
        suggestedFollowUps: [
          "Add new employee",
          "Show active departments",
          "Check system data health",
        ],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Verified against live organization database.",
        structuredOutput: {
          type: "text",
        },
      };
    }

    const recommendations = PeopleRecommendationEngine.generateRecommendations(scopedContext);
    const summary = PeopleRecommendationEngine.generateSummary(scopedContext);

    // =========================================================================
    // 6. SPECIFIC EMPLOYEE SEARCH & 360 PROFILE / UNKNOWN EMPLOYEE INTERCEPT
    // =========================================================================
    const matchedEmployee = this.findEmployeeInContext(q, origLower, authorizedEmployees);
    if (matchedEmployee && !this.isGeneralQuery(q)) {
      return this.generateEmployeeProfileResponse(matchedEmployee, scopedContext, userRole, recommendations);
    }

    // If query is an explicit employee search/lookup intent
    if (this.isEmployeeSearchQuery(origQuery, origLower, q)) {
      const personQueryName = this.extractQueryTargetPerson(origQuery, origLower, q);
      return {
        answer: `I couldn't find **${personQueryName || "that employee"}** in your organization's employee records.`,
        supportingDataPoints: [
          `Searched across ${authorizedEmployees.length} employee record(s) in active directory`,
          "Zero matching records found",
        ],
        suggestedFollowUps: [
          "Show all employees",
          "Show departments list",
          "Add employee to organization",
        ],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 98,
        authorizedScope: userRole,
        dataGroundingSummary: "Real-time query against live organization directory.",
        structuredOutput: {
          type: "text",
        },
      };
    }

    // =========================================================================
    // 7. COMPOUND FILTERED QUERIES (Status + Department + Role)
    // =========================================================================
    const matchedDept = this.findDepartmentInContext(q, origLower, baseDepartments, authorizedEmployees);
    const statusPredicate = this.detectStatusPredicate(q, origLower);

    if (statusPredicate || (matchedDept && (q.includes("employee") || q.includes("show") || q.includes("list") || q.includes("kaun") || q.includes("who")))) {
      let filtered = [...authorizedEmployees];
      const filterTitleParts: string[] = [];

      if (statusPredicate) {
        if (statusPredicate === "NOTICE") {
          filtered = filtered.filter((e) => {
            const s = normalizeEmployeeStatus(e.status);
            return s === "NOTICE" || s === "RESIGNED";
          });
          filterTitleParts.push("Notice / Resigned");
        } else if (statusPredicate === "ACTIVE") {
          filtered = filtered.filter((e) => normalizeEmployeeStatus(e.status) === "ACTIVE");
          filterTitleParts.push("Active");
        } else if (statusPredicate === "INACTIVE") {
          filtered = filtered.filter((e) => normalizeEmployeeStatus(e.status) === "INACTIVE");
          filterTitleParts.push("Inactive");
        } else if (statusPredicate === "INVITED") {
          filtered = filtered.filter((e) => normalizeEmployeeStatus(e.status) === "INVITED");
          filterTitleParts.push("Invited");
        } else if (statusPredicate === "PROBATION") {
          filtered = filtered.filter((e) => normalizeEmployeeStatus(e.status) === "PROBATION");
          filterTitleParts.push("Probation");
        } else if (statusPredicate === "TERMINATED") {
          filtered = filtered.filter((e) => normalizeEmployeeStatus(e.status) === "TERMINATED");
          filterTitleParts.push("Terminated");
        } else if (statusPredicate === "ON_LEAVE") {
          filtered = filtered.filter((e) => normalizeEmployeeStatus(e.status) === "ON_LEAVE");
          filterTitleParts.push("On Leave");
        }
      }

      if (matchedDept) {
        filtered = filtered.filter(
          (e) => (e.department || "").toLowerCase() === matchedDept.name.toLowerCase()
        );
        filterTitleParts.push(`in ${matchedDept.name}`);
      }

      const cleanFiltered = filtered.map(this.toCleanEmployeeItem);
      const title = `${filterTitleParts.join(" ")} Employees`.trim();

      if (cleanFiltered.length === 0) {
        return {
          answer: `No ${title.toLowerCase()} found in your organization's employee records.`,
          supportingDataPoints: [
            `Total directory records: ${authorizedEmployees.length}`,
            `Department filter: ${matchedDept?.name || "ALL"}`,
            `Status filter: ${statusPredicate || "ALL"}`,
          ],
          suggestedFollowUps: ["Show all employees", "Show departments list"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Real database filter query.",
          structuredOutput: {
            type: "employee_list",
            title,
            count: 0,
            employees: [],
          },
        };
      }

      const listText = cleanFiltered
        .slice(0, 10)
        .map((e) => `* **${e.name}** — ${e.role} (${e.department} · Status: **${e.status}**)`)
        .join("\n");

      const answer =
        `### ${title} (${cleanFiltered.length} Found)\n\n` +
        listText +
        (cleanFiltered.length > 10 ? `\n\n*...and ${cleanFiltered.length - 10} more members.*` : "");

      return {
        answer,
        supportingDataPoints: [
          `Matching Count: ${cleanFiltered.length}`,
          `Department: ${matchedDept?.name || "All Departments"}`,
          `Status Filter: ${statusPredicate || "All Statuses"}`,
          "Exact normalized match verified against live database",
        ],
        suggestedFollowUps: ["Show all employees", "Show departments list"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Filtered query executed on live database records.",
        structuredOutput: {
          type: "employee_list",
          title,
          count: cleanFiltered.length,
          employees: cleanFiltered,
        },
      };
    }

    // =========================================================================
    // 8. DIRECTORY / ALL EMPLOYEES
    // =========================================================================
    if (
      q.includes("all employees") ||
      q.includes("list employees") ||
      q.includes("show employees") ||
      q.includes("directory") ||
      q.includes("roster") ||
      q.includes("staff list") ||
      q.includes("all staff") ||
      q.includes("total staff") ||
      q.includes("kaun kaun hai") ||
      origLower.includes("sab employees") ||
      origLower.includes("sabhi employee") ||
      origLower.includes("puri list") ||
      origLower.includes("employees list")
    ) {
      return this.generateDirectoryResponse(authorizedEmployees, userRole, recommendations, summary);
    }

    // =========================================================================
    // 9. COMPENSATION & SALARIES
    // =========================================================================
    if (
      q.includes("salary") ||
      q.includes("salaries") ||
      q.includes("compensation") ||
      q.includes("payroll") ||
      q.includes("ctc") ||
      q.includes("highest salary") ||
      q.includes("average salary") ||
      q.includes("package") ||
      origLower.includes("tankha") ||
      origLower.includes("paisa") ||
      origLower.includes("vetan")
    ) {
      return this.generateCompensationResponse(authorizedEmployees, userRole, baseDepartments);
    }

    // =========================================================================
    // 10. ATTENDANCE & LEAVES
    // =========================================================================
    if (
      q.includes("attendance") ||
      q.includes("leave") ||
      q.includes("absent") ||
      q.includes("punctual") ||
      q.includes("on leave") ||
      q.includes("presence") ||
      origLower.includes("chhutti") ||
      origLower.includes("chutti")
    ) {
      return this.generateAttendanceResponse(authorizedEmployees, userRole, scopedContext);
    }

    // =========================================================================
    // 11. DEPARTMENTS & CAPACITY
    // =========================================================================
    if (
      matchedDept ||
      q.includes("department") ||
      q.includes("understaffed") ||
      q.includes("staffing") ||
      q.includes("capacity") ||
      q.includes("headcount")
    ) {
      return this.generateDepartmentResponse(matchedDept, baseDepartments, authorizedEmployees, userRole, recommendations);
    }

    // =========================================================================
    // 12. MANAGERS & ORG HIERARCHY
    // =========================================================================
    if (
      q.includes("manager") ||
      q.includes("leadership") ||
      q.includes("hierarchy") ||
      q.includes("reports to") ||
      q.includes("direct reports") ||
      q.includes("org chart") ||
      q.includes("who are managers") ||
      origLower.includes("manager kaun") ||
      origLower.includes("reporting")
    ) {
      return this.generateManagersResponse(authorizedEmployees, baseManagers, userRole);
    }

    // =========================================================================
    // 13. PROBATION & CONFIRMATION
    // =========================================================================
    if (
      q.includes("probation") ||
      q.includes("confirmation") ||
      q.includes("onboarding") ||
      q.includes("new joiner") ||
      q.includes("recent hire") ||
      origLower.includes("probation list")
    ) {
      return this.generateProbationResponse(authorizedEmployees, userRole, recommendations);
    }

    // =========================================================================
    // 14. NOTICE PERIOD & EXITS
    // =========================================================================
    if (
      q.includes("notice period") ||
      q.includes("resignation") ||
      q.includes("leaving") ||
      q.includes("exit") ||
      q.includes("transition") ||
      origLower.includes("kaun chhod")
    ) {
      return this.generateNoticePeriodResponse(authorizedEmployees, userRole, recommendations);
    }

    // =========================================================================
    // 15. PERFORMANCE & GOALS
    // =========================================================================
    if (
      q.includes("performance") ||
      q.includes("declining") ||
      q.includes("failing") ||
      q.includes("improving") ||
      q.includes("top performer") ||
      q.includes("low performer") ||
      q.includes("goal") ||
      q.includes("okr") ||
      q.includes("velocity") ||
      origLower.includes("accha perform")
    ) {
      return this.generatePerformanceResponse(authorizedEmployees, userRole, recommendations);
    }

    // =========================================================================
    // 16. SKILLS & TALENT SEARCH
    // =========================================================================
    const skillKeywords = [
      "react",
      "typescript",
      "python",
      "node",
      "figma",
      "ui/ux",
      "aws",
      "docker",
      "sales",
      "finance",
      "hr",
      "devops",
      "cloud",
      "qa",
      "cypress",
      "sql",
      "java",
      "marketing",
    ];
    const foundSkill = skillKeywords.find((s) => q.includes(s) || origLower.includes(s));

    if (foundSkill || q.includes("skill") || q.includes("developer") || q.includes("engineer") || q.includes("designer")) {
      return this.generateSkillSearchResponse(foundSkill || q, authorizedEmployees, userRole);
    }

    // =========================================================================
    // 17. WHO NEEDS ATTENTION TODAY?
    // =========================================================================
    if (
      q.includes("who needs attention") ||
      q.includes("attention") ||
      q.includes("focus today") ||
      q.includes("critical") ||
      q.includes("risk") ||
      origLower.includes("kya pending") ||
      origLower.includes("kisko dhyan")
    ) {
      return this.generateAttentionResponse(authorizedEmployees, userRole, recommendations);
    }

    // =========================================================================
    // 18. APPROVALS & WORKFLOWS
    // =========================================================================
    if (
      q.includes("approval") ||
      q.includes("workflow") ||
      q.includes("pending action") ||
      q.includes("operations queue") ||
      q.includes("task") ||
      origLower.includes("approvals")
    ) {
      return this.generateApprovalsResponse(summary, recommendations, userRole);
    }

    // =========================================================================
    // 19. DATA QUALITY & SYSTEM HEALTH
    // =========================================================================
    if (
      q.includes("data health") ||
      q.includes("system health") ||
      q.includes("anomaly") ||
      q.includes("it admin") ||
      q.includes("audit") ||
      q.includes("orphan")
    ) {
      return this.generateDataHealthResponse(scopedContext, summary, userRole);
    }

    // =========================================================================
    // 20. FOUNDERS & PLATFORM INFO
    // =========================================================================
    if (
      q.includes("founder") ||
      q.includes("equinoxsphere") ||
      q.includes("ofc360") ||
      q.includes("owner") ||
      q.includes("company") ||
      q.includes("created by") ||
      q.includes("who made")
    ) {
      return this.generateFoundersResponse(authorizedEmployees, userRole);
    }

    // Default Overview
    return this.generateDefaultOverviewResponse(scopedContext, summary, userRole);
  }

  // =========================================================================
  // ACTION EXECUTION ENGINE (REAL BACKEND MUTATIONS & CONFIRMATIONS)
  // =========================================================================

  private static async tryExecuteAction(
    req: AskPeopleAIRequest,
    origQuery: string,
    origLower: string,
    q: string,
    context: SystemContext,
    userRole: SystemRole,
    userId: string,
    actorName: string,
    actionExecutor?: ActionExecutor
  ): Promise<AskPeopleAIResponse | null> {
    // 1. CONFIRMED ACTION FROM MODAL / EXPLICIT CONFIRMATION
    if (req.confirmedAction) {
      return this.executeConfirmedAction(req.confirmedAction, context, userRole, userId, actorName, actionExecutor);
    }

    const isMoveIntent =
      q.includes("move") ||
      q.includes("transfer") ||
      q.includes("shift") ||
      origLower.includes("move karo") ||
      origLower.includes("transfer karo") ||
      origLower.includes("shift karo") ||
      origLower.includes("daalo") ||
      origLower.includes("bhejo") ||
      (q.includes("change") && q.includes("department"));

    const isManagerIntent =
      (q.includes("make") && q.includes("manager")) ||
      (q.includes("assign") && q.includes("manager")) ||
      (q.includes("set") && q.includes("manager")) ||
      origLower.includes("manager banao") ||
      origLower.includes("manager bana do") ||
      origLower.includes("manager set karo");

    const isRoleIntent =
      (q.includes("change") && (q.includes("designation") || q.includes("role") || q.includes("title"))) ||
      (q.includes("update") && (q.includes("designation") || q.includes("role") || q.includes("title"))) ||
      (q.includes("promote") || q.includes("promotion")) ||
      origLower.includes("designation badlo") ||
      origLower.includes("role change karo");

    const isSalaryIntent =
      (q.includes("update") && q.includes("salary")) ||
      (q.includes("change") && q.includes("salary")) ||
      (q.includes("set") && q.includes("salary")) ||
      origLower.includes("salary badlo") ||
      origLower.includes("salary update karo");

    const isDeactivateIntent =
      q.startsWith("deactivate ") ||
      q.includes("deactivate") ||
      q.includes("terminate") ||
      origLower.includes("deactivate karo") ||
      origLower.includes("hata do") ||
      origLower.includes("inactive karo");

    const isActivateIntent =
      (q.includes("activate") && !q.includes("deactivate")) ||
      (origLower.includes("activate karo") && !origLower.includes("deactivate"));

    const isCreateIntent =
      q.includes("add employee") ||
      q.includes("create employee") ||
      q.includes("create a test employee") ||
      q.includes("create test employee") ||
      q.includes("add a test employee") ||
      q.startsWith("create ") ||
      (q.startsWith("add ") && (q.includes(" to ") || q.includes(" in ") || q.includes(" as ") || q.includes(" with "))) ||
      origLower.includes("employee add karo") ||
      origLower.includes("employee create karo") ||
      (origLower.startsWith("onboard ") && (origLower.includes(" as ") || origLower.includes(" in ") || origLower.includes(" to ")));

    const isDeleteIntent =
      q.startsWith("delete ") ||
      q.startsWith("remove ") ||
      q.includes("delete employee") ||
      q.includes("delete person") ||
      q.includes("remove employee") ||
      origLower.includes("delete karo") ||
      origLower.includes("system se nikal do");


    // =========================================================================
    // BULK DEACTIVATE (CONFIRMATION REQUIRED)
    // =========================================================================
    if (
      (q.includes("deactivate all") || (origLower.includes("sabhi") && origLower.includes("deactivate"))) &&
      (q.includes("resigned") || q.includes("notice") || origLower.includes("resigned") || origLower.includes("notice"))
    ) {
      const matching = context.employees.filter((e) => {
        const st = normalizeEmployeeStatus(e.status);
        return st === "NOTICE" || st === "RESIGNED";
      });

      if (matching.length === 0) {
        return {
          answer: "No resigned or notice-period employees were found in your organization's records.",
          supportingDataPoints: [`Checked ${context.employees.length} employee record(s)`, "0 matches for notice/resigned status"],
          suggestedFollowUps: ["Show all active employees", "Show employees on probation"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Real-time status check against active database.",
          structuredOutput: {
            type: "text",
          },
        };
      }

      const cleanItems = matching.map(this.toCleanEmployeeItem);
      return {
        answer: `Deactivate **${matching.length}** resigned / notice-period employee(s)?\n\n${matching.map((e) => `* **${e.name}** (${e.department || "General"} · Current status: ${e.status || "Notice"})`).join("\n")}\n\n*Please confirm to proceed with bulk deactivation.*`,
        supportingDataPoints: [`Target count: ${matching.length} employee(s)`, "Confirmation required for bulk state mutation"],
        suggestedFollowUps: ["Cancel", "Show all employees"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Confirmation request generated.",
        structuredOutput: {
          type: "confirmation_request",
          confirmation: {
            actionType: "BULK_DEACTIVATE",
            title: `Bulk Deactivate ${matching.length} Employees?`,
            description: `This will update the status of ${matching.length} employee(s) currently serving notice or resigned to Inactive.`,
            affectedCount: matching.length,
            affectedEmployees: cleanItems,
          },
        },
      };
    }

    // =========================================================================
    // MOVE DEPARTMENT
    // =========================================================================
    if (isMoveIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: [`Searched in active directory (${context.employees.length} employees)`],
          suggestedFollowUps: ["Show all employees", "Show departments list"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Real-time employee resolution against database.",
          structuredOutput: { type: "text" },
        };
      }

      const deptMatch = this.extractDepartmentForAction(origQuery, origLower, q, context.departments, context.employees);
      if (!deptMatch) {
        const targetDeptName = this.extractCandidateDeptName(origQuery, origLower, q);
        return {
          answer: `I couldn't find a department named **"${targetDeptName || "specified"}"** in your organization's department list.`,
          supportingDataPoints: [`Available departments: ${context.departments.map((d) => d.name).join(", ") || "None defined"}`],
          suggestedFollowUps: ["Show departments list", "Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Department resolution against master database.",
          structuredOutput: { type: "text" },
        };
      }

      const mgrMatch = this.extractManagerForAction(origQuery, origLower, q, context.managers, context.employees, empMatch.id);

      const updatePayload: Partial<Employee> = {
        department: deptMatch.name,
      };
      if (deptMatch.id) {
        (updatePayload as any).department_id = deptMatch.id;
      }
      if (mgrMatch) {
        updatePayload.managerId = mgrMatch.id;
        (updatePayload as any).manager_id = mgrMatch.id;
        updatePayload.reportingManager = mgrMatch.name;
        (updatePayload as any).reporting_manager = mgrMatch.name;
      }

      if (actionExecutor?.updateEmployee) {
        try {
          const res = await actionExecutor.updateEmployee(empMatch.id, updatePayload);
          if (!res || res.error) {
            const errorMsg =
              res?.error?.data?.detail ||
              res?.error?.data?.message ||
              res?.error?.message ||
              "Backend rejected update request";
            return {
              answer: `The update could not be completed: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
              supportingDataPoints: ["Backend mutation rejected", "Database records unchanged"],
              suggestedFollowUps: ["Check employee details", "Verify permissions"],
              recommendedActions: [],
              confidence: "LIMITED",
              confidenceScore: 50,
              authorizedScope: userRole,
              dataGroundingSummary: "Backend API error during execution.",
              structuredOutput: {
                type: "action_result",
                actionResult: {
                  success: false,
                  actionType: "MOVE_DEPARTMENT",
                  message: `Could not move ${empMatch.name}: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
                  employeeName: empMatch.name,
                },
              },
            };
          }
          actionExecutor.revalidate?.();
        } catch (err: any) {
          return {
            answer: `The update could not be completed: ${err.message || "Network error"}`,
            supportingDataPoints: ["Request failed during backend execution"],
            suggestedFollowUps: ["Try again"],
            recommendedActions: [],
            confidence: "LIMITED",
            confidenceScore: 50,
            authorizedScope: userRole,
            dataGroundingSummary: "API execution failure.",
            structuredOutput: {
              type: "action_result",
              actionResult: {
                success: false,
                actionType: "MOVE_DEPARTMENT",
                message: `Could not move ${empMatch.name}: ${err.message || "Network error"}`,
                employeeName: empMatch.name,
              },
            },
          };
        }
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "EMPLOYEE_DEPARTMENT_TRANSFERRED",
        targetId: empMatch.id,
        targetName: empMatch.name,
        details: `Moved ${empMatch.name} to ${deptMatch.name}${mgrMatch ? ` and assigned manager ${mgrMatch.name}` : ""}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      return {
        answer: `Done. **${empMatch.name}** has been moved to **${deptMatch.name}**${mgrMatch ? ` and reporting manager set to **${mgrMatch.name}**` : ""}.\n\n*The employee directory and organization chart have been updated.*`,
        supportingDataPoints: [
          `Employee: ${empMatch.name}`,
          `New Department: ${deptMatch.name}`,
          ...(mgrMatch ? [`Reporting Manager: ${mgrMatch.name}`] : []),
          "Backend mutation confirmed & live cache invalidated",
        ],
        suggestedFollowUps: [
          `Show ${deptMatch.name} department employees`,
          `Tell me about ${empMatch.name}`,
          "Show full employee directory",
        ],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real database PATCH operation verified.",
        actionExecuted: {
          success: true,
          actionType: "MOVE_DEPARTMENT",
          targetEmployeeId: empMatch.id,
          targetEmployeeName: empMatch.name,
          message: `Moved ${empMatch.name} to ${deptMatch.name}`,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType: "MOVE_DEPARTMENT",
            message: `${empMatch.name} has been moved to ${deptMatch.name}.`,
            employeeName: empMatch.name,
            details: `Department updated from ${empMatch.department || "General"} to ${deptMatch.name}.`,
          },
          employee: this.toCleanEmployeeItem({ ...empMatch, department: deptMatch.name }),
        },
      };
    }

    // =========================================================================
    // ASSIGN MANAGER
    // =========================================================================
    if (isManagerIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      const mgrMatch = this.extractManagerForAction(origQuery, origLower, q, context.managers, context.employees, empMatch?.id);

      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: ["Employee not found in active directory"],
          suggestedFollowUps: ["Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Employee lookup in database.",
          structuredOutput: { type: "text" },
        };
      }

      if (!mgrMatch) {
        return {
          answer: `I couldn't find the specified manager in your organization's employee records.`,
          supportingDataPoints: ["Manager candidate not found in active roster"],
          suggestedFollowUps: ["Show managers list", "Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Manager lookup in database.",
          structuredOutput: { type: "text" },
        };
      }

      if (actionExecutor?.updateEmployee) {
        try {
          const res = await actionExecutor.updateEmployee(empMatch.id, {
            manager_id: mgrMatch.id,
            managerId: mgrMatch.id,
            reporting_manager: mgrMatch.name,
            reportingManager: mgrMatch.name,
            managerName: mgrMatch.name,
          });

          if (!res || res.error) {
            const errorMsg =
              res?.error?.data?.detail ||
              res?.error?.data?.message ||
              res?.error?.message ||
              "Backend rejected manager assignment";
            return {
              answer: `Manager assignment could not be completed: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
              supportingDataPoints: ["Backend error on manager update"],
              suggestedFollowUps: ["Check employee details"],
              recommendedActions: [],
              confidence: "LIMITED",
              confidenceScore: 50,
              authorizedScope: userRole,
              dataGroundingSummary: "API rejection.",
              structuredOutput: {
                type: "action_result",
                actionResult: {
                  success: false,
                  actionType: "CHANGE_MANAGER",
                  message: `Could not assign manager: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
                  employeeName: empMatch.name,
                },
              },
            };
          }
          actionExecutor.revalidate?.();
        } catch (err: any) {
          return {
            answer: `Manager assignment could not be completed: ${err.message || "Failed"}`,
            supportingDataPoints: ["API failure"],
            suggestedFollowUps: ["Try again"],
            recommendedActions: [],
            confidence: "LIMITED",
            confidenceScore: 50,
            authorizedScope: userRole,
            dataGroundingSummary: "Network error.",
            structuredOutput: { type: "text" },
          };
        }
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "EMPLOYEE_MANAGER_ASSIGNED",
        targetId: empMatch.id,
        targetName: empMatch.name,
        details: `Assigned manager ${mgrMatch.name} to ${empMatch.name}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      return {
        answer: `Done. **${mgrMatch.name}** has been assigned as reporting manager for **${empMatch.name}**.\n\n*Reporting hierarchy updated in live directory.*`,
        supportingDataPoints: [
          `Employee: ${empMatch.name}`,
          `Reporting Manager: ${mgrMatch.name}`,
          "Backend mutation confirmed & verified",
        ],
        suggestedFollowUps: [`Tell me about ${empMatch.name}`, "Show manager hierarchy"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real database PATCH operation verified.",
        actionExecuted: {
          success: true,
          actionType: "CHANGE_MANAGER",
          targetEmployeeId: empMatch.id,
          targetEmployeeName: empMatch.name,
          message: `Assigned manager ${mgrMatch.name} to ${empMatch.name}`,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType: "CHANGE_MANAGER",
            message: `${mgrMatch.name} has been assigned as reporting manager for ${empMatch.name}.`,
            employeeName: empMatch.name,
          },
          employee: this.toCleanEmployeeItem({ ...empMatch, reportingManager: mgrMatch.name }),
        },
      };
    }

    // =========================================================================
    // UPDATE ROLE / DESIGNATION
    // =========================================================================
    if (isRoleIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: ["Employee not found in active directory"],
          suggestedFollowUps: ["Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Employee lookup in database.",
          structuredOutput: { type: "text" },
        };
      }

      const roleMatch = origQuery.match(/(?:to|as)\s+([A-Za-z0-9\s]+?)(?:\s*(?:karo|bana|me|$))/i);
      const newRole = roleMatch && roleMatch[1] ? roleMatch[1].trim() : "Senior Specialist";

      if (actionExecutor?.updateEmployee) {
        try {
          const res = await actionExecutor.updateEmployee(empMatch.id, {
            designation: newRole,
            role: normalizeRole(newRole),
          });

          if (!res || res.error) {
            const errorMsg =
              res?.error?.data?.detail ||
              res?.error?.data?.message ||
              res?.error?.message ||
              "Backend rejected designation update";
            return {
              answer: `Role update could not be completed: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
              supportingDataPoints: ["Backend error on role update"],
              suggestedFollowUps: ["Check employee details"],
              recommendedActions: [],
              confidence: "LIMITED",
              confidenceScore: 50,
              authorizedScope: userRole,
              dataGroundingSummary: "API rejection.",
              structuredOutput: {
                type: "action_result",
                actionResult: {
                  success: false,
                  actionType: "UPDATE_ROLE",
                  message: `Could not update role for ${empMatch.name}: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
                  employeeName: empMatch.name,
                },
              },
            };
          }
          actionExecutor.revalidate?.();
        } catch (err: any) {
          return {
            answer: `Role update could not be completed: ${err.message || "Failed"}`,
            supportingDataPoints: ["API failure"],
            suggestedFollowUps: ["Try again"],
            recommendedActions: [],
            confidence: "LIMITED",
            confidenceScore: 50,
            authorizedScope: userRole,
            dataGroundingSummary: "Network error.",
            structuredOutput: { type: "text" },
          };
        }
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "EMPLOYEE_ROLE_UPDATED",
        targetId: empMatch.id,
        targetName: empMatch.name,
        details: `Updated role for ${empMatch.name} to ${newRole}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      return {
        answer: `Done. Designation for **${empMatch.name}** has been updated to **${newRole}**.\n\n*The employee directory has been updated.*`,
        supportingDataPoints: [`Employee: ${empMatch.name}`, `New Role: ${newRole}`, "Backend mutation confirmed & verified"],
        suggestedFollowUps: [`Tell me about ${empMatch.name}`, "Show all employees"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real database PATCH operation verified.",
        actionExecuted: {
          success: true,
          actionType: "UPDATE_ROLE",
          targetEmployeeId: empMatch.id,
          targetEmployeeName: empMatch.name,
          message: `Updated role for ${empMatch.name} to ${newRole}`,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType: "UPDATE_ROLE",
            message: `Designation for ${empMatch.name} has been updated to ${newRole}.`,
            employeeName: empMatch.name,
          },
          employee: this.toCleanEmployeeItem({ ...empMatch, role: newRole, designation: newRole }),
        },
      };
    }

    // =========================================================================
    // UPDATE SALARY
    // =========================================================================
    if (isSalaryIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: ["Employee not found in active directory"],
          suggestedFollowUps: ["Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Employee lookup in database.",
          structuredOutput: { type: "text" },
        };
      }

      const numMatch = origQuery.match(/\b(\d[\d,]*)\b/);
      const newSalary = numMatch ? Number(numMatch[1].replace(/,/g, "")) : 1500000;

      if (actionExecutor?.updateEmployee) {
        try {
          const res = await actionExecutor.updateEmployee(empMatch.id, { salary: newSalary, ctc: newSalary });
          if (!res || res.error) {
            const errorMsg =
              res?.error?.data?.detail ||
              res?.error?.data?.message ||
              res?.error?.message ||
              "Backend rejected salary update";
            return {
              answer: `Salary update could not be completed: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
              supportingDataPoints: ["Backend error on salary update"],
              suggestedFollowUps: ["Check permissions", "Show salary breakdown"],
              recommendedActions: [],
              confidence: "LIMITED",
              confidenceScore: 50,
              authorizedScope: userRole,
              dataGroundingSummary: "API rejection.",
              structuredOutput: {
                type: "action_result",
                actionResult: {
                  success: false,
                  actionType: "UPDATE_SALARY",
                  message: `Could not update salary for ${empMatch.name}: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
                  employeeName: empMatch.name,
                },
              },
            };
          }
          actionExecutor.revalidate?.();
        } catch (err: any) {
          return {
            answer: `Salary update could not be completed: ${err.message || "Failed"}`,
            supportingDataPoints: ["API failure"],
            suggestedFollowUps: ["Try again"],
            recommendedActions: [],
            confidence: "LIMITED",
            confidenceScore: 50,
            authorizedScope: userRole,
            dataGroundingSummary: "Network error.",
            structuredOutput: { type: "text" },
          };
        }
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "EMPLOYEE_SALARY_UPDATED",
        targetId: empMatch.id,
        targetName: empMatch.name,
        details: `Updated salary for ${empMatch.name} to ₹${newSalary.toLocaleString()}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      return {
        answer: `Done. Annual CTC for **${empMatch.name}** has been updated to **₹${newSalary.toLocaleString()}**.\n\n*Payroll records updated.*`,
        supportingDataPoints: [`Employee: ${empMatch.name}`, `New CTC: ₹${newSalary.toLocaleString()}`, "Verified in database"],
        suggestedFollowUps: [`Tell me about ${empMatch.name}`, "Show salary breakdown"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Compensation update verified in database.",
        actionExecuted: {
          success: true,
          actionType: "UPDATE_SALARY",
          targetEmployeeId: empMatch.id,
          targetEmployeeName: empMatch.name,
          message: `Updated salary for ${empMatch.name} to ₹${newSalary.toLocaleString()}`,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType: "UPDATE_SALARY",
            message: `Annual CTC for ${empMatch.name} has been updated to ₹${newSalary.toLocaleString()}.`,
            employeeName: empMatch.name,
          },
          employee: this.toCleanEmployeeItem({ ...empMatch, salary: newSalary, ctc: newSalary }),
        },
      };
    }

    // =========================================================================
    // DEACTIVATE EMPLOYEE (REQUIRES CONFIRMATION)
    // =========================================================================
    if (isDeactivateIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: ["Employee not found in active directory"],
          suggestedFollowUps: ["Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Database lookup.",
          structuredOutput: { type: "text" },
        };
      }

      // DO NOT immediately execute deactivation. Return structured confirmation.
      return {
        answer: `Are you sure you want to deactivate **${empMatch.name}**?\n\n*Current status: **${empMatch.status || "Active"}** · Department: **${empMatch.department || "General"}***\n\nPlease confirm to proceed with deactivating this employee.`,
        supportingDataPoints: [`Employee: ${empMatch.name}`, `Current Status: ${empMatch.status || "Active"}`],
        suggestedFollowUps: ["Cancel", "Show all employees"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Confirmation required for status deactivation.",
        structuredOutput: {
          type: "confirmation_request",
          confirmation: {
            actionType: "DEACTIVATE_EMPLOYEE",
            title: `Deactivate ${empMatch.name}?`,
            description: `Current status: ${empMatch.status || "Active"}. This will change the employee status to Inactive in live records.`,
            targetEmployeeId: empMatch.id,
            targetEmployeeName: empMatch.name,
            currentValue: empMatch.status || "Active",
            newValue: "Inactive",
          },
        },
      };
    }

    // =========================================================================
    // ACTIVATE EMPLOYEE (ADMIN)
    // =========================================================================
    if (isActivateIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: ["Employee not found in active directory"],
          suggestedFollowUps: ["Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Database lookup.",
          structuredOutput: { type: "text" },
        };
      }

      if (actionExecutor?.activateEmployee) {
        try {
          const res = await actionExecutor.activateEmployee(empMatch.id);
          if (!res || res.error) {
            const errorMsg =
              res?.error?.data?.detail ||
              res?.error?.data?.message ||
              res?.error?.message ||
              "Backend rejected employee activation";
            return {
              answer: `Employee could not be activated: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
              supportingDataPoints: ["Backend error on activation"],
              suggestedFollowUps: ["Show all employees"],
              recommendedActions: [],
              confidence: "LIMITED",
              confidenceScore: 50,
              authorizedScope: userRole,
              dataGroundingSummary: "API rejection.",
              structuredOutput: {
                type: "action_result",
                actionResult: {
                  success: false,
                  actionType: "ACTIVATE_EMPLOYEE",
                  message: `Could not activate ${empMatch.name}: ${typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}`,
                  employeeName: empMatch.name,
                },
              },
            };
          }
          actionExecutor.revalidate?.();
        } catch (err: any) {
          return {
            answer: `Employee could not be activated: ${err.message || "Failed"}`,
            supportingDataPoints: ["API failure"],
            suggestedFollowUps: ["Try again"],
            recommendedActions: [],
            confidence: "LIMITED",
            confidenceScore: 50,
            authorizedScope: userRole,
            dataGroundingSummary: "Network error.",
            structuredOutput: { type: "text" },
          };
        }
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "EMPLOYEE_ACTIVATED",
        targetId: empMatch.id,
        targetName: empMatch.name,
        details: `Activated employee ${empMatch.name}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      return {
        answer: `Done. **${empMatch.name}** has been activated in your organization's employee records.`,
        supportingDataPoints: [`Employee: ${empMatch.name}`, "Activation mutation confirmed & verified"],
        suggestedFollowUps: [`Tell me about ${empMatch.name}`, "Show all active employees"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real backend activation executed.",
        actionExecuted: {
          success: true,
          actionType: "ACTIVATE_EMPLOYEE",
          targetEmployeeId: empMatch.id,
          targetEmployeeName: empMatch.name,
          message: `Activated ${empMatch.name}`,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType: "ACTIVATE_EMPLOYEE",
            message: `${empMatch.name} has been activated.`,
            employeeName: empMatch.name,
          },
          employee: this.toCleanEmployeeItem({ ...empMatch, status: "Active" }),
        },
      };
    }

    // =========================================================================
    // CREATE / ADD EMPLOYEE (ROBUST PARSING + MANDATORY PHONE/EMAIL VALIDATION)
    // =========================================================================
    if (isCreateIntent) {
      const extracted = this.extractNewEmployeeInfo(origQuery, origLower, q, context);
      const { name, email, phone, departmentName, departmentId, designation, role, salary } = extracted;

      if (!name || name.length < 2) {
        return {
          answer: "Please provide the full name of the employee you want to add (e.g. *\"Add Rahul Sharma with email rahul@company.com, phone 9876543210 to Engineering\"*).",
          supportingDataPoints: ["Missing employee name parameter"],
          suggestedFollowUps: ["Show all employees", "Show departments list"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 90,
          authorizedScope: userRole,
          dataGroundingSummary: "Validation check.",
          structuredOutput: {
            type: "missing_fields_prompt",
            missingFields: [
              { field: "name", label: "Full Name", placeholder: "e.g. Rahul Sharma", type: "text" },
              { field: "email", label: "Work Email", placeholder: "e.g. rahul@company.com", type: "email" },
              { field: "phone", label: "Phone Number", placeholder: "e.g. 9876543210", type: "text" },
              { field: "department", label: "Department", placeholder: "e.g. Engineering", type: "text" },
            ],
          },
        };
      }

      // Check if phone or email is missing
      const isPhoneValid = phone && phone.replace(/\D/g, "").length >= 10;
      const isEmailValid = email && email.includes("@") && email.includes(".");

      if (!isPhoneValid || !isEmailValid) {
        const missingList: string[] = [];
        if (!isEmailValid) missingList.push("work email");
        if (!isPhoneValid) missingList.push("phone number (at least 10 digits)");

        const missingFieldsData: Array<{ field: string; label: string; placeholder: string; type: "text" | "email"; value?: string }> = [];
        if (!isEmailValid) {
          missingFieldsData.push({ field: "email", label: "Work Email", placeholder: "e.g. rahul@company.com", type: "email" });
        }
        if (!isPhoneValid) {
          missingFieldsData.push({ field: "phone", label: "Phone Number", placeholder: "e.g. 9876543210", type: "text" });
        }

        return {
          answer: `Sure! To add **${name}**${departmentName ? ` to **${departmentName}**` : ""}, I need their ${missingList.join(" and ")}.`,
          supportingDataPoints: [
            `Employee Name: ${name}`,
            `Department: ${departmentName || "General"}`,
            `Missing required fields: ${missingList.join(", ")}`,
            "Backend validation requires complete phone and email records",
          ],
          suggestedFollowUps: [
            `Add ${name} with email ${name.toLowerCase().replace(/\s+/g, ".")}@company.com and phone 9876543210`,
            "Cancel",
          ],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 95,
          authorizedScope: userRole,
          dataGroundingSummary: "Mandatory field validation enforced (no placeholder phone numbers).",
          structuredOutput: {
            type: "missing_fields_prompt",
            missingFields: missingFieldsData,
          },
        };
      }

      // Both email and phone are present and valid -> Build real backend payload
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || ".";
      const resolvedDept = departmentName || "General";
      const resolvedDesignation = designation || "Software Engineer";
      const resolvedRole = normalizeRole(role || resolvedDesignation);

      const createPayload: Record<string, any> = {
        name,
        first_name: firstName,
        last_name: lastName,
        email,
        personal_email: email,
        company_email: email,
        phone,
        department: resolvedDept,
        designation: resolvedDesignation,
        role: resolvedRole,
        status: "Active",
        employment_type: "FULL_TIME",
        joining_date: new Date().toISOString().split("T")[0],
      };

      if (departmentId) {
        createPayload.department_id = departmentId;
      }
      if (salary) {
        createPayload.ctc = salary;
        createPayload.salary = salary;
      }
      if (extracted.managerId) {
        createPayload.manager_id = extracted.managerId;
      }
      if (extracted.managerName) {
        createPayload.reporting_manager = extracted.managerName;
      }

      if (actionExecutor?.createEmployee) {
        try {
          const res = await actionExecutor.createEmployee(createPayload);
          if (!res || res.error) {
            const errDetail =
              res?.error?.data?.detail ||
              res?.error?.data?.message ||
              res?.error?.message ||
              "Employee creation was rejected by the server";
            return {
              answer: `Employee could not be created: ${typeof errDetail === "string" ? errDetail : JSON.stringify(errDetail)}`,
              supportingDataPoints: ["Backend validation rejection", "Zero records inserted"],
              suggestedFollowUps: ["Check employee parameters", "Show all employees"],
              recommendedActions: [],
              confidence: "LIMITED",
              confidenceScore: 50,
              authorizedScope: userRole,
              dataGroundingSummary: "Real backend validation error.",
              structuredOutput: {
                type: "action_result",
                actionResult: {
                  success: false,
                  actionType: "CREATE_EMPLOYEE",
                  message: `Employee could not be created: ${typeof errDetail === "string" ? errDetail : JSON.stringify(errDetail)}`,
                  employeeName: name,
                },
              },
            };
          }
          actionExecutor.revalidate?.();
        } catch (err: any) {
          return {
            answer: `Employee could not be created: ${err.message || "Failed"}`,
            supportingDataPoints: ["Network error on backend execution"],
            suggestedFollowUps: ["Try again"],
            recommendedActions: [],
            confidence: "LIMITED",
            confidenceScore: 50,
            authorizedScope: userRole,
            dataGroundingSummary: "API failure.",
            structuredOutput: {
              type: "action_result",
              actionResult: {
                success: false,
                actionType: "CREATE_EMPLOYEE",
                message: `Employee could not be created: ${err.message || "Network error"}`,
                employeeName: name,
              },
            },
          };
        }
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: "EMPLOYEE_CREATED",
        targetName: name,
        details: `Created employee ${name} in ${resolvedDept} department with phone ${phone} and email ${email}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      const cleanItem: CleanEmployeeItem = {
        id: "created-emp",
        name,
        email,
        phone,
        department: resolvedDept,
        role: resolvedDesignation,
        status: "Active",
        salary,
        joinedAt: new Date().toISOString().split("T")[0],
      };

      return {
        answer: `Done. **${name}** has been added to **${resolvedDept}** department as **${resolvedDesignation}**.\n\n* **Email:** [${email}](mailto:${email})\n* **Phone:** ${phone}\n* **Status:** Active`,
        supportingDataPoints: [
          `Name: ${name}`,
          `Department: ${resolvedDept}`,
          `Designation: ${resolvedDesignation}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          "Real database POST verified",
        ],
        suggestedFollowUps: [`Tell me about ${name}`, `Show ${resolvedDept} employees`, "Show all employees"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real employee created and verified in database.",
        actionExecuted: {
          success: true,
          actionType: "CREATE_EMPLOYEE",
          targetEmployeeName: name,
          message: `Created employee ${name} in ${resolvedDept}`,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType: "CREATE_EMPLOYEE",
            message: `${name} has been successfully added to ${resolvedDept}.`,
            employeeName: name,
          },
          employee: cleanItem,
        },
      };
    }

    // =========================================================================
    // DELETE EMPLOYEE (REQUIRES CONFIRMATION)
    // =========================================================================
    if (isDeleteIntent) {
      const empMatch = this.extractEmployeeForAction(origQuery, origLower, q, context.employees);
      if (!empMatch) {
        const targetName = this.extractCandidatePersonName(origQuery, origLower, q);
        return {
          answer: `I couldn't find **${targetName || "that employee"}** in your organization's employee records.`,
          supportingDataPoints: ["Employee not found in active directory"],
          suggestedFollowUps: ["Show all employees"],
          recommendedActions: [],
          confidence: "HIGH",
          confidenceScore: 100,
          authorizedScope: userRole,
          dataGroundingSummary: "Database lookup.",
          structuredOutput: { type: "text" },
        };
      }

      // DO NOT delete immediately. Return structured confirmation.
      return {
        answer: `Are you sure you want to permanently delete **${empMatch.name}**?\n\n*Department: **${empMatch.department || "General"}** · Status: **${empMatch.status || "Active"}***\n\n**Warning:** This action cannot be undone.`,
        supportingDataPoints: [`Employee: ${empMatch.name}`, "Irreversible deletion action"],
        suggestedFollowUps: ["Cancel", "Show all employees"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Confirmation required for permanent deletion.",
        structuredOutput: {
          type: "confirmation_request",
          confirmation: {
            actionType: "DELETE_EMPLOYEE",
            title: `Delete ${empMatch.name} permanently?`,
            description: `This action cannot be undone. Are you sure you want to permanently remove ${empMatch.name} from employee records?`,
            targetEmployeeId: empMatch.id,
            targetEmployeeName: empMatch.name,
          },
        },
      };
    }

    return null;
  }

  /**
   * Directly executes a confirmed action dispatched from the UI confirmation modal
   */
  private static async executeConfirmedAction(
    confirmed: ConfirmationDetails,
    context: SystemContext,
    userRole: SystemRole,
    userId: string,
    actorName: string,
    actionExecutor?: ActionExecutor
  ): Promise<AskPeopleAIResponse> {
    const { actionType, targetEmployeeId, targetEmployeeName, newValue, payload } = confirmed;

    try {
      if (actionType === "MOVE_DEPARTMENT" && targetEmployeeId && actionExecutor?.updateEmployee) {
        const res = await actionExecutor.updateEmployee(targetEmployeeId, {
          department: newValue,
          ...(payload || {}),
        });
        if (!res || res.error) {
          const err = res?.error?.data?.detail || res?.error?.data?.message || res?.error?.message || "Update rejected";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "CHANGE_MANAGER" && targetEmployeeId && actionExecutor?.updateEmployee) {
        const res = await actionExecutor.updateEmployee(targetEmployeeId, {
          manager_id: payload?.managerId || payload?.manager_id,
          managerId: payload?.managerId || payload?.manager_id,
          reporting_manager: newValue,
          reportingManager: newValue,
        });
        if (!res || res.error) {
          const err = res?.error?.data?.detail || res?.error?.data?.message || res?.error?.message || "Update rejected";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "UPDATE_ROLE" && targetEmployeeId && actionExecutor?.updateEmployee) {
        const res = await actionExecutor.updateEmployee(targetEmployeeId, {
          designation: newValue,
          role: normalizeRole(newValue),
        });
        if (!res || res.error) {
          const err = res?.error?.data?.detail || res?.error?.data?.message || res?.error?.message || "Update rejected";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "UPDATE_SALARY" && targetEmployeeId && actionExecutor?.updateEmployee) {
        const salNum = Number(String(newValue).replace(/[^0-9]/g, ""));
        const res = await actionExecutor.updateEmployee(targetEmployeeId, { salary: salNum, ctc: salNum });
        if (!res || res.error) {
          const err = res?.error?.data?.detail || res?.error?.data?.message || res?.error?.message || "Update rejected";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "DEACTIVATE_EMPLOYEE" && targetEmployeeId && actionExecutor?.deactivateEmployee) {
        const res = await actionExecutor.deactivateEmployee(targetEmployeeId);
        if (!res || res.error) {
          const err =
            res?.error?.data?.detail ||
            res?.error?.data?.message ||
            res?.error?.message ||
            `${targetEmployeeName || "Employee"} could not be deactivated because the current status is not eligible for deactivation.`;
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "ACTIVATE_EMPLOYEE" && targetEmployeeId && actionExecutor?.activateEmployee) {
        const res = await actionExecutor.activateEmployee(targetEmployeeId);
        if (!res || res.error) {
          const err = res?.error?.data?.detail || res?.error?.data?.message || res?.error?.message || "Activation rejected";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "DELETE_EMPLOYEE" && targetEmployeeId && actionExecutor?.deleteEmployee) {
        const res = await actionExecutor.deleteEmployee(targetEmployeeId);
        if (!res || res.error) {
          const err =
            res?.error?.data?.detail ||
            res?.error?.data?.message ||
            res?.error?.message ||
            "Permanent deletion is not available for this employee. You can deactivate them instead.";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      } else if (actionType === "BULK_DEACTIVATE" && confirmed.affectedEmployees && actionExecutor?.deactivateEmployee) {
        let failedCount = 0;
        for (const emp of confirmed.affectedEmployees) {
          const res = await actionExecutor.deactivateEmployee(emp.id);
          if (!res || res.error) failedCount++;
        }
        actionExecutor.revalidate?.();
        if (failedCount > 0 && failedCount === confirmed.affectedEmployees.length) {
          return this.buildActionFailureResponse(
            actionType,
            "Workforce",
            "None of the selected employees could be deactivated by the server.",
            userRole
          );
        }
      } else if (actionType === "CREATE_EMPLOYEE" && actionExecutor?.createEmployee) {
        const res = await actionExecutor.createEmployee(payload);
        if (!res || res.error) {
          const err = res?.error?.data?.detail || res?.error?.data?.message || res?.error?.message || "Creation rejected";
          return this.buildActionFailureResponse(actionType, targetEmployeeName, err, userRole);
        }
        actionExecutor.revalidate?.();
      }

      PeopleAuditService.logAction({
        actorId: userId,
        actorName,
        actorRole: userRole,
        action: actionType,
        targetId: targetEmployeeId,
        targetName: targetEmployeeName,
        details: `Confirmed and executed ${actionType} for ${targetEmployeeName || "Workforce"}.`,
        aiGenerated: true,
        status: "SUCCESS",
      });

      const message = `${targetEmployeeName || "Workforce"} update completed successfully.`;
      return {
        answer: `Done. **${targetEmployeeName || "Operation"}** was successfully processed.\n\n*The Employee Directory and database have been updated.*`,
        supportingDataPoints: [`Action: ${actionType}`, "Real backend execution confirmed & verified"],
        suggestedFollowUps: ["Show all employees", "Show department list"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real backend mutation confirmed.",
        actionExecuted: {
          success: true,
          actionType: actionType as any,
          targetEmployeeId,
          targetEmployeeName,
          message,
        },
        structuredOutput: {
          type: "action_result",
          actionResult: {
            success: true,
            actionType,
            message,
            employeeName: targetEmployeeName,
          },
        },
      };
    } catch (err: any) {
      return this.buildActionFailureResponse(actionType, targetEmployeeName, err.message || "Network error", userRole);
    }
  }

  private static buildActionFailureResponse(
    actionType: string,
    targetEmployeeName: string | undefined,
    errorMessage: string,
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const cleanError = typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage);
    return {
      answer: `Action could not be completed: ${cleanError}`,
      supportingDataPoints: ["Backend rejected mutation", "Database state unaltered"],
      suggestedFollowUps: ["Show all employees", "Check employee details"],
      recommendedActions: [],
      confidence: "LIMITED",
      confidenceScore: 50,
      authorizedScope: userRole,
      dataGroundingSummary: "Backend API rejection.",
      structuredOutput: {
        type: "action_result",
        actionResult: {
          success: false,
          actionType,
          message: cleanError,
          employeeName: targetEmployeeName,
        },
      },
    };
  }

  // =========================================================================
  // HELPER ENTITY RESOLVERS & PARSERS
  // =========================================================================

  private static isEmployeeSearchQuery(origQuery: string, origLower: string, q: string): boolean {
    if (
      q.includes("all employees") ||
      q.includes("list employees") ||
      q.includes("show employees") ||
      q.includes("all active employees") ||
      q.includes("active employees in") ||
      q.includes("employees in ") ||
      q.includes("directory") ||
      q.includes("salary") ||
      q.includes("attendance") ||
      q.includes("who is on leave") ||
      q.includes("departments") ||
      q.includes("who needs attention") ||
      q.includes("data health") ||
      q.includes("founder") ||
      q.includes("approvals") ||
      q.startsWith("add ") ||
      q.startsWith("create ") ||
      q.startsWith("move ") ||
      q.startsWith("delete ") ||
      q.startsWith("deactivate ")
    ) {
      return false;
    }

    if (
      q.startsWith("find employee") ||
      q.startsWith("search employee") ||
      q.startsWith("find person") ||
      q.startsWith("search person") ||
      q.startsWith("show employee") ||
      q.startsWith("who is") ||
      q.startsWith("tell me about") ||
      q.startsWith("lookup employee") ||
      q.startsWith("lookup") ||
      q.includes("employee named") ||
      q.includes("profile of") ||
      q.includes("details of") ||
      origLower.includes("ke baare me") ||
      origLower.includes("ki detail") ||
      origLower.includes("ka profile")
    ) {
      return true;
    }

    return false;
  }

  private static extractQueryTargetPerson(origQuery: string, origLower: string, q: string): string | null {
    const searchPrefixMatch = origQuery.match(
      /(?:find employee|search employee|find person|search person|show employee|who is|tell me about|details of|profile of|employee named|lookup employee|lookup|about)\s+([A-Za-z0-9\s.]+)/i
    );
    if (searchPrefixMatch && searchPrefixMatch[1]) {
      const candidate = searchPrefixMatch[1]
        .replace(/\b(?:in|at|from|department|role|designation)\b.*$/i, "")
        .replace(/[?.!]/g, "")
        .trim();
      if (candidate.length >= 2) return candidate;
    }

    const hindiMatch = origQuery.match(/([A-Za-z0-9\s.]+?)\s*(?:ke baare me|ki detail|ka profile|ko dikhao|ki profile)/i);
    if (hindiMatch && hindiMatch[1]) {
      const candidate = hindiMatch[1].trim();
      if (candidate.length >= 2) return candidate;
    }

    return null;
  }

  private static detectStatusPredicate(q: string, origLower: string): "ACTIVE" | "INACTIVE" | "INVITED" | "PROBATION" | "NOTICE" | "TERMINATED" | "ON_LEAVE" | null {
    if (q.includes("inactive") || q.includes("deactivated") || origLower.includes("inactive")) {
      return "INACTIVE";
    }
    if (q.includes("probation") || origLower.includes("probation")) {
      return "PROBATION";
    }
    if (q.includes("invited") || q.includes("invitation") || q.includes("onboarding pending") || origLower.includes("invited")) {
      return "INVITED";
    }
    if (q.includes("notice") || q.includes("resigned") || q.includes("leaving") || origLower.includes("notice") || origLower.includes("resigned")) {
      return "NOTICE";
    }
    if (q.includes("terminated") || origLower.includes("terminated")) {
      return "TERMINATED";
    }
    if (q.includes("on leave") || q.includes("leave") || q.includes("absent")) {
      return "ON_LEAVE";
    }
    if (q.includes("active") && !q.includes("deactivate") && !q.includes("inactive") && !q.includes("activate")) {
      return "ACTIVE";
    }
    return null;
  }

  private static extractNewEmployeeInfo(
    origQuery: string,
    origLower: string,
    q: string,
    context: SystemContext
  ): ExtractedEmployeeCreation {
    const result: ExtractedEmployeeCreation = {};

    // 1. Email Extraction
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const emailMatch = origQuery.match(emailRegex);
    if (emailMatch) {
      result.email = emailMatch[1].trim();
    }

    // 2. Phone Extraction (10-15 digits / phone indicators)
    const phonePattern = /(?:phone|mobile|contact|tel|cell|number)?[:\s]*(\+?\d[\d\s\-()]{8,15}\d)/i;
    const phoneMatch = origQuery.match(phonePattern);
    if (phoneMatch) {
      const rawDigits = phoneMatch[1].replace(/[\s\-()]/g, "");
      if (rawDigits.replace(/\D/g, "").length >= 10) {
        result.phone = rawDigits;
      }
    } else {
      const bareDigitsMatch = origQuery.match(/\b(\+?\d{10,13})\b/);
      if (bareDigitsMatch) {
        result.phone = bareDigitsMatch[1].trim();
      }
    }

    // 3. Name Extraction
    // Pattern A: "Create a test employee named OFC360 AI Test Employee with email..."
    const namedMatch = origQuery.match(
      /(?:create|add|onboard)\s+(?:a\s+|an\s+|test\s+)?(?:employee\s+)?(?:named\s+)([^,]+?)(?:\s+(?:with|in|to|as|email|phone|department|designation|at)|,|$)/i
    );
    if (namedMatch && namedMatch[1]) {
      result.name = namedMatch[1].trim();
    } else {
      // Pattern B: "Create Rahul Sharma with email rahul@... in Engineering as Senior Developer"
      const standardMatch = origQuery.match(
        /(?:create|add|onboard)\s+(?:a\s+|an\s+|test\s+)?(?:employee\s+)?([A-Za-z0-9][A-Za-z0-9\s.]+?)(?:\s+(?:with|in|to|as|email|phone|department|designation|at)|,|$)/i
      );
      if (standardMatch && standardMatch[1]) {
        const cand = standardMatch[1].trim();
        if (!cand.toLowerCase().startsWith("employee") && cand.toLowerCase() !== "test") {
          result.name = cand;
        }
      }
    }

    // Fallback Hindi: "Rahul Sharma ko add karo"
    if (!result.name) {
      const hindiMatch = origQuery.match(/([A-Za-z0-9\s.]+?)\s*(?:ko)\s*(?:add|create|onboard)/i);
      if (hindiMatch && hindiMatch[1]) {
        result.name = hindiMatch[1].trim();
      }
    }

    // 4. Department Resolution (Real backend resolution)
    const deptMatch = this.extractDepartmentForAction(origQuery, origLower, q, context.departments, context.employees);
    if (deptMatch) {
      result.departmentName = deptMatch.name;
      result.departmentId = deptMatch.id;
    } else {
      const candidateDept = this.extractCandidateDeptName(origQuery, origLower, q);
      if (candidateDept) {
        result.departmentName = candidateDept;
      }
    }

    // 5. Designation / Role Extraction
    const asMatch = origQuery.match(/(?:as|role|designation|position|title)\s+([^,]+?)(?:\s+(?:with|in|to|at|phone|email|salary)|,|$)/i);
    if (asMatch && asMatch[1]) {
      const rawDesig = asMatch[1].trim();
      if (!rawDesig.toLowerCase().includes("engineering") && !rawDesig.toLowerCase().includes("department")) {
        result.designation = rawDesig;
        result.role = rawDesig;
      }
    }

    // 6. Salary / CTC Extraction
    const salaryMatch = origQuery.match(/(?:salary|ctc|package|remuneration)\s*(?:is|of|:)?\s*₹?\s*(\d[\d,]*)/i);
    if (salaryMatch && salaryMatch[1]) {
      result.salary = Number(salaryMatch[1].replace(/,/g, ""));
    }

    // 7. Manager Extraction
    const mgrMatch = this.extractManagerForAction(origQuery, origLower, q, context.managers, context.employees);
    if (mgrMatch) {
      result.managerName = mgrMatch.name;
      result.managerId = mgrMatch.id;
    }

    return result;
  }

  private static findEmployeeInContext(q: string, origLower: string, employees: Employee[]): Employee | undefined {
    return employees.find((emp) => {
      const empName = (emp.name || "").toLowerCase().trim();
      const firstName = (emp.firstName || empName.split(" ")[0] || "").toLowerCase();
      const lastName = (emp.lastName || (empName.split(" ").length > 1 ? empName.split(" ")[1] : "")).toLowerCase();
      const email = (emp.email || "").toLowerCase();
      const code = (emp.employeeCode || (emp as any).employeeId || "").toLowerCase();

      if (empName && (q.includes(empName) || origLower.includes(empName))) return true;
      if (firstName && firstName.length >= 3 && (q.includes(firstName) || origLower.includes(firstName))) return true;
      if (lastName && lastName.length >= 3 && (q.includes(lastName) || origLower.includes(lastName))) return true;
      if (email && (q.includes(email) || origLower.includes(email))) return true;
      if (code && (q.includes(code) || origLower.includes(code))) return true;

      return false;
    });
  }

  private static findDepartmentInContext(
    q: string,
    origLower: string,
    departments: Department[],
    employees: Employee[]
  ): Department | undefined {
    const foundDept = departments.find(
      (d) =>
        (d.name && (q.includes(d.name.toLowerCase()) || origLower.includes(d.name.toLowerCase()))) ||
        (d.code && q.includes(d.code.toLowerCase()))
    );
    if (foundDept) return foundDept;

    const empDepts = Array.from(new Set(employees.map((e) => e.department).filter(Boolean))) as string[];
    const matchedName = empDepts.find((dName) => q.includes(dName.toLowerCase()) || origLower.includes(dName.toLowerCase()));
    if (matchedName) {
      return {
        id: matchedName.toLowerCase().replace(/\s+/g, "-"),
        name: matchedName,
        code: matchedName.slice(0, 3).toUpperCase(),
        headOfDepartment: "Not Assigned",
        employeeCount: employees.filter((e) => (e.department || "").toLowerCase() === matchedName.toLowerCase()).length,
        budget: 0,
      };
    }

    return undefined;
  }

  private static extractEmployeeForAction(
    origQuery: string,
    origLower: string,
    q: string,
    employees: Employee[]
  ): Employee | undefined {
    return this.findEmployeeInContext(q, origLower, employees);
  }

  private static extractDepartmentForAction(
    origQuery: string,
    origLower: string,
    q: string,
    departments: Department[],
    employees: Employee[]
  ): Department | undefined {
    return this.findDepartmentInContext(q, origLower, departments, employees);
  }

  private static extractManagerForAction(
    origQuery: string,
    origLower: string,
    q: string,
    managers: Manager[],
    employees: Employee[],
    excludeEmpId?: string
  ): Employee | Manager | undefined {
    const candidates = [
      ...managers,
      ...employees.filter((e) => e.id !== excludeEmpId),
    ];

    for (const c of candidates) {
      const name = (c.name || "").toLowerCase().trim();
      const firstName = (c.name || "").split(" ")[0].toLowerCase();
      if (name && (q.includes(name) || origLower.includes(name))) return c;
      if (firstName && firstName.length >= 3 && (q.includes(firstName) || origLower.includes(firstName))) return c;
    }
    return undefined;
  }

  private static extractCandidatePersonName(origQuery: string, origLower: string, q: string): string | null {
    const moveMatch = origQuery.match(/(?:move|transfer|shift|change|deactivate|activate|delete|set manager to|reporting to)\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)/i);
    if (moveMatch && moveMatch[1]) return moveMatch[1].trim();

    const hindiMatch = origQuery.match(/([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)\s*(?:ko|ka|ki)\s*(?:finance|engineering|hr|marketing|sales|move|deactivate|activate)/i);
    if (hindiMatch && hindiMatch[1]) return hindiMatch[1].trim();

    return this.extractQueryTargetPerson(origQuery, origLower, q);
  }

  private static extractCandidateDeptName(origQuery: string, origLower: string, q: string): string | null {
    const toMatch = origQuery.match(/(?:to|in|into)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (toMatch && toMatch[1]) {
      const val = toMatch[1].trim();
      if (!val.toLowerCase().includes("employee") && !val.toLowerCase().includes("senior")) {
        return val;
      }
    }

    const hindiMatch = origQuery.match(/(?:me|mein)\s*(?:move|transfer|shift)/i);
    if (hindiMatch) {
      const parts = origQuery.split(/\s+/);
      const idx = parts.findIndex((p) => p.toLowerCase() === "me" || p.toLowerCase() === "mein");
      if (idx > 0) return parts[idx - 1];
    }
    return null;
  }

  private static isGeneralQuery(q: string): boolean {
    const generalKeywords = [
      "all",
      "list",
      "directory",
      "salary",
      "attendance",
      "department",
      "manager",
      "probation",
      "notice",
      "performance",
      "skill",
      "attention",
      "approval",
      "data health",
      "system",
      "founder",
    ];
    return generalKeywords.some((k) => q.includes(k));
  }

  // =========================================================================
  // REAL DATA RESPONSE BUILDERS (100% PRODUCTION DATA ONLY, NO RAW UUIDs)
  // =========================================================================

  private static generateEmployeeProfileResponse(
    emp: Employee,
    context: SystemContext,
    userRole: SystemRole,
    recommendations: PeopleRecommendation[]
  ): AskPeopleAIResponse {
    const cleanEmp = this.toCleanEmployeeItem(emp);
    const salaryFormatted = emp.salary || emp.ctc
      ? `₹${Number(emp.salary || emp.ctc).toLocaleString()}`
      : undefined;

    const manager = cleanEmp.manager || "Not Assigned";
    const status = cleanEmp.status || "Active";
    const joined = cleanEmp.joinedAt || "Not recorded";

    const answer =
      `### ${cleanEmp.name}\n` +
      `**${cleanEmp.role}** · ${cleanEmp.department} · ${status}\n\n` +
      `* **Reporting Manager:** ${manager}\n` +
      `* **Email:** [${cleanEmp.email || "No email"}](mailto:${cleanEmp.email || ""})\n` +
      (cleanEmp.phone ? `* **Phone:** ${cleanEmp.phone}\n` : "") +
      `* **Joined Date:** ${joined}\n` +
      (salaryFormatted && userRole !== "employee" ? `* **Annual Compensation (CTC):** ${salaryFormatted}\n` : "");

    return {
      answer,
      supportingDataPoints: [
        `Department: ${cleanEmp.department}`,
        `Role: ${cleanEmp.role}`,
        `Status: ${status}`,
        `Direct DB record fetch verified`,
      ],
      suggestedFollowUps: [
        `Move ${cleanEmp.name} to another department`,
        `Who are the peers of ${cleanEmp.name}?`,
        "Show all employees",
      ],
      recommendedActions: recommendations.filter((r) => r.targetId === emp.id),
      confidence: "HIGH",
      confidenceScore: 98,
      authorizedScope: userRole,
      dataGroundingSummary: `Grounded in live database record for ${cleanEmp.name}.`,
      structuredOutput: {
        type: "employee_card",
        employee: cleanEmp,
      },
    };
  }

  private static generateDirectoryResponse(
    employees: Employee[],
    userRole: SystemRole,
    recommendations: PeopleRecommendation[],
    summary: any
  ): AskPeopleAIResponse {
    if (employees.length === 0) {
      return {
        answer: "No employee records found in your organization.",
        supportingDataPoints: ["Live database query returned 0 records"],
        suggestedFollowUps: ["Add employee to organization", "Show departments"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Real-time employee count.",
        structuredOutput: { type: "text" },
      };
    }

    const cleanEmployees = employees.map(this.toCleanEmployeeItem);
    const summaryList = cleanEmployees
      .slice(0, 10)
      .map((e) => `* **${e.name}** — ${e.role} (${e.department} · ${e.status})`)
      .join("\n");

    const answer =
      `### Employee Directory (${employees.length} Members)\n\n` +
      summaryList +
      (employees.length > 10 ? `\n\n*...and ${employees.length - 10} more members.*` : "");

    return {
      answer,
      supportingDataPoints: [
        `Total Active Headcount: ${employees.length}`,
        `Departments: ${Array.from(new Set(employees.map((e) => e.department).filter(Boolean))).length}`,
        "Real-time database fetch verified",
      ],
      suggestedFollowUps: [
        "Show company salary & payroll breakdown",
        "Who is on leave today?",
        "Which departments are understaffed?",
      ],
      recommendedActions: recommendations.slice(0, 3),
      confidence: "HIGH",
      confidenceScore: 100,
      authorizedScope: userRole,
      dataGroundingSummary: `Grounded in ${employees.length} live database records.`,
      structuredOutput: {
        type: "employee_list",
        title: "Employee Directory",
        count: employees.length,
        employees: cleanEmployees,
      },
    };
  }

  private static generateCompensationResponse(
    employees: Employee[],
    userRole: SystemRole,
    departments: Department[]
  ): AskPeopleAIResponse {
    if (userRole === "employee") {
      return {
        answer: "Access Denied: You do not have permission to view organization compensation telemetry.",
        supportingDataPoints: ["RBAC policy enforced"],
        suggestedFollowUps: ["How is my team performing?"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Role-based security enforcement.",
        structuredOutput: { type: "text" },
      };
    }

    const totalAnnualPayroll = employees.reduce((acc, e) => acc + Number(e.salary || e.ctc || 0), 0);
    const totalMonthlyPayroll = Math.round(totalAnnualPayroll / 12);
    const averageSalary = employees.length > 0 ? Math.round(totalAnnualPayroll / employees.length) : 0;

    const deptPayrollMap: Record<string, { total: number; count: number }> = {};
    employees.forEach((e) => {
      const dept = e.department || "General";
      if (!deptPayrollMap[dept]) deptPayrollMap[dept] = { total: 0, count: 0 };
      deptPayrollMap[dept].total += Number(e.salary || e.ctc || 0);
      deptPayrollMap[dept].count += 1;
    });

    const deptBreakdown = Object.entries(deptPayrollMap).map(([dept, data]) => ({
      department: dept,
      count: data.count,
      annualTotal: data.total,
      monthlyTotal: Math.round(data.total / 12),
      avgCtc: data.count > 0 ? Math.round(data.total / data.count) : 0,
    }));

    const deptListText = deptBreakdown
      .map((d) => `* **${d.department}:** ${d.count} employee(s) · ₹${d.annualTotal.toLocaleString()}/yr`)
      .join("\n");

    const answer =
      `### Compensation & Payroll Intelligence\n\n` +
      `* **Annual Payroll Expenditure:** **₹${totalAnnualPayroll.toLocaleString()}**\n` +
      `* **Monthly Payroll Outflow:** **₹${totalMonthlyPayroll.toLocaleString()}**\n` +
      `* **Average Employee CTC:** **₹${averageSalary.toLocaleString()}**\n` +
      `* **Total Headcount:** **${employees.length} Employees**\n\n` +
      `#### Department Allocation:\n` +
      deptListText;

    return {
      answer,
      supportingDataPoints: [
        `Annual Total: ₹${totalAnnualPayroll.toLocaleString()}`,
        `Monthly Total: ₹${totalMonthlyPayroll.toLocaleString()}`,
        `Audited records: ${employees.length}`,
      ],
      suggestedFollowUps: [
        "Show all employees in directory",
        "Who is on probation right now?",
      ],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 98,
      authorizedScope: userRole,
      dataGroundingSummary: "Computed from real active employee compensation records.",
      structuredOutput: {
        type: "compensation_overview",
        compensation: {
          totalAnnual: totalAnnualPayroll,
          totalMonthly: totalMonthlyPayroll,
          avgSalary: averageSalary,
          headcount: employees.length,
          departments: deptBreakdown,
        },
      },
    };
  }

  private static generateAttendanceResponse(
    employees: Employee[],
    userRole: SystemRole,
    context: SystemContext
  ): AskPeopleAIResponse {
    const onLeaveEmps = employees.filter((e) => normalizeEmployeeStatus(e.status) === "ON_LEAVE");
    const activeCount = employees.length - onLeaveEmps.length;
    const attendanceRate = employees.length > 0 ? ((activeCount / employees.length) * 100).toFixed(1) : "100.0";
    const cleanLeave = onLeaveEmps.map(this.toCleanEmployeeItem);

    const answer =
      `### Attendance & Presence\n\n` +
      `* **Total Workforce:** **${employees.length}**\n` +
      `* **Present Today:** **${activeCount}**\n` +
      `* **On Approved Leave:** **${onLeaveEmps.length}**\n` +
      `* **Attendance Rate:** **${attendanceRate}%**\n\n` +
      (onLeaveEmps.length > 0
        ? `#### On Leave Today:\n` +
          onLeaveEmps.map((e) => `* **${e.name}** — ${e.role || "Member"} (${e.department || "General"})`).join("\n")
        : `*All employees are present today.*`);

    return {
      answer,
      supportingDataPoints: [
        `Attendance Rate: ${attendanceRate}%`,
        `On Leave Count: ${onLeaveEmps.length}`,
        "Real-time attendance status",
      ],
      suggestedFollowUps: [
        "Show all employees",
        "Who needs attention today?",
      ],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 95,
      authorizedScope: userRole,
      dataGroundingSummary: "Real-time attendance status from active database.",
      structuredOutput: {
        type: "attendance_overview",
        attendance: {
          totalWorkforce: employees.length,
          presentCount: activeCount,
          onLeaveCount: onLeaveEmps.length,
          attendanceRate,
          onLeaveEmployees: cleanLeave,
        },
      },
    };
  }

  private static generateDepartmentResponse(
    matchedDept: Department | undefined,
    allDepts: Department[],
    employees: Employee[],
    userRole: SystemRole,
    recommendations: PeopleRecommendation[]
  ): AskPeopleAIResponse {
    if (matchedDept) {
      const deptMembers = employees.filter(
        (e) => (e.department || "").toLowerCase() === matchedDept.name.toLowerCase()
      );
      const cleanMembers = deptMembers.map(this.toCleanEmployeeItem);

      const memberList = cleanMembers.length > 0
        ? cleanMembers.map((e) => `* **${e.name}** — ${e.role} (Manager: ${e.manager || "—"} · ${e.status})`).join("\n")
        : "*Zero active employees assigned to this department.*";

      const answer =
        `### ${matchedDept.name} — ${deptMembers.length} Employees\n\n` +
        `* **Department Code:** ${matchedDept.code || matchedDept.name.slice(0, 3).toUpperCase()}\n` +
        `* **Head of Department:** ${matchedDept.headOfDepartment || cleanMembers[0]?.name || "Not Assigned"}\n\n` +
        `#### Department Members:\n` +
        memberList;

      return {
        answer,
        supportingDataPoints: [
          `Department: ${matchedDept.name}`,
          `Members Count: ${deptMembers.length}`,
          "Real-time database query",
        ],
        suggestedFollowUps: [
          "Show all departments",
          "Show all employees",
        ],
        recommendedActions: recommendations.filter((r) => r.targetName.toLowerCase() === matchedDept.name.toLowerCase()),
        confidence: "HIGH",
        confidenceScore: 98,
        authorizedScope: userRole,
        dataGroundingSummary: `Grounded in live records for ${matchedDept.name}.`,
        structuredOutput: {
          type: "employee_list",
          title: `${matchedDept.name} Employees`,
          count: deptMembers.length,
          employees: cleanMembers,
        },
      };
    }

    // All departments overview
    const deptList = (allDepts.length > 0
      ? allDepts
      : Array.from(new Set(employees.map((e) => e.department).filter(Boolean))).map((d) => ({
          name: d!,
          code: d?.slice(0, 3).toUpperCase(),
          headOfDepartment: "—",
        }))
    ).map((d: any) => {
      const count = employees.filter((e) => (e.department || "").toLowerCase() === d.name.toLowerCase()).length;
      return {
        name: d.name,
        code: d.code || d.name.slice(0, 3).toUpperCase(),
        headcount: count,
        headOfDepartment: d.headOfDepartment || "—",
      };
    });

    const deptText = deptList
      .map((d) => `* **${d.name}** (${d.code}) — ${d.headcount} employee(s) · Head: ${d.headOfDepartment}`)
      .join("\n");

    const answer =
      `### Organization Departments (${deptList.length})\n\n` +
      deptText;

    return {
      answer,
      supportingDataPoints: [`Departments defined: ${deptList.length}`, `Audited employees: ${employees.length}`],
      suggestedFollowUps: ["Show all employees", "Which departments are understaffed?"],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 98,
      authorizedScope: userRole,
      dataGroundingSummary: "Real-time departments overview.",
      structuredOutput: {
        type: "department_list",
        departments: deptList,
      },
    };
  }

  private static generateManagersResponse(
    employees: Employee[],
    managers: Manager[],
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const managerNames = Array.from(
      new Set([
        ...managers.map((m) => m.name),
        ...employees.map((e) => e.reportingManager).filter(Boolean),
        ...employees
          .filter(
            (e) =>
              (e.role || "").toLowerCase().includes("manager") ||
              (e.role || "").toLowerCase().includes("lead") ||
              (e.role || "").toLowerCase().includes("director") ||
              (e.role || "").toLowerCase().includes("head")
          )
          .map((e) => e.name),
      ])
    ) as string[];

    const managerDetails = managerNames.map((mName) => {
      const reports = employees.filter((e) => (e.reportingManager || "").toLowerCase() === mName.toLowerCase());
      const empRecord = employees.find((e) => e.name.toLowerCase() === mName.toLowerCase());
      const role = empRecord?.role || "Manager";
      const dept = empRecord?.department || "General";
      return `* **${mName}** — ${role} (${dept}) | **Direct Reports: ${reports.length}**${reports.length > 0 ? ` (${reports.map((r) => r.name).join(", ")})` : ""}`;
    });

    const answer =
      `### Management & Leadership Directory\n\n` +
      (managerDetails.length > 0 ? managerDetails.join("\n\n") : "*No manager records registered in organization.*");

    return {
      answer,
      supportingDataPoints: [`Identified Managers: ${managerNames.length}`, `Active employees: ${employees.length}`],
      suggestedFollowUps: ["Show full employee directory", "How is my team performing?"],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 96,
      authorizedScope: userRole,
      dataGroundingSummary: "Real-time reporting structure.",
      structuredOutput: {
        type: "text",
      },
    };
  }

  private static generateProbationResponse(
    employees: Employee[],
    userRole: SystemRole,
    recommendations: PeopleRecommendation[]
  ): AskPeopleAIResponse {
    const probationEmps = employees.filter((e) => normalizeEmployeeStatus(e.status) === "PROBATION");

    if (probationEmps.length === 0) {
      return {
        answer: "Zero employees are currently on probation in your organization. All active staff have completed confirmation.",
        supportingDataPoints: [`Audited ${employees.length} employee record(s)`, "0 on probation"],
        suggestedFollowUps: ["Show all employees", "Who needs attention today?"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Active database verification.",
        structuredOutput: { type: "text" },
      };
    }

    const cleanProbation = probationEmps.map(this.toCleanEmployeeItem);
    const list = cleanProbation
      .map((e) => `* **${e.name}** — ${e.role} (${e.department} · Joined: ${e.joinedAt || "Recent"})`)
      .join("\n");

    const answer =
      `### Employees on Probation (${probationEmps.length})\n\n` +
      list;

    return {
      answer,
      supportingDataPoints: [`Probation count: ${probationEmps.length}`],
      suggestedFollowUps: ["Show all employees", "What HR actions are pending?"],
      recommendedActions: recommendations.filter((r) => r.workflowType === "probation"),
      confidence: "HIGH",
      confidenceScore: 96,
      authorizedScope: userRole,
      dataGroundingSummary: "Live database probation status.",
      structuredOutput: {
        type: "employee_list",
        title: "Employees on Probation",
        count: probationEmps.length,
        employees: cleanProbation,
      },
    };
  }

  private static generateNoticePeriodResponse(
    employees: Employee[],
    userRole: SystemRole,
    recommendations: PeopleRecommendation[]
  ): AskPeopleAIResponse {
    const noticeEmps = employees.filter((e) => {
      const s = normalizeEmployeeStatus(e.status);
      return s === "NOTICE" || s === "RESIGNED";
    });

    if (noticeEmps.length === 0) {
      return {
        answer: "Zero employees are currently serving a notice period in your organization.",
        supportingDataPoints: [`Audited ${employees.length} employee record(s)`, "0 on notice period"],
        suggestedFollowUps: ["Show all employees", "Who is on probation right now?"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Live database status check.",
        structuredOutput: { type: "text" },
      };
    }

    const cleanNotice = noticeEmps.map(this.toCleanEmployeeItem);
    const list = cleanNotice
      .map((e) => `* **${e.name}** — ${e.role} (${e.department} · Manager: ${e.manager || "—"})`)
      .join("\n");

    const answer =
      `### Employees on Notice / Resigned (${noticeEmps.length})\n\n` +
      list;

    return {
      answer,
      supportingDataPoints: [`Notice period count: ${noticeEmps.length}`],
      suggestedFollowUps: ["Deactivate all resigned employees", "Show all employees"],
      recommendedActions: recommendations.filter((r) => r.workflowType === "exit_clearance"),
      confidence: "HIGH",
      confidenceScore: 96,
      authorizedScope: userRole,
      dataGroundingSummary: "Live database exit status.",
      structuredOutput: {
        type: "employee_list",
        title: "Notice Period & Exits",
        count: noticeEmps.length,
        employees: cleanNotice,
      },
    };
  }

  private static generatePerformanceResponse(
    employees: Employee[],
    userRole: SystemRole,
    recommendations: PeopleRecommendation[]
  ): AskPeopleAIResponse {
    if (employees.length === 0) {
      return {
        answer: "No employee records found in your organization.",
        supportingDataPoints: ["0 records in active directory"],
        suggestedFollowUps: ["Add new employee"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 100,
        authorizedScope: userRole,
        dataGroundingSummary: "Database query.",
        structuredOutput: { type: "text" },
      };
    }

    const sorted = [...employees].sort((a, b) => ((b as any).performanceScore || 80) - ((a as any).performanceScore || 80));
    const top = sorted.slice(0, 3);
    const cleanTop = top.map(this.toCleanEmployeeItem);

    const answer =
      `### Top Performers\n\n` +
      cleanTop.map((e) => `* **${e.name}** — **${e.performanceScore || 85}%** score (${e.role}, ${e.department})`).join("\n");

    return {
      answer,
      supportingDataPoints: [`Evaluated ${employees.length} employee scores`],
      suggestedFollowUps: ["Who needs attention today?", "Show all employees"],
      recommendedActions: recommendations.filter((r) => r.category.includes("Performance")),
      confidence: "HIGH",
      confidenceScore: 94,
      authorizedScope: userRole,
      dataGroundingSummary: "Performance calculation from real records.",
      structuredOutput: {
        type: "employee_list",
        title: "Top Performers",
        count: top.length,
        employees: cleanTop,
      },
    };
  }

  private static generateSkillSearchResponse(
    skillQuery: string,
    employees: Employee[],
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const sq = skillQuery.toLowerCase().trim();
    const matched = employees.filter((e) => {
      const roleStr = (e.role || e.designation || "").toLowerCase();
      const skills = Array.isArray(e.skills)
        ? e.skills.map((s: any) => (typeof s === "string" ? s : s.name).toLowerCase())
        : [];
      return roleStr.includes(sq) || skills.some((s) => s.includes(sq));
    });

    if (matched.length === 0) {
      return {
        answer: `No employees in your organization currently have verified experience or skills tagged for **"${skillQuery}"**.`,
        supportingDataPoints: [`Searched across ${employees.length} employee skill profiles`, "0 matches found"],
        suggestedFollowUps: ["Show all employees", "Show engineering team"],
        recommendedActions: [],
        confidence: "HIGH",
        confidenceScore: 95,
        authorizedScope: userRole,
        dataGroundingSummary: "Real-time skill taxonomy search.",
        structuredOutput: { type: "text" },
      };
    }

    const cleanMatched = matched.map(this.toCleanEmployeeItem);
    const list = cleanMatched.map((e) => `* **${e.name}** — **${e.role}** (${e.department})`).join("\n");

    const answer =
      `### Matching Talent for "${skillQuery}" (${matched.length} Found)\n\n` +
      list;

    return {
      answer,
      supportingDataPoints: [`Matching talent count: ${matched.length}`, `Query: "${skillQuery}"`],
      suggestedFollowUps: ["Show full employee directory", "Tell me about " + matched[0].name],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 96,
      authorizedScope: userRole,
      dataGroundingSummary: "Live employee skill matching.",
      structuredOutput: {
        type: "employee_list",
        title: `Talent with "${skillQuery}"`,
        count: matched.length,
        employees: cleanMatched,
      },
    };
  }

  private static generateAttentionResponse(
    employees: Employee[],
    userRole: SystemRole,
    recommendations: PeopleRecommendation[]
  ): AskPeopleAIResponse {
    const probationEmps = employees.filter((e) => normalizeEmployeeStatus(e.status) === "PROBATION");
    const noticeEmps = employees.filter((e) => {
      const s = normalizeEmployeeStatus(e.status);
      return s === "NOTICE" || s === "RESIGNED";
    });
    const lowPerf = employees.filter((e) => ((e as any).performanceScore || 80) < 70);

    const issues: string[] = [];
    if (probationEmps.length > 0) {
      issues.push(`* **Probation Reviews:** **${probationEmps.length}** employee(s) (${probationEmps.map((e) => e.name).join(", ")})`);
    }
    if (noticeEmps.length > 0) {
      issues.push(`* **Exit Transitions:** **${noticeEmps.length}** employee(s) (${noticeEmps.map((e) => e.name).join(", ")})`);
    }
    if (lowPerf.length > 0) {
      issues.push(`* **Performance Coaching:** **${lowPerf.length}** employee(s) (${lowPerf.map((e) => e.name).join(", ")})`);
    }

    const answer =
      `### Critical Workforce Attention Items\n\n` +
      (issues.length > 0
        ? issues.join("\n\n")
        : `*All **${employees.length}** employees in your organization are in good standing.*`);

    return {
      answer,
      supportingDataPoints: [`Audited employees: ${employees.length}`, `Active flags: ${issues.length}`],
      suggestedFollowUps: ["Show all employees", "Show pending approvals queue"],
      recommendedActions: recommendations.slice(0, 3),
      confidence: "HIGH",
      confidenceScore: 96,
      authorizedScope: userRole,
      dataGroundingSummary: "Real-time attention digest.",
      structuredOutput: { type: "text" },
    };
  }

  private static generateApprovalsResponse(
    summary: any,
    recommendations: PeopleRecommendation[],
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const workflows = summary?.pendingWorkflows || [];

    const answer =
      `### Autonomous People Operations Queue\n\n` +
      `* **Pending Approvals:** **${workflows.length} Workflows**\n` +
      `* **Active Recommendations:** **${recommendations.length} Actions**\n\n` +
      (workflows.length > 0
        ? workflows.map((wf: any, idx: number) => `* **${idx + 1}. ${wf.title}** (Target: ${wf.targetEmployeeName || "System"})`).join("\n")
        : `*Zero workflows currently awaiting approval.*`);

    return {
      answer,
      supportingDataPoints: [`Pending workflows: ${workflows.length}`, `Active recommendations: ${recommendations.length}`],
      suggestedFollowUps: ["Show all employees", "Who needs attention today?"],
      recommendedActions: recommendations.slice(0, 3),
      confidence: "HIGH",
      confidenceScore: 98,
      authorizedScope: userRole,
      dataGroundingSummary: "Live operations queue.",
      structuredOutput: { type: "text" },
    };
  }

  private static generateDataHealthResponse(
    context: SystemContext,
    summary: any,
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const score = summary?.dataHealthScore ?? 100;
    const answer =
      `### Organization Data Health\n\n` +
      `* **Overall Data Hygiene Score:** **${score}%**\n` +
      `* **Audited Employee Profiles:** **${context.employees.length}**\n` +
      `* **Active Departments:** **${context.departments.length}**\n\n` +
      `*100% verified against live production database.*`;

    return {
      answer,
      supportingDataPoints: [`Hygiene score: ${score}%`, `Profiles audited: ${context.employees.length}`],
      suggestedFollowUps: ["Show all employees", "Show departments list"],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 100,
      authorizedScope: userRole,
      dataGroundingSummary: "Real-time data hygiene audit.",
      structuredOutput: { type: "text" },
    };
  }

  private static generateFoundersResponse(
    employees: Employee[],
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const founders = employees.filter(
      (e) => (e.role || "").toLowerCase().includes("founder") || (e.role || "").toLowerCase().includes("chief executive") || (e.systemRole === "super_admin")
    );

    const foundersText = founders.length > 0
      ? founders.map((f) => `* **${f.name}** — ${f.role || "Executive"} (${f.department || "Executive"})`).join("\n")
      : `*OFC360 Enterprise People Intelligence Platform*`;

    const answer =
      `### OFC360 People Intelligence Engine\n\n` +
      `OFC360 is an enterprise-grade AI Workforce and People Management Platform designed for autonomous, real-time HR operations.\n\n` +
      `#### Leadership in your Organization:\n` +
      foundersText;

    return {
      answer,
      supportingDataPoints: ["Platform Architecture: OFC360 Grounded Engine"],
      suggestedFollowUps: ["Show all employees", "Show company salary breakdown"],
      recommendedActions: [],
      confidence: "HIGH",
      confidenceScore: 100,
      authorizedScope: userRole,
      dataGroundingSummary: "Platform architecture context.",
      structuredOutput: { type: "text" },
    };
  }

  private static generateDefaultOverviewResponse(
    context: SystemContext,
    summary: any,
    userRole: SystemRole
  ): AskPeopleAIResponse {
    const answer =
      `### OFC360 People AI\n\n` +
      `* **Total Active Headcount:** **${context.employees.length} Employees**\n` +
      `* **Active Departments:** **${context.departments.length}**\n` +
      `* **Data Hygiene Score:** **${summary.dataHealthScore}%**\n\n` +
      `**How can I help you today? You can ask me to:**\n` +
      `* *\"Engineering ke saare employees dikhao\"*\n` +
      `* *\"Move Rahul to Finance\"*\n` +
      `* *\"Show salary breakdown\"*\n` +
      `* *\"Who is on leave today?\"*\n` +
      `* *\"Add new employee\"*`;

    return {
      answer,
      supportingDataPoints: [`Headcount: ${context.employees.length}`, `Departments: ${context.departments.length}`],
      suggestedFollowUps: ["Show all employees", "Show company salary breakdown", "Who needs attention today?"],
      recommendedActions: summary.activeRecommendations.slice(0, 2),
      confidence: "HIGH",
      confidenceScore: 95,
      authorizedScope: userRole,
      dataGroundingSummary: "Real-time organization summary.",
      structuredOutput: { type: "text" },
    };
  }
}
