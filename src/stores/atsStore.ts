import { create } from "zustand";
import {
  Requisition,
  JobOpening,
  Candidate,
  Interview,
  Scorecard,
  OfferLetter,
  TalentPoolCandidate,
  EmployeeReferral,
  VendorAgency,
  VendorCandidateSubmission,
  AutomationRule,
  OnboardingBridgeRecord,
  AuditLogItem,
  CandidateStage,
  JobStatus
} from "@/types/ats";
import { getStoredData, setStoredData } from "@/utils/storage";

const ATS_STORAGE_KEY = "hr_nexus_ats_enterprise_v1";

interface ATSState {
  // Data State
  requisitions: Requisition[];
  jobs: JobOpening[];
  candidates: Candidate[];
  interviews: Interview[];
  scorecards: Scorecard[];
  offers: OfferLetter[];
  talentPool: TalentPoolCandidate[];
  referrals: EmployeeReferral[];
  vendors: VendorAgency[];
  vendorSubmissions: VendorCandidateSubmission[];
  automations: AutomationRule[];
  onboardingRecords: OnboardingBridgeRecord[];
  auditLogs: AuditLogItem[];

  // Selected State
  selectedCandidateId: string | null;
  activeTab: string;

  // Actions
  setActiveTab: (tab: string) => void;
  setSelectedCandidateId: (id: string | null) => void;

  // Requisition Actions
  addRequisition: (req: Omit<Requisition, "id" | "createdAt">) => void;
  updateRequisitionStatus: (id: string, status: Requisition["status"]) => void;

  // Job Actions
  addJob: (job: Omit<JobOpening, "id" | "createdAt" | "applicantCount" | "avgMatchScore">) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;

  // Candidate Actions
  addCandidate: (cand: Omit<Candidate, "id" | "appliedAt">) => void;
  updateCandidateStage: (id: string, stage: CandidateStage) => void;
  addCandidateNote: (candidateId: string, text: string, author: string) => void;

  // Interview Actions
  scheduleInterview: (interview: Omit<Interview, "id">) => void;

  // Scorecard Actions
  addScorecard: (scorecard: Omit<Scorecard, "id" | "submittedAt">) => void;

  // Offer Actions
  createOffer: (offer: Omit<OfferLetter, "id">) => void;
  signOffer: (offerId: string, eSignatureUrl: string) => void;

  // Referral & Vendor Actions
  addReferral: (referral: Omit<EmployeeReferral, "id" | "submittedAt">) => void;
  addVendorSubmission: (sub: Omit<VendorCandidateSubmission, "id" | "submittedAt" | "duplicateFlag">) => void;

  // Automation Actions
  toggleAutomation: (id: string) => void;

  // Onboarding Bridge
  convertToOnboarding: (candidateId: string, buddy: string, startDate: string) => void;
}

export const useATSStore = create<ATSState>((set, get) => ({
  requisitions: getStoredData(`${ATS_STORAGE_KEY}_reqs`, []),
  jobs: getStoredData(`${ATS_STORAGE_KEY}_jobs`, []),
  candidates: getStoredData(`${ATS_STORAGE_KEY}_candidates`, []),
  interviews: getStoredData(`${ATS_STORAGE_KEY}_interviews`, []),
  scorecards: getStoredData(`${ATS_STORAGE_KEY}_scorecards`, []),
  offers: getStoredData(`${ATS_STORAGE_KEY}_offers`, []),
  talentPool: getStoredData(`${ATS_STORAGE_KEY}_talent`, []),
  referrals: getStoredData(`${ATS_STORAGE_KEY}_referrals`, []),
  vendors: getStoredData(`${ATS_STORAGE_KEY}_vendors`, []),
  vendorSubmissions: getStoredData(`${ATS_STORAGE_KEY}_vsubs`, []),
  automations: getStoredData(`${ATS_STORAGE_KEY}_auto`, []),
  onboardingRecords: getStoredData(`${ATS_STORAGE_KEY}_onb`, []),
  auditLogs: getStoredData(`${ATS_STORAGE_KEY}_audit`, []),

  selectedCandidateId: null,
  activeTab: "dashboard",

  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedCandidateId: (selectedCandidateId) => set({ selectedCandidateId }),

  addRequisition: (reqData) => {
    const nextId = `REQ-${Date.now().toString().slice(-4)}`;
    const newReq: Requisition = {
      id: nextId,
      createdAt: new Date().toISOString().split("T")[0],
      ...reqData
    };
    const updated = [newReq, ...get().requisitions];
    setStoredData(`${ATS_STORAGE_KEY}_reqs`, updated);
    set({ requisitions: updated });
  },

  updateRequisitionStatus: (id, status) => {
    const updated = get().requisitions.map((r) => (r.id === id ? { ...r, status } : r));
    setStoredData(`${ATS_STORAGE_KEY}_reqs`, updated);
    set({ requisitions: updated });
  },

  addJob: (jobData) => {
    const nextId = `JOB-${Date.now().toString().slice(-4)}`;
    const newJob: JobOpening = {
      id: nextId,
      createdAt: new Date().toISOString().split("T")[0],
      applicantCount: 0,
      avgMatchScore: 85,
      ...jobData
    };
    const updated = [newJob, ...get().jobs];
    setStoredData(`${ATS_STORAGE_KEY}_jobs`, updated);
    set({ jobs: updated });
  },

  updateJobStatus: (id, status) => {
    const updated = get().jobs.map((j) => (j.id === id ? { ...j, status } : j));
    setStoredData(`${ATS_STORAGE_KEY}_jobs`, updated);
    set({ jobs: updated });
  },

  addCandidate: (candData) => {
    const nextId = `CAND-${Date.now().toString().slice(-4)}`;
    const newCand: Candidate = {
      id: nextId,
      appliedAt: new Date().toISOString().split("T")[0],
      notes: [],
      ...candData
    };
    const updated = [newCand, ...get().candidates];
    setStoredData(`${ATS_STORAGE_KEY}_candidates`, updated);
    set({ candidates: updated });
  },

  updateCandidateStage: (id, stage) => {
    const updated = get().candidates.map((c) => (c.id === id ? { ...c, stage } : c));
    setStoredData(`${ATS_STORAGE_KEY}_candidates`, updated);

    // Add audit log
    const log: AuditLogItem = {
      id: `LOG-${Date.now()}`,
      action: `Stage updated for candidate ${id} to ${stage}`,
      user: "Current HR Admin",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      module: "Kanban Pipeline",
      ipAddress: "127.0.0.1"
    };
    const updatedLogs = [log, ...get().auditLogs];
    setStoredData(`${ATS_STORAGE_KEY}_audit`, updatedLogs);

    set({ candidates: updated, auditLogs: updatedLogs });
  },

  addCandidateNote: (candidateId, text, author) => {
    const updated = get().candidates.map((c) => {
      if (c.id === candidateId) {
        return {
          ...c,
          notes: [
            ...c.notes,
            {
              id: `NOTE-${Date.now()}`,
              author,
              text,
              createdAt: new Date().toISOString().split("T")[0]
            }
          ]
        };
      }
      return c;
    });
    setStoredData(`${ATS_STORAGE_KEY}_candidates`, updated);
    set({ candidates: updated });
  },

  scheduleInterview: (interviewData) => {
    const nextId = `INT-${Date.now().toString().slice(-4)}`;
    const newInt: Interview = {
      id: nextId,
      ...interviewData
    };
    const updated = [newInt, ...get().interviews];
    setStoredData(`${ATS_STORAGE_KEY}_interviews`, updated);
    set({ interviews: updated });
  },

  addScorecard: (scData) => {
    const nextId = `SC-${Date.now().toString().slice(-4)}`;
    const newSC: Scorecard = {
      id: nextId,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      ...scData
    };
    const updated = [newSC, ...get().scorecards];
    setStoredData(`${ATS_STORAGE_KEY}_scorecards`, updated);
    set({ scorecards: updated });
  },

  createOffer: (offerData) => {
    const nextId = `OFF-${Date.now().toString().slice(-4)}`;
    const newOffer: OfferLetter = {
      id: nextId,
      ...offerData
    };
    const updated = [newOffer, ...get().offers];
    setStoredData(`${ATS_STORAGE_KEY}_offers`, updated);
    set({ offers: updated });
  },

  signOffer: (offerId, eSignatureUrl) => {
    const updated = get().offers.map((o) =>
      o.id === offerId
        ? { ...o, status: "Signed" as const, eSignatureUrl, signedAt: new Date().toISOString() }
        : o
    );
    setStoredData(`${ATS_STORAGE_KEY}_offers`, updated);
    set({ offers: updated });
  },

  addReferral: (refData) => {
    const nextId = `REF-${Date.now().toString().slice(-4)}`;
    const newRef: EmployeeReferral = {
      id: nextId,
      submittedAt: new Date().toISOString().split("T")[0],
      ...refData
    };
    const updated = [newRef, ...get().referrals];
    setStoredData(`${ATS_STORAGE_KEY}_referrals`, updated);
    set({ referrals: updated });
  },

  addVendorSubmission: (subData) => {
    const nextId = `VS-${Date.now().toString().slice(-4)}`;
    const isDuplicate = get().candidates.some(
      (c) => c.email.toLowerCase() === subData.candidateEmail.toLowerCase()
    );
    const newSub: VendorCandidateSubmission = {
      id: nextId,
      submittedAt: new Date().toISOString().split("T")[0],
      duplicateFlag: isDuplicate,
      ...subData
    };
    const updated = [newSub, ...get().vendorSubmissions];
    setStoredData(`${ATS_STORAGE_KEY}_vsubs`, updated);
    set({ vendorSubmissions: updated });
  },

  toggleAutomation: (id) => {
    const updated = get().automations.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a));
    setStoredData(`${ATS_STORAGE_KEY}_auto`, updated);
    set({ automations: updated });
  },

  convertToOnboarding: (candidateId, buddy, startDate) => {
    const cand = get().candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    const newRecord: OnboardingBridgeRecord = {
      id: `ONB-${Date.now()}`,
      candidateId: cand.id,
      candidateName: `${cand.firstName} ${cand.lastName}`,
      jobTitle: cand.jobTitle,
      department: "Engineering",
      startDate,
      buddyAssigned: buddy,
      docsCollected: false,
      laptopProvisioned: false,
      status: "In Onboarding"
    };

    const updatedOnb = [newRecord, ...get().onboardingRecords];
    const updatedCands = get().candidates.map((c) =>
      c.id === candidateId ? { ...c, stage: "Hired" as const, status: "Hired" as const } : c
    );

    setStoredData(`${ATS_STORAGE_KEY}_onb`, updatedOnb);
    setStoredData(`${ATS_STORAGE_KEY}_candidates`, updatedCands);
    set({ onboardingRecords: updatedOnb, candidates: updatedCands });
  }
}));