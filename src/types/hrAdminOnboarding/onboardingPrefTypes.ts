export interface OnboardingPreferences {
  enable_two_factor_auth?: boolean;
  attendance_mode?: string;
  payroll_cycle?: string;
  leave_policy_enabled?: boolean;
  working_days?: string[];
  fiscal_year_start?: string;
  [key: string]: any;
}
