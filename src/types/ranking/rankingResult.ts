import type { CandidateRankScore } from "./candidateRankScore";

export interface RankingResult {
  job_id: string;
  top_n: number;
  total_candidates: number;
  ranking_criteria_summary: string;
  model_used: string;
  ranked_candidates: CandidateRankScore[];
}
