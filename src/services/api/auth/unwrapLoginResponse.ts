import { AuthUser, normalizeRole } from "@/features/auth/authTypes";
import { RawEnvelope } from "../envelope";
import type { LoginResponse, RawLoginData } from "./authApiTypes";

export const unwrapLoginResponse = (raw: RawEnvelope<RawLoginData> | RawLoginData | any): LoginResponse => {
  const root = raw as any; const data = root?.data || root;
  const requires_email_verification = Boolean(root?.requires_email_verification ?? data?.requires_email_verification ?? false);
  const verification_id = root?.verification_id || data?.verification_id || undefined;
  const masked_email = data?.masked_email || undefined; const email = data?.email || undefined;
  const u = data?.user;
  const computedName = u?.name?.trim() || u?.full_name?.trim() || (u?.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : "") || (u?.email ? u.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "User");
  const normalizedUser: AuthUser = u ? { ...u, name: computedName, role: normalizeRole(u?.role), companyId: u.companyId || (u as any).company_id } : { id: "usr_me", name: computedName, email: email || "", role: "employee" };
  return { user: normalizedUser, token: data?.access_token || data?.token || "", refreshToken: data?.refresh_token || data?.refreshToken, requires_email_verification, verification_id, masked_email, email };
};
