export interface OnboardingDocumentItem {
  id: string;
  title: string;
  type: string;
  file_url?: string;
  status: string;
  [key: string]: any;
}

export interface OnboardingTaskItem {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  assigned_to?: string;
  status: string;
  [key: string]: any;
}
