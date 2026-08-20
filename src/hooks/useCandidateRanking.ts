import { useGetTopRankedCandidatesQuery } from "@/services/api/recruitmentApi";
import { useRankCandidatesHandler } from "./ranking/useRankCandidatesHandler";

export function useCandidateRanking(jobId: string, topN: 10 | 25 | 50 | 100 = 10) {
  const { runRanking, data: rankResult, isLoading: isRanking, isError: isRankError, error: rankError } = useRankCandidatesHandler(jobId, topN);
  const { data: topRanked, isLoading: isLoadingTopRanked, isFetching: isFetchingTopRanked, refetch: refetchTopRanked } = useGetTopRankedCandidatesQuery({ job_id: jobId, top_n: topN }, { skip: !jobId });
  return {
    runRanking, rankResult, isRanking, isRankError, rankError,
    topRanked, isLoadingTopRanked, isFetchingTopRanked, refetchTopRanked,
  };
}