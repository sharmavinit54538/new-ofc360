import type { ParsedResumeData } from "./types";

export interface ATSAnalysisResult {
  id: string;
  analyzedAt: string;
  candidate: ParsedResumeData;
  jobId?: string;
  jobTitle: string;
  jobDepartment: string;
  requiredExperienceYears: number;
  overallScore: number;
  scoreBreakdown: {
    skillsMatchPct: number;
    experienceMatchPct: number;
    keywordMatchPct: number;
    educationMatchPct: number;
    responsibilitiesMatchPct: number;
    jobTitleMatchPct: number;
    certificationsMatchPct: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordCoveragePct: number;
  experienceComparison: {
    requiredYears: number;
    candidateYears: number;
    matchLevel: "Strong Match" | "Good Match" | "Partial Match" | "Needs Experience";
    relevantRoles: string[];
  };
  educationComparison: {
    requiredDegree: string;
    candidateDegree: string;
    status: "Match" | "Partial Match" | "Not Found";
  };
  responsibilityComparison: {
    matched: string[];
    partiallyMatched: string[];
    missing: string[];
  };
  recommendations: string[];
  recruiterRecommendation: "Strong Match" | "Good Match" | "Potential Match" | "Weak Match" | "Not Recommended";
  recruiterSummary: {
    verdict: string;
    topStrengths: string[];
    keyGaps: string[];
    improvementOpportunities: string[];
  };
}
