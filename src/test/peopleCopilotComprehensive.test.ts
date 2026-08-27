import { describe, it, expect, vi } from "vitest";
import { PeopleCopilotService } from "@/services/people-ai/peopleCopilotService";
import type { SystemContext } from "@/services/people-ai/peopleContextCollector";
import type { Employee, Department, Manager } from "@/types/hr";
import type { ActionExecutor } from "@/services/people-ai/peopleAiTypes";

describe("Ask People AI — 100% Real Data & Backend Action Execution", () => {
  const realEmployees: Employee[] = [
    {
      id: "emp-101",
      employeeCode: "OFC-001",
      name: "Rahul Sharma",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@ofc360.com",
      role: "Software Engineer",
      designation: "Software Engineer",
      systemRole: "employee",
      department: "Engineering",
      employmentType: "full-time",
      status: "Active",
      salary: 1800000,
      ctc: 1800000,
      reportingManager: "Amit Kumar",
      skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Node.js" }],
      performanceScore: 88,
    },
    {
      id: "emp-102",
      employeeCode: "OFC-002",
      name: "Amit Kumar",
      firstName: "Amit",
      lastName: "Kumar",
      email: "amit.kumar@ofc360.com",
      role: "Engineering Manager",
      designation: "Engineering Manager",
      systemRole: "manager",
      department: "Engineering",
      employmentType: "full-time",
      status: "Active",
      salary: 2800000,
      ctc: 2800000,
      skills: [{ name: "Leadership" }, { name: "Architecture" }],
      performanceScore: 94,
    },
    {
      id: "emp-103",
      employeeCode: "OFC-003",
      name: "Priya Singh",
      firstName: "Priya",
      lastName: "Singh",
      email: "priya.singh@ofc360.com",
      role: "Finance Lead",
      designation: "Finance Lead",
      systemRole: "hr_admin",
      department: "Finance",
      employmentType: "full-time",
      status: "Active",
      salary: 2200000,
      ctc: 2200000,
      skills: [{ name: "Finance" }, { name: "Payroll" }],
      performanceScore: 92,
    },
    {
      id: "emp-104",
      employeeCode: "OFC-004",
      name: "Neha Patel",
      firstName: "Neha",
      lastName: "Patel",
      email: "neha.patel@ofc360.com",
      role: "QA Engineer",
      designation: "QA Engineer",
      systemRole: "employee",
      department: "Engineering",
      employmentType: "full-time",
      status: "Notice",
      salary: 1400000,
      ctc: 1400000,
      skills: [{ name: "Cypress" }, { name: "QA" }],
      performanceScore: 78,
    },
    {
      id: "emp-105",
      employeeCode: "OFC-005",
      name: "Vikas Verma",
      firstName: "Vikas",
      lastName: "Verma",
      email: "vikas.verma@ofc360.com",
      role: "Junior Developer",
      designation: "Junior Developer",
      systemRole: "employee",
      department: "Engineering",
      employmentType: "full-time",
      status: "Probation",
      salary: 900000,
      ctc: 900000,
      skills: [{ name: "React" }],
      performanceScore: 82,
    },
  ];

  const realDepartments: Department[] = [
    { id: "dept-eng", name: "Engineering", code: "ENG", headOfDepartment: "Amit Kumar", employeeCount: 4, budget: 6900000 },
    { id: "dept-fin", name: "Finance", code: "FIN", headOfDepartment: "Priya Singh", employeeCount: 1, budget: 2200000 },
  ];

  const realManagers: Manager[] = [
    {
      id: "mgr-102",
      employeeId: "emp-102",
      name: "Amit Kumar",
      email: "amit.kumar@ofc360.com",
      department: "Engineering",
      role: "Engineering Manager",
      teamSize: 3,
      directReportIds: ["emp-101", "emp-104", "emp-105"],
      permissions: {
        canApproveLeave: true,
        canApproveAttendance: true,
        canApprovePayroll: true,
        canConductAppraisals: true,
        canInitiateRequisitions: true,
      },
    },
  ];

  const realContext: SystemContext = {
    employees: realEmployees,
    departments: realDepartments,
    managers: realManagers,
    attendanceRecords: [],
  };

  const emptyContext: SystemContext = {
    employees: [],
    departments: [],
    managers: [],
    attendanceRecords: [],
  };

  it("1. Returns honest empty response when database has zero records (Zero Mock Data)", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "List all employees in directory" },
      "hr_admin",
      "admin-1",
      emptyContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toBe("No employee records found in your organization.");
    expect(res.supportingDataPoints).toContain("0 records returned for current organization tenant");
  });

  it("2. Returns accurate 'Employee Not Found' message when person does not exist in DB", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Suresh Raina ke baare me batao" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("I couldn't find");
    expect(res.answer).toContain("Suresh Raina");
    expect(res.answer).toContain("in your organization's employee records");
  });

  it("3. Answers Hindi/Hinglish query for real employee profile from live database", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "bhai Rahul Sharma ke baare me batao" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Rahul Sharma");
    expect(res.answer).toContain("Software Engineer");
    expect(res.answer).toContain("Engineering");
    expect(res.confidence).toBe("HIGH");
    expect(res.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  it("4. Answers Hindi/Hinglish query for directory list from real records", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "sab employees ki list dikhao" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Employee Directory");
    expect(res.answer).toContain("Rahul Sharma");
    expect(res.answer).toContain("Priya Singh");
    expect(res.answer).toContain("Amit Kumar");
  });

  it("5. Computes compensation & payroll strictly from real employee records", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "salary breakdown and total payroll kitna hai?" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("Compensation & Payroll Intelligence");
    expect(res.answer).toContain("Annual Payroll Expenditure");
    expect(res.answer).toMatch(/91,00,000|9,100,000/); // 18L + 28L + 22L + 14L + 9L = 91L
  });


  it("6. Real Action: 'Rahul Sharma ko Finance me move karo' executes real update mutation", async () => {
    const updateSpy = vi.fn().mockResolvedValue({ data: { id: "emp-101", department: "Finance" } });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      updateEmployee: updateSpy,
      revalidate: revalidateSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Rahul Sharma ko Finance me move karo" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(updateSpy).toHaveBeenCalledWith("emp-101", expect.objectContaining({ department: "Finance" }));
    expect(revalidateSpy).toHaveBeenCalled();
    expect(res.answer).toContain("Rahul Sharma");
    expect(res.answer).toContain("has been moved to");
    expect(res.answer).toContain("Finance");
    expect(res.actionExecuted?.success).toBe(true);
  });

  it("7. Real Action: 'Move Rahul to Finance and make Amit his manager' updates both department and manager", async () => {
    const updateSpy = vi.fn().mockResolvedValue({ data: { id: "emp-101" } });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      updateEmployee: updateSpy,
      revalidate: revalidateSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Move Rahul to Finance and make Amit his manager" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(updateSpy).toHaveBeenCalledWith(
      "emp-101",
      expect.objectContaining({
        department: "Finance",
        managerId: "mgr-102",
        reportingManager: "Amit Kumar",
      })
    );
    expect(res.answer).toContain("Rahul Sharma");
    expect(res.answer).toContain("Finance");
    expect(res.answer).toContain("Amit Kumar");
  });

  it("8. Real Action: 'Deactivate Rahul' requests confirmation and executes real backend deactivation mutation upon confirmation", async () => {
    const deactivateSpy = vi.fn().mockResolvedValue({ data: { id: "emp-101" } });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      deactivateEmployee: deactivateSpy,
      revalidate: revalidateSpy,
    };

    // Step A: Natural language query returns structured confirmation request without premature mutation
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Deactivate Rahul" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(res.structuredOutput?.type).toBe("confirmation_request");
    expect(res.structuredOutput?.confirmation?.actionType).toBe("DEACTIVATE_EMPLOYEE");
    expect(res.structuredOutput?.confirmation?.targetEmployeeId).toBe("emp-101");
    expect(deactivateSpy).not.toHaveBeenCalled(); // Safe: not executed yet

    // Step B: User confirms action via modal
    const confirmedRes = await PeopleCopilotService.queryPeopleAI(
      {
        query: "Confirm",
        confirmedAction: res.structuredOutput?.confirmation,
      },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(confirmedRes).toBeDefined();
    expect(deactivateSpy).toHaveBeenCalledWith("emp-101");
    expect(revalidateSpy).toHaveBeenCalled();
    expect(confirmedRes.answer).toContain("Rahul Sharma");
  });

  it("9. Real Action: Bulk deactivating notice period employees requests confirmation and executes on confirm", async () => {
    const deactivateSpy = vi.fn().mockResolvedValue({ data: {} });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      deactivateEmployee: deactivateSpy,
      revalidate: revalidateSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Deactivate all employees on notice" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(res.structuredOutput?.type).toBe("confirmation_request");
    expect(res.structuredOutput?.confirmation?.actionType).toBe("BULK_DEACTIVATE");
    expect(res.structuredOutput?.confirmation?.affectedEmployees?.length).toBe(1);
    expect(deactivateSpy).not.toHaveBeenCalled();

    // Confirm
    const confirmedRes = await PeopleCopilotService.queryPeopleAI(
      {
        query: "Confirm",
        confirmedAction: res.structuredOutput?.confirmation,
      },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(confirmedRes).toBeDefined();
    expect(deactivateSpy).toHaveBeenCalledWith("emp-104"); // Neha Patel is on Notice
    expect(revalidateSpy).toHaveBeenCalled();
  });


  it("10. Action on non-existent employee returns clear error message without fake mutation", async () => {
    const updateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      updateEmployee: updateSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Move John Doe to Finance" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(updateSpy).not.toHaveBeenCalled();
    expect(res.answer).toContain("I couldn't find");
    expect(res.answer).toContain("John Doe");
  });

  it("11. Returns structured employee_card payload without exposing raw UUIDs in text", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Tell me about Rahul Sharma" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.structuredOutput).toBeDefined();
    expect(res.structuredOutput?.type).toBe("employee_card");
    expect(res.structuredOutput?.employee?.name).toBe("Rahul Sharma");
    expect(res.structuredOutput?.employee?.department).toBe("Engineering");
    expect(res.structuredOutput?.employee?.role).toBe("Software Engineer");
    // Text should not contain raw database UUID
    expect(res.answer).not.toContain("emp-101");
  });

  it("12. Returns structured employee_list for department query without markdown pipe tables", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Engineering ke saare employees dikhao" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.structuredOutput).toBeDefined();
    expect(res.structuredOutput?.type).toBe("employee_list");
    expect(res.structuredOutput?.title).toContain("Engineering");
    expect(res.structuredOutput?.count).toBe(4);
    expect(res.structuredOutput?.employees?.length).toBe(4);
    // Should NOT contain raw markdown pipe table formatting
    expect(res.answer).not.toContain("|---|---|");
  });

  it("13. Executes confirmed action via confirmedAction payload directly", async () => {
    const updateSpy = vi.fn().mockResolvedValue({ data: { id: "emp-101" } });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      updateEmployee: updateSpy,
      revalidate: revalidateSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      {
        query: "Confirm",
        confirmedAction: {
          actionType: "MOVE_DEPARTMENT",
          title: "Move Rahul Sharma to Finance",
          description: "Move department to Finance",
          targetEmployeeId: "emp-101",
          targetEmployeeName: "Rahul Sharma",
          newValue: "Finance",
        },
      },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(updateSpy).toHaveBeenCalledWith("emp-101", expect.objectContaining({ department: "Finance" }));
    expect(revalidateSpy).toHaveBeenCalled();
    expect(res.structuredOutput?.type).toBe("action_result");
    expect(res.actionExecuted?.success).toBe(true);
  });

  it("14. Unknown employee search returns clear not-found message without falling through to dashboard overview", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Find employee XYZ Nonexistent Person 987654" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.answer).toContain("couldn't find");
    expect(res.answer).toContain("XYZ Nonexistent Person 987654");
    expect(res.answer).not.toContain("Total Active Headcount");
  });

  it("15. Create Employee: Parses full natural language details and calls createEmployee with real payload", async () => {
    const createSpy = vi.fn().mockResolvedValue({ data: { id: "emp-new", name: "OFC360 AI Test Employee" } });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      createEmployee: createSpy,
      revalidate: revalidateSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Create Rahul Sharma with email rahul@company.com, phone 9876543210 in Engineering as Senior Developer" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Rahul Sharma",
        email: "rahul@company.com",
        phone: "9876543210",
        department: "Engineering",
        designation: "Senior Developer",
      })
    );
    expect(revalidateSpy).toHaveBeenCalled();
    expect(res.actionExecuted?.success).toBe(true);
    expect(res.answer).toContain("Rahul Sharma");
    expect(res.answer).toContain("rahul@company.com");
  });

  it("16. Create Employee: Missing phone/email prompts user without inventing fake phone or calling API prematurely", async () => {
    const createSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      createEmployee: createSpy,
    };

    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Add Rahul Sharma to Engineering" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(createSpy).not.toHaveBeenCalled(); // Safe: does not call backend
    expect(res.structuredOutput?.type).toBe("missing_fields_prompt");
    expect(res.answer).toContain("Rahul Sharma");
    expect(res.answer.toLowerCase()).toContain("phone");
    expect(res.answer.toLowerCase()).toContain("email");
  });

  it("17. Filter Queries: 'Show all active employees in Engineering' applies exact normalized status matching", async () => {
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Show all active employees in Engineering" },
      "hr_admin",
      "admin-1",
      realContext
    );

    expect(res).toBeDefined();
    expect(res.structuredOutput?.type).toBe("employee_list");
    expect(res.structuredOutput?.employees?.every((e) => e.department === "Engineering")).toBe(true);
    expect(res.structuredOutput?.employees?.every((e) => (e.status || "").toLowerCase() === "active")).toBe(true);
    // emp-104 (Neha Patel) is on Notice, emp-105 (Vikram) is in Product -> should be filtered
    expect(res.structuredOutput?.employees?.some((e) => e.name === "Neha Patel")).toBe(false);
  });

  it("18. Delete Employee: Requests confirmation before calling backend delete mutation", async () => {
    const deleteSpy = vi.fn().mockResolvedValue({ data: { success: true } });
    const revalidateSpy = vi.fn();

    const actionExecutor: ActionExecutor = {
      deleteEmployee: deleteSpy,
      revalidate: revalidateSpy,
    };

    // Step A: Request
    const res = await PeopleCopilotService.queryPeopleAI(
      { query: "Delete Rahul Sharma" },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(res).toBeDefined();
    expect(res.structuredOutput?.type).toBe("confirmation_request");
    expect(res.structuredOutput?.confirmation?.actionType).toBe("DELETE_EMPLOYEE");
    expect(deleteSpy).not.toHaveBeenCalled();

    // Step B: Confirm
    const confirmedRes = await PeopleCopilotService.queryPeopleAI(
      {
        query: "Confirm",
        confirmedAction: res.structuredOutput?.confirmation,
      },
      "hr_admin",
      "admin-1",
      realContext,
      "Admin User",
      actionExecutor
    );

    expect(confirmedRes).toBeDefined();
    expect(deleteSpy).toHaveBeenCalledWith("emp-101");
    expect(revalidateSpy).toHaveBeenCalled();
  });
});


