import { normalizeManagerAddresses, normalizeManagerDocs, normalizeManagerSkills } from "./managerSubArraysNormalizer";

export function extractManagerArraysAndMeta(b: any, payload: Record<string, any>) {
  const compEmail = b.company_email || b.companyEmail || b.companyWorkEmail || b.workEmail || b.officialEmail;
  if (compEmail) payload.company_email = compEmail.trim();
  const altPhone = b.alternate_phone || b.alternatePhone;
  if (altPhone) payload.alternate_phone = altPhone.trim();
  const empStatus = b.employment_status || b.employmentStatus || b.status;
  if (empStatus) payload.employment_status = String(empStatus).toUpperCase();
  if (b.gender) payload.gender = String(b.gender).toUpperCase();
  const ms = b.marital_status || b.maritalStatus;
  if (ms) payload.marital_status = String(ms).toUpperCase();
  const bg = b.blood_group || b.bloodGroup;
  if (bg) payload.blood_group = String(bg).trim();
  if (Array.isArray(b.addresses)) payload.addresses = normalizeManagerAddresses(b.addresses);
  if (Array.isArray(b.documents)) payload.documents = normalizeManagerDocs(b.documents);
  if (Array.isArray(b.skills)) payload.skills = normalizeManagerSkills(b.skills);
  if (Array.isArray(b.education)) payload.education = b.education;
  if (Array.isArray(b.experience)) payload.experience = b.experience;
  if (Array.isArray(b.emergency_contacts || b.emergencyContacts)) payload.emergency_contacts = b.emergency_contacts || b.emergencyContacts;
}
