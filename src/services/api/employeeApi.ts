import { baseApi } from "./baseApi";
import { Employee } from "@/types/hr";
import { normalizeRole } from "@/features/auth/authTypes";
import { RawEnvelope } from "./envelope";

export interface GetEmployeesQueryParams {
  department?: string;
  status?: string;
  search?: string;
}

export type GetEmployeesQueryArg = GetEmployeesQueryParams | void;

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  probationEmployees: number;
  departmentCounts?: Record<string, number>;
}

export interface EmployeeDashboardData {
  totalCount: number;
  activeCount: number;
  newHiresThisMonth: number;
  turnoverRate: number;
  departmentDistribution: Array<{ department: string; count: number }>;
  recentActivities?: Array<{ id: string; type: string; description: string; timestamp: string }>;
}

export interface ImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors?: Array<{ row: number; error: string }>;
}

export interface OnboardingStatus {
  employeeId: string;
  status: "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | string;
  completedSteps: number;
  totalSteps: number;
  steps?: Array<{ id: string; name: string; isCompleted: boolean }>;
}

export interface ActivateEmployeePayload {
  id?: string;
  employee_id?: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ActivateEmployeeResponse {
  success?: boolean;
  message?: string;
  data?: any;
  token?: string;
  access_token?: string;
  refreshToken?: string;
  user?: any;
}

/**
 * Builds a clean payload matching the backend `EmployeeCreate` Pydantic model.
 * Excludes unknown aliases, client IDs, and extra properties that trigger 422 errors.
 */
function buildEmployeeCreatePayload(input: any): Record<string, any> {
  const b = input || {};

  const firstName = (
    b.first_name ||
    b.firstName ||
    (b.name ? b.name.trim().split(" ")[0] : "") ||
    ""
  ).trim();

  const lastName = (
    b.last_name ||
    b.lastName ||
    (b.name ? b.name.trim().split(" ").slice(1).join(" ") : "") ||
    ""
  ).trim() || ".";

  const personalEmail = (
    b.personal_email ||
    b.personalEmail ||
    b.email ||
    ""
  ).trim();

  const phone = (
    b.phone ||
    b.phone_number ||
    b.phoneNumber ||
    ""
  ).trim();

  const department = (b.department || b.department_name || "General").trim();
  const designation = (b.designation || "Employee").trim();
  const rawDate = b.joining_date || b.joiningDate || b.joinedAt;
  const joiningDate = rawDate
    ? String(rawDate).split("T")[0]
    : new Date().toISOString().split("T")[0];

  const employmentType = (b.employment_type || b.employmentType || "FULL_TIME").trim();
  const role = normalizeRole(b.role || b.systemRole || b.system_role || b.backendRole || "employee");

  const payload: Record<string, any> = {
    first_name: firstName,
    last_name: lastName,
    personal_email: personalEmail,
    phone,
    department,
    designation,
    joining_date: joiningDate,
    employment_type: employmentType,
    role,
  };

  const employeeId = (b.employee_id || b.employeeCode || (typeof b.id === "string" && !b.id.startsWith("emp_") && !b.id.startsWith("temp-") ? b.id : null) || "").trim();
  if (employeeId) payload.employee_id = employeeId;

  const companyEmail = (b.company_email || b.companyWorkEmail || b.work_email || "").trim();
  if (companyEmail) payload.company_email = companyEmail;

  const alternatePhone = (b.alternate_phone || b.alternatePhone || "").trim();
  if (alternatePhone) payload.alternate_phone = alternatePhone;

  if (b.gender) payload.gender = String(b.gender).trim();
  const rawDob = b.date_of_birth || b.dob;
  if (rawDob) payload.date_of_birth = String(rawDob).split("T")[0];
  if (b.blood_group || b.bloodGroup) payload.blood_group = (b.blood_group || b.bloodGroup).trim();
  if (b.marital_status || b.maritalStatus) payload.marital_status = (b.marital_status || b.maritalStatus).trim();
  if (b.profile_photo_url || b.photoUrl || b.avatar) payload.profile_photo_url = (b.profile_photo_url || b.photoUrl || b.avatar).trim();
  if (b.team) payload.team = String(b.team).trim();

  const isUuid = (val?: string | null) =>
    typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  const reportingManagerId = isUuid(b.reporting_manager_id)
    ? b.reporting_manager_id
    : isUuid(b.reportingManager)
    ? b.reportingManager
    : null;
  if (reportingManagerId) payload.reporting_manager_id = reportingManagerId;

  if (b.branch || b.branchOffice) payload.branch = (b.branch || b.branchOffice).trim();
  if (b.work_location || b.workLocation) payload.work_location = (b.work_location || b.workLocation).trim();
  if (typeof b.probation_period_months === "number") payload.probation_period_months = b.probation_period_months;
  else if (typeof b.probationPeriod === "number") payload.probation_period_months = b.probationPeriod;
  if (b.shift) payload.shift = String(b.shift).trim();
  if (typeof b.employee_capacity === "number") payload.employee_capacity = b.employee_capacity;
  else if (typeof b.capacity === "number") payload.employee_capacity = b.capacity;
  if (b.cost_center_id || b.costCenterId) payload.cost_center_id = (b.cost_center_id || b.costCenterId).trim();

  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  else if (b.salary !== undefined && b.salary !== null) payload.ctc = Number(b.salary);
  if (b.basic_salary !== undefined && b.basic_salary !== null) payload.basic_salary = Number(b.basic_salary);
  else if (b.basicSalary !== undefined && b.basicSalary !== null) payload.basic_salary = Number(b.basicSalary);
  if (b.hra !== undefined && b.hra !== null) payload.hra = Number(b.hra);
  if (b.bonus !== undefined && b.bonus !== null) payload.bonus = Number(b.bonus);
  if (b.pf !== undefined && b.pf !== null) payload.pf = Number(b.pf);
  else if (b.pfDeduction !== undefined && b.pfDeduction !== null) payload.pf = Number(b.pfDeduction);
  if (b.esi !== undefined && b.esi !== null) payload.esi = Number(b.esi);
  else if (b.esiDeduction !== undefined && b.esiDeduction !== null) payload.esi = Number(b.esiDeduction);
  if (b.professional_tax !== undefined && b.professional_tax !== null) payload.professional_tax = Number(b.professional_tax);
  else if (b.profTax !== undefined && b.profTax !== null) payload.professional_tax = Number(b.profTax);
  if (b.leave_group || b.leaveGroup) payload.leave_group = (b.leave_group || b.leaveGroup).trim();
  if (b.role_metadata || b.roleMetadata) payload.role_metadata = b.role_metadata || b.roleMetadata;

  // Sanitize sub-arrays matching EmployeeCreate sub-schemas
  if (Array.isArray(b.addresses) && b.addresses.length > 0) {
    const validAddresses = b.addresses
      .filter((a: any) => a && (a.address_line_1 || a.line1 || a.address || a.city))
      .map((a: any) => ({
        address_type: (a.address_type || (a.type === "PRESENT" ? "CURRENT" : a.type) || "CURRENT").toUpperCase(),
        address_line_1: String(a.address_line_1 || a.line1 || a.address || "").trim(),
        address_line_2: (a.address_line_2 || a.line2 || "").trim() || null,
        city: String(a.city || "").trim(),
        state: String(a.state || "").trim(),
        country: String(a.country || "India").trim(),
        pincode: String(a.pincode || "400001").trim(),
        is_same_as_current: Boolean(a.is_same_as_current ?? a.isSameAsCurrent ?? false),
      }))
      .filter((a: any) => a.address_line_1 && a.city && a.state);
    if (validAddresses.length > 0) payload.addresses = validAddresses;
  }

  const rawDocs = Array.isArray(b.documents)
    ? b.documents
    : Array.isArray(b.kycDocuments)
    ? b.kycDocuments
    : Array.isArray(b.kyc_documents)
    ? b.kyc_documents
    : [];
  if (rawDocs.length > 0) {
    const validDocs = rawDocs
      .filter((d: any) => d && (d.document_type || d.type || d.document_number || d.documentNumber))
      .map((d: any) => ({
        document_type: String(d.document_type || d.type || "PAN").toUpperCase().trim(),
        document_number: (d.document_number || d.documentNumber || "").trim() || null,
        document_url: (d.document_url || d.documentUrl || "").trim() || null,
        expiry_date: d.expiry_date || d.expiryDate ? String(d.expiry_date || d.expiryDate).split("T")[0] : null,
      }))
      .filter((d: any) => d.document_type);
    if (validDocs.length > 0) payload.documents = validDocs;
  }

  if (Array.isArray(b.education) && b.education.length > 0) {
    const validEdu = b.education
      .filter((e: any) => e && (e.degree || e.institution))
      .map((e: any) => ({
        degree: String(e.degree || "").trim(),
        institution: String(e.institution || "").trim(),
        field_of_study: (e.field_of_study || e.fieldOfStudy || "").trim() || null,
        start_year: e.start_year ? Number(e.start_year) : e.startYear ? Number(e.startYear) : null,
        end_year: e.end_year ? Number(e.end_year) : e.endYear ? Number(e.endYear) : null,
        grade: (e.grade || "").trim() || null,
        certificate_url: (e.certificate_url || e.certificateUrl || "").trim() || null,
      }))
      .filter((e: any) => e.degree && e.institution);
    if (validEdu.length > 0) payload.education = validEdu;
  }

  const rawExp = Array.isArray(b.experience)
    ? b.experience
    : Array.isArray(b.workExperience)
    ? b.workExperience
    : Array.isArray(b.work_experience)
    ? b.work_experience
    : [];
  if (rawExp.length > 0) {
    const validExp = rawExp
      .filter((x: any) => x && (x.company_name || x.companyName || x.company))
      .map((x: any) => ({
        company_name: String(x.company_name || x.companyName || x.company || "").trim(),
        designation: String(x.designation || x.role || "Employee").trim(),
        employment_type: (x.employment_type || x.employmentType || "").trim() || null,
        start_date: x.start_date || x.startDate ? String(x.start_date || x.startDate).split("T")[0] : new Date().toISOString().split("T")[0],
        end_date: x.end_date || x.endDate ? String(x.end_date || x.endDate).split("T")[0] : null,
        is_current: Boolean(x.is_current ?? x.isCurrent ?? false),
        description: (x.description || "").trim() || null,
      }))
      .filter((x: any) => x.company_name);
    if (validExp.length > 0) payload.experience = validExp;
  }

  if (Array.isArray(b.skills) && b.skills.length > 0) {
    const validSkills = b.skills
      .filter((s: any) => s && (s.skill_name || s.name || s.skill))
      .map((s: any) => ({
        skill_name: String(s.skill_name || s.name || s.skill || "").trim(),
        proficiency: (s.proficiency || "").trim() || null,
        years_of_experience: s.years_of_experience !== undefined && s.years_of_experience !== null ? Number(s.years_of_experience) : (s.years !== undefined && s.years !== null ? Number(s.years) : null),
      }))
      .filter((s: any) => s.skill_name);
    if (validSkills.length > 0) payload.skills = validSkills;
  }

  const rawEm = Array.isArray(b.emergency_contacts)
    ? b.emergency_contacts
    : Array.isArray(b.emergencyContacts)
    ? b.emergencyContacts
    : [];
  if (rawEm.length > 0) {
    const validEm = rawEm
      .filter((c: any) => c && (c.name || c.phone || c.primaryPhone))
      .map((c: any) => ({
        name: String(c.name || "").trim(),
        relation: String(c.relation || c.relationship || "Contact").trim(),
        phone: String(c.phone || c.primaryPhone || c.phoneNumber || "").trim(),
        alternate_phone: (c.alternate_phone || c.alternatePhone || "").trim() || null,
        email: (c.email || "").trim() || null,
        address: (c.address || "").trim() || null,
      }))
      .filter((c: any) => c.name && c.relation && c.phone);
    if (validEm.length > 0) payload.emergency_contacts = validEm;
  }

  const rawBank = Array.isArray(b.bank_accounts)
    ? b.bank_accounts
    : Array.isArray(b.bankAccounts)
    ? b.bankAccounts
    : [];
  if (rawBank.length > 0) {
    const validBank = rawBank
      .filter((bk: any) => bk && (bk.bank_name || bk.bankName || bk.account_number || bk.accountNumber))
      .map((bk: any) => ({
        bank_name: String(bk.bank_name || bk.bankName || "").trim(),
        account_holder_name: (bk.account_holder_name || bk.accountHolder || bk.accountHolderName || "").trim() || null,
        account_number: String(bk.account_number || bk.accountNumber || "").trim(),
        ifsc_code: String(bk.ifsc_code || bk.ifscCode || "HDFC0001234").trim().toUpperCase(),
        account_type: String(bk.account_type || bk.accountType || "SAVINGS").toUpperCase().trim(),
        is_primary: Boolean(bk.is_primary ?? bk.isPrimary ?? false),
      }))
      .filter((bk: any) => bk.bank_name && bk.account_number && bk.ifsc_code);
    if (validBank.length > 0) payload.bank_accounts = validBank;
  }

  return payload;
}

/**
 * Builds a clean payload matching the backend `EmployeeUpdate` Pydantic model.
 */
function buildEmployeeUpdatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload: Record<string, any> = {};

  const firstName = (b.first_name || b.firstName || (b.name ? b.name.split(" ")[0] : undefined))?.trim();
  const lastName = (b.last_name || b.lastName || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined))?.trim();
  if (firstName) payload.first_name = firstName;
  if (lastName) payload.last_name = lastName;

  const personalEmail = (b.personal_email || b.personalEmail || b.email)?.trim();
  if (personalEmail) payload.personal_email = personalEmail;

  const companyEmail = (b.company_email || b.companyWorkEmail || b.work_email)?.trim();
  if (companyEmail) payload.company_email = companyEmail;

  const phone = (b.phone || b.phone_number || b.phoneNumber)?.trim();
  if (phone) payload.phone = phone;

  const alternatePhone = (b.alternate_phone || b.alternatePhone)?.trim();
  if (alternatePhone) payload.alternate_phone = alternatePhone;

  if (b.department || b.department_name) payload.department = (b.department || b.department_name).trim();
  if (b.designation) payload.designation = b.designation.trim();
  if (b.role || b.systemRole || b.system_role || b.backendRole) {
    payload.role = normalizeRole(b.role || b.systemRole || b.system_role || b.backendRole);
  }

  const rawJoiningDate = b.joining_date || b.joiningDate || b.joinedAt;
  if (rawJoiningDate) payload.joining_date = String(rawJoiningDate).split("T")[0];

  if (b.gender) payload.gender = String(b.gender).trim();
  const rawDob = b.date_of_birth || b.dob;
  if (rawDob) payload.date_of_birth = String(rawDob).split("T")[0];
  if (b.blood_group || b.bloodGroup) payload.blood_group = (b.blood_group || b.bloodGroup).trim();
  if (b.marital_status || b.maritalStatus) payload.marital_status = (b.marital_status || b.maritalStatus).trim();
  if (b.team) payload.team = String(b.team).trim();
  if (b.branch || b.branchOffice) payload.branch = (b.branch || b.branchOffice).trim();
  if (b.work_location || b.workLocation) payload.work_location = (b.work_location || b.workLocation).trim();
  if (b.employment_type || b.employmentType) payload.employment_type = (b.employment_type || b.employmentType).trim();
  if (b.shift) payload.shift = String(b.shift).trim();
  if (typeof b.employee_capacity === "number") payload.employee_capacity = b.employee_capacity;
  if (b.cost_center_id || b.costCenterId) payload.cost_center_id = (b.cost_center_id || b.costCenterId).trim();
  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  else if (b.salary !== undefined && b.salary !== null) payload.ctc = Number(b.salary);
  if (b.basic_salary !== undefined && b.basic_salary !== null) payload.basic_salary = Number(b.basic_salary);
  if (b.hra !== undefined && b.hra !== null) payload.hra = Number(b.hra);
  if (b.bonus !== undefined && b.bonus !== null) payload.bonus = Number(b.bonus);
  if (b.pf !== undefined && b.pf !== null) payload.pf = Number(b.pf);
  if (b.esi !== undefined && b.esi !== null) payload.esi = Number(b.esi);
  if (b.professional_tax !== undefined && b.professional_tax !== null) payload.professional_tax = Number(b.professional_tax);
  if (b.leave_group || b.leaveGroup) payload.leave_group = (b.leave_group || b.leaveGroup).trim();

  return payload;
}

export function normalizeEmployee(raw: any): Employee {
  if (!raw || typeof raw !== "object") {
    return {
      id: String(Math.random()),
      name: "Employee",
      email: "",
      role: "employee",
      department: "General",
      systemRole: "employee",
      status: "Active",
      joinedAt: new Date().toISOString().split("T")[0],
      salary: 0,
    };
  }

  const rawId = raw.id || raw._id || raw.employee_id || raw.user_id || "";
  const id = typeof rawId === "string" ? rawId : String(rawId || Math.random());

  const firstName = (raw.first_name || raw.firstName || raw.user?.first_name || "").trim();
  const lastName = (raw.last_name || raw.lastName || raw.user?.last_name || "").trim();
  const rawCombinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const name =
    (raw.name ||
    raw.full_name ||
    raw.fullName ||
    raw.user?.name ||
    raw.user?.full_name ||
    rawCombinedName ||
    (raw.email ? raw.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "") ||
    "Employee").trim();

  const email = (
    raw.email ||
    raw.work_email ||
    raw.company_email ||
    raw.personal_email ||
    raw.companyWorkEmail ||
    raw.personalEmail ||
    raw.user?.email ||
    raw.user?.work_email ||
    ""
  ).trim();

  const department = (
    raw.department ||
    raw.department_name ||
    raw.dept ||
    (typeof raw.department === "object" && raw.department?.name) ||
    "General"
  ).trim();

  const designation = (
    raw.designation ||
    raw.job_title ||
    raw.position ||
    "Employee"
  ).trim();

  const rawRole = raw.role || raw.systemRole || raw.system_role || raw.backendRole;
  const role = normalizeRole(rawRole);
  const systemRole = role;

  const rawStatus = raw.status || raw.employment_status || raw.user_status || "Active";
  const status = typeof rawStatus === "string" ? rawStatus : "Active";

  const rawSalary = raw.salary ?? raw.ctc ?? raw.basic_salary ?? raw.basicSalary ?? 0;
  const salary = typeof rawSalary === "number" ? rawSalary : Number(rawSalary) || 0;

  const rawDate = raw.joinedAt || raw.joining_date || raw.joiningDate || raw.created_at || raw.createdAt;
  const joinedAt = rawDate ? String(rawDate).split("T")[0] : new Date().toISOString().split("T")[0];

  const phone = (raw.phone || raw.phone_number || raw.phoneNumber || "").trim();
  const avatar = (raw.avatar || raw.photoUrl || raw.profile_photo_url || raw.profile_image || "").trim();

  return {
    ...raw,
    id,
    name,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email,
    department,
    designation,
    role,
    backendRole: role,
    portalRole: role,
    systemRole,
    status,
    salary,
    joinedAt,
    phone: phone || undefined,
    avatar: avatar || undefined,
    ctc: salary,
  };
}

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], GetEmployeesQueryArg>({
      query: (params) => {
        const p = params as GetEmployeesQueryParams | undefined;
        const queryParams = new URLSearchParams();
        if (p?.department && p.department !== "ALL") {
          queryParams.append("department", p.department);
        }
        if (p?.status && p.status !== "ALL") {
          queryParams.append("status", p.status);
        }
        if (p?.search) {
          queryParams.append("search", p.search);
        }
        const queryString = queryParams.toString();
        return `/api/v1/employees${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (raw: any): Employee[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        let list: any[] = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) list = payload.items;
          else if (Array.isArray(payload.employees)) list = payload.employees;
          else if (Array.isArray(payload.data)) list = payload.data;
          else if (Array.isArray(payload.results)) list = payload.results;
        }
        return list.map(normalizeEmployee);
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),

    getEmployeeById: builder.query<Employee, string>({
      query: (id) => `/api/v1/employees/${id}`,
      transformResponse: (raw: any): Employee => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeEmployee(payload);
      },
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),

    createEmployee: builder.mutation<Employee, Omit<Employee, "id"> | Partial<Employee>>({
      query: (body) => {
        const payload = buildEmployeeCreatePayload(body);
        console.log("[createEmployee] Outgoing HTTP POST /api/v1/employees Body:", payload);
        return {
          url: "/api/v1/employees",
          method: "POST",
          body: payload,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log("[createEmployee] Mutation started with input arg:", arg);
        try {
          const result = await queryFulfilled;
          console.log("[createEmployee] Employee created successfully:", result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error("[createEmployee] FULL RAW ERROR DATA:", errorData);
          if (errorData?.detail) {
            console.error("[createEmployee] FastAPI/Pydantic validation details:", errorData.detail);
          }
        }
      },
      transformResponse: (raw: any): Employee => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeEmployee(payload);
      },
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    updateEmployee: builder.mutation<Employee, { id: string; changes: Partial<Employee> }>({
      query: ({ id, changes }) => {
        const payload = buildEmployeeUpdatePayload(changes);
        console.log(`[updateEmployee] Outgoing HTTP PATCH /api/v1/employees/${id} Body:`, payload);
        return {
          url: `/api/v1/employees/${id}`,
          method: "PATCH",
          body: payload,
        };
      },
      onQueryStarted: async ({ id, changes }, { queryFulfilled }) => {
        console.log(`[updateEmployee] Mutation started for ${id}:`, changes);
        try {
          const result = await queryFulfilled;
          console.log(`[updateEmployee] Success response for ${id}:`, result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error(`[updateEmployee] Error for ${id} - Full Raw Error Data:`, errorData);
          if (errorData?.detail) {
            console.error(`[updateEmployee] FastAPI/Pydantic validation details for ${id}:`, errorData.detail);
          }
        }
      },
      transformResponse: (raw: any): Employee => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeEmployee(payload);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "Timeline",
      ],
    }),

    updateEmployeeFull: builder.mutation<Employee, { id: string; employee: Omit<Employee, "id"> }>({
      query: ({ id, employee }) => ({
        url: `/api/v1/employees/${id}`,
        method: "PUT",
        body: employee,
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
        "Timeline",
      ],
    }),

    deleteEmployee: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; id: string }> | { success: boolean; id: string }, _meta, arg) =>
        (raw as RawEnvelope<{ success: boolean; id: string }>)?.data || (raw as { success: boolean; id: string }) || { success: true, id: arg },
      invalidatesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    getEmployeeStats: builder.query<EmployeeStats, void>({
      query: () => "/api/v1/employees/stats",
      transformResponse: (raw: RawEnvelope<EmployeeStats> | EmployeeStats) =>
        (raw as RawEnvelope<EmployeeStats>)?.data || (raw as EmployeeStats),
      providesTags: [{ type: "Employee", id: "STATS" }],
    }),

    getEmployeeDashboard: builder.query<EmployeeDashboardData, void>({
      query: () => "/api/v1/employees/dashboard",
      transformResponse: (raw: RawEnvelope<EmployeeDashboardData> | EmployeeDashboardData) =>
        (raw as RawEnvelope<EmployeeDashboardData>)?.data || (raw as EmployeeDashboardData),
      providesTags: [{ type: "Employee", id: "DASHBOARD" }],
    }),

    importEmployees: builder.mutation<ImportResult, FormData>({
      query: (formData) => ({
        url: "/api/v1/employees/import",
        method: "POST",
        body: formData,
      }),
      transformResponse: (raw: RawEnvelope<ImportResult> | ImportResult) =>
        (raw as RawEnvelope<ImportResult>)?.data || (raw as ImportResult),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),

    exportEmployees: builder.query<Blob, { format: "xlsx" | "csv" | "pdf" }>({
      query: ({ format }) => ({
        url: `/api/v1/employees/export?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    sendInvitation: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/send-invitation`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    sendInvite: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/send-invite`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    deactivateEmployee: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/deactivate`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    activateEmployeeByAdmin: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/activate-by-admin`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    activateEmployee: builder.mutation<
      ActivateEmployeeResponse,
      ActivateEmployeePayload
    >({
      query: ({ id, employee_id, token, new_password, confirm_password }) => {
        const empId = id || employee_id;
        if (!empId || empId === "me") {
          throw new Error("Employee UUID is required for password activation.");
        }
        return {
          url: `/api/v1/employees/${empId}/activate`,
          method: "POST",
          body: {
            token,
            new_password,
            confirm_password,
          },
        };
      },
      transformResponse: (raw: RawEnvelope<ActivateEmployeeResponse> | ActivateEmployeeResponse) =>
        (raw as RawEnvelope<ActivateEmployeeResponse>)?.data || (raw as ActivateEmployeeResponse),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Employee", id: arg.id || arg.employee_id },
        { type: "Employee", id: "LIST" },
      ],
    }),

    approveOnboarding: builder.mutation<Employee, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    rejectOnboarding: builder.mutation<Employee, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/api/v1/employees/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      transformResponse: (raw: RawEnvelope<Employee> | Employee) =>
        (raw as RawEnvelope<Employee>)?.data || (raw as Employee),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }],
    }),

    resetEmployeePassword: builder.mutation<{ temporaryPassword?: string }, string>({
      query: (id) => ({
        url: `/api/v1/employees/${id}/reset-password`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ temporaryPassword?: string }> | { temporaryPassword?: string }) =>
        (raw as RawEnvelope<{ temporaryPassword?: string }>)?.data || (raw as { temporaryPassword?: string }),
    }),

    getOnboardingStatus: builder.query<OnboardingStatus, string>({
      query: (id) => `/api/v1/employees/${id}/onboarding-status`,
      transformResponse: (raw: RawEnvelope<OnboardingStatus> | OnboardingStatus) =>
        (raw as RawEnvelope<OnboardingStatus>)?.data || (raw as OnboardingStatus),
      providesTags: (_r, _e, id) => [{ type: "Employee", id: `ONBOARDING-${id}` }],
    }),

    validateEmployeeInvitation: builder.query<{
      valid?: boolean;
      employee_id?: string;
      employeeId?: string;
      id?: string;
      email?: string;
      name?: string;
      full_name?: string;
      company_name?: string;
      [key: string]: any;
    }, string>({
      query: (token) => ({
        url: "/api/v1/onboarding/validate",
        params: { token },
      }),
      transformResponse: (raw: any) => raw?.data || raw,
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeFullMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeStatsQuery,
  useGetEmployeeDashboardQuery,
  useImportEmployeesMutation,
  useExportEmployeesQuery,
  useLazyExportEmployeesQuery,
  useSendInvitationMutation,
  useSendInviteMutation,
  useDeactivateEmployeeMutation,
  useActivateEmployeeByAdminMutation,
  useActivateEmployeeMutation,
  useApproveOnboardingMutation,
  useRejectOnboardingMutation,
  useResetEmployeePasswordMutation,
  useGetOnboardingStatusQuery,
  useValidateEmployeeInvitationQuery,
  useLazyValidateEmployeeInvitationQuery,
} = employeeApi;
 