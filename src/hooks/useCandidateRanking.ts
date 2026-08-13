import {
  useGetCandidateATSAnalysisQuery,
  useMatchCandidatesForJobMutation,
} from "@/services/api/recruitmentApi";

export function useCandidateRanking(jobId: string) {
  const [matchCandidates, { isLoading: isAnalyzing }] = useMatchCandidatesForJobMutation();

  return {
    isAnalyzing,
    matchCandidates,
  };
}
