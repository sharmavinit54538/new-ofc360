export interface CategoryScores {
  skills: number; experience: number; education: number; keywords: number;
  projects: number; certifications: number; resume_quality: number;
}
export interface ScoreBreakdown extends CategoryScores {}
export interface ParsedEducation {
  degree?: string; field_of_study?: string; university?: string; college?: string; passing_year?: number | string; grade?: string;
}
export interface ParsedProject {
  title: string; description?: string; technologies?: string[]; url?: string;
}
