export interface SecurityRole {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  [key: string]: any;
}
export interface SecurityPolicy {
  mfa_required: boolean;
  session_timeout_minutes: number;
  ip_whitelist_enabled: boolean;
  [key: string]: any;
}
