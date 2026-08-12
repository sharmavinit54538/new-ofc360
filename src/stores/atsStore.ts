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

const initialRequisitions: Requisition[] = [
  {
    id: "REQ-2026-001",
    title: "Senior AI & Fullstack Lead Engineer",
    department: "Engineering",
    hiringManager: "Dr. Alex Vance",
    targetStartDate: "2026-09-15",
    budgetMin: 140000,
    budgetMax: 185000,
    currency: "USD",
    justification: "Critical headcount expansion for NeuraCore AI copilot integration.",
    isReplacement: false,
    status: "Finance Approved",
    createdAt: "2026-08-01"
  },
  {
    id: "REQ-2026-002",
    title: "Principal Product Designer",
    department: "Product Design",
    hiringManager: "Elena Rostova",
    targetStartDate: "2026-09-01",
    budgetMin: 120000,
    budgetMax: 155000,
    currency: "USD",
    justification: "Replacing outgoing Senior Lead for Enterprise UI revamp.",
    isReplacement: true,
    replacementFor: "Marcus Chen",
    status: "C-Level Approved",
    createdAt: "2026-08-05"
  }
];

const initialJobs: JobOpening[] = [
  {
    id: "JOB-101",
    requisitionId: "REQ-2026-001",
    title: "Senior AI & Fullstack Lead Engineer",
    department: "Engineering",
    location: "San Francisco, CA / Remote",
    workType: "Hybrid",
    employmentType: "Full-Time",
    experienceLevel: "Senior",
    salaryMin: 140000,
    salaryMax: 185000,
    currency: "USD",
    description: "Lead our core AI engineering team building dynamic ATS intelligent engines.",
    responsibilities: ["Build scalable React/TypeScript UI", "Integrate LLM API endpoints", "Optimize ATS data architecture"],
    requirements: ["5+ years React & TypeScript", "Experience with LLMs & Vector Databases", "Strong CS fundamentals"],
    perks: ["Health, Dental, Vision", "Unlimited PTO", "$3,000 Tech Stipend"],
    screeningQuestions: [
      { id: "q1", question: "How many years of TypeScript experience do you have?", type: "choice", options: ["1-2 yrs", "3-5 yrs", "5+ yrs"], required: true },
      { id: "q2", question: "Describe a complex UI architecture you led recently.", type: "text", required: true }
    ],
    status: "Published",
    publishedTo: { careersSite: true, linkedIn: true, indeed: true, glassdoor: false },
    pipelineStages: ["Applied", "Screening", "Tech Interview", "Culture Round", "Offer Extended", "Hired"],
    createdAt: "2026-08-02",
    applicantCount: 28,
    avgMatchScore: 89
  },
  {
    id: "JOB-102",
    requisitionId: "REQ-2026-002",
    title: "Principal Product Designer",
    department: "Product Design",
    location: "New York, NY",
    workType: "Onsite",
    employmentType: "Full-Time",
    experienceLevel: "Lead",
    salaryMin: 120000,
    salaryMax: 155000,
    currency: "USD",
    description: "Shape the future of enterprise HR design systems with high-end glassmorphism and modern micro-animations.",
    responsibilities: ["Design responsive web components", "Conduct user testing", "Maintain Design System"],
    requirements: ["7+ years Product Design in Figma", "Strong design system track record", "Glassmorphism & dark mode expertise"],
    perks: ["401(k) Matching", "Wellness Stipend"],
    screeningQuestions: [],
    status: "Published",
    publishedTo: { careersSite: true, linkedIn: true, indeed: false, glassdoor: true },
    pipelineStages: ["Applied", "Screening", "Portfolio Review", "Culture Round", "Offer Extended", "Hired"],
    createdAt: "2026-08-06",
    applicantCount: 14,
    avgMatchScore: 92
  }
];

const initialCandidates: Candidate[] = [
  {
    id: "CAND-001",
    jobId: "JOB-101",
    jobTitle: "Senior AI & Fullstack Lead Engineer",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    currentCompany: "Stripe",
    currentRole: "Staff Software Engineer",
    expectedSalary: 175000,
    noticePeriodDays: 15,
    source: "LinkedIn",
    stage: "Tech Interview",
    aiMatchScore: 96,
    aiSummary: "Top tier candidate with 6+ years React/Node stack and LLM orchestration background at Stripe.",
    skills: ["React", "TypeScript", "Python", "LangChain", "Node.js", "PostgreSQL"],
    experienceYears: 7,
    tags: ["Ex-FAANG", "Immediate Joiner", "Top Match"],
    appliedAt: "2026-08-03",
    rating: 5,
    notes: [
      { id: "n1", author: "Alex Vance", avatar: "AV", text: "Great initial screening round! Excellent grasp of system design.", timestamp: "2026-08-04 10:30" }
    ],
    status: "Active"
  },
  {
    id: "CAND-002",
    jobId: "JOB-101",
    jobTitle: "Senior AI & Fullstack Lead Engineer",
    firstName: "Rahul",
    lastName: "Mehta",
    email: "rahul.mehta@example.com",
    phone: "+1 (555) 987-6543",
    location: "Austin, TX",
    currentCompany: "Atlassian",
    currentRole: "Senior Frontend Engineer",
    expectedSalary: 165000,
    noticePeriodDays: 30,
    source: "Referral",
    stage: "Offer Extended",
    aiMatchScore: 91,
    aiSummary: "Strong frontend architecture expert with deep state management experience.",
    skills: ["React", "TypeScript", "Zustand", "TailwindCSS", "GraphQL"],
    experienceYears: 6,
    tags: ["Employee Referral", "Strong Tech"],
    appliedAt: "2026-08-04",
    rating: 4,
    notes: [
      { id: "n2", author: "Elena Rostova", avatar: "ER", text: "Culture fit round cleared with flying colors.", timestamp: "2026-08-07 14:15" }
    ],
    status: "Active"
  },
  {
    id: "CAND-003",
    jobId: "JOB-102",
    jobTitle: "Principal Product Designer",
    firstName: "Chloe",
    lastName: "Dupont",
    email: "chloe.dupont@example.com",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    currentCompany: "Figma",
    currentRole: "Senior UX Designer",
    expectedSalary: 150000,
    noticePeriodDays: 14,
    source: "Careers Site",
    stage: "Screening",
    aiMatchScore: 88,
    aiSummary: "Outstanding design portfolio with high-end glassmorphic UI assets.",
    skills: ["Figma", "Design Systems", "Prototyping", "Framer Motion", "UI Animation"],
    experienceYears: 8,
    tags: ["Figma Expert", "Glassmorphism Specialist"],
    appliedAt: "2026-08-07",
    rating: 4,
    notes: [],
    status: "Active"
  }
];

const initialInterviews: Interview[] = [
  {
    id: "INT-501",
    candidateId: "CAND-001",
    candidateName: "Sarah Jenkins",
    jobTitle: "Senior AI & Fullstack Lead Engineer",
    interviewers: ["Alex Vance", "Michael Chang"],
    stage: "Tech Interview",
    scheduledAt: "2026-08-12T14:00:00.000Z",
    durationMinutes: 60,
    meetLink: "https://meet.google.com/xyz-ats-demo",
    status: "Scheduled"
  }
];

const initialScorecards: Scorecard[] = [
  {
    id: "SC-901",
    candidateId: "CAND-001",
    interviewerName: "Alex Vance",
    interviewerRole: "Engineering VP",
    stage: "Screening",
    ratings: [
      { criteria: "Technical Proficiency", score: 5, comment: "Deep understanding of LLM integration and TypeScript." },
      { criteria: "Communication & Clarity", score: 5, comment: "Articulate and concise explanations." },
      { criteria: "Cultural Alignment", score: 4, comment: "Highly collaborative mindset." }
    ],
    overallRecommendation: "Strong Hire",
    pros: "Exceptional architecture skills and proactive drive.",
    cons: "Requires 15 days notice period.",
    submittedAt: "2026-08-04 11:00"
  }
];

const initialOffers: OfferLetter[] = [
  {
    id: "OFF-301",
    candidateId: "CAND-002",
    candidateName: "Rahul Mehta",
    jobTitle: "Senior AI & Fullstack Lead Engineer",
    department: "Engineering",
    baseSalary: 168000,
    bonus: 15000,
    equity: "0.15% Stock Options",
    joiningDate: "2026-09-01",
    status: "Sent to Candidate",
    expiryDate: "2026-08-18"
  }
];

const initialTalentPool: TalentPoolCandidate[] = [
  {
    id: "TP-001",
    name: "David Kim",
    email: "david.k@example.com",
    role: "Fullstack Architect",
    tags: ["Silver Medalist", "Ex-Google"],
    source: "Direct Sourced",
    lastContacted: "2026-07-20",
    nurtureSequence: "Quarterly Tech Update",
    aiFitScore: 94
  }
];

const initialReferrals: EmployeeReferral[] = [
  {
    id: "REF-01",
    referrerName: "Jessica Alba (Senior HR)",
    referrerEmail: "jessica.a@company.com",
    candidateName: "Rahul Mehta",
    candidateEmail: "rahul.mehta@example.com",
    role: "Senior AI & Fullstack Lead Engineer",
    bonusAmount: 2500,
    status: "Under Review",
    submittedAt: "2026-08-04"
  }
];

const initialVendors: VendorAgency[] = [
  {
    id: "VEN-01",
    agencyName: "Apex Executive Search",
    contactPerson: "Robert Sterling",
    email: "robert@apexsearch.io",
    candidatesSubmitted: 12,
    hiredCount: 3,
    status: "Active"
  }
];

const initialVendorSubmissions: VendorCandidateSubmission[] = [
  {
    id: "VS-01",
    vendorId: "VEN-01",
    agencyName: "Apex Executive Search",
    candidateName: "Marcus Vance",
    candidateEmail: "marcus.v@example.com",
    jobTitle: "Principal Product Designer",
    duplicateFlag: false,
    submittedAt: "2026-08-08",
    status: "Pending Review"
  }
];

const initialAutomations: AutomationRule[] = [
  {
    id: "AUTO-1",
    name: "Stage Change Email & Calendar Link",
    trigger: "Candidate moved to Tech Interview",
    condition: "Job == Engineering",
    action: "Send Tech Assessment Email & Create Meet Link",
    isActive: true
  },
  {
    id: "AUTO-2",
    name: "Auto-Archive Rejected Candidates",
    trigger: "Candidate status set to Rejected",
    condition: "None",
    action: "Add to Talent Pool with tag 'Rejection-Pool'",
    isActive: true
  }
];

const initialOnboardingRecords: OnboardingBridgeRecord[] = [
  {
    id: "ONB-101",
    candidateId: "CAND-099",
    candidateName: "Elena Martinez",
    jobTitle: "Staff Backend Engineer",
    department: "Engineering",
    startDate: "2026-08-20",
    buddyAssigned: "Alex Vance",
    docsCollected: true,
    laptopProvisioned: true,
    status: "In Onboarding"
  }
];

const initialAuditLogs: AuditLogItem[] = [
  { id: "LOG-01", action: "Candidate Stage Update (CAND-001 -> Tech Interview)", user: "Alex Vance", timestamp: "2026-08-04 10:32:10", module: "Kanban Pipeline", ipAddress: "192.168.1.45" },
  { id: "LOG-02", action: "Offer Letter Created (OFF-301)", user: "Elena Rostova", timestamp: "2026-08-07 14:20:00", module: "Offer Management", ipAddress: "192.168.1.12" }
];

export const useATSStore = create<ATSState>((set, get) => ({
  requisitions: getStoredData(`${ATS_STORAGE_KEY}_reqs`, initialRequisitions),
  jobs: getStoredData(`${ATS_STORAGE_KEY}_jobs`, initialJobs),
  candidates: getStoredData(`${ATS_STORAGE_KEY}_candidates`, initialCandidates),
  interviews: getStoredData(`${ATS_STORAGE_KEY}_interviews`, initialInterviews),
  scorecards: getStoredData(`${ATS_STORAGE_KEY}_scorecards`, initialScorecards),
  offers: getStoredData(`${ATS_STORAGE_KEY}_offers`, initialOffers),
  talentPool: getStoredData(`${ATS_STORAGE_KEY}_talent`, initialTalentPool),
  referrals: getStoredData(`${ATS_STORAGE_KEY}_referrals`, initialReferrals),
  vendors: getStoredData(`${ATS_STORAGE_KEY}_vendors`, initialVendors),
  vendorSubmissions: getStoredData(`${ATS_STORAGE_KEY}_vsubs`, initialVendorSubmissions),
  automations: getStoredData(`${ATS_STORAGE_KEY}_auto`, initialAutomations),
  onboardingRecords: getStoredData(`${ATS_STORAGE_KEY}_onb`, initialOnboardingRecords),
  auditLogs: getStoredData(`${ATS_STORAGE_KEY}_audit`, initialAuditLogs),

  selectedCandidateId: "CAND-001",
  activeTab: "dashboard",

  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedCandidateId: (selectedCandidateId) => set({ selectedCandidateId }),

  addRequisition: (reqData) => {
    const nextId = `REQ-2026-${String(get().requisitions.length + 1).padStart(3, "0")}`;
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
    const nextId = `JOB-${get().jobs.length + 101}`;
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
    const nextId = `CAND-${String(get().candidates.length + 1).padStart(3, "0")}`;
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
    const note = {
      id: `n_${Date.now()}`,
      author,
      avatar: author.split(" ").map((n) => n[0]).join(""),
      text,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };
    const updated = get().candidates.map((c) =>
      c.id === candidateId ? { ...c, notes: [note, ...c.notes] } : c
    );
    setStoredData(`${ATS_STORAGE_KEY}_candidates`, updated);
    set({ candidates: updated });
  },

  scheduleInterview: (interviewData) => {
    const nextId = `INT-${get().interviews.length + 501}`;
    const newInt: Interview = {
      id: nextId,
      ...interviewData
    };
    const updated = [newInt, ...get().interviews];
    setStoredData(`${ATS_STORAGE_KEY}_interviews`, updated);
    set({ interviews: updated });
  },

  addScorecard: (scorecardData) => {
    const nextId = `SC-${get().scorecards.length + 901}`;
    const newSc: Scorecard = {
      id: nextId,
      submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      ...scorecardData
    };
    const updated = [newSc, ...get().scorecards];
    setStoredData(`${ATS_STORAGE_KEY}_scorecards`, updated);
    set({ scorecards: updated });
  },

  createOffer: (offerData) => {
    const nextId = `OFF-${get().offers.length + 301}`;
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
    const nextId = `REF-${get().referrals.length + 1}`;
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
    const nextId = `VS-${get().vendorSubmissions.length + 1}`;
    // Check duplicate
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
