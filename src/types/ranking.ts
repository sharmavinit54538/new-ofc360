// ── AI Ranking Types ─────────────────────────────────────────────────
// Maps to backend: app/agents/resume_ranker.py → CandidateRankScore.to_dict()

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

// Maps to backend: app/agents/resume_ranker.py → RankingResult.to_dict()
export interface RankingResult {
  job_id: string;
  top_n: number;
  total_candidates: number;
  ranking_criteria_summary: string;
  model_used: string;
  ranked_candidates: CandidateRankScore[];
}

// Maps to backend: app/api/v2/ranking.py → get_ranked_candidates response.data
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

// Request payload for POST /api/v2/ranking/rank
export interface RankCandidatesRequest {
  job_id: string;
  resume_document_ids: string[];
  top_n?: 10 | 25 | 50 | 100;
  model?: string;
}

// Query params for GET /api/v2/ranking/top/:job_id
export interface TopRankedQueryParams {
  job_id: string;
  top_n?: 10 | 25 | 50 | 100;
}
