export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export type AuditLogParams = { module?: string; userId?: string } | void;
