export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year?: number;
  endYear?: string | number;
  grade?: string;
  gpa?: string;
  [key: string]: any;
}
