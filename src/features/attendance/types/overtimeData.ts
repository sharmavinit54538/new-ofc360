export interface OvertimeData {
  items?: Array<{
    employee_id: string;
    employee_name: string;
    overtime_hours: number;
    date: string;
    approved?: boolean;
    [key: string]: unknown;
  }>;
  total_hours?: number;
  [key: string]: unknown;
}
