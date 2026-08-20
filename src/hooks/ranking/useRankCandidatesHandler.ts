import { useRankCandidatesMutation } from "@/services/api/recruitmentApi";
import type { RankCandidatesRequest } from "@/types/ranking";

export function useRankCandidatesHandler(jobId: string, defaultTopN: 10 | 25 | 50 | 100) {
  const [rankCandidates, state] = useRankCandidatesMutation();
  const runRanking = (resumeDocumentIds: string[], opts?: { top_n?: 10 | 25 | 50 | 100; model?: string }) => {
    const body: RankCandidatesRequest = { job_id: jobId, resume_document_ids: resumeDocumentIds, top_n: opts?.top_n ?? defaultTopN, model: opts?.model };
    return rankCandidates(body);
  };
  return { runRanking, ...state };
}
