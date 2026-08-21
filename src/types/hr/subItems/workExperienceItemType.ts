export interface WorkExperienceItem {
  id?: string;
  company?: string;
  companyName?: string;
  role?: string;
  designation?: string;
  fromYear?: number;
  toYear?: number;
  startDate?: string;
  endDate?: string;
  employmentType?: string;
  description?: string;
  [key: string]: any;
}
