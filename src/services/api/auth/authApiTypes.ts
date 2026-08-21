import { AuthUser } from "@/features/auth/authTypes";

export interface LoginRequest { identifier: string; password?: string; role?: string; }
export interface LoginResponse {
  user: AuthUser; token: string; refreshToken?: string;
  requires_email_verification?: boolean; verification_id?: string; masked_email?: string; email?: string;
}
export interface RawLoginData {
  access_token?: string; refresh_token?: string; expires_in?: number; token_type?: string;
  user?: AuthUser; token?: string; refreshToken?: string;
  requires_email_verification?: boolean; verification_id?: string; masked_email?: string; email?: string;
}
export interface RegisterRequest {
  first_name?: string; last_name?: string; name?: string; full_name?: string;
  identifier: string; phone?: string; password?: string; company_name?: string; role?: string;
}
export interface VerifyEmailOtpRequest { verification_id?: string; otp: string; identifier?: string; email?: string; }
export interface ResendEmailOtpRequest { verification_id?: string; email?: string; identifier?: string; }
export interface ResendEmailOtpResponse { success: boolean; message: string; verification_id?: string; }
