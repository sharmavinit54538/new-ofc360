import { PayCycle } from "./cycles";
export interface PayrollDashboardData {
  total_payroll_cost: number;
  active_pay_cycle?: PayCycle;
  pending_approvals: number;
  processed_payslips_count: number;
  recent_activities?: any[];
  chart_data?: any[];
  [key: string]: any;
}
export interface AiPayrollInsight {
  forecast_cost?: number;
  anomalies_detected?: number;
  fraud_risk_score?: number;
  health_score?: number;
  department_breakdown?: Record<string, number>;
  insights?: string[];
  [key: string]: any;
}
