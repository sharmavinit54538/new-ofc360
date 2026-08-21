export const PUBLIC_AUTH_ENDPOINTS = [
  "login", "register", "forgotPassword", "verifyResetOtp", "resetPassword",
  "verifyEmail", "resendOtp", "verifyEmailOtp", "resendEmailOtp",
  "createAuthLogin", "createAuthRegister", "createAuthForgotPassword",
  "createAuthResetPassword", "createAuthVerifyEmail", "createAuthResendOtp",
  "validateEmployeeInvitation", "validateInvitation", "activateEmployee",
  "activateAccount", "validateManagerInvitation", "activateManager",
  "refreshSession", "createAuthRefresh",
] as const;

export const PUBLIC_AUTH_URL_PATTERNS = [
  "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/verify-reset-otp",
  "/auth/reset-password", "/auth/verify-email", "/auth/verify-email-otp",
  "/auth/resend-otp", "/auth/resend-email-otp", "/auth/refresh",
  "/onboarding/validate", "/onboarding/validate-token", "/onboarding/activate",
  "/managers/onboarding/validate",
];
