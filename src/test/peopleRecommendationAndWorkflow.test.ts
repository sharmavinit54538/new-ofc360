import { describe, it, expect } from "vitest";
import { PeopleRecommendationEngine } from "@/services/people-ai/peopleRecommendationEngine";
import { PeopleWorkflowEngine } from "@/services/people-ai/peopleWorkflowEngine";
import { PeopleAuditService } from "@/services/people-ai/peopleAuditService";
import type { SystemContext } from "@/services/people-ai/peopleContextCollector";
import type { Employee, Department, Manager } from "@/types/hr";

describe("OFC360 People AI — Recommendation & Autonomous Workflow Engine", () => {
  const mockEmployees: Employee[] = [
    {
      id: "emp-101",
      name: "Sneha Reddy",
      email: "sneha.reddy@ofc360.com",
      department: "Engineering",
      role: "Software Engineer",
      systemRole: "employee",
      status: "Probation",
      salary: 1300000,
      joinedAt: "2026-06-15",
      skills: ["Java", "Spring Boot"],
      performanceScore: 88,
    },
    {
      id: "emp-102",
      name: "Vikram Malhotra",
      email: "vikram.m@ofc360.com",
      department: "Finance",
      role: "Financial Analyst",
      systemRole: "employee",
      status: "Active",
      salary: 1400000,
      joinedAt: "2024-05-10",
      skills: [], // Missing skills
      performanceScore: 65, // Performance dip
    },
  ];

  const systemContext: SystemContext = {
    employees: mockEmployees,
    departments: [
      { id: "d1", name: "Engineering", code: "ENG", headOfDepartment: "Lead", employeeCount: 1, budget: 100 },
      { id: "d2", name: "Finance", code: "FIN", headOfDepartment: "Lead", employeeCount: 1, budget: 100 },
    ],
    managers: [],
    attendanceRecords: [],
  };

  it("1. Generates structured, explainable recommendations with approval requirements", () => {
    const recs = PeopleRecommendationEngine.generateRecommendations(systemContext);
    expect(recs.length).toBeGreaterThan(0);

    const probRec = recs.find((r) => r.workflowType === "probation");
    expect(probRec).toBeDefined();
    expect(probRec?.title).toContain("Sneha Reddy");
    expect(probRec?.requiredApproval).toBe("Manager");
    expect(probRec?.confidence).toBe("HIGH");
    expect(probRec?.evidence.length).toBeGreaterThan(0);

    const perfRec = recs.find((r) => r.workflowType === "performance_review");
    expect(perfRec).toBeDefined();
    expect(perfRec?.title).toContain("Vikram Malhotra");
    expect(perfRec?.reason).toContain("dipped below 70%");
  });

  it("2. Triggers and tracks Joiner (Onboarding) workflow lifecycle", () => {
    const wf = PeopleWorkflowEngine.triggerJoinerWorkflow(mockEmployees[0], "HR System");
    expect(wf).toBeDefined();
    expect(wf.type).toBe("onboarding");
    expect(wf.targetEmployeeId).toBe("emp-101");
    expect(wf.steps.length).toBe(5);
    expect(wf.steps[0].status).toBe("completed");
    expect(wf.auditTrail.length).toBeGreaterThan(0);
  });

  it("3. Triggers and enforces approval gates on Mover workflow", () => {
    const wf = PeopleWorkflowEngine.triggerMoverWorkflow(
      mockEmployees[0],
      { newRole: "Senior Software Engineer", newDepartment: "Engineering" },
      "HR Manager"
    );
    expect(wf).toBeDefined();
    expect(wf.type).toBe("internal_mobility");
    expect(wf.status).toBe("pending_approval");
    expect(wf.requiresConfirmation).toBe(true);

    // Approve step
    const approved = PeopleWorkflowEngine.approveWorkflow(wf.id, "Engineering Director");
    expect(approved).toBeDefined();
    expect(approved?.status).toBe("in_progress");
  });

  it("4. Triggers Leaver (Exit Clearance) workflow with immutable audit log", () => {
    const wf = PeopleWorkflowEngine.triggerLeaverWorkflow(
      mockEmployees[1],
      "Career Opportunity",
      "HR Operations"
    );
    expect(wf).toBeDefined();
    expect(wf.type).toBe("exit_clearance");
    expect(wf.steps.length).toBe(4);

    const logs = PeopleAuditService.getAuditLogs({ targetId: "emp-102" });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some((l) => l.action.includes("LEAVER"))).toBe(true);
  });
});
