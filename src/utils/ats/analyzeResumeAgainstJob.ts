import type { ParsedResumeData } from "./types";
import type { ATSAnalysisResult } from "./analysisResultType";
import { matchSkillsAndKeywords } from "./matchSkillsKeywords";
import { buildAtsReport } from "./buildAtsReport";

export function analyzeResumeAgainstJob(cand: ParsedResumeData, jobTitle: string, jobDesc: string, reqSkills: string[] = [], reqYears = 4): ATSAnalysisResult {
  const { requiredSkills, matchedSkills, missingSkills, matchedKeywords, missingKeywords } = matchSkillsAndKeywords(cand.extractedSkills, (jobDesc + " " + jobTitle).toLowerCase(), reqSkills);
  const sPct = Math.min(100, Math.round((matchedSkills.length / Math.max(1, requiredSkills.length)) * 100));
  const kPct = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, 12)) * 100));
  const ePct = cand.totalExperienceYears >= reqYears ? 100 : cand.totalExperienceYears >= reqYears - 1 ? 85 : 65;
  const overall = Math.min(100, Math.max(35, Math.round(sPct * 0.35 + ePct * 0.25 + kPct * 0.20 + 20)));
  const rec = overall >= 85 ? "Strong Match" : overall >= 75 ? "Good Match" : overall >= 65 ? "Potential Match" : "Weak Match";
  return buildAtsReport(cand, jobTitle, reqYears, sPct, kPct, ePct, overall, rec, matchedSkills, missingSkills, matchedKeywords, missingKeywords);
}
