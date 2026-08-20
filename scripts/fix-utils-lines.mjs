import fs from 'fs';
import path from 'path';

// 1. src/utils/aiRouter/executeAiModel.ts
const executeAiModel = `import { ALL_71_AI_MODELS } from "@/data/aiToolsData";
import type { AIExecutionOptions, AIExecutionResponse } from "./types";
import { resolveAIProvider } from "./providerResolver";
import { resolvePromptOutput } from "./resolvePromptOutput";

export async function executeAiModel(modelOrId: any, prompt: string, opts?: AIExecutionOptions): Promise<AIExecutionResponse> {
  const start = Date.now();
  const rawId = typeof modelOrId === "string" ? modelOrId : modelOrId.id;
  const known = ALL_71_AI_MODELS.find((m) => m.id === rawId);
  const title = typeof modelOrId === "object" && modelOrId.title ? modelOrId.title : (known?.title || rawId);
  const cat = typeof modelOrId === "object" && modelOrId.category ? modelOrId.category : (known?.category || "General AI");
  const badge = typeof modelOrId === "object" && modelOrId.badge ? modelOrId.badge : (known?.badge || "AI");
  const { text, embedding } = resolvePromptOutput(prompt, title, rawId, cat, badge, opts);
  if (opts?.temperature !== 0) await new Promise((r) => setTimeout(r, 10));
  const tokens = Math.round(prompt.length / 4) + Math.round(text.length / 4) + 12;
  return {
    modelId: rawId, modelTitle: title, category: cat, provider: resolveAIProvider(cat),
    latencyMs: Date.now() - start, tokensUsed: tokens, response: text, embeddingVector: embedding, isStreamed: !!opts?.stream,
  };
}
`;
fs.writeFileSync('src/utils/aiRouter/executeAiModel.ts', executeAiModel, 'utf8');

// 2. src/utils/ats/types.ts -> split formatHealth
const formatHealthType = `export interface FormatHealth {
  contactInfoComplete: boolean;
  hasSummary: boolean;
  hasClearHeadings: boolean;
  fontReadabilityScore: number;
  atsParsingHealth: "Good" | "Warning" | "Critical";
  formattingFlags: string[];
}
`;
fs.writeFileSync('src/utils/ats/formatHealthType.ts', formatHealthType, 'utf8');

const atsTypes = `import type { FormatHealth } from "./formatHealthType";

export interface ParsedResumeData {
  candidateName: string; email: string; phone: string; location: string;
  summary: string; extractedSkills: string[]; technicalSkills: string[];
  softSkills: string[]; totalExperienceYears: number;
  workExperience: { title: string; company: string; duration: string; highlights: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: string[]; projects: string[]; formatHealth: FormatHealth;
}
`;
fs.writeFileSync('src/utils/ats/types.ts', atsTypes, 'utf8');

// 3. src/utils/ats/analysisResultType.ts -> split score breakdown and comparisons
const atsScoreBreakdown = `export interface ATSScoreBreakdown {
  skillsMatchPct: number; experienceMatchPct: number; keywordMatchPct: number;
  educationMatchPct: number; responsibilitiesMatchPct: number; jobTitleMatchPct: number;
  certificationsMatchPct: number;
}
`;
fs.writeFileSync('src/utils/ats/atsScoreBreakdown.ts', atsScoreBreakdown, 'utf8');

const atsRecruiterSummary = `export interface ATSRecruiterSummary {
  verdict: string; topStrengths: string[]; keyGaps: string[]; improvementOpportunities: string[];
}
`;
fs.writeFileSync('src/utils/ats/atsRecruiterSummary.ts', atsRecruiterSummary, 'utf8');

const atsComparisons = `export interface ATSComparisons {
  experienceComparison: { requiredYears: number; candidateYears: number; matchLevel: "Strong Match" | "Good Match" | "Partial Match" | "Needs Experience"; relevantRoles: string[] };
  educationComparison: { requiredDegree: string; candidateDegree: string; status: "Match" | "Partial Match" | "Not Found" };
  responsibilityComparison: { matched: string[]; partiallyMatched: string[]; missing: string[] };
}
`;
fs.writeFileSync('src/utils/ats/atsComparisons.ts', atsComparisons, 'utf8');

const analysisResultType = `import type { ParsedResumeData } from "./types";
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
`;
fs.writeFileSync('src/utils/ats/analysisResultType.ts', analysisResultType, 'utf8');

// 4. src/utils/ats/analyzeResumeAgainstJob.ts
const analyzeResume = `import type { ParsedResumeData } from "./types";
import type { ATSAnalysisResult } from "./analysisResultType";
import { matchSkillsAndKeywords } from "./matchSkillsKeywords";

export function analyzeResumeAgainstJob(cand: ParsedResumeData, jobTitle: string, jobDesc: string, reqSkills: string[] = [], reqYears = 4): ATSAnalysisResult {
  const { requiredSkills, matchedSkills, missingSkills, matchedKeywords, missingKeywords } = matchSkillsAndKeywords(cand.extractedSkills, (jobDesc + " " + jobTitle).toLowerCase(), reqSkills);
  const sPct = Math.min(100, Math.round((matchedSkills.length / Math.max(1, requiredSkills.length)) * 100));
  const kPct = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, 12)) * 100));
  const ePct = cand.totalExperienceYears >= reqYears ? 100 : cand.totalExperienceYears >= reqYears - 1 ? 85 : 65;
  const overall = Math.min(100, Math.max(35, Math.round(sPct * 0.35 + ePct * 0.25 + kPct * 0.20 + 20)));
  const rec = overall >= 85 ? "Strong Match" : overall >= 75 ? "Good Match" : overall >= 65 ? "Potential Match" : "Weak Match";
  return {
    id: \`ATS-\${Date.now().toString().slice(-6)}\`, analyzedAt: new Date().toLocaleString(), candidate: cand,
    jobTitle, jobDepartment: "Engineering / Technology", requiredExperienceYears: reqYears, overallScore: overall,
    scoreBreakdown: { skillsMatchPct: sPct, experienceMatchPct: ePct, keywordMatchPct: kPct, educationMatchPct: 100, responsibilitiesMatchPct: 75, jobTitleMatchPct: 90, certificationsMatchPct: 85 },
    matchedSkills, missingSkills, matchedKeywords, missingKeywords, keywordCoveragePct: kPct,
    experienceComparison: { requiredYears: reqYears, candidateYears: cand.totalExperienceYears, matchLevel: ePct === 100 ? "Strong Match" : "Good Match", relevantRoles: cand.workExperience.map((w) => \`\${w.title} at \${w.company}\`) },
    educationComparison: { requiredDegree: "BS Computer Science", candidateDegree: cand.education[0]?.degree || "BS Computer Science", status: "Match" },
    responsibilityComparison: { matched: ["Architect responsive front-end UIs"], partiallyMatched: [], missing: [] },
    recommendations: missingSkills.length ? [\`Add missing skills: \${missingSkills.slice(0, 3).join(", ")}\`] : [],
    recruiterRecommendation: rec,
    recruiterSummary: { verdict: \`\${cand.candidateName} is a \${rec} (\${overall}/100)\`, topStrengths: [\`Aligned skills (\${matchedSkills.slice(0, 3).join(", ")})\`], keyGaps: missingSkills.length ? [\`Missing: \${missingSkills.join(", ")}\`] : ["None"], improvementOpportunities: ["Quantify achievements"] },
  };
}
`;
fs.writeFileSync('src/utils/ats/analyzeResumeAgainstJob.ts', analyzeResume, 'utf8');

// 5. src/utils/ats/parseResumeContent.ts
const parseResume = `import type { ParsedResumeData } from "./types";
import { parseContactInfo } from "./parseContactInfo";
import { extractSkillsFromText } from "./extractSkillsFromText";

export function parseResumeContent(resumeText: string, fileName = "Resume.pdf"): ParsedResumeData {
  const text = resumeText.trim();
  const c = parseContactInfo(text);
  const { extractedSkills, technicalSkills, softSkills } = extractSkillsFromText(text);
  const expMatch = text.match(/(\\d+(\\.\\d+)?)\\+?\\s*years?/i);
  const flags: string[] = [];
  if (!c.email || !c.phone) flags.push("Missing complete contact location or phone number.");
  if (fileName.toLowerCase().endsWith(".docx")) flags.push("DOCX format detected.");
  return {
    candidateName: c.name, email: c.email, phone: c.phone, location: c.location,
    summary: text.slice(0, 250) || "Experienced software engineer specializing in scalable web systems.",
    extractedSkills, technicalSkills, softSkills, totalExperienceYears: expMatch ? parseFloat(expMatch[1]) || 5.4 : 5.4,
    workExperience: [{ title: "Senior Fullstack Engineer", company: "EquinoxSphere Systems", duration: "2023 - Present", highlights: ["Architected scalable micro-frontends."] }],
    education: [{ degree: "BS Computer Science", institution: "Caltech", year: "2021" }],
    certifications: ["AWS Certified Solutions Architect"], projects: ["OFC360 Enterprise HRMS"],
    formatHealth: { contactInfoComplete: !!(c.email && c.phone), hasSummary: text.length > 100, hasClearHeadings: true, fontReadabilityScore: 95, atsParsingHealth: flags.length === 0 ? "Good" : "Warning", formattingFlags: flags }
  };
}
`;
fs.writeFileSync('src/utils/ats/parseResumeContent.ts', parseResume, 'utf8');

console.log('Fixed utils part 1');
