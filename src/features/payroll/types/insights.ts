export interface AiPayrollInsight {
  forecast_cost?: number;
  anomalies_detected?: number;
  fraud_risk_score?: number;
  health_score?: number;
  department_breakdown?: Record<string, number>;
  insights?: string[];
  [key: string]: any;
}
