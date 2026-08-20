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
