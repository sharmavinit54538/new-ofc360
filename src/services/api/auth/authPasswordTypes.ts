export interface ForgotPasswordRequest { identifier: string; }
export interface VerifyResetOtpRequest { identifier: string; otp: string; }
export interface ResetPasswordRequest {
  identifier?: string; email?: string; otp: string;
  newPassword?: string; new_password?: string; confirmPassword?: string; confirm_password?: string;
}
export interface ChangePasswordRequest {
  oldPassword?: string; old_password?: string; newPassword?: string; new_password?: string;
}
