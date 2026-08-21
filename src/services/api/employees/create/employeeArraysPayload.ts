export function extractEmployeeSubArrays(b: any, payload: Record<string, any>) {
  if (Array.isArray(b.addresses) && b.addresses.length > 0) {
    const validAddresses = b.addresses.filter((a: any) => a && (a.address_line_1 || a.line1 || a.city)).map((a: any) => ({
      address_type: (a.address_type || (a.type === "PRESENT" ? "CURRENT" : a.type) || "CURRENT").toUpperCase(),
      address_line_1: String(a.address_line_1 || a.line1 || "").trim(),
      city: String(a.city || "").trim(), state: String(a.state || "").trim(), country: String(a.country || "India").trim(), pincode: String(a.pincode || "400001").trim(),
    })).filter((a: any) => a.address_line_1 && a.city && a.state);
    if (validAddresses.length > 0) payload.addresses = validAddresses;
  }
  const rawDocs = Array.isArray(b.documents) ? b.documents : (Array.isArray(b.kycDocuments) ? b.kycDocuments : []);
  if (rawDocs.length > 0) {
    const validDocs = rawDocs.filter((d: any) => d && (d.document_type || d.type)).map((d: any) => ({
      document_type: String(d.document_type || d.type || "PAN").toUpperCase().trim(),
      document_number: (d.document_number || d.documentNumber || "").trim() || null,
    }));
    if (validDocs.length > 0) payload.documents = validDocs;
  }
}
