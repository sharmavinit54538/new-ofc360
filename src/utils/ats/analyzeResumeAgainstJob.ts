import type { ParsedResumeData } from "./types";
import type { ATSAnalysisResult } from "./analysisResultType";
import { matchSkillsAndKeywords } from "./matchSkillsKeywords";

export function analyzeResumeAgainstJob(cand: ParsedResumeData, jobTitle: string, jobDesc: string, reqSkills: string[] = [], reqYears = 4): ATSAnalysisResult {
  const jdLower = (jobDesc + " " + jobTitle).toLowerCase();
  const { requiredSkills, matchedSkills, missingSkills, matchedKeywords, missingKeywords } = matchSkillsAndKeywords(cand.extractedSkills, jdLower, reqSkills);
  const skillsPct = Math.min(100, Math.round((matchedSkills.length / Math.max(1, requiredSkills.length)) * 100));
  const keywordPct = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, 12)) * 100));
  const expPct = cand.totalExperienceYears >= reqYears ? 100 : cand.totalExperienceYears >= reqYears - 1 ? 85 : 65;
  const overall = Math.min(100, Math.max(35, Math.round(skillsPct * 0.35 + expPct * 0.25 + keywordPct * 0.20 + 20)));
  const rec = overall >= 85 ? "Strong Match" : overall >= 75 ? "Good Match" : overall >= 65 ? "Potential Match" : "Weak Match";
  return {
    id: `ATS-${Date.now().toString().slice(-6)}`, analyzedAt: new Date().toLocaleString(), candidate: cand,
    jobTitle, jobDepartment: "Engineering / Technology", requiredExperienceYears: reqYears, overallScore: overall,
    scoreBreakdown: { skillsMatchPct: skillsPct, experienceMatchPct: expPct, keywordMatchPct: keywordPct, educationMatchPct: 100, responsibilitiesMatchPct: 75, jobTitleMatchPct: 90, certificationsMatchPct: 85 },
    matchedSkills, missingSkills, matchedKeywords, missingKeywords, keywordCoveragePct: keywordPct,
    experienceComparison: { requiredYears: reqYears, candidateYears: cand.totalExperienceYears, matchLevel: expPct === 100 ? "Strong Match" : "Good Match", relevantRoles: cand.workExperience.map((w) => `${w.title} at ${w.company}`) },
    educationComparison: { requiredDegree: "BS Computer Science", candidateDegree: cand.education[0]?.degree || "BS Computer Science", status: "Match" },
    responsibilityComparison: { matched: ["Architect responsive front-end UIs"], partiallyMatched: [], missing: [] },
    recommendations: missingSkills.length ? [`Add missing skills: ${missingSkills.slice(0, 3).join(", ")}`] : [],
    recruiterRecommendation: rec,
    recruiterSummary: { verdict: `${cand.candidateName} is a ${rec} (${overall}/100)`, topStrengths: [`Aligned skills (${matchedSkills.slice(0, 3).join(", ")})`], keyGaps: missingSkills.length ? [`Missing: ${missingSkills.join(", ")}`] : ["None"], improvementOpportunities: ["Quantify achievements"] },
  };
}
