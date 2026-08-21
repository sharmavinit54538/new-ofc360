export interface NewHireOnboardingRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  email: string;
  designation: string;
  department: string;
  joining_date: string;
  status: string;
  completion_percentage: number;
  [key: string]: any;
}
