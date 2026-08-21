export interface ShiftViolationsData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    violation_type: string;
    details: string;
    date: string;
    shift_name?: string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}
