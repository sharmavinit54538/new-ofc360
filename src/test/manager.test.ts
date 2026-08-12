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
    it("should build dual camelCase and snake_case payload from standard EmployeeFormDialog submission", () => {
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

      // Name variants
      expect(payload.firstName).toBe("Rajesh");
      expect(payload.first_name).toBe("Rajesh");
      expect(payload.lastName).toBe("Kumar");
      expect(payload.last_name).toBe("Kumar");
      expect(payload.name).toBe("Rajesh Kumar");
      expect(payload.fullName).toBe("Rajesh Kumar");
      expect(payload.full_name).toBe("Rajesh Kumar");

      // Email variants
      expect(payload.email).toBe("rajesh@company.com");
      expect(payload.work_email).toBe("rajesh@company.com");
      expect(payload.company_email).toBe("rajesh@company.com");
      expect(payload.personal_email).toBe("rajesh.k@gmail.com");
      expect(payload.personalEmail).toBe("rajesh.k@gmail.com");
      expect(payload.companyWorkEmail).toBe("rajesh@company.com");

      // Phone variants
      expect(payload.phone).toBe("+91 9876543210");
      expect(payload.phone_number).toBe("+91 9876543210");
      expect(payload.phoneNumber).toBe("+91 9876543210");
      expect(payload.alternate_phone).toBe("+91 9876543211");
      expect(payload.alternatePhone).toBe("+91 9876543211");

      // Department & Role variants
      expect(payload.department).toBe("Engineering");
      expect(payload.department_name).toBe("Engineering");
      expect(payload.designation).toBe("Engineering Lead");
      expect(payload.role).toBe("Engineering Lead");
      expect(payload.systemRole).toBe("manager");
      expect(payload.system_role).toBe("manager");

      // Core details
      expect(payload.joining_date).toBe("2024-01-15");
      expect(payload.joiningDate).toBe("2024-01-15");
      expect(payload.employment_type).toBe("FULL_TIME");
      expect(payload.employmentType).toBe("FULL_TIME");
      expect(payload.status).toBe("Active");
      expect(payload.ctc).toBe(2400000);
      expect(payload.salary).toBe(2400000);
      expect(payload.basic_salary).toBe(1200000);
      expect(payload.basicSalary).toBe(1200000);
    });

    it("should handle snake_case inputs and produce complete normalized payload", () => {
      const snakeInput = {
        first_name: "Priya",
        last_name: "Sharma",
        personal_email: "priya.sharma@example.com",
        phone_number: "9876543210",
        department_name: "Design",
        role: "Design Manager",
        system_role: "manager",
        joining_date: "2023-05-01",
        employment_type: "FULL_TIME",
        salary: 1800000,
      };

      const payload = buildManagerCreatePayload(snakeInput);

      expect(payload.first_name).toBe("Priya");
      expect(payload.firstName).toBe("Priya");
      expect(payload.last_name).toBe("Sharma");
      expect(payload.lastName).toBe("Sharma");
      expect(payload.full_name).toBe("Priya Sharma");
      expect(payload.personal_email).toBe("priya.sharma@example.com");
      expect(payload.phone).toBe("9876543210");
      expect(payload.phone_number).toBe("9876543210");
      expect(payload.department).toBe("Design");
      expect(payload.department_name).toBe("Design");
      expect(payload.systemRole).toBe("manager");
      expect(payload.system_role).toBe("manager");
      expect(payload.ctc).toBe(1800000);
      expect(payload.salary).toBe(1800000);
    });

    it("should handle sub-arrays (addresses, kyc, education, experience, emergency contacts, bank accounts)", () => {
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
        bankAccounts: [
          {
            bankName: "HDFC Bank",
            accountNumber: "1234567890",
            ifscCode: "HDFC0001234",
            accountType: "SAVINGS",
          },
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

      expect(payload.bank_accounts).toBeDefined();
      expect(payload.bank_accounts?.length).toBe(1);
      expect(payload.bank_accounts?.[0].bank_name).toBe("HDFC Bank");
      expect(payload.bank_accounts?.[0].account_number).toBe("1234567890");
    });
  });

  describe("buildManagerUpdatePayload", () => {
    it("should build dual keys for partial updates", () => {
      const changes = {
        firstName: "Ananya",
        lastName: "Deshmukh",
        department: "Product",
        phone: "+91 9123456789",
        ctc: 3000000,
      };

      const payload = buildManagerUpdatePayload(changes);

      expect(payload.firstName).toBe("Ananya");
      expect(payload.first_name).toBe("Ananya");
      expect(payload.lastName).toBe("Deshmukh");
      expect(payload.last_name).toBe("Deshmukh");
      expect(payload.full_name).toBe("Ananya Deshmukh");
      expect(payload.department).toBe("Product");
      expect(payload.department_name).toBe("Product");
      expect(payload.phone).toBe("+91 9123456789");
      expect(payload.phone_number).toBe("+91 9123456789");
      expect(payload.ctc).toBe(3000000);
      expect(payload.salary).toBe(3000000);
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
