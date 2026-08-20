export interface ResetPasswordRequest { token: string; newPassword?: string; password?: string; }
export interface RefreshTokenRequest { refreshToken: string; }
export interface UserSession { id: string; userId: string; token: string; device?: string; ipAddress?: string; createdAt: string; expiresAt: string; }