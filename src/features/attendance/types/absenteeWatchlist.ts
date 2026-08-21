export interface AbsenteeWatchlist {
  watchlist?: Array<{
    employee_id: string;
    employee_name: string;
    absence_count: number;
    risk_score: number;
    department?: string;
    [key: string]: unknown;
  }>;
  total?: number;
  [key: string]: unknown;
}
