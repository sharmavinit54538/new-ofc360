import type { ParsedResumeData } from "./types";
import type { ATSScoreBreakdown } from "./atsScoreBreakdown";
import type { ATSRecruiterSummary } from "./atsRecruiterSummary";
import type { ATSComparisons } from "./atsComparisons";

export interface ATSAnalysisResult extends ATSComparisons {
  id: string; analyzedAt: string; candidate: ParsedResumeData;
  jobId?: string; jobTitle: string; jobDepartment: string;
  requiredExperienceYears: number; overallScore: number;
  scoreBreakdown: ATSScoreBreakdown;
  matchedSkills: string[]; missingSkills: string[];
  matchedKeywords: string[]; missingKeywords: string[];
  keywordCoveragePct: number; recommendations: string[];
  recruiterRecommendation: "Strong Match" | "Good Match" | "Potential Match" | "Weak Match" | "Not Recommended";
  recruiterSummary: ATSRecruiterSummary;
}
