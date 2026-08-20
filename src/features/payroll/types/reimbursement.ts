export interface ReimbursementClaim {
  id: string;
  employee_id: string;
  employee_name?: string;
  category: string;
  amount: number;
  expense_date: string;
  receipt_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid' | string;
  remarks?: string;
  created_at?: string;
  [key: string]: any;
}
