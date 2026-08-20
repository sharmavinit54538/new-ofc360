import type { ATSDataCollections } from "./atsTypes";
import { getStoredData } from "@/utils/storage";

export const getInitialAtsData = (): ATSDataCollections => ({
  requisitions: getStoredData("hr_nexus_ats_enterprise_v1_reqs", []),
  jobs: getStoredData("hr_nexus_ats_enterprise_v1_jobs", []),
  candidates: getStoredData("hr_nexus_ats_enterprise_v1_cands", []),
  interviews: [], scorecards: [], offers: [], talentPool: [], referrals: [],
  vendors: [], vendorSubmissions: [], automations: [], onboardingRecords: [],
  auditLogs: [], selectedCandidateId: null, activeTab: "requisitions",
});