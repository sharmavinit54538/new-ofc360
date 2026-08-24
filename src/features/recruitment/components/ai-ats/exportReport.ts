import { ATSAnalysisResult } from "@/utils/atsScoringEngine";
import { toast } from "sonner";

export function exportATSReport(res: ATSAnalysisResult) {
  const reportText = `
OFC360 ATS RESUME ANALYSIS REPORT
===============================
Candidate Name: ${res.candidate.candidateName}
Email: ${res.candidate.email}
Phone: ${res.candidate.phone}
Target Job Title: ${res.jobTitle}
Overall ATS Score: ${res.overallScore} / 100
Recruiter Recommendation: ${res.recruiterRecommendation}
Analyzed At: ${res.analyzedAt}

SCORE BREAKDOWN:
- Skills Match: ${res.scoreBreakdown.skillsMatchPct}%
- Experience Match: ${res.scoreBreakdown.experienceMatchPct}%
- Keyword Coverage: ${res.scoreBreakdown.keywordMatchPct}%
- Education Match: ${res.scoreBreakdown.educationMatchPct}%
- Responsibilities Match: ${res.scoreBreakdown.responsibilitiesMatchPct}%

MATCHED SKILLS:
${res.matchedSkills.join(", ")}

MISSING SKILLS:
${res.missingSkills.join(", ")}

RECRUITER SUMMARY:
${res.recruiterSummary.verdict}

KEY STRENGTHS:
- ${res.recruiterSummary.topStrengths.join("\n- ")}

RECOMMENDATIONS:
- ${res.recommendations.join("\n- ")}
`;

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `OFC360_ATS_Report_${res.candidate.candidateName.replace(/\s+/g, "_")}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("ATS Analysis Report exported!");
}