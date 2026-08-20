export interface Payslip {
  id: string;
  employee_id: string;
  employee_name?: string;
  cycle_id: string;
  pay_period_start: string;
  pay_period_end: string;
  gross_pay: number;
  net_pay: number;
  total_allowances: number;
  total_deductions: number;
  total_tax: number;
  status: 'draft' | 'generated' | 'sent' | 'paid' | string;
  pdf_url?: string;
  generated_at?: string;
  [key: string]: any;
}
