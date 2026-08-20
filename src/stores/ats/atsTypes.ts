import type { Requisition, JobOpening, Candidate, Interview, Scorecard, OfferLetter, TalentPoolCandidate, EmployeeReferral, VendorAgency, VendorCandidateSubmission, AutomationRule, OnboardingBridgeRecord, AuditLogItem } from "@/types/ats";

export interface ATSDataCollections {
  requisitions: Requisition[]; jobs: JobOpening[]; candidates: Candidate[];
  interviews: Interview[]; scorecards: Scorecard[]; offers: OfferLetter[];
  talentPool: TalentPoolCandidate[]; referrals: EmployeeReferral[];
  vendors: VendorAgency[]; vendorSubmissions: VendorCandidateSubmission[];
  automations: AutomationRule[]; onboardingRecords: OnboardingBridgeRecord[];
  auditLogs: AuditLogItem[]; selectedCandidateId: string | null; activeTab: string;
}