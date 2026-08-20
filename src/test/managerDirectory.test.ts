import { describe, it, expect } from "vitest";
import { normalizeRole, roleLabels, ROLE_OPTIONS } from "@/features/auth/authTypes";
import { normalizeEmployee } from "@/services/api/employeeApi";

describe("Employee Directory — Manager Integration & Workforce Representation", () => {
  const mockRawManagerBackendItem = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    employee_id: "MGR-202608-0131",
    first_name: "Mamraj",
    last_name: "Yadav",
    personal_email: "themamraj0131@gmail.com",
    company_email: "mamraj@ofc360.com",
    phone: "9828740131",
    department: "Engineering",
    designation: "Cloud & DevOps Engineer",
    role: "manager",
    status: "ACTIVE",
    ctc: 1200000,
    salary: 1200000,
    basic_salary: 600000,
    hra: 300000,
    bonus: 180000,
    pf: 72000,
    esi: 0,
    professional_tax: 2400,
    joining_date: "2026-08-19",
    created_at: "2026-08-19T10:00:00Z",
  };

  const mockRawEmployeeBackendItem = {
    id: "f1e2d3c4-b5a6-0987-dcba-fe9876543210",
    employee_id: "EMP-202608-0008",
    first_name: "Sunaina",
    last_name: "Mehra",
    personal_email: "sunaina.mehra@example.com",
    company_email: "sunaina.mehra@ofc360.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Senior Frontend Engineer",
    role: "employee",
    status: "ACTIVE",
    ctc: 1000000,
    salary: 1000000,
    joining_date: "2026-08-17",
    created_at: "2026-08-17T10:00:00Z",
  };

  it("should normalize Manager backend record preserving designation and role='manager'", () => {
    const rawList = [mockRawManagerBackendItem, mockRawEmployeeBackendItem];
    const responseList = rawList.map(normalizeEmployee);

    expect(responseList).toHaveLength(2);

    const manager = responseList.find((e: any) => e.firstName === "Mamraj");
    expect(manager).toBeDefined();
    expect(manager.name).toBe("Mamraj Yadav");
    expect(manager.department).toBe("Engineering");
    expect(manager.designation).toBe("Cloud & DevOps Engineer");
    expect(manager.role).toBe("manager");
    expect(manager.systemRole).toBe("manager");
    expect(manager.status).toBe("ACTIVE");
    expect(manager.salary).toBe(1200000);
    expect(manager.joinedAt).toBe("2026-08-19");
  });

  it("should format table columns correctly for Manager (System Role = Manager, Designation = Cloud & DevOps Engineer)", () => {
    const manager = normalizeEmployee(mockRawManagerBackendItem);

    // System Access Role column
    const systemRoleLabel = roleLabels[manager.systemRole as keyof typeof roleLabels];
    expect(systemRoleLabel).toBe("Manager");

    // Job Designation column
    expect(manager.designation).toBe("Cloud & DevOps Engineer");

    // Annual CTC column
    expect(manager.salary).toBe(1200000);
  });

  it("should support role filtering in Employee Directory (Manager vs Employee)", () => {
    const rawList = [mockRawManagerBackendItem, mockRawEmployeeBackendItem];
    const responseList = rawList.map(normalizeEmployee);

    const managerList = responseList.filter((e: any) => e.systemRole === "manager");
    expect(managerList).toHaveLength(1);
    expect(managerList[0].name).toBe("Mamraj Yadav");

    const employeeList = responseList.filter((e: any) => e.systemRole === "employee");
    expect(employeeList).toHaveLength(1);
    expect(employeeList[0].name).toBe("Sunaina Mehra");
  });

  it("should find managers when searching by name, designation, department, or role", () => {
    const rawList = [mockRawManagerBackendItem, mockRawEmployeeBackendItem];
    const responseList = rawList.map(normalizeEmployee);

    const searchByName = responseList.filter((e: any) =>
      e.name.toLowerCase().includes("mamraj")
    );
    expect(searchByName).toHaveLength(1);

    const searchByDesignation = responseList.filter((e: any) =>
      e.designation.toLowerCase().includes("devops")
    );
    expect(searchByDesignation).toHaveLength(1);

    const searchByDept = responseList.filter((e: any) =>
      e.department.toLowerCase().includes("engineering")
    );
    expect(searchByDept).toHaveLength(2);
  });

  it("should include Manager in ROLE_OPTIONS for filter dropdown", () => {
    const managerOption = ROLE_OPTIONS.find((opt) => opt.value === "manager");
    expect(managerOption).toBeDefined();
    expect(managerOption?.label).toBe("Manager");
  });
});
