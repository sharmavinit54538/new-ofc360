/**
 * OFC360 In-Memory Auth Storage & Security Helpers
 * Strict security: NEVER persists access/refresh tokens in localStorage or sessionStorage.
 */

export const isValidToken = (token: unknown): token is string => {
  return (
    typeof token === "string" &&
    token.trim().length > 10 &&
    token !== "undefined" &&
    token !== "null" &&
    token !== "[object Object]"
  );
};

export const isValidUUID = (id: unknown): id is string => {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
};

export const PUBLIC_AUTH_ENDPOINTS = [
  "login",
  "register",
  "forgotPassword",
  "verifyResetOtp",
  "resetPassword",
  "verifyEmail",
  "resendOtp",
  "verifyEmailOtp",
  "resendEmailOtp",
  "createAuthLogin",
  "createAuthRegister",
  "createAuthForgotPassword",
  "createAuthResetPassword",
  "createAuthVerifyEmail",
  "createAuthResendOtp",
  "validateEmployeeInvitation",
  "validateInvitation",
  "activateEmployee",
  "activateAccount",
  "validateManagerInvitation",
  "activateManager",
  "refreshSession",
  "createAuthRefresh",
] as const;

export const PUBLIC_AUTH_URL_PATTERNS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-reset-otp",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/verify-email-otp",
  "/auth/resend-otp",
  "/auth/resend-email-otp",
  "/auth/refresh",
  "/onboarding/validate",
  "/onboarding/validate-token",
  "/onboarding/activate",
  "/managers/onboarding/validate",
];

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

/**
 * Storage cleanup utility on logout
 */
export const clearLegacyAuthStorage = (): void => {
  try {
    localStorage.removeItem("ofc360_access_token");
    localStorage.removeItem("ofc360_refresh_token");
    localStorage.removeItem("ofc360_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("ofc360_access_token");
    sessionStorage.removeItem("ofc360_refresh_token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  } catch {
    // ignore
  }
};
