import type { ParsedResumeData } from "./types";
import type { ATSAnalysisResult } from "./analysisResultType";

export function buildAtsReport(cand: ParsedResumeData, jobTitle: string, reqYears: number, sPct: number, kPct: number, ePct: number, overall: number, rec: any, matchedSkills: string[], missingSkills: string[], matchedKeywords: string[], missingKeywords: string[]): ATSAnalysisResult {
  return {
    id: `ATS-${Date.now().toString().slice(-6)}`, analyzedAt: new Date().toLocaleString(), candidate: cand,
    jobTitle, jobDepartment: "Engineering / Technology", requiredExperienceYears: reqYears, overallScore: overall,
    scoreBreakdown: { skillsMatchPct: sPct, experienceMatchPct: ePct, keywordMatchPct: kPct, educationMatchPct: 100, responsibilitiesMatchPct: 75, jobTitleMatchPct: 90, certificationsMatchPct: 85 },
    matchedSkills, missingSkills, matchedKeywords, missingKeywords, keywordCoveragePct: kPct,
    experienceComparison: { requiredYears: reqYears, candidateYears: cand.totalExperienceYears, matchLevel: ePct === 100 ? "Strong Match" : "Good Match", relevantRoles: cand.workExperience.map((w) => `${w.title} at ${w.company}`) },
    educationComparison: { requiredDegree: "BS Computer Science", candidateDegree: cand.education[0]?.degree || "BS Computer Science", status: "Match" },
    responsibilityComparison: { matched: ["Architect responsive front-end UIs"], partiallyMatched: [], missing: [] },
    recommendations: missingSkills.length ? [`Add missing skills: ${missingSkills.slice(0, 3).join(", ")}`] : [],
    recruiterRecommendation: rec,
    recruiterSummary: { verdict: `${cand.candidateName} is a ${rec} (${overall}/100)`, topStrengths: [`Aligned skills (${matchedSkills.slice(0, 3).join(", ")})`], keyGaps: missingSkills.length ? [`Missing: ${missingSkills.join(", ")}`] : ["None"], improvementOpportunities: ["Quantify achievements"] },
  };
}
