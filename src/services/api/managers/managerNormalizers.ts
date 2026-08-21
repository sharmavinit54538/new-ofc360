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
  if (["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"].includes(str)) return str;
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
