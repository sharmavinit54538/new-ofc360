import type { FormatHealth } from "./formatHealthType";

export interface ParsedResumeData {
  candidateName: string; email: string; phone: string; location: string;
  summary: string; extractedSkills: string[]; technicalSkills: string[];
  softSkills: string[]; totalExperienceYears: number;
  workExperience: { title: string; company: string; duration: string; highlights: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: string[]; projects: string[]; formatHealth: FormatHealth;
}
