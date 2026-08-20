export interface LoginRequest { email: string; password?: string; otp?: string; }
export interface RegisterRequest { name: string; email: string; password?: string; companyName?: string; role?: string; }
export interface AuthResponse { token: string; refreshToken?: string; user: any; expiresIn?: number; }
export interface SendOtpRequest { email: string; type?: 'login' | 'register' | 'reset-password'; }
export interface VerifyOtpRequest { email: string; otp: string; }