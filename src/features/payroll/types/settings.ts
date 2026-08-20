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
