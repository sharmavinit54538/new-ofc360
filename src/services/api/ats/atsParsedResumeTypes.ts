import type { ParsedEducation, ParsedProject } from "./atsScoreTypes";

export interface ParsedResumeInfo {
  name: string | null; email: string | null; phone: string | null; address: string | null;
  linkedin: string | null; github: string | null; portfolio: string | null; summary: string | null;
  experience_years: number; current_company: string | null; current_designation: string | null;
  skills: string[]; technical_skills: string[]; soft_skills: string[];
  education: ParsedEducation[]; projects: ParsedProject[]; certifications: string[]; languages: string[];
}
