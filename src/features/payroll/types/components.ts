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
