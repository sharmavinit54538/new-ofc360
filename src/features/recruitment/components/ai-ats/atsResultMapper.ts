import { ATSAnalysisResult } from "@/utils/atsScoringEngine";
import type { BackendCandidateScreeningResponse } from "@/services/api/recruitmentApi";

export function mapBackendToATSResult(
  backend: BackendCandidateScreeningResponse,
  jobTitle: string,
  jobDepartment: string,
  requiredExperienceYears: number
): ATSAnalysisResult {
  const cd = backend?.candidate_details || ({} as any);
  const ab = backend?.ats_breakdown || ({} as any);
  const ai = backend?.ai_insights || ({} as any);

  const overallScore = Math.round(ab.overall_ats_score || 0);

  let recruiterRecommendation: ATSAnalysisResult["recruiterRecommendation"] = "Strong Match";
  if (overallScore >= 85) recruiterRecommendation = "Strong Match";
  else if (overallScore >= 75) recruiterRecommendation = "Good Match";
  else if (overallScore >= 65) recruiterRecommendation = "Potential Match";
  else if (overallScore >= 50) recruiterRecommendation = "Weak Match";
  else recruiterRecommendation = "Not Recommended";

  const candidateYears = cd.total_experience_years || 0;
  let expMatchLevel: "Strong Match" | "Good Match" | "Partial Match" | "Needs Experience" = "Strong Match";
  if (candidateYears >= requiredExperienceYears) expMatchLevel = "Strong Match";
  else if (candidateYears >= requiredExperienceYears - 1) expMatchLevel = "Good Match";
  else if (candidateYears >= requiredExperienceYears - 2) expMatchLevel = "Partial Match";
  else expMatchLevel = "Needs Experience";

  return {
    id: `ATS-${(backend?.candidate_id || String(Math.random())).slice(-6)}`,
    analyzedAt: backend?.created_at ? new Date(backend.created_at).toLocaleString() : new Date().toLocaleString(),
    candidate: {
      candidateName: cd.candidate_name || "Unknown Candidate",
      email: cd.email || "",
      phone: cd.phone || "",
      location: cd.current_location || cd.address || "",
      summary: cd.summary || ai.candidate_summary || "",
      extractedSkills: cd.skills || [],
      technicalSkills: cd.technical_skills || [],
      softSkills: cd.soft_skills || [],
      totalExperienceYears: candidateYears,
      workExperience: (cd.work_history || []).map((w: any) => ({
        title: w?.designation || "Role",
        company: w?.company || "",
        duration: w?.duration_months ? `${Math.round(w.duration_months / 12 * 10) / 10} Yrs` : (w?.start_date && w?.end_date ? `${w.start_date} - ${w.end_date}` : ""),
        highlights: w?.description ? [w.description] : [],
      })),
      education: (cd.education || []).map((e: any) => ({
        degree: e?.degree || "",
        institution: e?.university || e?.college || "",
        year: e?.passing_year ? String(e.passing_year) : "",
      })),
      certifications: cd.certifications || [],
      projects: (cd.projects || []).map((p: any) => p?.title || ""),
      formatHealth: {
        contactInfoComplete: !!(cd.email && cd.phone),
        hasSummary: !!(cd.summary && (typeof cd.summary === "string" ? cd.summary.length > 50 : false)),
        hasClearHeadings: true,
        fontReadabilityScore: Math.round(ab.formatting_quality || 90),
        atsParsingHealth: backend?.quality_analysis?.is_valid ? "Good" : "Warning",
        formattingFlags: backend?.quality_analysis?.issues || [],
      },
    },
    jobTitle,
    jobDepartment,
    requiredExperienceYears,
    overallScore,
    scoreBreakdown: {
      skillsMatchPct: Math.round(ab.skill_match_score || 0),
      experienceMatchPct: Math.round(ab.experience_match_score || 0),
      keywordMatchPct: Math.round(ab.keyword_match_score || 0),
      educationMatchPct: Math.round(ab.education_match_score || 0),
      responsibilitiesMatchPct: Math.round(ab.role_match_score || 0),
      jobTitleMatchPct: Math.round(ab.role_match_score || 0),
      certificationsMatchPct: Math.round(ab.certification_match_score || 0),
    },
    matchedSkills: ab.matched_skills || [],
    missingSkills: ab.missing_skills || [],
    matchedKeywords: ab.matched_skills || [],
    missingKeywords: ab.missing_skills || [],
    keywordCoveragePct: Math.round(ab.keyword_match_score || 0),
    experienceComparison: {
      requiredYears: requiredExperienceYears,
      candidateYears,
      matchLevel: expMatchLevel,
      relevantRoles: (cd.work_history || []).map((w: any) => `${w?.designation || "Role"} at ${w?.company || ""}`),
    },
    educationComparison: {
      requiredDegree: "Bachelor's or equivalent",
      candidateDegree: cd.education?.[0]?.degree || "Not specified",
      status: (ab.education_match_score || 0) >= 70 ? "Match" : (ab.education_match_score || 0) >= 40 ? "Partial Match" : "Not Found",
    },
    responsibilityComparison: {
      matched: ai.strengths || [],
      partiallyMatched: [],
      missing: ai.weaknesses || [],
    },
    recommendations: [
      ...((ai?.missing_skills || []).length > 0 ? [`Highlight experience with missing skills: ${(ai.missing_skills || []).slice(0, 3).join(", ")}.`] : []),
      ...(ai?.recommended_interview_questions || []).slice(0, 2).map((q: string) => `Interview Question: ${q}`),
      "Ensure section headings use standard ATS keywords.",
    ],
    recruiterRecommendation,
    recruiterSummary: {
      verdict: ai.candidate_summary || `${cd.candidate_name || "Candidate"} is a ${recruiterRecommendation} (${overallScore}/100) for the ${jobTitle} role.`,
      topStrengths: (ai?.strengths || []).length > 0 ? (ai.strengths || []).slice(0, 3) : ["Analysis completed successfully."],
      keyGaps: (ai?.weaknesses || []).length > 0 ? (ai.weaknesses || []).slice(0, 3) : ["No critical gaps identified."],
      improvementOpportunities: (ai?.risk_factors || []).length > 0 ? (ai.risk_factors || []).slice(0, 3) : [
        "Include metric-driven achievement metrics.",
        "Add cloud deployment keywords.",
      ],
    },
  };
}