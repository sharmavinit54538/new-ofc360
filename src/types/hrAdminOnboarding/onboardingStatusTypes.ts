export interface OnboardingStatus {
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  completion_percentage: number;
  completed_at?: string | null;
  [key: string]: any;
}
