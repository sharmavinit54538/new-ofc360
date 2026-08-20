/**
 * Shared Payroll API Interfaces & Types
 */

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field?: string; message: string }[] | null;
}

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

export interface SalaryStructure {
  id: string;
  name: string;
  code?: string;
  description?: string;
  base_salary: number;
  currency: string;
  components?: { component_id: string; amount: number; type: string }[];
  is_active: boolean;
  effective_date?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

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

export interface Deduction {
  id: string;
  name: string;
  type: 'statutory' | 'voluntary' | 'loan' | string;
  amount_type: 'fixed' | 'percentage' | string;
  value: number;
  is_mandatory: boolean;
  description?: string;
  [key: string]: any;
}

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

export interface BankTransfer {
  id: string;
  cycle_id: string;
  total_amount: number;
  transfer_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | string;
  bank_name?: string;
  batch_reference?: string;
  file_url?: string;
  created_at?: string;
  [key: string]: any;
}

export interface ComplianceRule {
  id: string;
  country: string;
  state?: string;
  rule_name: string;
  category: 'tax' | 'pension' | 'social_security' | 'labor_law' | string;
  description?: string;
  is_active: boolean;
  effective_date: string;
  [key: string]: any;
}

export interface PayrollDashboardData {
  total_payroll_cost: number;
  active_pay_cycle?: PayCycle;
  pending_approvals: number;
  processed_payslips_count: number;
  recent_activities?: any[];
  chart_data?: any[];
  [key: string]: any;
}

export interface PayrollSettings {
  id?: string;
  currency: string;
  default_pay_cycle: string;
  auto_generate_payslips: boolean;
  tax_calculation_method: string;
  overtime_calculation_base: string;
  approval_levels: number;
  [key: string]: any;
}

export interface TaxSetting {
  id: string;
  name: string;
  tax_code: string;
  rate: number;
  is_percentage: boolean;
  min_bracket?: number;
  max_bracket?: number;
  is_active: boolean;
  [key: string]: any;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction' | 'reimbursement' | string;
  calculation_type: 'flat' | 'percentage' | string;
  default_value: number;
  is_taxable: boolean;
  order: number;
  is_active: boolean;
  [key: string]: any;
}

export interface Allowance {
  id: string;
  name: string;
  allowance_code: string;
  amount: number;
  is_taxable: boolean;
  is_recurring: boolean;
  is_active: boolean;
  [key: string]: any;
}

export interface PayrollTemplate {
  id: string;
  name: string;
  description?: string;
  structure_ids: string[];
  component_ids: string[];
  is_published: boolean;
  created_at?: string;
  [key: string]: any;
}

export interface SecurityRole {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  [key: string]: any;
}

export interface SecurityPolicy {
  mfa_required: boolean;
  session_timeout_minutes: number;
  ip_whitelist_enabled: boolean;
  [key: string]: any;
}

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

export interface IpWhitelistEntry {
  id: string;
  ip_address: string;
  label?: string;
  created_at?: string;
  [key: string]: any;
}

export interface AiPayrollInsight {
  forecast_cost?: number;
  anomalies_detected?: number;
  fraud_risk_score?: number;
  health_score?: number;
  department_breakdown?: Record<string, number>;
  insights?: string[];
  [key: string]: any;
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: any;
}