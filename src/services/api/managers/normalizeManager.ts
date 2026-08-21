import { Manager } from "@/types/hr";
import { normalizeRole } from "@/features/auth/authTypes";

export function normalizeManager(raw: any): Manager {
  if (!raw || typeof raw !== "object") return { id: String(Math.random()), name: "Manager", email: "", role: "Manager", department: "General", systemRole: "manager", status: "Active", joinedAt: new Date().toISOString().split("T")[0], salary: 0 };
  const id = String(raw.id || raw._id || raw.manager_id || raw.employee_id || Math.random());
  const firstName = (raw.first_name || raw.firstName || "").trim();
  const lastName = (raw.last_name || raw.lastName || "").trim();
  const rawCombined = [firstName, lastName].filter(Boolean).join(" ").trim();
  const name = (raw.name || raw.full_name || raw.fullName || rawCombined || (raw.email ? raw.email.split("@")[0] : "") || "Manager").trim();
  const email = (raw.email || raw.work_email || raw.company_email || raw.personal_email || "").trim();
  const department = (raw.department || raw.department_name || raw.dept || "General").trim();
  const role = (raw.designation || raw.role || raw.job_title || "Manager").trim();
  const systemRole = normalizeRole(raw.systemRole || raw.system_role || raw.role || "manager");
  const status = typeof (raw.status || raw.employment_status || "Active") === "string" ? (raw.status || raw.employment_status || "Active") : "Active";
  const salary = Number(raw.salary ?? raw.ctc ?? raw.basic_salary ?? 0) || 0;
  const joinedAt = raw.joinedAt || raw.joining_date || raw.created_at ? String(raw.joinedAt || raw.joining_date || raw.created_at).split("T")[0] : new Date().toISOString().split("T")[0];
  const phone = (raw.phone || raw.phone_number || "").trim() || undefined;
  const avatar = (raw.avatar || raw.photoUrl || raw.profile_photo_url || "").trim() || undefined;
  return { ...raw, id, name, firstName: firstName || undefined, lastName: lastName || undefined, email, department, role, systemRole, status, salary, joinedAt, phone, avatar, ctc: salary };
}
