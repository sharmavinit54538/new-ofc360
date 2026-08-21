import { PUBLIC_AUTH_ENDPOINTS, PUBLIC_AUTH_URL_PATTERNS } from "./publicEndpoints";

export const isPublicRequest = (url?: string, endpoint?: string): boolean => {
  if (endpoint && (PUBLIC_AUTH_ENDPOINTS as readonly string[]).includes(endpoint)) return true;
  if (url) {
    if (PUBLIC_AUTH_URL_PATTERNS.some((pattern) => url.includes(pattern))) return true;
    if (url.includes("/activate") || url.includes("/validate")) return true;
  }
  return false;
};

export const needsCompanyId = (url: string, endpoint?: string): boolean => {
  if (isPublicRequest(url, endpoint)) return false;
  if (url.includes("/auth/me") || url.includes("/auth/refresh")) return false;
  if (url.includes("/hr-admin/onboarding") || url.includes("/onboarding")) return false;
  if (url.includes("/connect") || url.includes("/api/v1/connect")) return false;
  if (url.includes("/super-admin") || url.includes("/api/v1/super-admin")) return false;
  return true;
};
