export function normalizeManagerAddresses(arr: any[]) {
  return arr.map((a) => ({ address_line_1: a.address_line_1 || a.addressLine1 || a.line1 || a.street || a.address || "", city: a.city || "", state: a.state || "", pincode: a.pincode || a.postalCode || a.zip || "", is_permanent: Boolean(a.is_permanent ?? a.isPermanent) }));
}

export function normalizeManagerDocs(arr: any[]) {
  return arr.map((d) => ({ document_type: d.document_type || d.type || d.documentType || "", document_number: d.document_number || d.number || d.documentNumber || "", document_url: d.document_url || d.url || d.documentUrl }));
}

export function normalizeManagerSkills(arr: any[]) {
  return arr.map((s) => ({ skill_name: s.skill_name || s.name || s.skillName || "", proficiency: s.proficiency ? String(s.proficiency).toUpperCase() : "INTERMEDIATE", years_of_experience: s.years_of_experience ?? s.years ?? s.yearsOfExperience ?? 0 }));
}
