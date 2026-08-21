import { Employee } from "@/types/hr";
import { normalizeRole } from "@/features/auth/authTypes";

export function normalizeEmployee(raw: any): Employee {
  if (!raw || typeof raw !== "object") return { id: String(Math.random()), name: "Employee", email: "", role: "employee", department: "General", systemRole: "employee", status: "Active", joinedAt: new Date().toISOString().split("T")[0], salary: 0 };
  const id = String(raw.id || raw._id || raw.employee_id || raw.user_id || Math.random());
  const firstName = (raw.first_name || raw.firstName || raw.user?.first_name || "").trim();
  const lastName = (raw.last_name || raw.lastName || raw.user?.last_name || "").trim();
  const rawCombined = [firstName, lastName].filter(Boolean).join(" ").trim();
  const name = (raw.name || raw.full_name || raw.fullName || rawCombined || (raw.email ? raw.email.split("@")[0] : "") || "Employee").trim();
  const email = (raw.email || raw.work_email || raw.company_email || raw.personal_email || raw.user?.email || "").trim();
  const department = (raw.department || raw.department_name || raw.dept || (typeof raw.department === "object" && raw.department?.name) || "General").trim();
  const designation = (raw.designation || raw.job_title || raw.position || "Employee").trim();
  const role = normalizeRole(raw.role || raw.systemRole || raw.system_role || raw.backendRole);
  const status = typeof (raw.status || raw.employment_status || "Active") === "string" ? (raw.status || raw.employment_status || "Active") : "Active";
  const salary = Number(raw.salary ?? raw.ctc ?? raw.basic_salary ?? 0) || 0;
  const joinedAt = raw.joinedAt || raw.joining_date || raw.created_at ? String(raw.joinedAt || raw.joining_date || raw.created_at).split("T")[0] : new Date().toISOString().split("T")[0];
  const phone = (raw.phone || raw.phone_number || "").trim() || undefined;
  const avatar = (raw.avatar || raw.photoUrl || raw.profile_photo_url || "").trim() || undefined;
  return { ...raw, id, name, firstName: firstName || undefined, lastName: lastName || undefined, email, department, designation, role, backendRole: role, portalRole: role, systemRole: role, status, salary, joinedAt, phone, avatar, ctc: salary };
}
