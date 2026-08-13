export interface SecuritySetting {
  twoFactorEnabled: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  ipWhitelist: string[];
}
