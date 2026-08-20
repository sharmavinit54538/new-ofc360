export interface OvertimeEntry {
  id: string;
  employee_id: string;
  employee_name?: string;
  date: string;
  hours: number;
  rate_multiplier: number;
  calculated_amount: number;
  status: 'pending' | 'approved' | 'rejected' | string;
  reason?: string;
  approved_by?: string;
  created_at?: string;
  [key: string]: any;
}
