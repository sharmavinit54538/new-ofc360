/**
 * Legacy barrel file — re-exports from the canonical recruitment API.
 * New code should import directly from "@/features/recruitment/api".
 */
export {
  recruitmentApi,
  useGetRecruitmentJobsQuery,
  useGetJobsQuery,
  useGetRecruitmentJobByIdQuery,
  useUploadResumeForScreeningMutation,
  useUploadResumeMutation,
  useGetRecruitmentCandidatesQuery,
  useGetRecruitmentCandidateByIdQuery,
  useGetCandidateATSAnalysisQuery,
  useRankCandidatesMutation,
  useGetTopRankedCandidatesQuery,
  useGetRequisitionsQuery,
  useGetRequisitionByIdQuery,
  useCreateRequisitionMutation,
  useApproveRequisitionMutation,
  useGetOffersQuery,
  useCreateOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useGetReferralsQuery,
  useCreateReferralMutation,
  useUpdateReferralStatusMutation,
  useGetRecruitmentAnalyticsQuery,
  useGetRecruitmentNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/features/recruitment/api";

export type {
  BackendJobSkill,
  BackendJobListItem,
  BackendJobDetail,
  BackendJobListResponse,
  BackendATSScoreBreakdown,
  BackendAIInsights,
  BackendParsedResume,
  BackendCandidateScreeningResponse,
  BackendCandidateATSAnalysis,
  BackendCandidateListItem,
  RankingResult,
  TopRankedResponse,
  RankCandidatesRequest,
  TopRankedQueryParams,
} from "@/features/recruitment/api";
export type { RankingResult, TopRankedResponse, RankCandidatesRequest, TopRankedQueryParams } from "@/types/ranking";