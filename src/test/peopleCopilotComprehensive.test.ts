import { describe, it, expect } from "vitest";
import { PeopleCopilotService } from "@/services/people-ai/peopleCopilotService";
import type { SystemContext } from "@/services/people-ai/peopleContextCollector";

describe("Ask People AI — Comprehensive Multilingual & Full Intelligence Capabilities", () => {
  const emptyContext: SystemContext = {
    employees: [],
    departments: [],
    managers: [],
    attendanceRecords: [],
  };

  it("1. Answers Hindi/Hinglish query for employee profile accurately", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "bhai Vinit Sharma ke baare me batao" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Vinit Sharma");
    expect(res.answer).toContain("VP of Engineering");
    expect(res.answer).toContain("Engineering");
    expect(res.confidence).toBe("HIGH");
    expect(res.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  it("2. Answers Hindi/Hinglish query for directory list", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "sab employees ki list dikhao" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Employee Directory");
    expect(res.answer).toContain("Mamraj Yadav");
    expect(res.answer).toContain("Priya Sharma");
  });

  it("3. Answers compensation & payroll questions for HR Admin", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "salary breakdown and total payroll kitna hai?" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Compensation & Payroll Intelligence");
    expect(res.answer).toContain("Annual Payroll Expenditure");
    expect(res.answer).toContain("Monthly Payroll Outflow");
  });

  it("4. Answers attendance and leave questions", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "kaun chhutti par hai aur attendance kitna hai?" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Attendance, Presence & Leave Telemetry");
    expect(res.answer).toContain("97.4%");
    expect(res.answer).toContain("Casual Leave (CL)");
  });

  it("5. Answers specific department deep inquiry", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Engineering department details" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Deep Department Intelligence: **Engineering**");
    expect(res.answer).toContain("Head of Department");
    expect(res.answer).toContain("Vinit Sharma");
  });

  it("6. Answers leadership and founders inquiry", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "who are the founders and owners of OFC360 and EquinoxSphere?" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Vinit Sharma");
    expect(res.answer).toContain("Banoth Siddarth");
    expect(res.answer).toContain("EquinoxSphere");
  });

  it("7. Answers skill and talent search inquiry", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "who knows React and TypeScript?" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Matching Talent for Skill/Role");
    expect(res.answer.toLowerCase()).toContain("react");
  });

  it("8. Answers probation inquiry with actionable review context", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "probation par kaun kaun hai?" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Active Probation Reviews");
    expect(res.answer).toContain("Rahul Verma");
  });
});
