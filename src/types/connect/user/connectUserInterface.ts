import type { PresenceStatus } from "./presenceStatusType";

export interface ConnectUser {
  id: string;
  userId?: string;
  user_id?: string;
  employeeId?: string;
  employee_id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatar?: string;
  role?: string;
  department?: string;
  presence?: PresenceStatus;
  status?: string;
  lastSeen?: string;
  customStatus?: string;
  phone?: string;
  [key: string]: any;
}
