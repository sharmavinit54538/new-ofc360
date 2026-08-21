import { normalizeRole } from "@/features/auth/authTypes";

export function extractManagerBaseCreate(b: any): Record<string, any> {
  const firstName = (b.first_name || b.firstName || (b.name ? b.name.trim().split(" ")[0] : "") || "").trim();
  const lastName = (b.last_name || b.lastName || (b.name ? b.name.trim().split(" ").slice(1).join(" ") : "") || "").trim() || ".";
  const personalEmail = (b.personal_email || b.personalEmail || b.email || "").trim();
  const phone = (b.phone || b.phone_number || b.phoneNumber || "").trim();
  const department = (b.department || b.department_name || "General").trim();
  const designation = (b.designation || "Manager").trim();
  const rawDate = b.joining_date || b.joiningDate || b.joinedAt;
  const joiningDate = rawDate ? String(rawDate).split("T")[0] : new Date().toISOString().split("T")[0];
  const employmentType = (b.employment_type || b.employmentType || "FULL_TIME").trim();
  const role = normalizeRole(b.role || b.systemRole || b.system_role || b.backendRole || "manager");
  return { first_name: firstName, last_name: lastName, personal_email: personalEmail, phone, department, designation, joining_date: joiningDate, employment_type: employmentType, role };
}
