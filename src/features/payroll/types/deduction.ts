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
