export interface OnboardingWorkflow {
  id: string;
  name: string;
  description?: string;
  stepsCount?: number;
  [key: string]: any;
}
