export function extractEmployeeCompAndOrg(b: any, payload: Record<string, any>) {
  const empId = (b.employee_id || b.employeeCode || (typeof b.id === "string" && !b.id.startsWith("emp_") && !b.id.startsWith("temp-") ? b.id : null) || "").trim();
  if (empId) payload.employee_id = empId;
  const companyEmail = (b.company_email || b.companyWorkEmail || b.work_email || "").trim();
  if (companyEmail) payload.company_email = companyEmail;
  if (b.gender) payload.gender = String(b.gender).trim();
  if (b.date_of_birth || b.dob) payload.date_of_birth = String(b.date_of_birth || b.dob).split("T")[0];
  if (b.blood_group || b.bloodGroup) payload.blood_group = (b.blood_group || b.bloodGroup).trim();
  if (b.marital_status || b.maritalStatus) payload.marital_status = (b.marital_status || b.maritalStatus).trim();
  if (b.profile_photo_url || b.photoUrl || b.avatar) payload.profile_photo_url = (b.profile_photo_url || b.photoUrl || b.avatar).trim();
  if (b.branch || b.branchOffice) payload.branch = (b.branch || b.branchOffice).trim();
  if (b.work_location || b.workLocation) payload.work_location = (b.work_location || b.workLocation).trim();
  if (b.ctc !== undefined && b.ctc !== null) payload.ctc = Number(b.ctc);
  else if (b.salary !== undefined && b.salary !== null) payload.ctc = Number(b.salary);
  if (b.basic_salary !== undefined && b.basic_salary !== null) payload.basic_salary = Number(b.basic_salary);
  if (b.hra !== undefined && b.hra !== null) payload.hra = Number(b.hra);
}
