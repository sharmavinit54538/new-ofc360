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

const VALID_SYSTEM_ROLES = new Set(["super_admin", "hr_admin", "manager", "employee", "executive", "it_admin"]);

export function normalizeGender(g?: any): string | undefined {
  if (!g) return undefined;
  const str = String(g).trim().toUpperCase();
  if (str === "MALE" || str === "M") return "MALE";
  if (str === "FEMALE" || str === "F") return "FEMALE";
  if (str === "OTHER" || str === "O") return "OTHER";
  return undefined;
}

export function normalizeMaritalStatus(m?: any): string | undefined {
  if (!m) return undefined;
  const str = String(m).trim().toUpperCase();
  if (str === "SINGLE") return "SINGLE";
  if (str === "MARRIED") return "MARRIED";
  if (str === "DIVORCED") return "DIVORCED";
  if (str === "WIDOWED") return "WIDOWED";
  return undefined;
}

export function normalizeEmploymentStatus(s?: any): string {
  if (!s) return "ACTIVE";
  const str = String(s).trim().toUpperCase();
  if (str === "ACTIVE" || str === "ACT") return "ACTIVE";
  if (str === "INACTIVE" || str === "DEACTIVATED" || str === "DISABLED") return "INACTIVE";
  if (str === "PROBATION" || str === "PROB") return "PROBATION";
  if (str === "CONFIRMED" || str === "PERMANENT") return "CONFIRMED";
  if (str === "NOTICE" || str === "NOTICE_PERIOD" || str === "NOTICE PERIOD") return "NOTICE_PERIOD";
  if (str === "INVITED" || str === "INVITATION_SENT") return "INVITED";
  return str;
}

/**
 * Builds a clean snake_case payload matching backend `ManagerCreate` schema.
 * Strictly separates job designation from authorization role and avoids redundant duplicate keys.
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
    ""
  ).trim();

  const phone = (
    b.phone ||
    b.phone_number ||
    b.phoneNumber ||
    ""
  ).trim();

  const department = (b.department || b.department_name || "General").trim();

  // Distinct job title vs authorization role
  let designation = (b.designation || "").trim();
  if (!designation) {
    if (b.role && !VALID_SYSTEM_ROLES.has(String(b.role).toLowerCase().trim())) {
      designation = String(b.role).trim();
    } else {
      designation = "Manager";
    }
  }

  let role = "manager";
  if (b.systemRole || b.system_role) {
    role = normalizeRole(b.systemRole || b.system_role);
  } else if (b.role && VALID_SYSTEM_ROLES.has(String(b.role).toLowerCase().trim())) {
    role = normalizeRole(b.role);
  }

  const rawDate = b.joining_date || b.joiningDate || b.joinedAt;
  const joiningDate = rawDate
    ? String(rawDate).split("T")[0]
    : new Date().toISOString().split("T")[0];

  const employmentType = (b.employment_type || b.employmentType || "FULL_TIME").trim().toUpperCase();
  const employmentStatus = normalizeEmploymentStatus(b.employment_status || b.status);

  const payload: Record<string, any> = {
    first_name: firstName,
    last_name: lastName,
    personal_email: personalEmail,
    phone,
    department,
    designation,
    joining_date: joiningDate,
    employment_type: employmentType,
    employment_status: employmentStatus,
    role,
  };

  if (companyEmail) {
    payload.company_email = companyEmail;
  }

  const managerId = (b.manager_id || b.managerId || b.employee_id || b.employeeCode || (typeof b.id === "string" && !b.id.startsWith("emp_") && !b.id.startsWith("temp-") && !b.id.startsWith("mgr_") ? b.id : null) || "").trim();
  if (managerId) {
    payload.manager_id = managerId;
  }

  const alternatePhone = (b.alternate_phone || b.alternatePhone || "").trim();
  if (alternatePhone) {
    payload.alternate_phone = alternatePhone;
  }

  const normGender = normalizeGender(b.gender);
  if (normGender) payload.gender = normGender;

  const rawDob = b.date_of_birth || b.dob;
  if (rawDob) {
    payload.date_of_birth = String(rawDob).split("T")[0];
  }

  const bloodGroup = (b.blood_group || b.bloodGroup || "").trim();
  if (bloodGroup) {
    payload.blood_group = bloodGroup;
  }

  const normMarital = normalizeMaritalStatus(b.marital_status || b.maritalStatus);
  if (normMarital) payload.marital_status = normMarital;

  const profilePhotoUrl = (b.profile_photo_url || b.photoUrl || b.avatar || "").trim();
  if (profilePhotoUrl) {
    payload.profile_photo_url = profilePhotoUrl;
  }

  const branch = (b.branch || b.branchOffice || "").trim();
  if (branch) {
    payload.branch = branch;
  }

  const workLocation = (b.work_location || b.workLocation || "").trim();
  if (workLocation) {
    payload.work_location = workLocation;
  }

  const shift = (b.shift || "").trim();
  if (shift) {
    payload.shift = shift;
  }

  if (typeof b.probation_period_months === "number") {
    payload.probation_period_months = b.probation_period_months;
  } else if (typeof b.probationPeriod === "number") {
    payload.probation_period_months = b.probationPeriod;
  }

  const ctc = b.ctc !== undefined && b.ctc !== null ? Number(b.ctc) : (b.salary !== undefined && b.salary !== null ? Number(b.salary) : undefined);
  if (ctc !== undefined && !isNaN(ctc)) {
    payload.ctc = ctc;
  }

  const basicSalary = b.basic_salary !== undefined && b.basic_salary !== null ? Number(b.basic_salary) : (b.basicSalary !== undefined && b.basicSalary !== null ? Number(b.basicSalary) : undefined);
  if (basicSalary !== undefined && !isNaN(basicSalary)) {
    payload.basic_salary = basicSalary;
  }

  if (b.hra !== undefined && b.hra !== null && !isNaN(Number(b.hra))) {
    payload.hra = Number(b.hra);
  }
  if (b.bonus !== undefined && b.bonus !== null && !isNaN(Number(b.bonus))) {
    payload.bonus = Number(b.bonus);
  }

  const pf = b.pf !== undefined && b.pf !== null ? Number(b.pf) : (b.pfDeduction !== undefined && b.pfDeduction !== null ? Number(b.pfDeduction) : undefined);
  if (pf !== undefined && !isNaN(pf)) {
    payload.pf = pf;
  }

  const esi = b.esi !== undefined && b.esi !== null ? Number(b.esi) : (b.esiDeduction !== undefined && b.esiDeduction !== null ? Number(b.esiDeduction) : undefined);
  if (esi !== undefined && !isNaN(esi)) {
    payload.esi = esi;
  }

  const profTax = b.professional_tax !== undefined && b.professional_tax !== null ? Number(b.professional_tax) : (b.profTax !== undefined && b.profTax !== null ? Number(b.profTax) : undefined);
  if (profTax !== undefined && !isNaN(profTax)) {
    payload.professional_tax = profTax;
  }

  const leaveGroup = (b.leave_group || b.leaveGroup || "").trim();
  if (leaveGroup) {
    payload.leave_group = leaveGroup;
  }

  const isUuid = (val?: string | null) =>
    typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  const reportingTo = isUuid(b.reporting_to) ? b.reporting_to : isUuid(b.reportingManager) ? b.reportingManager : null;
  if (reportingTo) {
    payload.reporting_to = reportingTo;
  }

  // Permissions
  if (b.can_approve_leave !== undefined || b.canApproveLeave !== undefined) payload.can_approve_leave = Boolean(b.can_approve_leave ?? b.canApproveLeave);
  if (b.can_approve_attendance !== undefined || b.canApproveAttendance !== undefined) payload.can_approve_attendance = Boolean(b.can_approve_attendance ?? b.canApproveAttendance);
  if (b.can_manage_employees !== undefined || b.canManageEmployees !== undefined) payload.can_manage_employees = Boolean(b.can_manage_employees ?? b.canManageEmployees);
  if (b.can_view_payroll !== undefined || b.canViewPayroll !== undefined) payload.can_view_payroll = Boolean(b.can_view_payroll ?? b.canViewPayroll);
  if (b.can_edit_departments !== undefined || b.canEditDepartments !== undefined) payload.can_edit_departments = Boolean(b.can_edit_departments ?? b.canEditDepartments);
  if (b.can_invite_users !== undefined || b.canInviteUsers !== undefined) payload.can_invite_users = Boolean(b.can_invite_users ?? b.canInviteUsers);
  if (b.can_manage_recruitment !== undefined || b.canManageRecruitment !== undefined) payload.can_manage_recruitment = Boolean(b.can_manage_recruitment ?? b.canManageRecruitment);
  if (b.can_manage_performance !== undefined || b.canManagePerformance !== undefined) payload.can_manage_performance = Boolean(b.can_manage_performance ?? b.canManagePerformance);

  // Sub-arrays
  if (Array.isArray(b.addresses) && b.addresses.length > 0) {
    const validAddresses = b.addresses
      .filter((a: any) => a && (a.address_line_1 || a.line1 || a.address || a.city))
      .map((a: any) => ({
        address_type: (a.address_type || (a.type === "PRESENT" ? "CURRENT" : a.type) || "CURRENT").toUpperCase(),
        address_line_1: String(a.address_line_1 || a.line1 || a.address || "").trim(),
        address_line_2: (a.address_line_2 || a.line2 || "").trim() || null,
        city: String(a.city || "Not Specified").trim(),
        state: String(a.state || "Not Specified").trim(),
        country: String(a.country || "India").trim(),
        pincode: String(a.pincode || "400001").trim(),
        is_same_as_current: Boolean(a.is_same_as_current ?? a.isSameAsCurrent ?? false),
      }))
      .filter((a: any) => a.address_line_1);
    if (validAddresses.length > 0) payload.addresses = validAddresses;
  }

  const rawDocs = Array.isArray(b.documents) ? b.documents : Array.isArray(b.kycDocuments) ? b.kycDocuments : Array.isArray(b.kyc_documents) ? b.kyc_documents : [];
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

  const rawExp = Array.isArray(b.experience) ? b.experience : Array.isArray(b.workExperience) ? b.workExperience : Array.isArray(b.work_experience) ? b.work_experience : [];
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

  const rawSkills = Array.isArray(b.skills) ? b.skills : [];
  if (rawSkills.length > 0) {
    const validSkills = rawSkills
      .filter((sk: any) => sk && (sk.skill_name || sk.name || sk.skill))
      .map((sk: any) => ({
        skill_name: String(sk.skill_name || sk.name || sk.skill || "").trim(),
        proficiency: (sk.proficiency || "INTERMEDIATE").toUpperCase().trim(),
        years_of_experience: sk.years_of_experience !== undefined ? Number(sk.years_of_experience) : sk.years !== undefined ? Number(sk.years) : undefined,
      }))
      .filter((sk: any) => sk.skill_name);
    if (validSkills.length > 0) payload.skills = validSkills;
  }

  const rawEm = Array.isArray(b.emergency_contacts) ? b.emergency_contacts : Array.isArray(b.emergencyContacts) ? b.emergencyContacts : [];
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

  return payload;
}

/**
 * Builds a clean snake_case payload for manager update operations.
 */
export function buildManagerUpdatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload: Record<string, any> = {};

  const firstName = (b.first_name || b.firstName || (b.name ? b.name.split(" ")[0] : undefined))?.trim();
  if (firstName !== undefined && firstName !== "") payload.first_name = firstName;

  const lastName = (b.last_name || b.lastName || (b.name ? b.name.split(" ").slice(1).join(" ") : undefined))?.trim();
  if (lastName !== undefined && lastName !== "") payload.last_name = lastName;

  const personalEmail = (b.personal_email || b.personalEmail)?.trim();
  if (personalEmail !== undefined && personalEmail !== "") payload.personal_email = personalEmail;

  const companyEmail = (b.company_email || b.companyWorkEmail || b.work_email)?.trim();
  if (companyEmail !== undefined && companyEmail !== "") payload.company_email = companyEmail;

  const phone = (b.phone || b.phone_number || b.phoneNumber)?.trim();
  if (phone !== undefined && phone !== "") payload.phone = phone;

  const alternatePhone = (b.alternate_phone || b.alternatePhone)?.trim();
  if (alternatePhone !== undefined) payload.alternate_phone = alternatePhone || null;

  const department = (b.department || b.department_name)?.trim();
  if (department !== undefined && department !== "") payload.department = department;

  if (b.designation !== undefined) {
    payload.designation = String(b.designation).trim();
  }

  if (b.role !== undefined || b.systemRole !== undefined || b.system_role !== undefined) {
    const rawRole = b.systemRole || b.system_role || b.role;
    if (VALID_SYSTEM_ROLES.has(String(rawRole).toLowerCase().trim())) {
      payload.role = normalizeRole(rawRole);
    } else if (b.designation === undefined && rawRole) {
      payload.designation = String(rawRole).trim();
    }
  }

  const rawJoiningDate = b.joining_date || b.joiningDate || b.joinedAt;
  if (rawJoiningDate !== undefined) {
    payload.joining_date = String(rawJoiningDate).split("T")[0];
  }

  const employmentType = (b.employment_type || b.employmentType)?.trim();
  if (employmentType !== undefined && employmentType !== "") {
    payload.employment_type = employmentType.toUpperCase();
  }

  if (b.employment_status !== undefined || b.status !== undefined) {
    payload.employment_status = normalizeEmploymentStatus(b.employment_status || b.status);
  }

  if (b.gender !== undefined) {
    payload.gender = normalizeGender(b.gender) || null;
  }
  const rawDob = b.date_of_birth || b.dob;
  if (rawDob !== undefined) {
    payload.date_of_birth = rawDob ? String(rawDob).split("T")[0] : null;
  }
  if (b.blood_group !== undefined || b.bloodGroup !== undefined) {
    payload.blood_group = (b.blood_group || b.bloodGroup || "").trim() || null;
  }
  if (b.marital_status !== undefined || b.maritalStatus !== undefined) {
    payload.marital_status = normalizeMaritalStatus(b.marital_status || b.maritalStatus) || null;
  }
  if (b.profile_photo_url !== undefined || b.photoUrl !== undefined || b.avatar !== undefined) {
    payload.profile_photo_url = (b.profile_photo_url || b.photoUrl || b.avatar || "").trim() || null;
  }
  if (b.branch !== undefined || b.branchOffice !== undefined) {
    payload.branch = (b.branch || b.branchOffice || "").trim() || null;
  }
  if (b.work_location !== undefined || b.workLocation !== undefined) {
    payload.work_location = (b.work_location || b.workLocation || "").trim() || null;
  }
  if (b.shift !== undefined) {
    payload.shift = String(b.shift).trim() || null;
  }
  if (b.probation_period_months !== undefined || b.probationPeriod !== undefined) {
    const prob = b.probation_period_months ?? b.probationPeriod;
    payload.probation_period_months = prob !== null && prob !== undefined ? Number(prob) : null;
  }
  if (b.ctc !== undefined && b.ctc !== null) {
    payload.ctc = Number(b.ctc);
  } else if (b.salary !== undefined && b.salary !== null) {
    payload.ctc = Number(b.salary);
  }
  if (b.basic_salary !== undefined && b.basic_salary !== null) {
    payload.basic_salary = Number(b.basic_salary);
  } else if (b.basicSalary !== undefined && b.basicSalary !== null) {
    payload.basic_salary = Number(b.basicSalary);
  }
  if (b.hra !== undefined && b.hra !== null) payload.hra = Number(b.hra);
  if (b.bonus !== undefined && b.bonus !== null) payload.bonus = Number(b.bonus);
  if (b.pf !== undefined && b.pf !== null) {
    payload.pf = Number(b.pf);
  } else if (b.pfDeduction !== undefined && b.pfDeduction !== null) {
    payload.pf = Number(b.pfDeduction);
  }
  if (b.esi !== undefined && b.esi !== null) {
    payload.esi = Number(b.esi);
  } else if (b.esiDeduction !== undefined && b.esiDeduction !== null) {
    payload.esi = Number(b.esiDeduction);
  }
  if (b.professional_tax !== undefined && b.professional_tax !== null) {
    payload.professional_tax = Number(b.professional_tax);
  } else if (b.profTax !== undefined && b.profTax !== null) {
    payload.professional_tax = Number(b.profTax);
  }
  if (b.leave_group !== undefined || b.leaveGroup !== undefined) {
    payload.leave_group = (b.leave_group || b.leaveGroup || "").trim() || null;
  }

  // Permissions
  if (b.can_approve_leave !== undefined || b.canApproveLeave !== undefined) payload.can_approve_leave = Boolean(b.can_approve_leave ?? b.canApproveLeave);
  if (b.can_approve_attendance !== undefined || b.canApproveAttendance !== undefined) payload.can_approve_attendance = Boolean(b.can_approve_attendance ?? b.canApproveAttendance);
  if (b.can_manage_employees !== undefined || b.canManageEmployees !== undefined) payload.can_manage_employees = Boolean(b.can_manage_employees ?? b.canManageEmployees);
  if (b.can_view_payroll !== undefined || b.canViewPayroll !== undefined) payload.can_view_payroll = Boolean(b.can_view_payroll ?? b.canViewPayroll);
  if (b.can_edit_departments !== undefined || b.canEditDepartments !== undefined) payload.can_edit_departments = Boolean(b.can_edit_departments ?? b.canEditDepartments);
  if (b.can_invite_users !== undefined || b.canInviteUsers !== undefined) payload.can_invite_users = Boolean(b.can_invite_users ?? b.canInviteUsers);
  if (b.can_manage_recruitment !== undefined || b.canManageRecruitment !== undefined) payload.can_manage_recruitment = Boolean(b.can_manage_recruitment ?? b.canManageRecruitment);
  if (b.can_manage_performance !== undefined || b.canManagePerformance !== undefined) payload.can_manage_performance = Boolean(b.can_manage_performance ?? b.canManagePerformance);

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
