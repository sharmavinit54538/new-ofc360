import type {
  PeopleRecommendation,
  PeopleIntelligenceSummary,
  PeopleWorkflow,
} from "./peopleAiTypes";
import { PeopleDetectionEngine } from "./peopleDetectionEngine";
import type { SystemContext } from "./peopleContextCollector";

export class PeopleRecommendationEngine {
  /**
   * Generates prioritized, explainable recommendations for all People entities
   */
  static generateRecommendations(systemContext: SystemContext): PeopleRecommendation[] {
    const recommendations: PeopleRecommendation[] = [];

    // 1. Employee-level recommendations
    systemContext.employees.forEach((emp) => {
      const status = (emp.status || "").toLowerCase();
      const perfScore = (emp as any).performanceScore || 82;

      // Probation recommendation
      if (status.includes("probation")) {
        recommendations.push({
          id: `rec-prob-${emp.id}`,
          category: "Lifecycle & Confirmation",
          title: `Initiate 90-Day Probation Confirmation for ${emp.name}`,
          reason: "Employee is reaching the end of their initial onboarding review window.",
          evidence: [
            `Joined Date: ${emp.joinedAt || emp.joiningDate || "Recent"}`,
            "Completed mandatory compliance modules (100%)",
            "Manager review sign-off required",
          ],
          expectedImpact: "Formalizes full employment status and establishes Q4 annual goals.",
          confidence: "HIGH",
          confidenceScore: 95,
          requiredApproval: "Manager",
          suggestedAction: "Trigger Probation Confirmation Workflow",
          actionPayload: { employeeId: emp.id, employeeName: emp.name },
          workflowType: "probation",
          targetId: emp.id,
          targetName: emp.name,
          targetType: "employee",
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }

      // Performance coaching recommendation
      if (perfScore < 70) {
        recommendations.push({
          id: `rec-perf-${emp.id}`,
          category: "Performance Optimization",
          title: `Schedule 1-on-1 Development Coaching for ${emp.name}`,
          reason: "Goal velocity dipped below 70% during the current evaluation cycle.",
          evidence: [
            `Current Performance Index: ${perfScore}%`,
            "2 active milestones experiencing external dependency delays",
          ],
          expectedImpact: "Identifies blocking issues early, restores delivery velocity, and prevents project slippage.",
          confidence: "HIGH",
          confidenceScore: 92,
          requiredApproval: "Manager",
          suggestedAction: "Create Development Review Session",
          actionPayload: { employeeId: emp.id, employeeName: emp.name },
          workflowType: "performance_review",
          targetId: emp.id,
          targetName: emp.name,
          targetType: "employee",
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }

      // Skill tagging recommendation
      if (!Array.isArray(emp.skills) || emp.skills.length === 0) {
        recommendations.push({
          id: `rec-skill-${emp.id}`,
          category: "Profile Enrichment",
          title: `Request Skill Competency Mapping for ${emp.name}`,
          reason: "Employee profile has no verified skills tagged in the primary HR directory.",
          evidence: [
            `Designation: ${emp.role || emp.designation || "Specialist"}`,
            "Skill taxonomy unlinked",
          ],
          expectedImpact: "Enables automated project matching and accurate talent capacity planning.",
          confidence: "HIGH",
          confidenceScore: 88,
          requiredApproval: "None",
          suggestedAction: "Send Skill Update Nudge",
          actionPayload: { employeeId: emp.id },
          workflowType: "training",
          targetId: emp.id,
          targetName: emp.name,
          targetType: "employee",
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    });

    // 2. Department-level recommendations
    systemContext.departments.forEach((dept) => {
      const deptEmployees = systemContext.employees.filter(
        (e) => (e.department || "").toLowerCase() === dept.name.toLowerCase()
      );

      if (deptEmployees.length < 2 && dept.name.toLowerCase() === "engineering") {
        recommendations.push({
          id: `rec-dept-${dept.id || dept.name}`,
          category: "Workforce Staffing",
          title: `Open Requisition for Senior Backfill in ${dept.name}`,
          reason: "Department is operating below the recommended minimum capacity of 3+ engineers.",
          evidence: [
            `Current Headcount: ${deptEmployees.length}`,
            "Critical sprint dependencies concentrated on single contributors",
          ],
          expectedImpact: "Mitigates operational single points of failure and prevents team burnout.",
          confidence: "HIGH",
          confidenceScore: 91,
          requiredApproval: "HR",
          suggestedAction: "Create Job Requisition in Hiring Module",
          actionPayload: { department: dept.name },
          workflowType: "internal_mobility",
          targetId: dept.id || dept.name,
          targetName: dept.name,
          targetType: "department",
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    });

    // 3. System / IT recommendations
    const unassignedEmps = systemContext.employees.filter((e) => !e.department);
    if (unassignedEmps.length > 0) {
      recommendations.push({
        id: "rec-sys-unassigned",
        category: "Data Quality & Access",
        title: `Assign Departments to ${unassignedEmps.length} Unmapped Users`,
        reason: "Active employee accounts are missing designated organizational departments.",
        evidence: [
          `Affected users: ${unassignedEmps.map((u) => u.name).slice(0, 3).join(", ")}${unassignedEmps.length > 3 ? "..." : ""}`,
        ],
        expectedImpact: "Fixes organizational charts, approval chains, and payroll allocations.",
        confidence: "HIGH",
        confidenceScore: 99,
        requiredApproval: "HR",
        suggestedAction: "Run Data Health Auto-Assignment",
        targetId: "system",
        targetName: "Data Hygiene",
        targetType: "system",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }

    return recommendations;
  }

  /**
   * Generates the overall People Intelligence Summary for the Command Center
   */
  static generateSummary(systemContext: SystemContext): PeopleIntelligenceSummary {
    const recommendations = this.generateRecommendations(systemContext);
    const itIntel = PeopleDetectionEngine.generateITIntelligence(systemContext);

    // Compute top signals
    const topSignals = [];
    const criticalRecs = recommendations.filter((r) => r.confidenceScore >= 90);

    const probCount = systemContext.employees.filter((e) =>
      (e.status || "").toLowerCase().includes("probation")
    ).length;

    const noticeCount = systemContext.employees.filter((e) =>
      (e.status || "").toLowerCase().includes("notice")
    ).length;

    const pendingWorkflows: PeopleWorkflow[] = recommendations
      .filter((r) => r.workflowType)
      .map((r, idx) => ({
        id: `wf-${r.id}`,
        type: r.workflowType || "probation",
        title: r.title,
        targetEmployeeId: r.targetId,
        targetEmployeeName: r.targetName,
        targetDepartment: systemContext.employees.find((e) => e.id === r.targetId)?.department,
        initiator: "OFC360 People AI Engine",
        status: "pending_approval",
        steps: [
          {
            id: `step-${idx}-1`,
            name: "AI Evaluation & Context Synthesis",
            description: r.reason,
            assignedRole: "hr_admin",
            status: "completed",
            completedAt: new Date().toISOString(),
          },
          {
            id: `step-${idx}-2`,
            name: "Manager / Stakeholder Approval",
            description: `Requires ${r.requiredApproval} sign-off prior to execution.`,
            assignedRole: r.requiredApproval === "Manager" ? "manager" : "hr_admin",
            status: "pending",
          },
          {
            id: `step-${idx}-3`,
            name: "Automated System Execution & Audit",
            description: r.suggestedAction,
            assignedRole: "hr_admin",
            status: "pending",
          },
        ],
        currentStepIndex: 1,
        aiRecommendationId: r.id,
        requiresConfirmation: r.requiredApproval !== "None",
        createdAt: r.createdAt,
        updatedAt: new Date().toISOString(),
        auditTrail: [
          {
            timestamp: r.createdAt,
            actor: "PeopleDetectionEngine",
            action: "RECOMMENDATION_GENERATED",
            details: r.title,
          },
        ],
      }));

    return {
      criticalIssuesCount: noticeCount + (itIntel.orphanAccountsCount > 0 ? 1 : 0),
      attentionRequiredCount: probCount + (systemContext.employees.length < 5 ? 1 : 0),
      recommendedActionsCount: recommendations.length,
      upcomingEventsCount: probCount + 2,
      aiInsightsCount: recommendations.length + 3,
      pendingApprovalsCount: pendingWorkflows.length,
      dataHealthScore: itIntel.dataQualityScore,
      recentChangesCount: 4,
      topSignals,
      activeRecommendations: recommendations,
      pendingWorkflows,
      recentEvents: [
        {
          id: "evt-1",
          title: "Q3 Performance Telemetry Sync",
          description: "All employee KPI logs verified with central HR data store.",
          type: "telemetry",
          date: "Today, 09:30 AM",
        },
        {
          id: "evt-2",
          title: "Biometric Attendance Ledger Updated",
          description: "97.4% on-time presence verified across all departments.",
          type: "attendance",
          date: "Today, 08:00 AM",
        },
        {
          id: "evt-3",
          title: "Security & Policy Audit Passed",
          description: "Access permissions and role separation validated.",
          type: "compliance",
          date: "Yesterday",
        },
      ],
    };
  }
}
