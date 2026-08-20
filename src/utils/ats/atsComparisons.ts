export interface ATSComparisons {
  experienceComparison: { requiredYears: number; candidateYears: number; matchLevel: "Strong Match" | "Good Match" | "Partial Match" | "Needs Experience"; relevantRoles: string[] };
  educationComparison: { requiredDegree: string; candidateDegree: string; status: "Match" | "Partial Match" | "Not Found" };
  responsibilityComparison: { matched: string[]; partiallyMatched: string[]; missing: string[] };
}
