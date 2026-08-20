export interface RankCandidatesRequest {
  job_id: string;
  resume_document_ids: string[];
  top_n?: 10 | 25 | 50 | 100;
  model?: string;
}

export interface TopRankedQueryParams {
  job_id: string;
  top_n?: 10 | 25 | 50 | 100;
}
