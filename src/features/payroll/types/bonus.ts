export interface Bonus {
  id: string;
  employee_id?: string;
  plan_name?: string;
  title: string;
  amount: number;
  bonus_type: 'performance' | 'annual' | 'referral' | 'spot' | string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | string;
  reason?: string;
  created_at?: string;
  [key: string]: any;
}
