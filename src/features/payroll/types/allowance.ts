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
