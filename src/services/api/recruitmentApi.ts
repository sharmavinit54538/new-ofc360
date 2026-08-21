export * from "./recruitment/recruitmentJobTypes";
export * from "./recruitment/recruitmentAtsTypes";
export * from "./recruitment/recruitmentCandidateTypes";
export * from "./recruitment/recruitmentJobsEndpoints";
export * from "./recruitment/recruitmentCandidateEndpoints";
export * from "./recruitment/recruitmentRankingEndpoints";

import { recruitmentJobsApi } from "./recruitment/recruitmentJobsEndpoints";
import { recruitmentCandidateApi } from "./recruitment/recruitmentCandidateEndpoints";
import { recruitmentRankingApi } from "./recruitment/recruitmentRankingEndpoints";

export const recruitmentApi = {
  ...recruitmentJobsApi,
  ...recruitmentCandidateApi,
  ...recruitmentRankingApi,
};