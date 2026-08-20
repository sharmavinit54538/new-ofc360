export interface PayCycle {
  id: string;
  name: string;
  period_start: string;
  period_end: string;
  pay_date: string;
  status: 'draft' | 'active' | 'locked' | 'processing' | 'completed' | 'archived' | string;
  total_employees?: number;
  total_gross?: number;
  total_net?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}
