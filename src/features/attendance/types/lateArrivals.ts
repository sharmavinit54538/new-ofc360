export interface LateArrivalsData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    check_in_time: string;
    delay_minutes: number;
    department?: string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}
