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
