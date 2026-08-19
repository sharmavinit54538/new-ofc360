import { describe, it, expect } from "vitest";
import {
  managerApi,
  buildManagerCreatePayload,
  buildManagerUpdatePayload,
  useGetManagersQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useSendManagerInviteMutation,
  useActivateManagerMutation,
  useDeactivateManagerMutation,
  useResetManagerPasswordMutation,
} from "@/services/api/managerApi";
import { normalizeError } from "@/services/api/normalizeError";

describe("Manager Module — Payload Builders & Error Handling", () => {
  describe("buildManagerCreatePayload", () => {
    it("should build clean snake_case payload with distinct designation and role", () => {
      const formInput = {
        firstName: "Rajesh",
        lastName: "Kumar",
        name: "Rajesh Kumar",
        personalEmail: "rajesh.k@gmail.com",
        companyWorkEmail: "rajesh@company.com",
        phone: "+91 9876543210",
        alternatePhone: "+91 9876543211",
        department: "Engineering",
        designation: "Engineering Lead",
        systemRole: "manager",
        joiningDate: "2024-01-15",
        employmentType: "FULL_TIME",
        status: "Active",
        ctc: 2400000,
        basicSalary: 1200000,
        hra: 600000,
        bonus: 300000,
        pfDeduction: 144000,
        esiDeduction: 0,
        profTax: 2500,
        gender: "Male",
        dob: "1988-06-20",
        bloodGroup: "O+",
        maritalStatus: "Married",
        branchOffice: "Bengaluru Tech Park",
        workLocation: "Hybrid",
        probationPeriod: 3,
        capacity: 100,
        costCenterId: "CC-ENG-02",
        leaveGroup: "Management Policy",
      };

      const payload = buildManagerCreatePayload(formInput);

      // Core name & contact
      expect(payload.first_name).toBe("Rajesh");
      expect(payload.last_name).toBe("Kumar");
      expect(payload.personal_email).toBe("rajesh.k@gmail.com");
      expect(payload.company_email).toBe("rajesh@company.com");
      expect(payload.phone).toBe("+91 9876543210");
      expect(payload.alternate_phone).toBe("+91 9876543211");

      // Verify strict separation of job designation and system role
      expect(payload.department).toBe("Engineering");
      expect(payload.designation).toBe("Engineering Lead");
      expect(payload.role).toBe("manager");
      expect(payload.role).not.toBe("Engineering Lead");

      // Ensure no duplicate camelCase keys
      expect(payload.firstName).toBeUndefined();
      expect(payload.lastName).toBeUndefined();
      expect(payload.personalEmail).toBeUndefined();
      expect(payload.systemRole).toBeUndefined();
      expect(payload.system_role).toBeUndefined();

      // Employment & compensation
      expect(payload.joining_date).toBe("2024-01-15");
      expect(payload.employment_type).toBe("FULL_TIME");
      expect(payload.employment_status).toBe("ACTIVE");
      expect(payload.gender).toBe("MALE");
      expect(payload.marital_status).toBe("MARRIED");
      expect(payload.blood_group).toBe("O+");
      expect(payload.branch).toBe("Bengaluru Tech Park");
      expect(payload.work_location).toBe("Hybrid");
      expect(payload.probation_period_months).toBe(3);
      expect(payload.ctc).toBe(2400000);
      expect(payload.basic_salary).toBe(1200000);
      expect(payload.hra).toBe(600000);
      expect(payload.bonus).toBe(300000);
      expect(payload.pf).toBe(144000);
      expect(payload.esi).toBe(0);
      expect(payload.professional_tax).toBe(2500);
      expect(payload.leave_group).toBe("Management Policy");
    });

    it("should handle exact user case: Cloud & DevOps Engineer with systemRole manager", () => {
      const input = {
        firstName: "Mamraj",
        lastName: "Yadav",
        personalEmail: "themamraj0131@gmail.com",
        companyWorkEmail: "mamraj@ofc360.com",
        phoneNumber: "9828740131",
        department: "Engineering",
        designation: "Cloud & DevOps Engineer",
        systemRole: "manager",
        joiningDate: "2026-08-19",
        status: "Active",
      };

      const payload = buildManagerCreatePayload(input);

      expect(payload.first_name).toBe("Mamraj");
      expect(payload.last_name).toBe("Yadav");
      expect(payload.personal_email).toBe("themamraj0131@gmail.com");
      expect(payload.company_email).toBe("mamraj@ofc360.com");
      expect(payload.phone).toBe("9828740131");
      expect(payload.department).toBe("Engineering");
      expect(payload.designation).toBe("Cloud & DevOps Engineer");
      expect(payload.role).toBe("manager");
      expect(payload.employment_status).toBe("ACTIVE");
    });

    it("should handle employee system role gracefully", () => {
      const input = {
        firstName: "Anil",
        lastName: "Kapoor",
        personalEmail: "anil@example.com",
        phone: "9876543210",
        department: "Engineering",
        designation: "Software Engineer",
        systemRole: "employee",
      };

      const payload = buildManagerCreatePayload(input);
      expect(payload.designation).toBe("Software Engineer");
      expect(payload.role).toBe("employee");
    });

    it("should handle sub-arrays (addresses, documents, education, experience, emergency contacts, skills)", () => {
      const input = {
        name: "Vikram Malhotra",
        email: "vikram@example.com",
        addresses: [
          {
            type: "PRESENT",
            line1: "123 Park Street",
            city: "Bengaluru",
            state: "Karnataka",
            country: "India",
            pincode: "560001",
          },
        ],
        documents: [
          {
            type: "PAN",
            documentNumber: "ABCDE1234F",
          },
        ],
        skills: [
          { name: "Kubernetes", proficiency: "Expert", years: 5 },
        ],
        emergencyContacts: [
          { name: "Rohit Sharma", relation: "Brother", phone: "9876543210" },
        ],
      };

      const payload = buildManagerCreatePayload(input);

      expect(payload.addresses).toBeDefined();
      expect(payload.addresses?.length).toBe(1);
      expect(payload.addresses?.[0].address_line_1).toBe("123 Park Street");
      expect(payload.addresses?.[0].city).toBe("Bengaluru");

      expect(payload.documents).toBeDefined();
      expect(payload.documents?.length).toBe(1);
      expect(payload.documents?.[0].document_type).toBe("PAN");
      expect(payload.documents?.[0].document_number).toBe("ABCDE1234F");

      expect(payload.skills).toBeDefined();
      expect(payload.skills?.[0].skill_name).toBe("Kubernetes");
      expect(payload.skills?.[0].proficiency).toBe("EXPERT");

      expect(payload.emergency_contacts).toBeDefined();
      expect(payload.emergency_contacts?.[0].name).toBe("Rohit Sharma");
    });
  });

  describe("buildManagerUpdatePayload", () => {
    it("should build clean snake_case payload for partial updates", () => {
      const changes = {
        firstName: "Ananya",
        lastName: "Deshmukh",
        department: "Product",
        designation: "Lead Product Manager",
        systemRole: "manager",
        phone: "+91 9123456789",
        status: "Active",
        ctc: 3000000,
      };

      const payload = buildManagerUpdatePayload(changes);

      expect(payload.first_name).toBe("Ananya");
      expect(payload.last_name).toBe("Deshmukh");
      expect(payload.department).toBe("Product");
      expect(payload.designation).toBe("Lead Product Manager");
      expect(payload.role).toBe("manager");
      expect(payload.phone).toBe("+91 9123456789");
      expect(payload.employment_status).toBe("ACTIVE");
      expect(payload.ctc).toBe(3000000);

      // Ensure no duplicate camelCase keys
      expect(payload.firstName).toBeUndefined();
      expect(payload.lastName).toBeUndefined();
      expect(payload.systemRole).toBeUndefined();
    });
  });

  describe("managerApi Endpoints", () => {
    it("should have all manager endpoints registered in RTK baseApi", () => {
      expect(managerApi.endpoints).toHaveProperty("getManagers");
      expect(managerApi.endpoints).toHaveProperty("getManagerById");
      expect(managerApi.endpoints).toHaveProperty("createManager");
      expect(managerApi.endpoints).toHaveProperty("updateManager");
      expect(managerApi.endpoints).toHaveProperty("deleteManager");
      expect(managerApi.endpoints).toHaveProperty("sendManagerInvite");
      expect(managerApi.endpoints).toHaveProperty("activateManager");
      expect(managerApi.endpoints).toHaveProperty("deactivateManager");
      expect(managerApi.endpoints).toHaveProperty("resetManagerPassword");
    });

    it("should export all valid generated hooks", () => {
      expect(typeof useGetManagersQuery).toBe("function");
      expect(typeof useCreateManagerMutation).toBe("function");
      expect(typeof useUpdateManagerMutation).toBe("function");
      expect(typeof useDeleteManagerMutation).toBe("function");
      expect(typeof useSendManagerInviteMutation).toBe("function");
      expect(typeof useActivateManagerMutation).toBe("function");
      expect(typeof useDeactivateManagerMutation).toBe("function");
      expect(typeof useResetManagerPasswordMutation).toBe("function");
    });
  });

  describe("Error Normalization for Manager Operations", () => {
    it("should normalize FastAPI 422 validation errors with field details", () => {
      const error422 = {
        status: 422,
        data: {
          detail: [
            { loc: ["body", "first_name"], msg: "field required", type: "value_error.missing" },
            { loc: ["body", "work_email"], msg: "invalid email format", type: "value_error.email" },
          ],
        },
      };

      const normalized = normalizeError(error422);
      expect(normalized.status).toBe(422);
      expect(normalized.message).toContain("first_name: field required");
      expect(normalized.message).toContain("work_email: invalid email format");
    });

    it("should normalize 409 conflict errors for duplicate manager email", () => {
      const error409 = {
        status: 409,
        data: {
          detail: "A manager with this email already exists.",
        },
      };

      const normalized = normalizeError(error409);
      expect(normalized.status).toBe(409);
      expect(normalized.message).toBe("A manager with this email already exists.");
    });
  });
});
