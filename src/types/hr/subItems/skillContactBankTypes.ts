export interface SkillItem {
  id?: string;
  name: string;
  level?: "beginner" | "intermediate" | "expert" | string;
  proficiency?: string;
  years?: number;
  [key: string]: any;
}

export interface EmergencyContactItem {
  id?: string;
  name: string;
  relationship: string;
  phone?: string;
  primaryPhone?: string;
  [key: string]: any;
}
