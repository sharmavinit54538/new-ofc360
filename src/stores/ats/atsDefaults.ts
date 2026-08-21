import type { ATSDataCollections } from "./atsTypes";
import { getStoredData } from "@/utils/storage";

export const getInitialAtsData = (): ATSDataCollections => ({
  requisitions: getStoredData("ofc360_ats_reqs_v1", []),
  jobs: getStoredData("ofc360_ats_jobs_v1", []),
  candidates: getStoredData("ofc360_ats_cands_v1", []),
  interviews: [], scorecards: [], offers: [], talentPool: [], referrals: [],
  vendors: [], vendorSubmissions: [], automations: [], onboardingRecords: [],
  auditLogs: [], selectedCandidateId: null, activeTab: "requisitions",
});