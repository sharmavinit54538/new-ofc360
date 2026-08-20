export interface SalaryProcessingRun {
  id: string;
  cycle_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back' | string;
  total_employees: number;
  processed_count: number;
  error_count: number;
  total_gross_pay: number;
  total_net_pay: number;
  total_deductions: number;
  total_taxes: number;
  run_date?: string;
  approved_by?: string;
  approved_at?: string;
  [key: string]: any;
}
