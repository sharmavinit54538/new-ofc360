export interface SecuritySession {
  id: string;
  user_id: string;
  user_email: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_active_at: string;
  [key: string]: any;
}
