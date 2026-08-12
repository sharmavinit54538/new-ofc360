import {
  useRankCandidatesQuery,
  useAnalyzeAtsScoreMutation,
} from "@/services/api/recruitmentApi";

export function useCandidateRanking(jobId: string) {
  const { data: rankedCandidates, isLoading, isFetching, refetch } = useRankCandidatesQuery(jobId, {
    skip: !jobId,
  });

  const [analyzeAtsScore, { isLoading: isAnalyzing }] = useAnalyzeAtsScoreMutation();

  return {
    candidates: rankedCandidates || [],
    isLoading,
    isFetching,
    isAnalyzing,
    refetch,
    analyzeAtsScore,
  };
}
