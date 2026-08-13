export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: string;
  avatar?: string;
  departmentId?: string;
  companyId?: string;
  permissions?: string[];
  isVerified?: boolean;
  status?: string;
  [key: string]: any;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  currentPassword?: string;
}

export interface ChangePhoneRequest {
  newPhone: string;
}

export interface VerifyEmailRequest {
  otp: string;
  email?: string;
}
