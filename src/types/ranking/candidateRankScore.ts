export interface CandidateRankScore {
  candidate_id: string;
  candidate_name: string;
  rank: number;
  overall_score: number;
  skills_score: number;
  experience_score: number;
  projects_score: number;
  certifications_score: number;
  semantic_similarity_score: number;
  culture_fit_score: number;
  education_score: number;
  career_growth_score: number;
  stability_score: number;
  leadership_score: number;
  score_explanations: Record<string, string>;
}
