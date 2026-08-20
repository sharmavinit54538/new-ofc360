export interface Advance {
  id: string;
  employee_id: string;
  employee_name?: string;
  principal_amount: number;
  monthly_repayment: number;
  remaining_balance: number;
  tenure_months: number;
  status: 'pending' | 'active' | 'completed' | 'rejected' | string;
  disbursed_at?: string;
  created_at?: string;
  [key: string]: any;
}
