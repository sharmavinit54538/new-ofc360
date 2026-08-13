import { baseApi } from "./baseApi";
import { Manager, ManagerPermissions } from "@/types/hr";
import { normalizeRole } from "@/features/auth/authTypes";
import { RawEnvelope } from "./envelope";

export interface GetManagersQueryParams {
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export type GetManagersQueryArg = GetManagersQueryParams | void;

export interface SendManagerInvitePayload {
  managerId?: string;
  email?: string;
}

export interface ActivateManagerPayload {
  id: string;
  token?: string;
  password?: string;
  [key: string]: unknown;
}

export interface ActivateManagerOnboardingPayload {
  token: string;
  password?: string;
  full_name?: string;
  [key: string]: unknown;
}

export interface ValidateOnboardingTokenResponse {
  valid: boolean;
  email?: string;
  managerId?: string;
  [key: string]: unknown;
}

export interface ResetPasswordResponse {
  temporaryPassword?: string;
  message?: string;
}

/**
 * Builds a clean payload matching the backend manager creation expectations.
 * Mirrors employeeApi.ts by sending both camelCase and snake_case keys.
 */
export function buildManagerCreatePayload(input: any): Record<string, any> {
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

  const fullName = (
    b.full_name ||
    b.fullName ||
    b.name ||
    `${firstName} ${lastName}`.replace(/\s+\.$/, "").trim()
  ).trim();

  const personalEmail = (
    b.personal_email ||
    b.personalEmail ||
    b.email ||
    ""
  ).trim();

  const companyEmail = (
    b.company_email ||
    b.companyWorkEmail ||
    b.work_email ||
    b.email ||
    personalEmail ||
    ""
  ).trim();

  const email = companyEmail || personalEmail;

  const phone = (
    b.phone ||
    b.phone_number ||
    b.phoneNumber ||
    ""
  ).trim();

  const department = (b.department || b.department_name || "General").trim();
  const designation = (b.designation || b.role || "Manager").trim();
  const rawDate = b.joining_date || b.joiningDate || b.joinedAt;
  const joiningDate = rawDate
    ? String(rawDate).split("T")[0]
    : new Date().toISOString().split("T")[0];

  const employmentType = (b.employment_type || b.employmentType || "FULL_TIME").trim();
  const systemRole = (b.systemRole || b.system_role || b.role || "manager").toLowerCase().trim();
  const status = (b.status || "Active").trim();

  const ctc = b.ctc !== undefined && b.ctc !== null ? Number(b.ctc) : (b.salary !== undefined && b.salary !== null ? Number(b.salary) : undefined);

  const payload: Record<string, any> = {
    // Name variants
    firstName,
    first_name: firstName,
    lastName,
    last_name: lastName,
    name: fullName,
    fullName,
    full_name: fullName,

    // Email variants
    email,
    work_email: companyEmail || email,
    personal_email: personalEmail || email,
    company_email: companyEmail || email,
    personalEmail,
    companyWorkEmail: companyEmail,

    // Phone variants
    phone,
    phone_number: phone,
    phoneNumber: phone,

    // Role & Department variants
    designation,
    role: designation,
    department,
    department_name: department,
    systemRole,
    system_role: systemRole,

    // Other core fields
    joining_date: joiningDate,
    joiningDate,
    joinedAt: joiningDate,
    employment_type: employmentType,
    employmentType,
    status,
  };

  if (ctc !== undefined) {
    payload.ctc = ctc;
    payload.salary = ctc;
  }
  if (b.basicSalary !== undefined || b.basic_salary !== undefined) {
    const basic = Number(b.basic_salary ?? b.basicSalary);
    payload.basic_salary = basic;
    payload.basicSalary = basic;
  }
  if (b.hra !== undefined) payload.hra = Number(b.hra);
  if (b.bonus !== undefined) payload.bonus = Number(b.bonus);
  if (b.pfDeduction !== undefined || b.pf !== undefined) {
    const pf = Number(b.pf ?? b.pfDeduction);
    payload.pf = pf;
    payload.pfDeduction = pf;
  }
  if (b.esiDeduction !== undefined || b.esi !== undefined) {
    const esi = Number(b.esi ?? b.esiDeduction);
    payload.esi = esi;
    payload.esiDeduction = esi;
  }
  if (b.profTax !== undefined || b.professional_tax !== undefined) {
    const pt = Number(b.professional_tax ?? b.profTax);
    payload.professional_tax = pt;
    payload.profTax = pt;
  }

  const employeeId = (b.employee_id || b.employeeCode || (typeof b.id === "string" && !b.id.startsWith("emp_") && !b.id.startsWith("temp-") ? b.id : null) || "").trim();
  if (employeeId) {
    payload.employee_id = employeeId;
    payload.employeeCode = employeeId;
  }

  const alternatePhone = (b.alternate_phone || b.alternatePhone || "").trim();
  if (alternatePhone) {
    payload.alternate_phone = alternatePhone;
    payload.alternatePhone = alternatePhone;
  }

  if (b.gender) payload.gender = String(b.gender).trim();
  const rawDob = b.date_of_birth || b.dob;
  if (rawDob) {
    const dobFormatted = String(rawDob).split("T")[0];
    payload.date_of_birth = dobFormatted;
    payload.dob = dobFormatted;
  }
  if (b.blood_group || b.bloodGroup) {
    const bg = (b.blood_group || b.bloodGroup).trim();
    payload.blood_group = bg;
    payload.bloodGroup = bg;
  }
  if (b.marital_status || b.maritalStatus) {
    const ms = (b.marital_status || b.maritalStatus).trim();
    payload.marital_status = ms;
    payload.maritalStatus = ms;
  }
  if (b.profile_photo_url || b.photoUrl || b.avatar) {
    const photo = (b.profile_photo_url || b.photoUrl || b.avatar).trim();
    payload.profile_photo_url = photo;
    payload.photoUrl = photo;
    payload.avatar = photo;
  }
  if (b.team) payload.team = String(b.team).trim();
  if (b.branch || b.branchOffice) {
    const branch = (b.branch || b.branchOffice).trim();
    payload.branch = branch;
    payload.branchOffice = branch;
  }
  if (b.work_location || b.workLocation) {
    const wl = (b.work_location || b.workLocation).trim();
    payload.work_location = wl;
    payload.workLocation = wl;
  }
  if (typeof b.probation_period_months === "number" || typeof b.probationPeriod === "number") {
    const prob = b.probation_period_months ?? b.probationPeriod;
    payload.probation_period_months = prob;
    payload.probationPeriod = prob;
  }
  if (b.shift) payload.shift = String(b.shift).trim();
  if (typeof b.employee_capacity === "number" || typeof b.capacity === "number") {
    const cap = b.employee_capacity ?? b.capacity;
    payload.employee_capacity = cap;
    payload.capacity = cap;
  }
  if (b.cost_center_id || b.costCenterId) {
    const cc = (b.cost_center_id || b.costCenterId).trim();
    payload.cost_center_id = cc;
    payload.costCenterId = cc;
  }
  if (b.leave_group || b.leaveGroup) {
    const lg = (b.leave_group || b.leaveGroup).trim();
    payload.leave_group = lg;
    payload.leaveGroup = lg;
  }

  // Sub-arrays matching employee schema
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
        designation: String(x.designation || x.role || "Manager").trim(),
        employment_type: (x.employment_type || x.employmentType || "").trim() || null,
        start_date: x.start_date || x.startDate ? String(x.start_date || x.startDate).split("T")[0] : new Date().toISOString().split("T")[0],
        end_date: x.end_date || x.endDate ? String(x.end_date || x.endDate).split("T")[0] : null,
        is_current: Boolean(x.is_current ?? x.isCurrent ?? false),
        description: (x.description || "").trim() || null,
      }))
      .filter((x: any) => x.company_name);
    if (validExp.length > 0) payload.experience = validExp;
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
 * Builds a clean payload for manager update operations.
 * Sends both camelCase and snake_case keys.
 */
export function buildManagerUpdatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload: Record<string, any> = {};

  const firstName = (b.first_name || b.firstName || (b.name ? b.name.split(" ")[0] : undefined))?.trim();
  const lastName = (b.last_name || b.lastName || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined))?.trim();
  if (firstName !== undefined) {
    payload.firstName = firstName;
    payload.first_name = firstName;
  }
  if (lastName !== undefined) {
    payload.lastName = lastName;
    payload.last_name = lastName;
  }
  const fullName = (b.full_name || b.fullName || b.name || (firstName && lastName ? `${firstName} ${lastName}` : firstName))?.trim();
  if (fullName !== undefined) {
    payload.name = fullName;
    payload.fullName = fullName;
    payload.full_name = fullName;
  }

  const personalEmail = (b.personal_email || b.personalEmail || b.email)?.trim();
  const companyEmail = (b.company_email || b.companyWorkEmail || b.work_email)?.trim();
  const email = companyEmail || personalEmail || (b.email ? String(b.email).trim() : undefined);
  if (email !== undefined) {
    payload.email = email;
    payload.work_email = companyEmail || email;
    payload.personal_email = personalEmail || email;
    payload.company_email = companyEmail || email;
    if (personalEmail) payload.personalEmail = personalEmail;
    if (companyEmail) payload.companyWorkEmail = companyEmail;
  }

  const phone = (b.phone || b.phone_number || b.phoneNumber)?.trim();
  if (phone !== undefined) {
    payload.phone = phone;
    payload.phone_number = phone;
    payload.phoneNumber = phone;
  }

  const alternatePhone = (b.alternate_phone || b.alternatePhone)?.trim();
  if (alternatePhone !== undefined) {
    payload.alternate_phone = alternatePhone;
    payload.alternatePhone = alternatePhone;
  }

  const department = (b.department || b.department_name)?.trim();
  if (department !== undefined) {
    payload.department = department;
    payload.department_name = department;
  }

  if (b.designation) {
    payload.designation = String(b.designation).trim();
  }

  if (b.role || b.systemRole || b.system_role) {
    const roleVal = normalizeRole(b.role || b.systemRole || b.system_role);
    payload.role = roleVal;
    payload.systemRole = roleVal;
    payload.system_role = roleVal;
  }

  const rawJoiningDate = b.joining_date || b.joiningDate || b.joinedAt;
  if (rawJoiningDate !== undefined) {
    const jDate = String(rawJoiningDate).split("T")[0];
    payload.joining_date = jDate;
    payload.joiningDate = jDate;
    payload.joinedAt = jDate;
  }

  const employmentType = (b.employment_type || b.employmentType)?.trim();
  if (employmentType !== undefined) {
    payload.employment_type = employmentType;
    payload.employmentType = employmentType;
  }

  const status = b.status?.trim();
  if (status !== undefined) {
    payload.status = status;
  }

  if (b.gender) payload.gender = String(b.gender).trim();
  const rawDob = b.date_of_birth || b.dob;
  if (rawDob) {
    const dobFormatted = String(rawDob).split("T")[0];
    payload.date_of_birth = dobFormatted;
    payload.dob = dobFormatted;
  }
  if (b.blood_group || b.bloodGroup) {
    const bg = (b.blood_group || b.bloodGroup).trim();
    payload.blood_group = bg;
    payload.bloodGroup = bg;
  }
  if (b.marital_status || b.maritalStatus) {
    const ms = (b.marital_status || b.maritalStatus).trim();
    payload.marital_status = ms;
    payload.maritalStatus = ms;
  }
  if (b.profile_photo_url || b.photoUrl || b.avatar) {
    const photo = (b.profile_photo_url || b.photoUrl || b.avatar).trim();
    payload.profile_photo_url = photo;
    payload.photoUrl = photo;
    payload.avatar = photo;
  }
  if (b.team) payload.team = String(b.team).trim();
  if (b.branch || b.branchOffice) {
    const branch = (b.branch || b.branchOffice).trim();
    payload.branch = branch;
    payload.branchOffice = branch;
  }
  if (b.work_location || b.workLocation) {
    const wl = (b.work_location || b.workLocation).trim();
    payload.work_location = wl;
    payload.workLocation = wl;
  }
  if (b.shift) payload.shift = String(b.shift).trim();
  if (typeof b.employee_capacity === "number" || typeof b.capacity === "number") {
    const cap = b.employee_capacity ?? b.capacity;
    payload.employee_capacity = cap;
    payload.capacity = cap;
  }
  if (b.cost_center_id || b.costCenterId) {
    const cc = (b.cost_center_id || b.costCenterId).trim();
    payload.cost_center_id = cc;
    payload.costCenterId = cc;
  }
  if (b.ctc !== undefined && b.ctc !== null) {
    payload.ctc = Number(b.ctc);
    payload.salary = Number(b.ctc);
  } else if (b.salary !== undefined && b.salary !== null) {
    payload.ctc = Number(b.salary);
    payload.salary = Number(b.salary);
  }
  if (b.basic_salary !== undefined && b.basic_salary !== null) {
    payload.basic_salary = Number(b.basic_salary);
    payload.basicSalary = Number(b.basic_salary);
  } else if (b.basicSalary !== undefined && b.basicSalary !== null) {
    payload.basic_salary = Number(b.basicSalary);
    payload.basicSalary = Number(b.basicSalary);
  }
  if (b.hra !== undefined && b.hra !== null) payload.hra = Number(b.hra);
  if (b.bonus !== undefined && b.bonus !== null) payload.bonus = Number(b.bonus);
  if (b.pf !== undefined && b.pf !== null) {
    payload.pf = Number(b.pf);
    payload.pfDeduction = Number(b.pf);
  } else if (b.pfDeduction !== undefined && b.pfDeduction !== null) {
    payload.pf = Number(b.pfDeduction);
    payload.pfDeduction = Number(b.pfDeduction);
  }
  if (b.esi !== undefined && b.esi !== null) {
    payload.esi = Number(b.esi);
    payload.esiDeduction = Number(b.esi);
  } else if (b.esiDeduction !== undefined && b.esiDeduction !== null) {
    payload.esi = Number(b.esiDeduction);
    payload.esiDeduction = Number(b.esiDeduction);
  }
  if (b.professional_tax !== undefined && b.professional_tax !== null) {
    payload.professional_tax = Number(b.professional_tax);
    payload.profTax = Number(b.professional_tax);
  } else if (b.profTax !== undefined && b.profTax !== null) {
    payload.professional_tax = Number(b.profTax);
    payload.profTax = Number(b.profTax);
  }
  if (b.leave_group || b.leaveGroup) {
    const lg = (b.leave_group || b.leaveGroup).trim();
    payload.leave_group = lg;
    payload.leaveGroup = lg;
  }

  return payload;
}

export function normalizeManager(raw: any): Manager {
  if (!raw || typeof raw !== "object") {
    return {
      id: String(Math.random()),
      name: "Manager",
      email: "",
      role: "Manager",
      department: "General",
      systemRole: "manager",
      status: "Active",
      joinedAt: new Date().toISOString().split("T")[0],
      salary: 0,
    };
  }

  const rawId = raw.id || raw._id || raw.manager_id || raw.employee_id || raw.user_id || "";
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
    "Manager").trim();

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

  const role = (
    raw.designation ||
    raw.role ||
    raw.job_title ||
    raw.position ||
    "Manager"
  ).trim();

  const systemRole = normalizeRole(raw.systemRole || raw.system_role || raw.role || "manager");

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
    role,
    systemRole,
    status,
    salary,
    joinedAt,
    phone: phone || undefined,
    avatar: avatar || undefined,
    ctc: salary,
  };
}

export const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagers: builder.query<Manager[], GetManagersQueryArg>({
      query: (params) => {
        const p = params as GetManagersQueryParams | undefined;
        const qp = new URLSearchParams();
        if (p?.department && p.department !== "ALL") qp.append("department", p.department);
        if (p?.status && p.status !== "ALL") qp.append("status", p.status);
        if (p?.search) qp.append("search", p.search);
        if (p?.page) qp.append("page", String(p.page));
        if (p?.limit) qp.append("limit", String(p.limit));
        const qs = qp.toString();
        return `/api/v1/managers${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (raw: any): Manager[] => {
        if (!raw) return [];
        const payload = raw.data !== undefined ? raw.data : raw;
        let list: any[] = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else if (payload && typeof payload === "object") {
          if (Array.isArray(payload.items)) list = payload.items;
          else if (Array.isArray(payload.managers)) list = payload.managers;
          else if (Array.isArray(payload.data)) list = payload.data;
          else if (Array.isArray(payload.results)) list = payload.results;
        }
        return list.map(normalizeManager);
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Manager" as const, id })),
              { type: "Manager", id: "LIST" },
            ]
          : [{ type: "Manager", id: "LIST" }],
    }),

    getManagerById: builder.query<Manager, string>({
      query: (id) => `/api/v1/managers/${id}`,
      transformResponse: (raw: any): Manager => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeManager(payload);
      },
      providesTags: (_result, _error, id) => [{ type: "Manager", id }],
    }),

    createManager: builder.mutation<Manager, Omit<Manager, "id"> | Partial<Manager>>({
      query: (body) => {
        const payload = buildManagerCreatePayload(body);
        console.log("[createManager] Outgoing HTTP POST /api/v1/managers Body:", payload);
        return {
          url: "/api/v1/managers",
          method: "POST",
          body: payload,
        };
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log("[createManager] Mutation started with input arg:", arg);
        try {
          const result = await queryFulfilled;
          console.log("[createManager] Manager created successfully:", result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error("[createManager] FULL RAW ERROR DATA:", errorData);
          if (errorData?.detail) {
            console.error("[createManager] FastAPI/Pydantic validation details:", errorData.detail);
          }
        }
      },
      transformResponse: (raw: any): Manager => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeManager(payload);
      },
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),

    updateManager: builder.mutation<Manager, { id: string; manager: Partial<Manager> }>({
      query: ({ id, manager }) => {
        const payload = buildManagerUpdatePayload(manager);
        console.log(`[updateManager] Outgoing HTTP PUT /api/v1/managers/${id} Body:`, payload);
        return {
          url: `/api/v1/managers/${id}`,
          method: "PUT",
          body: payload,
        };
      },
      onQueryStarted: async ({ id, manager }, { queryFulfilled }) => {
        console.log(`[updateManager] Mutation started for ${id}:`, manager);
        try {
          const result = await queryFulfilled;
          console.log(`[updateManager] Success response for ${id}:`, result.data);
        } catch (error: any) {
          const errorData = error?.error?.data || error?.data || error?.error || error;
          console.error(`[updateManager] Error for ${id} - Full Raw Error Data:`, errorData);
          if (errorData?.detail) {
            console.error(`[updateManager] FastAPI/Pydantic validation details for ${id}:`, errorData.detail);
          }
        }
      },
      transformResponse: (raw: any): Manager => {
        const payload = raw?.data !== undefined ? raw.data : raw;
        return normalizeManager(payload);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    deleteManager: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}`,
        method: "DELETE",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; id: string }> | { success: boolean; id: string }, _meta, arg) =>
        (raw as RawEnvelope<{ success: boolean; id: string }>)?.data || (raw as { success: boolean; id: string }) || { success: true, id: arg },
      invalidatesTags: (_result, _error, id) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    updateManagerPermissions: builder.mutation<Manager, { id: string; permissions: ManagerPermissions | Record<string, unknown> }>({
      query: ({ id, permissions }) => ({
        url: `/api/v1/managers/${id}/permissions`,
        method: "PATCH",
        body: permissions,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Manager", id }],
    }),

    getMyManagerProfile: builder.query<Manager, void>({
      query: () => "/api/v1/managers/profile",
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      providesTags: [{ type: "Manager", id: "ME" }],
    }),

    sendManagerInvite: builder.mutation<{ success: boolean; message?: string }, SendManagerInvitePayload>({
      query: (body) => ({
        url: "/api/v1/managers/send-invite",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    sendManagerInvitationById: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/send-invitation`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<{ success: boolean; message?: string }> | { success: boolean; message?: string }) =>
        (raw as RawEnvelope<{ success: boolean; message?: string }>)?.data || (raw as { success: boolean; message?: string }) || { success: true },
    }),

    activateManager: builder.mutation<Manager, ActivateManagerPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/managers/${id}/activate`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    activateManagerByAdmin: builder.mutation<Manager, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/activate-by-admin`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, id) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    deactivateManager: builder.mutation<Manager, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/deactivate`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: (_result, _error, id) => [
        { type: "Manager", id },
        { type: "Manager", id: "LIST" },
      ],
    }),

    resetManagerPassword: builder.mutation<ResetPasswordResponse, string>({
      query: (id) => ({
        url: `/api/v1/managers/${id}/reset-password`,
        method: "POST",
      }),
      transformResponse: (raw: RawEnvelope<ResetPasswordResponse> | ResetPasswordResponse) =>
        (raw as RawEnvelope<ResetPasswordResponse>)?.data || (raw as ResetPasswordResponse),
    }),

    validateManagerOnboardingToken: builder.query<ValidateOnboardingTokenResponse, string>({
      query: (token) => `/api/v1/managers/onboarding/validate?token=${encodeURIComponent(token)}`,
      transformResponse: (raw: RawEnvelope<ValidateOnboardingTokenResponse> | ValidateOnboardingTokenResponse) =>
        (raw as RawEnvelope<ValidateOnboardingTokenResponse>)?.data || (raw as ValidateOnboardingTokenResponse),
    }),

    activateManagerOnboarding: builder.mutation<Manager, ActivateManagerOnboardingPayload>({
      query: (body) => ({
        url: "/api/v1/managers/onboarding/activate",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),

    completeManagerOnboarding: builder.mutation<Manager, Record<string, unknown> | void>({
      query: (body) => ({
        url: "/api/v1/managers/onboarding/complete",
        method: "POST",
        body: body || {},
      }),
      transformResponse: (raw: RawEnvelope<Manager> | Manager) =>
        (raw as RawEnvelope<Manager>)?.data || (raw as Manager),
      invalidatesTags: [{ type: "Manager", id: "LIST" }],
    }),
  }),
});

export const {
  useGetManagersQuery,
  useLazyGetManagersQuery,
  useGetManagerByIdQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useUpdateManagerPermissionsMutation,
  useGetMyManagerProfileQuery,
  useSendManagerInviteMutation,
  useSendManagerInvitationByIdMutation,
  useActivateManagerMutation,
  useActivateManagerByAdminMutation,
  useDeactivateManagerMutation,
  useResetManagerPasswordMutation,
  useValidateManagerOnboardingTokenQuery,
  useLazyValidateManagerOnboardingTokenQuery,
  useActivateManagerOnboardingMutation,
  useCompleteManagerOnboardingMutation,
} = managerApi;
