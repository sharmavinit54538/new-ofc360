export interface TopRankedCandidate {
  rank: number;
  resume_document_id: string;
  candidate_name: string | null;
  candidate_id: string | null;
  overall_match_score: number;
  skill_match_score: number;
  experience_match_score: number;
  recommendation: string | null;
}

export interface TopRankedResponse {
  job_id: string;
  top_n: number;
  total: number;
  ranked_candidates: TopRankedCandidate[];
}
