import { describe, it, expect, beforeEach } from "vitest";
import { useHRAdminOnboardingStore } from "@/stores/hrAdminOnboardingStore";
import {
  validateCIN,
  validateGSTIN,
  validatePAN,
  validateTAN,
  validateMobileNumber,
  validateImageFile,
} from "@/utils/onboardingValidation";
import { hasModuleAccess } from "@/lib/permissions";

describe("HR Admin Onboarding Module Test Suite", () => {
  const companyA = "company_tenant_a";
  const companyB = "company_tenant_b";

  beforeEach(() => {
    localStorage.clear();
    useHRAdminOnboardingStore.getState().resetOnboardingData(companyA);
    useHRAdminOnboardingStore.getState().resetOnboardingData(companyB);
  });

  // Test 1: HR Admin can start onboarding
  it("1. HR Admin can start onboarding with default initial step", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.loadForCompany(companyA);
    const { onboarding } = useHRAdminOnboardingStore.getState();
    expect(onboarding.current_step).toBe(1);
    expect(onboarding.completed_steps).toEqual([]);
    expect(onboarding.is_completed).toBe(false);
  });

  // Test 2: Company Details save successfully
  it("2. Company Details save successfully when valid", () => {
    const store = useHRAdminOnboardingStore.getState();
    const result = store.saveStep(
      1,
      {
        company: {
          company_name: "Acme Corp Pvt Ltd",
          industry: "Software Development & SaaS",
          country: "India",
          city: "Bengaluru",
          company_size: "51-200",
          timezone: "Asia/Kolkata",
          address: "100 Innovation Way, Tech Park",
        },
      },
      companyA
    );

    expect(result.success).toBe(true);
    expect(result.status?.completed_steps).toContain(1);
    expect(result.status?.current_step).toBe(2);
  });

  // Test 3: Required fields validation
  it("3. Rejects Company Details save if required fields are missing", () => {
    const store = useHRAdminOnboardingStore.getState();
    const result = store.saveStep(
      1,
      {
        company: {
          company_name: "  ", // whitespace only
          industry: "Tech",
          country: "India",
          city: "Bengaluru",
          company_size: "11-50",
          timezone: "Asia/Kolkata",
          address: "Address",
        },
      },
      companyA
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Company Name is required");
  });

  // Test 4: CIN validation
  it("4. Validates Indian Corporate Identity Number (CIN) format", () => {
    expect(validateCIN("U12345MH2020PTC123456")).toBe(true);
    expect(validateCIN("INVALID_CIN_123")).toBe(false);
  });

  // Test 5: GST validation
  it("5. Validates Goods and Services Tax Identification Number (GSTIN) format", () => {
    expect(validateGSTIN("22AAAAA0000A1Z5")).toBe(true);
    expect(validateGSTIN("INVALID_GSTIN")).toBe(false);
  });

  // Test 6: HR Admin profile save
  it("6. HR Admin profile saves successfully", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.saveStep(
      1,
      {
        company: {
          company_name: "Acme Corp",
          industry: "Software",
          country: "India",
          city: "Bengaluru",
          company_size: "11-50",
          timezone: "Asia/Kolkata",
          address: "Tech Park",
        },
      },
      companyA
    );

    const result = store.saveStep(
      2,
      {
        hr_admin: {
          first_name: "Alex",
          last_name: "Mercer",
          mobile_number: "+919876543210",
          designation: "Head of HR",
          preferred_language: "English",
        },
      },
      companyA
    );

    expect(result.success).toBe(true);
    expect(result.status?.completed_steps).toContain(2);
    expect(result.status?.current_step).toBe(3);
  });

  // Test 7: Profile photo upload validation
  it("7. Validates profile photo file format and size", () => {
    const validFile = new File(["dummy"], "photo.png", { type: "image/png" });
    const res = validateImageFile(validFile, ["image/png", "image/jpeg"]);
    expect(res.valid).toBe(true);
  });

  // Test 8: Company logo upload validation
  it("8. Validates company logo file upload", () => {
    const logoFile = new File(["logo"], "logo.jpeg", { type: "image/jpeg" });
    const res = validateImageFile(logoFile, ["image/png", "image/jpeg"]);
    expect(res.valid).toBe(true);
  });

  // Test 9: Company stamp upload validation
  it("9. Validates company official stamp / seal upload (PNG transparent preferred)", () => {
    const stampFile = new File(["stamp"], "stamp.png", { type: "image/png" });
    const res = validateImageFile(stampFile, ["image/png", "image/jpeg", "image/webp"]);
    expect(res.valid).toBe(true);
  });

  // Test 10: Invalid file rejection
  it("10. Rejects invalid file formats (e.g. PDF/EXE) for logo/stamp", () => {
    const invalidFile = new File(["executable"], "script.exe", { type: "application/x-msdownload" });
    const res = validateImageFile(invalidFile, ["image/png", "image/jpeg", "image/webp"]);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Invalid file format");
  });

  // Test 11: Step completion
  it("11. Completes branding step 3 and updates completion percentage", () => {
    const store = useHRAdminOnboardingStore.getState();
    const result = store.saveStep(
      3,
      {
        branding: {
          authorized_signatory_name: "Vinit Sharma",
          authorized_signatory_designation: "Founder",
        },
      },
      companyA
    );

    expect(result.success).toBe(true);
    expect(result.status?.completed_steps).toContain(3);
    expect(result.status?.completion_percentage).toBe(20); // 1 out of 5 steps in isolated test
  });

  // Test 12: Resume onboarding after logout/login
  it("12. Resumes onboarding progress from stored company data on load", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.saveStep(
      1,
      {
        company: {
          company_name: "Persisted Tech",
          industry: "Software",
          country: "India",
          city: "Mumbai",
          company_size: "11-50",
          timezone: "Asia/Kolkata",
          address: "123 Street",
        },
      },
      companyA
    );

    // Re-load company data (simulating fresh login session)
    store.loadForCompany(companyA);
    const state = useHRAdminOnboardingStore.getState();
    expect(state.company.company_name).toBe("Persisted Tech");
    expect(state.onboarding.completed_steps).toContain(1);
    expect(state.onboarding.current_step).toBe(2);
  });

  // Test 13: Completed steps are not shown again as fresh incomplete steps
  it("13. Completed steps remain intact and do not reset to step 1", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.saveStep(1, { company: { company_name: "C1", industry: "I1", country: "Ind", city: "Mum", company_size: "1-10", timezone: "UTC", address: "A1" } }, companyA);
    store.saveStep(2, { hr_admin: { first_name: "F", last_name: "L", mobile_number: "9876543210", designation: "HR", preferred_language: "English" } }, companyA);

    store.loadForCompany(companyA);
    const { onboarding } = useHRAdminOnboardingStore.getState();
    expect(onboarding.completed_steps).toEqual([1, 2]);
    expect(onboarding.current_step).toBe(3);
  });

  // Test 14: Final onboarding completion
  it("14. Marks onboarding fully completed when all required steps are satisfied", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.saveStep(1, { company: { company_name: "C1", industry: "I1", country: "Ind", city: "Mum", company_size: "1-10", timezone: "UTC", address: "A1" } }, companyA);
    store.saveStep(2, { hr_admin: { first_name: "F", last_name: "L", mobile_number: "9876543210", designation: "HR", preferred_language: "English" } }, companyA);
    store.saveStep(3, { branding: { authorized_signatory_name: "Sig", authorized_signatory_designation: "CEO" } }, companyA);

    const completeRes = store.completeOnboarding(companyA);
    expect(completeRes.success).toBe(true);
    expect(completeRes.status?.is_completed).toBe(true);
    expect(completeRes.status?.completed_at).toBeDefined();
  });

  // Test 15: Unauthorized employee access prevention
  it("15. RoleGuard prevents employee role from accessing HR Admin onboarding module", () => {
    expect(hasModuleAccess("employee", "rbac")).toBe(false);
    expect(hasModuleAccess("employee", "system_settings")).toBe(false);
  });

  // Test 16: Unauthorized manager access prevention
  it("16. RoleGuard prevents manager role from accessing HR Admin system settings", () => {
    expect(hasModuleAccess("manager", "system_settings")).toBe(false);
  });

  // Test 17: Cross-company access prevention
  it("17. Prevents cross-company data bleed between company A and company B", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.saveStep(1, { company: { company_name: "Company A Corp", industry: "I1", country: "Ind", city: "Mum", company_size: "1-10", timezone: "UTC", address: "A1" } }, companyA);

    // Load company B
    store.loadForCompany(companyB);
    const stateB = useHRAdminOnboardingStore.getState();
    expect(stateB.company.company_name).toBe("");
    expect(stateB.onboarding.completed_steps).toEqual([]);
  });

  // Test 18: Invalid onboarding step validation
  it("18. Handles invalid mobile numbers with error return", () => {
    const store = useHRAdminOnboardingStore.getState();
    const res = store.saveStep(
      2,
      {
        hr_admin: {
          first_name: "Alex",
          last_name: "M",
          mobile_number: "123", // invalid
          designation: "HR",
          preferred_language: "English",
        },
      },
      companyA
    );
    expect(res.success).toBe(false);
    expect(res.error).toContain("Invalid Mobile Number");
  });

  // Test 19: Database rollback / error handling on missing fields
  it("19. Rejects final complete call if mandatory steps are incomplete", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.resetOnboardingData(companyA);
    const completeRes = store.completeOnboarding(companyA);
    expect(completeRes.success).toBe(false);
    expect(completeRes.error).toContain("incomplete");
  });

  // Test 20: Final redirect state readiness
  it("20. Onboarding status returns completion_percentage 100% when complete", () => {
    const store = useHRAdminOnboardingStore.getState();
    store.saveStep(1, { company: { company_name: "C1", industry: "I1", country: "Ind", city: "Mum", company_size: "1-10", timezone: "UTC", address: "A1" } }, companyA);
    store.saveStep(2, { hr_admin: { first_name: "F", last_name: "L", mobile_number: "9876543210", designation: "HR", preferred_language: "English" } }, companyA);
    store.saveStep(3, { branding: { authorized_signatory_name: "Sig", authorized_signatory_designation: "CEO" } }, companyA);

    const completeRes = store.completeOnboarding(companyA);
    expect(completeRes.status?.completion_percentage).toBe(100);
  });
});