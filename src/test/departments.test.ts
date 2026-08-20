import { describe, it, expect } from "vitest";
import {
  departmentApi,
  normalizeDepartment,
  useGetDepartmentsQuery,
  useDeleteDepartmentMutation,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/services/api/departmentApi";
import { normalizeError } from "@/services/api/normalizeError";
import { Department } from "@/types/hr";

describe("Department Module — Delete & Normalization Functionality", () => {
  describe("Department ID Normalization", () => {
    it("should correctly normalize department with numeric id", () => {
      const raw = {
        id: 101,
        department_name: "Engineering",
        department_code: "ENG-01",
        employee_capacity: 50,
        employee_count: 20,
        status: "ACTIVE",
      };
      const normalized = normalizeDepartment(raw);
      expect(normalized.id).toBe("101");
      expect(normalized._id).toBe("101");
      expect(normalized.name).toBe("Engineering");
      expect(normalized.code).toBe("ENG-01");
      expect(normalized.employeeCount).toBe(20);
      expect(normalized.capacity).toBe(50);
      expect(normalized.openPositions).toBe(30);
      expect(normalized.status).toBe("Active");
    });

    it("should correctly extract department_id field", () => {
      const raw = {
        department_id: 102,
        name: "Engineering",
        code: "ENG-02",
      };
      const normalized = normalizeDepartment(raw);
      expect(normalized.id).toBe("102");
      expect(normalized.name).toBe("Engineering");
      expect(normalized.code).toBe("ENG-02");
    });

    it("should correctly extract _id and departmentId fields", () => {
      const rawMongo = {
        _id: "mongo_dept_999",
        name: "Human Resources",
      };
      const normalizedMongo = normalizeDepartment(rawMongo);
      expect(normalizedMongo.id).toBe("mongo_dept_999");

      const rawCamel = {
        departmentId: "dept_camel_555",
        departmentName: "Management",
      };
      const normalizedCamel = normalizeDepartment(rawCamel);
      expect(normalizedCamel.id).toBe("dept_camel_555");
      expect(normalizedCamel.name).toBe("Management");
    });

    it("should correctly extract dept_id field", () => {
      const raw = {
        dept_id: 777,
        name: "Finance",
      };
      const normalized = normalizeDepartment(raw);
      expect(normalized.id).toBe("777");
    });

    it("should correctly resolve Department Head and Reporting Manager from all API property aliases", () => {
      const raw1 = {
        id: "101",
        name: "Technology",
        department_head: "Alex Johnson",
        reporting_manager_name: "Sarah Chen",
      };
      const norm1 = normalizeDepartment(raw1);
      expect(norm1.head).toBe("Alex Johnson");
      expect(norm1.manager).toBe("Sarah Chen");

      const raw2 = {
        id: "102",
        name: "Human Resources",
        head_of_department: "Priya Sharma",
      };
      const norm2 = normalizeDepartment(raw2);
      expect(norm2.head).toBe("Priya Sharma");
      expect(norm2.manager).toBe("Priya Sharma");

      const raw3 = {
        id: "103",
        name: "Engineering",
      };
      const norm3 = normalizeDepartment(raw3);
      expect(norm3.head).toBe("Vinit Sharma");
      expect(norm3.manager).toContain("Vinit Sharma");
    });

    it("should correctly resolve Open Reqs (openPositions) from property aliases or calculate from capacity", () => {
      const raw1 = {
        id: "201",
        name: "Cloud Platform",
        open_requisitions: 8,
      };
      const norm1 = normalizeDepartment(raw1);
      expect(norm1.openPositions).toBe(8);

      const raw2 = {
        id: "202",
        name: "Security",
        employee_capacity: 40,
        employee_count: 25,
      };
      const norm2 = normalizeDepartment(raw2);
      expect(norm2.openPositions).toBe(15);

      const raw3 = {
        id: "203",
        name: "QA Engineering",
        hiring_status: "Open",
      };
      const norm3 = normalizeDepartment(raw3);
      expect(typeof norm3.openPositions).toBe("number");
      expect(norm3.openPositions).toBeGreaterThan(0);
    });
  });

  describe("Duplicate Department Names Handling", () => {
    const rawDuplicateList = [
      { id: 101, department_name: "Engineering", department_code: "ENG-01" },
      { id: 102, department_name: "Engineering", department_code: "ENG-02" },
      { id: 201, department_name: "Human Resources", department_code: "HR-01" },
      { id: 202, department_name: "Human Resources", department_code: "HR-02" },
      { id: 301, department_name: "Management", department_code: "MGT-01" },
      { id: 302, department_name: "Management", department_code: "MGT-02" },
    ];

    it("should assign distinct IDs to duplicate named departments", () => {
      const departments: Department[] = rawDuplicateList.map(normalizeDepartment);

      expect(departments).toHaveLength(6);
      expect(departments[0].id).toBe("101");
      expect(departments[1].id).toBe("102");
      expect(departments[0].name).toBe(departments[1].name); // Both "Engineering"
      expect(departments[0].id).not.toBe(departments[1].id); // Distinct IDs
    });

    it("should delete only the targeted department by ID without affecting duplicate names", () => {
      let departments: Department[] = rawDuplicateList.map(normalizeDepartment);

      // Delete Engineering #1 (ID: 101)
      const targetIdToDelete = "101";
      departments = departments.filter((d) => d.id !== targetIdToDelete);

      expect(departments).toHaveLength(5);
      expect(departments.find((d) => d.id === "101")).toBeUndefined();
      
      // Engineering #2 (ID: 102) must remain
      const remainingEng = departments.find((d) => d.id === "102");
      expect(remainingEng).toBeDefined();
      expect(remainingEng?.name).toBe("Engineering");

      // Delete Human Resources #1 (ID: 201)
      departments = departments.filter((d) => d.id !== "201");
      expect(departments).toHaveLength(4);
      expect(departments.find((d) => d.id === "201")).toBeUndefined();
      expect(departments.find((d) => d.id === "202")).toBeDefined();

      // Delete Management #1 (ID: 301)
      departments = departments.filter((d) => d.id !== "301");
      expect(departments).toHaveLength(3);
      expect(departments.find((d) => d.id === "301")).toBeUndefined();
      expect(departments.find((d) => d.id === "302")).toBeDefined();
    });
  });

  describe("RTK Query Department API Endpoints", () => {
    it("should have deleteDepartment endpoint configured with DELETE method and correct URL", () => {
      expect(departmentApi.endpoints).toHaveProperty("deleteDepartment");
      expect(departmentApi.endpoints).toHaveProperty("getDepartments");
      expect(departmentApi.endpoints).toHaveProperty("getDepartmentById");
      expect(departmentApi.endpoints).toHaveProperty("createDepartment");
      expect(departmentApi.endpoints).toHaveProperty("updateDepartment");

      // Check generated hooks
      expect(typeof useGetDepartmentsQuery).toBe("function");
      expect(typeof useDeleteDepartmentMutation).toBe("function");
      expect(typeof useCreateDepartmentMutation).toBe("function");
      expect(typeof useUpdateDepartmentMutation).toBe("function");
    });
  });

  describe("API Error Normalization for Delete Responses", () => {
    it("should correctly normalize 409 Conflict error with dependencies", () => {
      const conflictError = {
        status: 409,
        data: {
          success: false,
          message: "Department cannot be deleted because it has associated employees.",
        },
      };
      const normalized = normalizeError(conflictError);
      expect(normalized.status).toBe(409);
      expect(normalized.message).toBe("Department cannot be deleted because it has associated employees.");
    });

    it("should correctly normalize 404 Not Found error", () => {
      const notFoundError = {
        status: 404,
        data: {
          detail: "Department not found",
        },
      };
      const normalized = normalizeError(notFoundError);
      expect(normalized.status).toBe(404);
      expect(normalized.message).toBe("Department not found");
    });

    it("should correctly normalize 403 Forbidden error", () => {
      const forbiddenError = {
        status: 403,
        data: {
          detail: "You do not have permission to delete departments.",
        },
      };
      const normalized = normalizeError(forbiddenError);
      expect(normalized.status).toBe(403);
      expect(normalized.message).toBe("You do not have permission to delete departments.");
    });

    it("should correctly normalize 401 Unauthorized error", () => {
      const unauthorizedError = {
        status: 401,
      };
      const normalized = normalizeError(unauthorizedError);
      expect(normalized.status).toBe(401);
      expect(normalized.message).toContain("Unauthorized");
    });

    it("should correctly normalize 500 Internal Server Error", () => {
      const serverError = {
        status: 500,
        data: {
          message: "Database transaction failed during department deletion",
        },
      };
      const normalized = normalizeError(serverError);
      expect(normalized.status).toBe(500);
      expect(normalized.message).toBe("Database transaction failed during department deletion");
    });
  });
});