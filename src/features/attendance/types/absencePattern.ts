export interface AbsencePatternData {
  patterns?: Array<{
    employee_id: string;
    employee_name: string;
    pattern_type: string;
    frequency: number;
    risk_level: "low" | "medium" | "high" | string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}
