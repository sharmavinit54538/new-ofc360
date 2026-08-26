import type {
  PeopleWorkflow,
  PeopleWorkflowType,
  PeopleWorkflowStep,
} from "./peopleAiTypes";
import type { Employee } from "@/types/hr";
import { PeopleAuditService } from "./peopleAuditService";

export class PeopleWorkflowEngine {
  private static workflows: Map<string, PeopleWorkflow> = new Map();

  /**
   * Initializes or triggers a Joiner (Onboarding) Workflow
   */
  static triggerJoinerWorkflow(employee: Employee, initiator = "HR Admin"): PeopleWorkflow {
    const workflowId = `wf-joiner-${employee.id}-${Date.now()}`;
    const steps: PeopleWorkflowStep[] = [
      {
        id: "step-1",
        name: "Profile & Identity Verification",
        description: "Validate employee contact info, KYC identity, and personal records.",
        assignedRole: "hr_admin",
        status: "completed",
        completedAt: new Date().toISOString(),
        completedBy: initiator,
      },
      {
        id: "step-2",
        name: "Department & Manager Assignment",
        description: `Assign to ${employee.department || "Designated Department"} with reporting hierarchy setup.`,
        assignedRole: "hr_admin",
        status: employee.department ? "completed" : "pending",
        completedAt: employee.department ? new Date().toISOString() : undefined,
      },
      {
        id: "step-3",
        name: "IT System Access & Role Provisioning",
        description: `Provision ${employee.systemRole || "employee"} account credentials and workspace access.`,
        assignedRole: "it_admin",
        status: "in_progress",
      },
      {
        id: "step-4",
        name: "Mandatory Compliance & Security Training",
        description: "Enroll in Enterprise Security, POSH, and Data Privacy modules.",
        assignedRole: "employee",
        status: "pending",
      },
      {
        id: "step-5",
        name: "Manager 30-Day Check-in Milestone",
        description: "Schedule initial performance and integration sync with reporting manager.",
        assignedRole: "manager",
        status: "pending",
      },
    ];

    const workflow: PeopleWorkflow = {
      id: workflowId,
      type: "onboarding",
      title: `Onboarding Lifecycle for ${employee.name}`,
      targetEmployeeId: employee.id,
      targetEmployeeName: employee.name,
      targetDepartment: employee.department,
      initiator,
      status: "in_progress",
      steps,
      currentStepIndex: 2,
      requiresConfirmation: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actor: initiator,
          action: "WORKFLOW_TRIGGERED_JOINER",
          details: `Initiated autonomous onboarding pipeline for ${employee.name}`,
        },
      ],
    };

    this.workflows.set(workflowId, workflow);
    PeopleAuditService.logAction({
      actorId: "hr_admin",
      actorName: initiator,
      actorRole: "hr_admin",
      action: "JOINER_WORKFLOW_INITIATED",
      targetId: employee.id,
      targetName: employee.name,
      details: `Autonomous onboarding workflow triggered for ${employee.name} (${employee.department || "General"}).`,
      aiGenerated: true,
      status: "SUCCESS",
    });

    return workflow;
  }

  /**
   * Initializes or triggers a Mover (Internal Mobility / Transfer) Workflow
   */
  static triggerMoverWorkflow(
    employee: Employee,
    changes: { newDepartment?: string; newRole?: string; newManager?: string },
    initiator = "HR Admin"
  ): PeopleWorkflow {
    const workflowId = `wf-mover-${employee.id}-${Date.now()}`;
    const steps: PeopleWorkflowStep[] = [
      {
        id: "step-1",
        name: "AI Transfer Impact Analysis",
        description: `Evaluate role shift from ${employee.role} (${employee.department}) to ${changes.newRole || employee.role} (${changes.newDepartment || employee.department}).`,
        assignedRole: "hr_admin",
        status: "completed",
        completedAt: new Date().toISOString(),
      },
      {
        id: "step-2",
        name: "Department Head / Manager Approval",
        description: "Obtain release sign-off from current manager and acceptance from receiving manager.",
        assignedRole: "manager",
        status: "pending",
      },
      {
        id: "step-3",
        name: "IT Permission & Access Scoping Adjustment",
        description: "Re-scope system permissions, group memberships, and software licenses.",
        assignedRole: "it_admin",
        status: "pending",
      },
      {
        id: "step-4",
        name: "New Role Competency & Training Plan",
        description: "Assign domain-specific training modules required for new designation.",
        assignedRole: "hr_admin",
        status: "pending",
      },
    ];

    const workflow: PeopleWorkflow = {
      id: workflowId,
      type: "internal_mobility",
      title: `Internal Mobility / Role Transfer for ${employee.name}`,
      targetEmployeeId: employee.id,
      targetEmployeeName: employee.name,
      targetDepartment: changes.newDepartment || employee.department,
      initiator,
      status: "pending_approval",
      steps,
      currentStepIndex: 1,
      requiresConfirmation: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actor: initiator,
          action: "WORKFLOW_TRIGGERED_MOVER",
          details: `Role change requested: ${employee.role} -> ${changes.newRole || employee.role}`,
        },
      ],
    };

    this.workflows.set(workflowId, workflow);
    PeopleAuditService.logAction({
      actorId: "hr_admin",
      actorName: initiator,
      actorRole: "hr_admin",
      action: "MOVER_WORKFLOW_INITIATED",
      targetId: employee.id,
      targetName: employee.name,
      details: `Internal mobility pipeline triggered for ${employee.name}. Target Department: ${changes.newDepartment || employee.department}.`,
      aiGenerated: true,
      status: "PENDING_APPROVAL",
    });

    return workflow;
  }

  /**
   * Initializes or triggers a Leaver (Exit Clearance) Workflow
   */
  static triggerLeaverWorkflow(
    employee: Employee,
    reason: string,
    initiator = "HR Admin"
  ): PeopleWorkflow {
    const workflowId = `wf-leaver-${employee.id}-${Date.now()}`;
    const steps: PeopleWorkflowStep[] = [
      {
        id: "step-1",
        name: "Resignation / Exit Notice Logging",
        description: `Formal exit documented. Reason: ${reason}.`,
        assignedRole: "hr_admin",
        status: "completed",
        completedAt: new Date().toISOString(),
        completedBy: initiator,
      },
      {
        id: "step-2",
        name: "Knowledge Transfer & Deliverable Handover",
        description: "Manager verifies all active project code, docs, and credentials handed over.",
        assignedRole: "manager",
        status: "in_progress",
      },
      {
        id: "step-3",
        name: "IT Hardware Recovery & Access Revocation",
        description: "Schedule system account deactivation and hardware asset return.",
        assignedRole: "it_admin",
        status: "pending",
      },
      {
        id: "step-4",
        name: "Final Payroll & Settlement Clearance",
        description: "Calculate pending leave encashment, gratuity, and final full & final (F&F) slip.",
        assignedRole: "hr_admin",
        status: "pending",
      },
    ];

    const workflow: PeopleWorkflow = {
      id: workflowId,
      type: "exit_clearance",
      title: `Exit Clearance & Offboarding for ${employee.name}`,
      targetEmployeeId: employee.id,
      targetEmployeeName: employee.name,
      targetDepartment: employee.department,
      initiator,
      status: "in_progress",
      steps,
      currentStepIndex: 1,
      requiresConfirmation: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actor: initiator,
          action: "WORKFLOW_TRIGGERED_LEAVER",
          details: `Exit clearance initiated. Reason: ${reason}`,
        },
      ],
    };

    this.workflows.set(workflowId, workflow);
    PeopleAuditService.logAction({
      actorId: "hr_admin",
      actorName: initiator,
      actorRole: "hr_admin",
      action: "LEAVER_WORKFLOW_INITIATED",
      targetId: employee.id,
      targetName: employee.name,
      details: `Exit management workflow created for ${employee.name}. Reason: ${reason}.`,
      aiGenerated: true,
      status: "IN_PROGRESS",
    });

    return workflow;
  }

  /**
   * Approves a workflow step
   */
  static approveWorkflow(workflowId: string, actor = "HR Manager"): PeopleWorkflow | null {
    const wf = this.workflows.get(workflowId);
    if (!wf) return null;

    wf.status = "in_progress";
    if (wf.steps[wf.currentStepIndex]) {
      wf.steps[wf.currentStepIndex].status = "completed";
      wf.steps[wf.currentStepIndex].completedAt = new Date().toISOString();
      wf.steps[wf.currentStepIndex].completedBy = actor;
    }

    // Advance step
    if (wf.currentStepIndex < wf.steps.length - 1) {
      wf.currentStepIndex += 1;
      wf.steps[wf.currentStepIndex].status = "in_progress";
    } else {
      wf.status = "completed";
    }

    wf.updatedAt = new Date().toISOString();
    wf.auditTrail.push({
      timestamp: new Date().toISOString(),
      actor,
      action: "WORKFLOW_APPROVED",
      details: `Step approved. Current status: ${wf.status}`,
    });

    PeopleAuditService.logAction({
      actorId: actor.toLowerCase().replace(/\s+/g, "_"),
      actorName: actor,
      actorRole: "hr_admin",
      action: "WORKFLOW_STEP_APPROVED",
      targetId: wf.targetEmployeeId,
      targetName: wf.targetEmployeeName,
      details: `Approved step in workflow "${wf.title}". Status is now ${wf.status}.`,
      aiGenerated: false,
      status: "SUCCESS",
    });

    return wf;
  }

  /**
   * Rejects / cancels a workflow
   */
  static rejectWorkflow(workflowId: string, reason: string, actor = "HR Manager"): PeopleWorkflow | null {
    const wf = this.workflows.get(workflowId);
    if (!wf) return null;

    wf.status = "cancelled";
    wf.updatedAt = new Date().toISOString();
    wf.auditTrail.push({
      timestamp: new Date().toISOString(),
      actor,
      action: "WORKFLOW_REJECTED",
      details: `Workflow rejected. Reason: ${reason}`,
    });

    PeopleAuditService.logAction({
      actorId: actor.toLowerCase().replace(/\s+/g, "_"),
      actorName: actor,
      actorRole: "hr_admin",
      action: "WORKFLOW_REJECTED",
      targetId: wf.targetEmployeeId,
      targetName: wf.targetEmployeeName,
      details: `Workflow "${wf.title}" was rejected by ${actor}. Reason: ${reason}`,
      aiGenerated: false,
      status: "OVERRIDDEN",
    });

    return wf;
  }

  /**
   * Returns all active workflows
   */
  static getAllWorkflows(): PeopleWorkflow[] {
    return Array.from(this.workflows.values());
  }
}
