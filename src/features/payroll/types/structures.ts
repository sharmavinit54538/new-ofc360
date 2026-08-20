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
