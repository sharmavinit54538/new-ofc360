import type { CandidateStage, CandidateSource } from "./atsStatusTypes";

export interface CandidateNote { id: string; authorName: string; authorRole: string; content: string; createdAt: string; isPrivate: boolean; }
export interface Candidate {
  id: string; jobId: string; name: string; email: string; phone: string; location: string;
  currentRole?: string; currentCompany?: string; totalExperienceYears: number;
  stage: CandidateStage; source: CandidateSource; appliedDate: string;
  matchScore: number; rating?: number; resumeUrl?: string; skills: string[];
  notes?: CandidateNote[]; rejectionReason?: string;
}