import {
  useRankCandidatesMutation,
  useGetTopRankedCandidatesQuery,
} from "@/services/api/recruitmentApi";
import type { RankCandidatesRequest } from "@/types/ranking";

/**
 * Hook to rank candidates for a job using AI scoring (v2 backend).
 *
 * - `rankCandidates(body)` — triggers POST /api/v2/ranking/rank
 * - `topRanked` — cached GET /api/v2/ranking/top/:job_id (auto-fetches when jobId is set)
 */
export function useCandidateRanking(jobId: string, topN: 10 | 25 | 50 | 100 = 10) {
  const [rankCandidates, {
    data: rankResult,
    isLoading: isRanking,
    isError: isRankError,
    error: rankError,
  }] = useRankCandidatesMutation();

  const {
    data: topRanked,
    isLoading: isLoadingTopRanked,
    isFetching: isFetchingTopRanked,
    refetch: refetchTopRanked,
  } = useGetTopRankedCandidatesQuery(
    { job_id: jobId, top_n: topN },
    { skip: !jobId },
  );

  /** Trigger a full AI ranking run for the given resume documents. */
  const runRanking = (resumeDocumentIds: string[], options?: { top_n?: 10 | 25 | 50 | 100; model?: string }) => {
    const body: RankCandidatesRequest = {
      job_id: jobId,
      resume_document_ids: resumeDocumentIds,
      top_n: options?.top_n ?? topN,
      model: options?.model,
    };
    return rankCandidates(body);
  };

  return {
    // AI ranking mutation
    runRanking,
    rankResult,
    isRanking,
    isRankError,
    rankError,

    // Pre-ranked candidates query
    topRanked,
    isLoadingTopRanked,
    isFetchingTopRanked,
    refetchTopRanked,
  };
}
