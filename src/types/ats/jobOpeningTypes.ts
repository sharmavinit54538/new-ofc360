import type { JobStatus } from "./atsStatusTypes";
import type { ScreeningQuestion } from "./requisitionTypes";

export interface JobOpening {
  id: string; requisitionId?: string; title: string; department: string; location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  workplaceType: "On-Site" | "Hybrid" | "Remote"; experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
  status: JobStatus; postedDate: string; closingDate?: string; applicantsCount: number;
  skills: string[]; screeningQuestions?: ScreeningQuestion[];
}