import { describe, it, expect } from "vitest";
import { PeopleDetectionEngine } from "@/services/people-ai/peopleDetectionEngine";
import type { SystemContext } from "@/services/people-ai/peopleContextCollector";
import type { Employee, Department, Manager } from "@/types/hr";

describe("OFC360 People AI — Detection Engine & Signal Diagnostics", () => {
  const mockEmployees: Employee[] = [
    {
      id: "emp-1",
      name: "Aarav Sharma",
      email: "aarav.sharma@ofc360.com",
      department: "Engineering",
      role: "Senior Full Stack Engineer",
      systemRole: "employee",
      status: "Active",
      salary: 1800000,
      joinedAt: "2024-03-15",
      skills: ["React", "TypeScript", "Node.js", "Python"],
      performanceScore: 92,
    },
    {
      id: "emp-2",
      name: "Priya Patel",
      email: "priya.patel@ofc360.com",
      department: "Engineering",
      role: "Frontend Engineer",
      systemRole: "employee",
      status: "Probation",
      salary: 1200000,
      joinedAt: "2026-06-01",
      skills: ["React", "TailwindCSS"],
      performanceScore: 84,
    },
    {
      id: "emp-3",
      name: "Rohan Verma",
      email: "rohan.verma@ofc360.com",
      department: "Marketing",
      role: "Growth Specialist",
      systemRole: "employee",
      status: "Active",
      salary: 1100000,
      joinedAt: "2025-01-10",
      skills: ["SEO", "Content Strategy"],
      performanceScore: 62, // Low performance dip
    },
  ];

  const mockDepartments: Department[] = [
    {
      id: "dept-1",
      name: "Engineering",
      code: "ENG",
      headOfDepartment: "Aarav Sharma",
      employeeCount: 2,
      budget: 3600000,
    },
    {
      id: "dept-2",
      name: "Marketing",
      code: "MKT",
      headOfDepartment: "Rohan Verma",
      employeeCount: 1,
      budget: 1500000,
    },
  ];

  const mockManagers: Manager[] = [
    {
      id: "mgr-1",
      employeeId: "emp-1",
      name: "Aarav Sharma",
      email: "aarav.sharma@ofc360.com",
      department: "Engineering",
      role: "Engineering Manager",
      teamSize: 1,
      directReportIds: ["emp-2"],
      permissions: {
        canApproveLeave: true,
        canApproveAttendance: true,
        canApprovePayroll: false,
        canConductAppraisals: true,
        canInitiateRequisitions: true,
      },
    },
  ];

  const systemContext: SystemContext = {
    employees: mockEmployees,
    departments: mockDepartments,
    managers: mockManagers,
    attendanceRecords: [],
  };

  it("1. Generates 7-dimensional AI signals for an employee with high confidence", () => {
    const intel = PeopleDetectionEngine.analyzeEmployee("emp-1", systemContext);
    expect(intel).toBeDefined();
    expect(intel?.employeeId).toBe("emp-1");
    expect(intel?.signals.performance.status).toBe("positive");
    expect(intel?.signals.performance.confidence).toBe("HIGH");
    expect(intel?.signals.workload).toBeDefined();
    expect(intel?.signals.attendance).toBeDefined();
    expect(intel?.signals.skill.status).toBe("positive");
    expect(intel?.signals.growth).toBeDefined();
    expect(intel?.signals.development).toBeDefined();
  });

  it("2. Accurately detects probation milestone for employee on probation", () => {
    const intel = PeopleDetectionEngine.analyzeEmployee("emp-2", systemContext);
    expect(intel).toBeDefined();
    expect(intel?.signals.growth.status).toBe("attention_required");
    expect(intel?.insights.some((i) => i.category === "Probation Milestone")).toBe(true);

    const probInsight = intel?.insights.find((i) => i.category === "Probation Milestone");
    expect(probInsight?.whatHappened).toContain("probation");
    expect(probInsight?.recommendedAction).toContain("Probation Confirmation");
    expect(probInsight?.confidence).toBe("HIGH");
  });

  it("3. Accurately detects performance deceleration when score drops below 75%", () => {
    const intel = PeopleDetectionEngine.analyzeEmployee("emp-3", systemContext);
    expect(intel).toBeDefined();
    expect(intel?.signals.performance.status).toBe("attention_required");
    expect(intel?.signals.performance.trend).toBe("down");
    expect(intel?.insights.some((i) => i.category === "Performance Signal")).toBe(true);

    const perfInsight = intel?.insights.find((i) => i.category === "Performance Signal");
    expect(perfInsight?.whyItMatters).toBeDefined();
    expect(perfInsight?.supportingData.length).toBeGreaterThan(0);
    expect(perfInsight?.recommendedAction).toContain("coaching");
  });

  it("4. Evaluates department health and detects understaffing risks", () => {
    const deptIntel = PeopleDetectionEngine.analyzeDepartment("Engineering", systemContext);
    expect(deptIntel).toBeDefined();
    expect(deptIntel.departmentName).toBe("Engineering");
    expect(deptIntel.headCount).toBe(2);
    expect(deptIntel.staffingStatus).toBe("UNDERSTAFFED");
    expect(deptIntel.healthScore).toBeGreaterThan(0);
    expect(deptIntel.healthReasoning.length).toBeGreaterThan(0);
    expect(deptIntel.insights.some((i) => i.category === "Staffing Capacity")).toBe(true);
  });

  it("5. Synthesizes actionable Manager Focus actions for direct reports", () => {
    const mgrIntel = PeopleDetectionEngine.analyzeManager("mgr-1", systemContext);
    expect(mgrIntel).toBeDefined();
    expect(mgrIntel.todayFocusActions.length).toBeGreaterThan(0);
    expect(mgrIntel.todayFocusActions.some((a) => a.title.includes("Probation"))).toBe(true);
  });

  it("6. Generates Executive CXO Briefing grounded in organizational data", () => {
    const briefing = PeopleDetectionEngine.generateExecutiveBriefing(systemContext);
    expect(briefing).toBeDefined();
    expect(briefing.totalHeadcount).toBe(3);
    expect(briefing.workforceHealthScore).toBeGreaterThan(0);
    expect(briefing.whatChanged.length).toBeGreaterThan(0);
    expect(briefing.whatRequiresAttention.length).toBeGreaterThan(0);
    expect(briefing.whatIsImproving.length).toBeGreaterThan(0);
    expect(briefing.leadershipNextSteps.length).toBeGreaterThan(0);
    expect(briefing.departmentComparative.length).toBe(2);
  });

  it("7. Generates IT System Intelligence and audits permission anomalies", () => {
    const itIntel = PeopleDetectionEngine.generateITIntelligence(systemContext);
    expect(itIntel).toBeDefined();
    expect(itIntel.totalUserAccounts).toBe(3);
    expect(itIntel.activeAccounts).toBe(3);
    expect(itIntel.dataQualityScore).toBeGreaterThan(50);
    expect(itIntel.integrationHealth.sso).toBe("CONNECTED");
  });
});
